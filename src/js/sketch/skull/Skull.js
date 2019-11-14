import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Skull.vs';
import fs from './glsl/Skull.fs';

export default class Skull extends THREE.Group {
  constructor(geometry1, geometry2) {
    // Create Object3D
    super();

    // Define Material
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        alpha: {
          type: 'f',
          value: 0
        },
        renderOutline: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      flatShading: true,
    });

    this.head = new THREE.Mesh(geometry1, this.material);
    this.jaw = new THREE.Mesh(geometry2, this.material);

    this.add(this.head);
    this.add(this.jaw);

    this.name = 'Skull';
    this.isActive = false;
  }
  start(alpha) {
    this.isActive = true;
  }
  update(time, camera) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
  }
}
