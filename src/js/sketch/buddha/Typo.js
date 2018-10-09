const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

const duration = 1;
let iPositions = undefined;
let iUvs = undefined;
let iTimes = undefined;
let num = 0;

export default class InstanceMesh {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texHannyaShingyo: {
        type: 't',
        value: undefined
      },
      unitUv: {
        type: 'f',
        value: 0
      },
      duration: {
        type: 'f',
        value: duration
      },
    };
    this.obj = undefined;
  }
  createTexture() {
    const text = '観自在菩薩行深般若波羅蜜多時照見五蘊皆空度一切苦厄舎利子色不異空空不異色色即是空空即是色受想行識亦復如是舎利子是諸法空相不生不滅不垢不浄不増不減是故空中無色無受想行識無眼耳鼻舌身意無色声香味触法無眼界乃至無意識界無無明亦無無明尽乃至無老死亦無老死尽無苦集滅道無智亦無得以無所得故菩提薩埵依般若波羅蜜多故心無罣礙無罣礙故無有恐怖遠離一切顛倒夢想究竟涅槃三世諸仏依般若波羅蜜多故得阿耨多羅三藐三菩提故知般若波羅蜜多是大神呪是大明呪是無上呪是無等等呪能除一切苦真実不虚故説般若波羅蜜多呪即説呪日羯諦羯諦波羅羯諦波羅僧羯諦菩提薩婆訶般若心経';
    const widthPerSide = 2048;
    const gridsPerSide = Math.ceil(Math.sqrt(text.length));
    const fontSize = widthPerSide / gridsPerSide;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {
      alpha: true
    });

    num = text.length;
    iPositions = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    iUvs = new THREE.InstancedBufferAttribute(new Float32Array(num * 2), 2);
    iTimes = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);

    canvas.width = canvas.height = widthPerSide;
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.font = fontSize + 'px serif';

    for (var y = 0; y < gridsPerSide; y++) {
      for (var x = 0; x < gridsPerSide; x++) {
        const i = y * gridsPerSide + x;

        // draw canvas2D.
        const str = text.substr(y * gridsPerSide + x, 1);
        ctx.fillText(str, fontSize * x, fontSize * (gridsPerSide - y) - fontSize * 0.15);

        // define instance buffer attributes.
        const radian = MathEx.radians(Math.random() * 360);
        const radius = Math.random() * 20 + 5;
        iPositions.setXYZ(
          i,
          Math.cos(radian) * radius,
          4,
          Math.sin(radian) * radius
        );
        iUvs.setXY(i, x / gridsPerSide, y / gridsPerSide);
        iTimes.setX(i, 0);
      }
    }

    this.uniforms.texHannyaShingyo.value = new THREE.CanvasTexture(canvas);
    this.uniforms.unitUv.value = 1 / gridsPerSide;
  }
  createObj() {
    this.createTexture();

    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(6, 6, 6);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    geometry.addAttribute('iPosition',  iPositions);
    geometry.addAttribute('iUv',  iUvs);
    geometry.addAttribute('iTime',  iTimes);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/typo.vs'),
      fragmentShader: glslify('./glsl/typo.fs'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.y = 4.0;
    this.obj.frustumCulled = false;
  }
  render(time) {
    this.uniforms.time.value += time;
    for (var i = 0; i < num; i++) {
      const past =  iTimes.getX(i);
      if (past > duration) {
        const radian = MathEx.radians(Math.random() * 360);
        const radius = Math.random() * 20 + 5;
        iPositions.setXYZ(
          i,
          Math.cos(radian) * radius,
          0,
          Math.sin(radian) * radius
        );
        iTimes.setX(i, 0);
        iPositions.needsUpdate = true;
      } else {
        iTimes.setX(i, past + time);
      }
    }
    iTimes.needsUpdate = true;
  }
}
