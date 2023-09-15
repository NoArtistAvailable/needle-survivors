import { Behaviour, registerType } from '@needle-tools/engine';
import { Vector3 } from 'three';

@registerType
export class CameraController extends Behaviour {
  public target: Behaviour | null = null;

  offset: Vector3 = new Vector3(0, 20, 8);

  // constructor(target: Behaviour | null) {
  //   super();
  //   this.target = target;
  // }

  setTarget(target: Behaviour) {
    this.target = target;
  }

  private targetPosition: Vector3 = new Vector3(0, 0, 0);
  start() {
    console.log('!');
    if (this.target) this.targetPosition.copy(this.target.gameObject.position);
  }
  update() {
    console.log('!');
    if (!this.target) return;
    this.targetPosition.lerp(
      this.target.gameObject.position,
      this.context.time.deltaTime * 5
    );
    this.gameObject.position.copy(this.targetPosition);
    this.gameObject.position.add(this.offset);
  }
}
