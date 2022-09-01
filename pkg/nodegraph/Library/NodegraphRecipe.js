/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 */

import {nodeTypes, categories} from './Nodes/nodeTypes.js';
import {customInspectors} from './Inspectors/customInspectors.js';
// TODO(sjmiles): should just be a recipe
import {NodeCatalogParticles, NodeCatalogStores} from '../../Library/NodeCatalog/NodeCatalogSpecs.js';

const NodeCatalogRecipe = {
  $stores: {
    ...NodeCatalogStores
  },
  ...NodeCatalogParticles,
};

export const NodegraphRecipe = {
  $meta: {
    description: 'Node Editor Recipe'
  },
  $stores: {
    selectedPipeline: {
      $type: 'JSON',
      $tags: ['persisted'],
      $value: null
    },
    selectedNode: {
      $type: 'JSON'
    },
    nodeTypes: {
      $type: '[JSON]',
      $value: nodeTypes
    },
    inspectorData: {
      $type: 'JSON'
    },
    recipes: {
      $type: '[JSON]',
      $value: []
    },
    categories: {
      $type: 'JSON',
      $value: categories
    }
  },
  main: {
    $kind: '$app/Library/Nodegraph',
    $inputs: [
      {pipeline: 'selectedPipeline'}
    ],
    $outputs: [
      {pipeline: 'selectedPipeline'}
    ],
    $slots: {
      catalog: {
        ...NodeCatalogRecipe
      },
      preview: {
        runner: {
          //$kind: '$library/NodeGraph/Runner',
          $kind: '$library/Designer/Designer',
          $inputs: [
            'recipes',
            {pipeline: 'selectedPipeline'},
            'selectedNode',
            'nodeTypes',
            'categories',
          ],
          $outputs: [
            {pipeline: 'selectedPipeline'},
            'selectedNode'
          ]
        }
      },
      editor: {
        Editor: {
          $kind: '$library/NodeGraph/Editor',
          $inputs: [
            {pipeline: 'selectedPipeline'},
            'selectedNode',
            'nodeTypes',
            'categories'
          ],
          $outputs: [
            {pipeline: 'selectedPipeline'},
            'selectedNode',
          ]
        }
      },
      inspector: {
        Inspector: {
          $kind: '$library/NodeGraph/Inspector',
          $inputs: [{data: 'inspectorData'}],
          $outputs: [{data: 'inspectorData'}],
          $staticInputs: {customInspectors}
        }
      }
    }
  },
  nodeInspector: {
    $kind: '$library/NodeGraph/NodeInspector',
    $inputs: [
      {node: 'selectedNode'},
      {pipeline: 'selectedPipeline'},
      'nodeTypes',
    ],
    $outputs: [{data: 'inspectorData'}]
  },
  nodeUpdator: {
    $kind: '$library/NodeGraph/NodeUpdator',
    $inputs: [
      {node: 'selectedNode'},
      {pipeline: 'selectedPipeline'},
      {data: 'inspectorData'}
    ],
    $outputs: [
      {node: 'selectedNode'},
      {pipeline: 'selectedPipeline'},
    ]
  },
  nodesConnector: {
    $kind: '$library/NodeGraph/NodesConnector',
    $inputs: [
      {pipeline: 'selectedPipeline'},
      'selectedNode',
      'nodeTypes',
    ],
    $outputs: [
      {pipeline: 'selectedPipeline'},
      'selectedNode',
      'recipes'
    ],
    $staticInputs: {
      customInspectors,
      inspectorData: 'inspectorData',
      globalStores: [
        'selectedNode',
        'selectedPipeline'
      ]
    }
  }
};
