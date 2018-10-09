import { ObservablePoint, Sprite } from "pixi.js";
import Vector from "../core/vector";
import Entity from "../core/entity";

export default abstract class PIXIEntity extends Entity {

  static get assets(): Array<string> { return []; }

  get sprite() { return this._sprite; }
  get cameraPosition() { return this.position; }

  protected _sprite: Sprite;

  constructor(
    sprite: Sprite | Function,
    position: Vector,
  ) {
    super(position);

    this._sprite = typeof sprite === 'function' ? sprite() : sprite;
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
  }

  init() {
    super.init();

    this.alignSprite();

    // TODO: INIT HEALTH BAR
  }

  afterTick() {
    super.afterTick();

    this.alignSprite();
  }

  damage(damageAmount: number) {
    super.damage(damageAmount);

    this.updateHealthBar();
  }

  heal(healAmount: number) {
    super.heal(healAmount);

    this.updateHealthBar();
  }

  private alignSprite() {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  private updateHealthBar() {
    // TODO
  }

}
