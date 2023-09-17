import { registerType, Behaviour, GameObject } from '@needle-tools/engine';
import { InputAxis } from './InputAxis';
import * as THREE from 'three';

@registerType
export class PlayerController extends Behaviour {
  static get Instance() : PlayerController{
    if(!PlayerController._instance) PlayerController._instance = GameObject.findObjectOfType(PlayerController);
    return PlayerController._instance!; 
  }
  private static _instance: PlayerController|null = null;


  speed: number = 2;

  forwardInput: InputAxis = new InputAxis('w', 's', this.context.input);
  rightInput: InputAxis = new InputAxis('d', 'a', this.context.input);

  workVector: THREE.Vector3 = new THREE.Vector3();

  update() {
    this.workVector.copy(this.context!.mainCameraComponent!.forward);
    this.workVector.y = 0;
    this.workVector.normalize();
    this.workVector.multiplyScalar(this.forwardInput.value);
    this.workVector.multiplyScalar(this.speed * this.context.time.deltaTime);
    this.gameObject.position.add(this.workVector);

    this.workVector.copy(this.context!.mainCameraComponent!.forward);
    this.workVector.cross(new THREE.Vector3(0, 1, 0));
    this.workVector.y = 0;
    this.workVector.normalize();
    this.workVector.multiplyScalar(this.rightInput.value);
    this.workVector.multiplyScalar(this.speed * this.context.time.deltaTime);
    this.gameObject.position.add(this.workVector);
  }
}
