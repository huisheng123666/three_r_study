import {
  Color,
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  Mesh,
  WebGLRenderer,
  DirectionalLight,
  MeshStandardMaterial,
  Clock,
  TextureLoader,
  AmbientLight,
  HemisphereLight,
  AxesHelper,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let resizeTimer: number | null = null;

class Word {
  camera: PerspectiveCamera | null = null;
  scene: Scene | null = null;
  renderer: WebGLRenderer | null = null;
  container?: HTMLElement;
  controls?: OrbitControls | null = null;
  clock?: Clock;
  gltfLoader?: GLTFLoader | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    this.container.appendChild(this.renderer.domElement);
    this.gltfLoader = createGLTFLoader();
    // 灯光
    const { mainLight, ambientLight, hemisphereLight } = createLights();

    // const cube = createCube();

    this.scene.add(mainLight, ambientLight, hemisphereLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;

    this.clock = new Clock();

    this.renderer.setAnimationLoop(() => {
      // const radiansPerSecond = MathUtils.degToRad(30);
      // const delta = this.clock?.getDelta();

      // cube.rotation.z += radiansPerSecond * delta!;
      // cube.rotation.x += radiansPerSecond * delta!;
      // cube.rotation.y += radiansPerSecond * delta!;

      // required if controls.enableDamping or controls.autoRotate are set to true
      this.controls?.update();

      this.renderer?.render(this.scene!, this.camera!);

      this.camera?.lookAt(0, 0, 0);
    });
  }

  render() {
    this.renderer?.render(this.scene!, this.camera!);
  }

  resize() {
    if (resizeTimer) {
      clearTimeout(resizeTimer);
      resizeTimer = null;
    }
    resizeTimer = setTimeout(() => {
      this.camera!.aspect =
        this.container!.clientWidth / this.container!.clientHeight;
      this.renderer!.setSize(
        this.container!.clientWidth,
        this.container!.clientHeight
      );
      this.renderer!.setPixelRatio(window.devicePixelRatio);
      this.camera?.updateProjectionMatrix();
    }, 100);
  }

  destroy() {
    this.container?.removeChild(this.renderer!.domElement);
    this.renderer?.dispose();
    this.controls?.dispose();
  }

  addHelper() {
    const axesHelper = new AxesHelper(10);
    this.scene!.add(axesHelper);
  }

  loaderModel(
    url: string,
    onLoad: <T>(data: T) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void
  ) {
    this.gltfLoader?.load(url, onLoad, onProgress, onError);
  }
}

function createScene() {
  const scene = new Scene();

  scene.background = new Color("skyblue");

  return scene;
}

function createCamera() {
  const camera = new PerspectiveCamera(
    35, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    1000 // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(100, 100, 100);

  return camera;
}

function createMaterial() {
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load("/uv-test-bw.png");

  const material = new MeshStandardMaterial({
    map: texture,
  });

  return material;
}

function createCube() {
  // create a geometry
  const geometry = new BoxGeometry(2, 2, 2);

  // create a default (white) Basic material
  const material = createMaterial();

  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);

  // cube.rotation.set(-0.5, -0.1, 0.8);

  return cube;
}

function createRenderer() {
  const renderer = new WebGLRenderer();

  return renderer;
}

function createLights() {
  // 环境光
  const ambientLight = new AmbientLight("white", 2);
  // 直线光
  const mainLight = new DirectionalLight("white", 5);
  mainLight.position.set(10, 10, 10);

  // 半球光 光照颜色从天空光线颜色渐变到地面光线颜色
  const hemisphereLight = new HemisphereLight("green", "red", 5);

  return { ambientLight, mainLight, hemisphereLight };
}

function createGLTFLoader() {
  const loader = new GLTFLoader();

  return loader;
}

export { Word };
