const THREE = require('three/build/three.js');
const glslify = require('glslify');

export default class PostEffect {
  constructor(texture) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0,
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
      },
      texture: {
        type: 't',
        value: texture
      }
    };
    this.obj = this.createObj(texture);
    this.time = 1;
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/postEffect.vs'),
        fragmentShader: require('./glsl/postEffect.fs'),
      })
    );
  }
  render(time) {
    this.uniforms.time.value += time * this.time;
  }
  resize() {
    this.uniforms.resolution.value.set(document.body.clientWidth, window.innerHeight);
  }
}
