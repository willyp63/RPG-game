import Entity from "./entity";
import CollisionDetector from "./collision-detector";

export default class System {

  protected entities: Array<Entity> = [];

  constructor() {
    this.onTick();
  }

  protected addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  protected onTick() {
    requestAnimationFrame(this.onTick.bind(this));

    this.entities.forEach(entity => entity.onTick());

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
}
