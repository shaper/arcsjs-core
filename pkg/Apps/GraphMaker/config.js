/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
let url = import.meta.url;
if (url.includes('localhost:9888')) {
  url = `http://localhost:9888/0.4.5`;
} else if (url.includes('localhost/gob')) {
  url = `http://localhost/gob/arcsjs-core/pkg`;
} else {
  url = `https://arcsjs.web.app/0.4.5`;
}

globalThis.config = {
  arcsPath: url,
  aeon: 'graph/0.4.5',
  // theme: 'dark',
  logFlags: {
    app: true,
    //arc: true,
    //code: true,
    //composer: true,
    graph: true,
    particles: true,
    //recipe: true,
    //storage: true,
    //services: true
  }
};
