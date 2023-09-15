import { GameObject, NeedleEngine, OrbitControls } from '@needle-tools/engine';
import { AxesHelper, GridHelper, MathUtils } from 'three';
import * as THREE from 'three';
import { PlayerController } from './modules/input/PlayerController';
import { CameraController } from './modules/input/CameraController';

NeedleEngine.addContextCreatedCallback((args) => {
  const context = args.context!;
  const scene = context.scene;
  const camera = context.mainCameraComponent!;

  camera.gameObject.getComponent(OrbitControls)!.destroy();
  camera.gameObject.position.set(0, 20, 8);
  camera.gameObject.rotation.set(-70 * MathUtils.DEG2RAD, 0, 0);
  camera.fieldOfView = 45;

  const grid = new GridHelper();
  scene.add(grid);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y += 0.5;
  scene.add(cube);
  const player = new PlayerController();
  GameObject.addComponent(cube, player);

  let camController = new CameraController();
  console.log(camController);
  GameObject.addComponent(camera.gameObject, camController);
  camController.target = player;
  console.log('we got here');
});
