attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform vec2 resolution;
uniform float pixelRatio;
uniform sampler2D noiseTex;

varying vec3 vColor;

void main() {
  // Coordinate transformation
  float texColorR = texture2D(noiseTex, position.yz * 0.01 + vec2(position.x, time * 5.0) * 0.01).r;
  float texColorG = texture2D(noiseTex, position.zx * 0.01 + vec2(position.y, time * 5.0) * 0.01).g;
  float texColorB = texture2D(noiseTex, position.xy * 0.01 + vec2(position.z, time * 5.0) * 0.01).b;
  vec3 noisePosition = (vec3(texColorR, texColorG, texColorB) * 2.0 - 1.0) * 2.0;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noisePosition, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);

  // Define the point size.
  float pointSize = 3.0 * resolution.y / 1024.0 * pixelRatio * 50.0 / distanceFromCamera;

  vColor = vec3(texColorR, texColorG, texColorB);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = pointSize;
}
