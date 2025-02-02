/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
export const customInspectors = {
  'CssStyle': {
    $meta: {
      name: 'CssStyle Inspector'
    },
    inspect: {
      $kind: '$library/Node/Inspectors/CssStyleInspector',
    }
  }
};