/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 */

import {nodeTypes, categories} from './nodeTypes.js';
import {customInspectors} from './customInspectors.js';
import {NodeCatalogRecipe} from '../../Library/NodeTypeCatalog/NodeCatalogRecipe.js';

const globalStores = [
  'selectedNode',
  'selectedPipeline',
  'nodeTypes',
  'categories',
  'nodeId',
];

const PipelineToolbar = {
  $stores: {
    pipelineToolbarEvent: {
      $type: 'String'
    },
    pipelineToolbarIcons: {
      $type: '[Pojo]'
    }
  },
  pipelineToolbar: {
    $kind: '$library/NodeGraph/PipelineToolbar',
    $inputs: [
      {pipeline: 'selectedPipeline'},
      'pipelines',
      {event: 'pipelineToolbarEvent'}
    ],
    $staticInputs: {
      publishPaths: {}
    },
    $outputs: [
      {pipeline: 'selectedPipeline'},
      'selectedNodeId',
      'pipelines',
      {icons: 'pipelineToolbarIcons'},
      {event: 'pipelineToolbarEvent'}
    ],
    $slots: {
      buttons: {
        PipelineButtons: {
          $kind: '$library/NodeGraph/Toolbar',
          $inputs: [{icons: 'pipelineToolbarIcons'}],
          $outputs: [{event: 'pipelineToolbarEvent'}],
        }
      },
      chooser: {
        PipelineChooser: {
          $kind: '$library/NodeGraph/PipelineChooser',
          $inputs: [
            {pipeline: 'selectedPipeline'},
            'pipelines'
          ],
          $outputs: [{pipeline: 'selectedPipeline'}]
        }
      }
    }
  }
};

const NodeEditor = {
  $stores: {
    editorToolbarEvent: {
      $type: 'String'
    },
    editorToolbarIcons: {
      $type: '[Pojo]'
    },
  },
  Editor: {
    // $kind: 'http://localhost:9876/Library/Editor',
    // $kind: '$library/NodeGraph/SimpleEditor',
    $kind: '$library/NodeGraph/Editor',
    $inputs: [
      {pipeline: 'selectedPipeline'},
      'selectedNodeId',
      'nodeTypes',
      'categories',
      {layout: 'nodegraphLayout'},
      {previewLayout: 'previewLayout'},
      'newNodeInfos',
      {event: 'editorToolbarEvent'}
    ],
    $outputs: [
      {pipeline: 'selectedPipeline'},
      'selectedNodeId',
      {layout: 'nodegraphLayout'},
      {previewLayout: 'previewLayout'},
      'newNodeInfos',
      {event: 'editorToolbarEvent'},
      'editorToolbarIcons'
    ],
    $slots: {
      toolbar: {
        editorToolbar: {
          $kind: '$library/NodeGraph/Toolbar',
          $inputs: [{icons: 'editorToolbarIcons'}],
          $outputs: [{event: 'editorToolbarEvent'}]
        }
      }
    }
  }
};

export const NodegraphRecipe = {
  $meta: {
    description: 'Node Editor Recipe'
  },
  $stores: {
    pipelines: {
      $type: '[Pojo]',
      $tags: ['persisted'],
      $value: []
    },
    selectedPipeline: {
      $type: 'Pojo',
      $tags: ['persisted'],
      $value: null
    },
    selectedNodeId: {
      $type: 'String'
    },
    candidates: {
      $type: 'Pojo'
    },
    builtinNodeTypes: {
      $type: 'Pojo',
      $value: nodeTypes
    },
    inspectorData: {
      $type: 'Pojo'
    },
    recipes: {
      $type: '[Pojo]',
      $value: []
    },
    categories: {
      $type: 'Pojo',
      $value: categories
    },
    previewLayout: {
      $type: 'Pojo'
    },
    nodegraphLayout: {
      $type: 'Pojo'
    },
    nodeTypes: {
      $type: 'Pojo',
      $value: nodeTypes
    },
    newNodeInfos: {
      $type: '[Pojo]'
    }
  },
  // 'a_frame': {
  //   $kind: '$library/AFrame/Scene.js'
  // },
  main: {
    $kind: '$nodegraph/Nodegraph',
    $slots: {
      catalog: NodeCatalogRecipe,
      toolbar: PipelineToolbar,
      preview: {
        designer: {
          $kind: '$library/Designer/Designer',
          $inputs: [
            'recipes',
            {pipeline: 'selectedPipeline'},
            'selectedNodeId',
            'nodeTypes',
            'categories',
            {layout: 'previewLayout'},
            'newNodeInfos'
          ],
          $outputs: [
            {pipeline: 'selectedPipeline'},
            'selectedNodeId',
            {layout: 'previewLayout'},
            'newNodeInfos'
          ]
        }
      },
      editor: NodeEditor,
      inspector: {
        Inspector: {
          $kind: '$library/NodeGraph/Inspector',
          $staticInputs: {customInspectors},
          $inputs: [{data: 'inspectorData'}],
          $outputs: [{data: 'inspectorData'}]
        }
      },
      tree: {
        NodeTree: {
          $kind: '$library/NodeGraph/NodeTree',
          $inputs: [
            {pipeline: 'selectedPipeline'},
            'selectedNodeId',
            'nodeTypes',
            'categories',
            {layout: 'previewLayout'}
          ],
          $outputs: [
            {pipeline: 'selectedPipeline'},
            'selectedNodeId',
            {layout: 'previewLayout'}
          ]
        }
      }
    }
  },
  nodeInspector: {
    $kind: '$library/NodeGraph/NodeInspector',
    $staticInputs: {
      customInspectors,
      inspectorData: 'inspectorData',
    },
    $inputs: [
      'selectedNodeId',
      {pipeline: 'selectedPipeline'},
      'candidates',
      'nodeTypes'
    ],
    $outputs: [{data: 'inspectorData'}]
  },
  candidateFinder: {
    $kind: '$library/NodeGraph/CandidateFinder',
    $inputs: [
      {pipeline: 'selectedPipeline'},
      'nodeTypes'
    ],
    $staticInputs: {globalStores},
    $outputs: ['candidates']
  },
  connectionUpdator: {
    $kind: '$library/NodeGraph/ConnectionUpdator',
    $inputs: [
      {pipeline: 'selectedPipeline'},
      'nodeTypes',
      'candidates',
    ],
    $outputs: [{pipeline: 'selectedPipeline'}]
  },
  nodeUpdator: {
    $kind: '$library/NodeGraph/NodeUpdator',
    $inputs: [
      'selectedNodeId',
      {pipeline: 'selectedPipeline'},
      {data: 'inspectorData'}
    ],
    $outputs: [
      'selectedNodeId',
      {pipeline: 'selectedPipeline'}
    ]
  },
  recipeBuilder: {
    $kind: '$library/NodeGraph/RecipeBuilder',
    $inputs: [
      {pipeline: 'selectedPipeline'},
      'nodeTypes',
      {layout: 'previewLayout'}
    ],
    $outputs: ['recipes']
  },
  layoutInitializer: {
    $kind: '$library/NodeGraph/LayoutInitializer',
    $inputs: [
      {pipeline: 'selectedPipeline'},
      'previewLayout',
      'nodegraphLayout'
    ],
    $outputs: [
      'previewLayout',
      'nodegraphLayout'
    ]
  },
  layoutUpdator: {
    $kind: '$library/NodeGraph/LayoutUpdator',
    $inputs: [
      {pipeline: 'selectedPipeline'},
      'previewLayout',
      'nodegraphLayout'
    ],
    $outputs: [{pipeline: 'selectedPipeline'}]
  },
  combiner: {
    $kind: '$library/NodeGraph/NodeTypesCombiner',
    $inputs: ['builtinNodeTypes', 'selectedPipeline'],
    $outputs: [{results: 'nodeTypes'}, 'selectedPipeline']
  },
  creator: {
    $kind: '$library/NodeGraph/NodeCreator',
    $inputs: [
      'newNodeInfos',
      'nodeTypes',
      {pipeline: 'selectedPipeline'}
    ],
    $outputs: [
      'newNodeInfos',
      {pipeline: 'selectedPipeline'},
      'selectedNodeId'
    ]
  }
};
