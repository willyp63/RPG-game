import HPActor from './actor';
import { Container } from 'pixi.js';
import HPCollisionDetector from '../physics/collision-detector';
import HPCollisionHandler from '../physics/collision-handler';
import HPDirection from '../physics/direction';
import HPVector from '../physics/vector';
import { HPMouseTracker } from '../interaction/mouse-tracker';

export default class HPStage {
  
  size = HPVector.Zero;

  private actors: Array<HPActor> = [];

  constructor(
    private viewSize: HPVector,
    private rootContainer: Container,
    private actorToFollow: HPActor,
    private gravityForce: HPVector,
    private airFrictionCoefficient: number,
  ) {
    HPMouseTracker.setContainer(rootContainer);
  }

  addActor(actor: HPActor) {
    this.actors.push(actor);
    actor.init();
    this.rootContainer.addChild(actor.sprite);
  }

  removeActorAt(i: number) {
    this.rootContainer.removeChild(this.actors[i].sprite);
    this.actors[i].destroy();
    this.actors.splice(i, 1);
  }

  clearActors() {
    while (this.actors[0]) this.removeActorAt(0);
  }

  onTick() {
    this.actors.forEach(actor => actor.beforeTick());
    this.handleCollisions();
    this.followActor();

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
    actor.push(this.gravityForce.times(actor.gravityBoundCoefficient));
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

  private followActor() {
    let stageX = this.viewSize.x / 2 - this.actorToFollow.position.x;
    stageX = Math.min(stageX, 0);
    stageX = Math.max(stageX, this.viewSize.x - this.size.x);

    let stageY = this.viewSize.y / 2 - this.actorToFollow.position.y;
    stageY = Math.min(stageY, 0);
    stageY = Math.max(stageY, this.viewSize.y - this.size.y);

    this.rootContainer.x = stageX;
    this.rootContainer.y = stageY;
  }

}
