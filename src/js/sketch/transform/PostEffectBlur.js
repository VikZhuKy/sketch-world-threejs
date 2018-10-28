const THREE = require('three');

export default class PostEffectBlur {
  constructor(texture, x, y, radius) {
    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(),
      },
      direction: {
        type: 'v2',
        value: new THREE.Vector2(x, y)
      },
      radius: {
        type: 'f',
        value: radius
      },
      texture: {
        type: 't',
        value: texture
      }
    };
    this.obj;

    this.createObj();
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/postEffect.vs'),
      fragmentShader: require('./glsl/postEffectBlur.fs'),
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.visible = false;
  }
  resize(resolution) {
    this.uniforms.resolution.value.set(resolution.x, resolution.y);
  }
  render(renderer, scene, camera, renderTarget) {
    this.obj.visible = true;
    renderer.render(scene, camera, renderTarget);
    this.obj.visible = false;
  }
}
