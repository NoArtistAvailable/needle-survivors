import { Behaviour, CapsuleCollider, FrameEvent, GameObject, NeedleEngine, Rigidbody } from '@needle-tools/engine';
import { MathUtils, Vector3, Object3D } from 'three';
import * as THREE from 'three';
import { randFloat, seededRandom } from 'three/src/math/MathUtils';
import { PlayerController } from '../input/PlayerController';

export class Enemy {

    public speed: number = 1;
    public gameObject: GameObject;
    public rigidBody: Rigidbody;

    public target: GameObject | null = null;

    private workVector: Vector3 = new Vector3();

    constructor(gameObject: GameObject|Object3D) {
        this.gameObject = gameObject as GameObject;
        this.rigidBody = this.gameObject.getComponent(Rigidbody)!;
    }

    public GetTargetDirection(workVector: Vector3){
        if (!this.target) return;
        workVector.copy(this.target.position);
        workVector.y = this.gameObject.position.y;
        workVector.sub(this.gameObject.position);

        this.workVector.normalize();
    }

    public update(deltaTime: number) {
        if (!this.target) return;

        this.GetTargetDirection(this.workVector);
        this.workVector.multiplyScalar(this.speed);

        this.workVector.sub(this.rigidBody.getVelocity());
        this.rigidBody.setForce(this.workVector.x, this.workVector.y, this.workVector.z);
    }

}

export class EnemyManager extends Behaviour {

    public spawnRadius: number = 5;
    public spawnPerSecond: number = 1;
    public spawnMax: number = 20;

    private leftOverSpawn: number = 0;
    private enemies: Enemy[] = [];

    start(){
        //this.context.registerCoroutineUpdate(this, this.onPhysics(), FrameEvent.PrePhysicsStep);
        this.startCoroutine(this.onPhysics(), FrameEvent.PrePhysicsStep);
    }

    update(): void {
        const deltaTime: number = this.context.time.deltaTime;
        if(this.enemies.length < this.spawnMax){
            this.leftOverSpawn += this.spawnPerSecond * deltaTime;
            for (let toSpawn = 0; toSpawn < Math.floor(this.leftOverSpawn); toSpawn++)
                this.SpawnEnemyAtRandomPosition();
            this.leftOverSpawn = MathUtils.euclideanModulo(this.leftOverSpawn, 1);
        }        
    }

    *onPhysics(){
        while(true){
            const deltaTime: number = this.context.time.deltaTime;
            this.enemies.forEach((e)=>e.update(deltaTime));
            yield;
        }
    }

    static NewDefaultRigidBody() : Rigidbody{
        const rb = new Rigidbody();
        rb.lockRotationX = true;
        rb.lockRotationZ = true;
        rb.lockPositionY = true;
        rb.useGravity = false;
        return rb;
    }

    SpawnEnemyAtRandomPosition() {
        const geometry = new THREE.CapsuleGeometry(0.3,1,3,6);
        const material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y += 0.5;

        const collider = new CapsuleCollider();
        collider.height = 1;
        collider.radius = 0.3;
        const rb = EnemyManager.NewDefaultRigidBody();

        GameObject.addComponent(cube, collider);
        GameObject.addComponent(cube, rb);

        const spawnPos = new Vector3(randFloat(-1,1),0,randFloat(-1,1));
        spawnPos.normalize();
        spawnPos.multiplyScalar(this.spawnRadius);
        spawnPos.add(PlayerController.Instance.gameObject.position);

        cube.position.add(spawnPos);

        this.context.scene.add(cube);
        const enemy = new Enemy(cube);
        enemy.target = PlayerController.Instance.gameObject;
        const vec = new Vector3();
        enemy.GetTargetDirection(vec);
        vec.multiplyScalar(enemy.speed);
        enemy.rigidBody.setVelocity(vec);

        this.enemies.push(enemy);
    }

}