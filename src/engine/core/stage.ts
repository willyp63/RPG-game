import HPActor from './actor';
import { Container } from 'pixi.js';
import HPCollisionDetector from '../physics/collision-detector';
import HPCollisionHandler from '../physics/collision-handler';
import HPDirection from '../physics/direction';
import HPVector from '../physics/vector';

export default class HPStage {

  private actors: Array<HPActor> = [];

  constructor(
    private rootContainer: Container,
    private gravityForce: HPVector,
    private airFrictionCoefficient: number,
  ) { }

  addActor(actor: HPActor) {
    this.actors.push(actor);
    this.rootContainer.addChild(actor.sprite);
  }

  removeActorAt(i: number) {
    this.rootContainer.removeChild(this.actors[i].sprite);
    this.actors.splice(i, 1);
  }

  clearActors() {
    while (this.actors[0]) this.removeActorAt(0);
  }

  onTick() {
    this.actors.forEach(actor => actor.beforeTick());
    this.handleCollisions();

    this.actors.forEach(actor => {
      this.killIfSquished(actor);
      this.applyGravity(actor);
      this.applyAirFriction(actor);
      actor.onTick();
      this.addNewBornActors(actor);
    });

    this.removeDeadActors();
  }

  private handleCollisions() {
    for (let i = 0; i < this.actors.length; i++) {
      for (let j = i + 1; j < this.actors.length; j++) {
        const actor1 = this.actors[i];
        const actor2 = this.actors[j];
        const collision = HPCollisionDetector.detect(actor1, actor2);

        HPCollisionHandler.handle(actor1, actor2, collision);
        actor1.onCollision(actor2, collision);
        actor2.onCollision(actor1, collision.withOppositeDirection());
      }
    }
  }

  private killIfSquished(actor: HPActor) {
    if (actor.wallContact.all([HPDirection.Up, HPDirection.Down]) ||
        actor.wallContact.all([HPDirection.Left, HPDirection.Right])) {
      actor.kill();
    }
  }

  private applyGravity(actor: HPActor) {
    if (actor.isGravityBound) actor.push(this.gravityForce);
  }

  private applyAirFriction(actor: HPActor) {
    if (actor.isAirFrictionBound) actor.push(actor.velocity.times(-this.airFrictionCoefficient));
  }

  private addNewBornActors(actor: HPActor) {
    if (!actor.newBornActors.length) return;

    actor.newBornActors.forEach(actor => {
      this.addActor(actor);
    });
    actor.newBornActors = [];
  }

  private removeDeadActors() {
    for (let i = 0; i < this.actors.length; i++) {
      if (this.actors[i].isDead) this.removeActorAt(i--);
    }
  }

}
