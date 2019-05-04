import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/crystal.vs';
import fs from './glsl/crystal.fs';

export default class Crystal extends THREE.Mesh {
  constructor(geometry) {
    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      flatShading: true,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Mesh';
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
