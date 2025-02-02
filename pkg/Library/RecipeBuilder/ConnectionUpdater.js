/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

({

// ConnectionUpdater atm only initializes connections of newly added nodes,
// if a single candidate is available.
// In the future, a more sophisticated heuristics can be implemented to
// automatically connect nodes.

connectionDelimiter: ':',

update(inputs, state) {
  if (this.inputsChanged(inputs, state)) {
    const {graph, nodeTypes, candidates} = inputs;
    assign(state, {graph, candidates});
    if (candidates) {
      let changed = false;
      if (this.removeGraphOutdatedConnections(graph, candidates)) {
        changed = true;
      }
      if (this.updateGraphConnections(graph, nodeTypes, candidates)) {
        changed = true;
      }
      if (changed) {
        return {graph};
      }
    }
  }
},

inputsChanged({graph, candidates}, state) {
  // TODO(mariakleiner): for custom nodes, recompute connections, if nodeType changed.
  return graph &&
      (this.graphChanged(graph, state.graph) || this.candidatesChanged(candidates, state.candidates));
},

graphChanged(graph, oldGraph) {
  return graph.$meta.id !== oldGraph?.$meta?.id ||
         keys(graph.nodes).length !== keys(oldGraph?.nodes).length;
},

candidatesChanged(candidates, oldCandidates) {
  return !deepEqual(candidates, oldCandidates);
},

removeGraphOutdatedConnections(graph, candidates) {
  return values(graph.nodes)
    .map(node => this.removeNodeOutdatedConnections(node, candidates[node.id]))
    .some(changed => changed);
},

removeNodeOutdatedConnections(node, candidates) {
  let changed = false;
  keys(node.props).forEach(key => {
    const conns = node.props[key].connection;
    const originalLength = conns?.length;
    const connCandidates = candidates[key];
    if (conns && connCandidates) {
      node.props[key].connection = conns.filter(conn => this.hasMatchingCandidate(conn, connCandidates));
      if (node.props[key].connection.length === 0) {
        delete node.props[key].connection;
      }
      changed = changed || (node.props[key]?.connection?.length !== originalLength);
    }
  });
  return changed;
},

hasMatchingCandidate(connection, candidates) {
  const {from, storeName} = this.parseConnection(connection);
  return candidates.some(candidate => from === candidate.from && storeName === candidate.storeName);
},

updateGraphConnections(graph, nodeTypes, candidates) {
  return values(graph.nodes)
    .map(node => this.updateNodeConnections(node, nodeTypes[node.type], candidates[node.id]))
    .some(changed => changed)
    ;
},

updateNodeConnections(node, nodeType, candidates) {
  if (candidates) {
    return this.initializeConnections(node, nodeType, candidates);
  }
},

initializeConnections(node, nodeType, candidates) {
  if (!node.props) {
    node.props ??= {};
    const used = [];
    keys(nodeType?.$stores).forEach(store => {
      node.props[store] ??= {};
      this.initializeStoreConnection(store, node, candidates[store], used);
    });
    return true;
  }
  return false;
},

initializeStoreConnection(store, node, storeCandidates, used) {
  const isUsed = (candidate) => used.find(({from, storeName}) => candidate.from === from && candidate.storeName === storeName);
  const unusedCandidates = storeCandidates?.filter(candidate => !isUsed(candidate));
  if (unusedCandidates?.length === 1) {
    node.props[store].connection = [this.formatConnection(unusedCandidates[0])];
    used.push(unusedCandidates?.[0]);
  }
},

parseConnection(connection) {
  const [from, storeName] = connection.split(this.connectionDelimiter);
  return {from, storeName};
},

formatConnection({from, storeName}) {
  if (from?.length > 0) {
    return `${from}${this.connectionDelimiter}${storeName}`;
  }
  return storeName;
}

});
