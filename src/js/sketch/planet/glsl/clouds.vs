attribute vec3 position;
attribute vec3 instancePosition;
attribute vec3 instanceRotate;
attribute vec2 uv;
attribute float speed;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);
#pragma glslify: calcRotateMat4 = require(glsl-matrix/calcRotateMat4);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: ease = require(glsl-easings/circular-out);

void main(void) {
  // added Noise to form like a cloud.
  float noise = snoise3(position + instancePosition);
  vec3 noiseEasePos = normalize(vec3(position.x, position.y, 0.01)) * ease((10.0 - abs(position.z)) / 10.0) * vec3(0.4, 1.0, 1.0);
  vec3 noisePosition = (noise + 1.0) / 2.0 * noiseEasePos * 3.0 + noiseEasePos * 1.0;

  // coordinate transformation
  mat4 translateMat = calcTranslateMat4(instancePosition);
  mat4 rotateMat = calcRotateMat4(instanceRotate);
  mat4 worldRotateMat = calcRotateMat4(vec3(0.0, time * speed, 0.0));
  vec4 mvPosition = modelViewMatrix * worldRotateMat * translateMat * rotateMat * vec4(position + noisePosition, 1.0);

  vPosition = mvPosition.xyz;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
