import { GameObject, NeedleEngine } from '@needle-tools/engine';
import { AxesHelper, GridHelper } from 'three';
import * as THREE from 'three';
import { PlayerController } from './modules/input/PlayerController';

NeedleEngine.addContextCreatedCallback((args) => {
  const context = args.context;
  const scene = context.scene;

  const grid = new GridHelper();
  scene.add(grid);

  const axis = new AxesHelper();
  axis.position.y = 1;
  scene.add(axis);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y += 0.5;
  scene.add(cube);
  GameObject.addComponent(cube, new PlayerController());
});
