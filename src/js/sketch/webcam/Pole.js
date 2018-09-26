const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Pole {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      force: {
        type: 'f',
        value: 0
      },
    };
    this.obj = null;
  }
  createObj() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(1.4, 1.4, 20);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const num = 100;
    const iPositions = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    const iDelays = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);
    for ( var i = 0, ul = num; i < ul; i++ ) {
      const radius = Math.random() * Math.random() * 80 + 30;
      const radian = MathEx.radians(Math.random() * 360);
      iPositions.setXYZ(
        i,
        Math.cos(radian) * radius,
        Math.sin(radian) * radius,
        0
      );
      iDelays.setX(
        i,
        Math.random() * 8
      )
    }
    geometry.addAttribute('iPosition', iPositions);
    geometry.addAttribute('iDelay', iDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/pole.vs'),
      fragmentShader: glslify('./glsl/pole.fs'),
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.frustumCulled = false;
  }
  render(time, force) {
    this.uniforms.force.value = force;
    this.uniforms.time.value += time * (force * 1.2);
  }
}
