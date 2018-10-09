import Entity from "./entity";
import Vector from "./vector";
import Direction from "./direction";
import Collision from "./collision";

export default abstract class System {

  get width() { return 0; };
  get height() { return 0; };
  get gravityForce() { return new Vector(0, 0.333); }
  get frictionCoefficient() { return 0.0333; }

  public entities: Array<Entity> = [];

  constructor() { }

  init() {
    this.onTick();
  }

  onTick() {
    requestAnimationFrame(this.onTick.bind(this));

    this.entities.forEach(entity => entity.onTick());
    this.checkForCollisions();
    this.killSquishedEntities();
    this.applyGravity();
    this.applyFriction();
    this.entities.forEach(entity => entity.afterTick());
    this.addNewEntities();
    this.removeEntities();
  }

  addEntity(entity: Entity) {
    entity.init();
    this.entities.push(entity);
  }

  removeEntityAt(i: number) {
    this.entities.splice(i, 1)[0].destroy();
  }

  clearEntities() {
    while(this.entities.length) this.removeEntityAt(0);
  }

  private checkForCollisions() {
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        const entity1 = this.entities[i];
        const entity2 = this.entities[j];
        const collision = Collision.detect(entity1, entity2);

        entity1.onCollision(entity2, collision);
        entity2.onCollision(entity1, collision.withOppositeDirection());
      }
    }
  }

  private killSquishedEntities() {
    this.entities.forEach(entity => {
      const isSquished =
        entity.isTouchingWallsInAllDirections([Direction.Up, Direction.Down]) ||
        entity.isTouchingWallsInAllDirections([Direction.Left, Direction.Right]);

      if (isSquished) entity.kill();
    });
  }

  private applyGravity() {
    this.entities.forEach(entity => {
      if (entity.isGravityBound) {
        entity.push(this.gravityForce);
      }
    });
  }

  private applyFriction() {
    this.entities.forEach(entity => {
      if (entity.isFrictionBound) {
        entity.push(entity.velocity.times(-this.frictionCoefficient));
      }
    });
  }

  private removeEntities() {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].canBeRemovedFromSystem) {
        this.removeEntityAt(i--);
      }
    }
  }

  private addNewEntities() {
    const currentNumEntities = this.entities.length;
    for (let i = 0; i < currentNumEntities; i++) {
      if (this.entities[i].entitiesToAddNextFrame.length){
        this.entities[i].entitiesToAddNextFrame.forEach(entity => this.addEntity(entity));
        this.entities[i].entitiesToAddNextFrame = [];
      }
    }
  }

}
