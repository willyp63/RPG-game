import Entity from "./entity";
import CollisionDetector from "./collision-detector";
import Vector from "./vector";
import Direction from "./direction";

export default abstract class System {

  protected get width() { return 0; };
  protected get height() { return 0; };
  protected get gravityForce() { return new Vector(0, 0.333); }

  protected entities: Array<Entity> = [];

  constructor() {
    this.onTick();
  }

  protected addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  protected removeEntityAt(i: number) {
    this.entities.splice(i, 1);
  }

  protected onTick() {
    requestAnimationFrame(this.onTick.bind(this));

    this.entities.forEach(entity => entity.onTick());
    this._checkForCollisions();
    this._killSquishedEntities();
    this._applyGravity();
    this.entities.forEach(entity => entity.afterTick());
    this._addNewEntities();
    this._removeEntities();
  }

  _checkForCollisions() {
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        const entity1 = this.entities[i];
        const entity2 = this.entities[j];
        const collision = CollisionDetector.detect(entity1, entity2);

        entity1.onCollision(entity2, collision);
        entity2.onCollision(entity1, collision.withOppositeDirection());
      }
    }
  }

  _killSquishedEntities() {
    this.entities.forEach(entity => {
      const isSquished =
        entity.isTouchingWallsInAllDirections([Direction.Up, Direction.Down]) ||
        entity.isTouchingWallsInAllDirections([Direction.Left, Direction.Right]);

      if (isSquished) entity.kill();
    });
  }

  _applyGravity() {
    this.entities.forEach(entity => {
      if (entity.isGravityBound) {
        entity.push(this.gravityForce);
      }
    });
  }

  _removeEntities() {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].canRemoveFromSystem) {
        this.removeEntityAt(i--);
      }
    }
  }

  _addNewEntities() {
    const currentNumEntities = this.entities.length;
    for (let i = 0; i < currentNumEntities; i++) {
      if (this.entities[i].entitiesToAdd.length){
        this.entities[i].entitiesToAdd.forEach(entity => this.addEntity(entity));
        this.entities[i].entitiesToAdd = [];
      }
    }
  }
}
