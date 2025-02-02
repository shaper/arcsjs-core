/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
const builtin = navigator.mediaDevices;
const fallback = MediaDevices.prototype;

let asyncStreamGetter;

globalThis.createVirtualCamera = _asyncStreamGetter => {
  asyncStreamGetter = _asyncStreamGetter;
  builtin.getUserMedia = getUserMedia;
  builtin.enumerateDevices = enumerateDevices;
  builtin.dispatchEvent(
    new CustomEvent('devicechange')
  );
};

const enumerateDevices = async function () {
  const devices = await fallback.enumerateDevices.call(this);
  const virtualCamera = {
    deviceId: 'virtual',
    groupID: 'ArcsJs',
    kind: 'videoinput',
    label: 'ArcsJs Virtual Camera'
  };
  return [...devices, virtualCamera];
};

const getUserMedia = async function (constraints) {
  if (constraints) {
    const videoDeviceId = getDeviceId(constraints.video);
    if (videoDeviceId === 'virtual') {
      return marshalVirtualStream(constraints);
    } else {
      return fallback.getUserMedia.call(this, constraints);
    }
  }
};

const marshalVirtualStream = async ({audio, video}) => {
  const stream = await asyncStreamGetter(video);
  if (audio) {
    const audioStream = await fallback.getUserMedia.call(this, {audio, video: false});
    for (const track of audioStream.getAudioTracks()) {
      stream.addTrack(track);
    }
  }
  return stream;
};

const getDeviceId = videoConstraints => {
  if (typeof videoConstraints === 'boolean') {
    return null;
  }
  if (!videoConstraints?.deviceId) {
    return null;
  }
  if (typeof videoConstraints.deviceId === 'string') {
    return videoConstraints.deviceId;
  }
  if (videoConstraints.deviceId instanceof Array) {
    return videoConstraints.deviceId[0];
  }
  return videoConstraints.deviceId.exact ?? null;
};
