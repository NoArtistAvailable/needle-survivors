import { Behaviour, GameObject } from '@needle-tools/engine';
import { MathUtils, Vector3, Object3D } from 'three';
import * as THREE from 'three';
import { randFloat, seededRandom } from 'three/src/math/MathUtils';
import { PlayerController } from '../input/PlayerController';

export class Enemy {

    public speed: number = 1;
    public gameObject: GameObject;

    public target: GameObject | null = null;

    private workVector: Vector3 = new Vector3();

    constructor(gameObject: GameObject|Object3D) {
        this.gameObject = gameObject as GameObject;
    }

    public update(deltaTime: number) {
        if (!this.target) return;
        this.workVector.copy(this.target.position);
        this.workVector.sub(this.gameObject.position);
        this.workVector.normalize();

        this.workVector.multiplyScalar(deltaTime * this.speed);
        this.workVector.add(this.gameObject.position);
        this.gameObject.position.copy(this.workVector);
    }

}

export class EnemyManager extends Behaviour {

    public spawnRadius: number = 5;
    public spawnPerSecond: number = 1;
    public spawnMax: number = 20;

    private leftOverSpawn: number = 0;
    private enemies: Enemy[] = [];
    update(): void {
        const deltaTime: number = this.context.time.deltaTime;
        if(this.enemies.length < this.spawnMax){
            this.leftOverSpawn += this.spawnPerSecond * deltaTime;
            for (let toSpawn = 0; toSpawn < Math.floor(this.leftOverSpawn); toSpawn++)
                this.SpawnEnemyAtRandomPosition();
            this.leftOverSpawn = MathUtils.euclideanModulo(this.leftOverSpawn, 1);
        }

        this.enemies.forEach((e)=>e.update(deltaTime));
    }

    SpawnEnemyAtRandomPosition() {
        const geometry = new THREE.CapsuleGeometry(0.3,1,3,6);
        const material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y += 0.5;

        const spawnPos = new Vector3(randFloat(-1,1),0,randFloat(-1,1));
        spawnPos.normalize();
        spawnPos.multiplyScalar(this.spawnRadius);
        spawnPos.add(PlayerController.Instance.gameObject.position);

        cube.position.add(spawnPos);

        this.context.scene.add(cube);
        const enemy = new Enemy(cube);
        this.enemies.push(enemy);

        enemy.target = PlayerController.Instance.gameObject;
    }

}