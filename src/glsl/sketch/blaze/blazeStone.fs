precision highp float;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDistance;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // Flat Shading
  vec3 light = normalize(-vPosition);
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal, light) + 1.0) / 2.0;

  vec3 hsv = vec3(
    0.86 + diff * 0.24,
    1.0 - diff * 0.4,
    (diff * 0.88 + 0.12) * vDistance
    );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
