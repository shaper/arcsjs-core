/**
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
export * from '../../Library/TensorFlow/TensorFlow.js';
export * from '../../Library/Core/utils.min.js';
export * from '../../Library/App/surface-imports.js';
export * from '../../Library/Dom/container-layout.js';
export * from '../../Library/Designer/designer-layout.js';
export * from '../../Library/Dom/multi-select.js';
export * from '../../Library/NodeGraph/dom/node-graph.js';
export * from '../../Library/NodeGraph/dom/node-graph-editor.js';
export * from '../../Library/NodeCatalog/draggable-item.js';
export * from '../../Library/Threejs/threejs-editor.js';
//export * from '../../Library/AFrame/aframe.js';

// n.b. operates in outer context

// extract an absolute url to the folder 2 above here (counting the filename, aka 'nodegraph/')
import {Paths} from '../../Library/Core/utils.min.js';
const url = Paths.getAbsoluteHereUrl(import.meta, 2);
//const url = globalThis.config.arcsPath;

// remote libraries
//const rapsai = `http://localhost:9876`;
const rapsai = `https://rapsai-core.web.app/0.5.1`;
await import(`${rapsai}/Library/input-image.js`);

// calculate important paths
export const paths = {
  $app: url,
  $rapsai: rapsai,
  $config: `${url}/conf/config.js`,
  $library: `${url}/../Library`
};
