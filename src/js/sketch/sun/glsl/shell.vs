attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 cameraPosition;
uniform float time;

varying vec2 vUv;
varying float vOpacity;

void main(void) {
  float wave1 = sin(position.x + position.y + time * 0.4);
  float wave2 = sin(position.z - position.x + time * 0.4);
  float wave = wave1 + wave2;
  vec3 wavePosition = normalize(position) * wave * 0.6;

  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position + wavePosition, 1.0);

  float angleToCamera = acos(dot(normalize(cameraPosition), normalize(mPosition.xyz)));

  vUv = uv + vec2(0.5, 0.0);
  vOpacity = smoothstep(0.2, 0.8, abs(sin(angleToCamera)));

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
