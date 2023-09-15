import { GameObject, NeedleEngine, OrbitControls } from '@needle-tools/engine';
import { AxesHelper, GridHelper, MathUtils } from 'three';
import * as THREE from 'three';
import { PlayerController } from './modules/input/PlayerController';

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
  GameObject.addComponent(cube, new PlayerController());
});
