import { Sprite, ObservablePoint, Container } from "pixi.js";
import Vector from "../core/vector";
import Entity from "../core/entity";
import { HealthBar } from "./health-bar";

export const HEALTH_BAR_Y_POSITION_PERCENT =  0.667;

export default abstract class PIXIEntity extends Entity {

  static assets: Array<string> = [];

  get container() { return this._container; }
  protected _container: Container;

  get sprite() { return this._sprite; }
  protected _sprite: Sprite;

  get cameraPosition() { return this.position; }

  protected _healthBar?: HealthBar;

  constructor(
    sprite: Sprite | Function,
    position: Vector,
  ) {
    super(position);

    this._container = new Container();

    this._sprite = typeof sprite === 'function' ? sprite() : sprite;
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this._container.addChild(this._sprite);

    // wait for child constructor to run
    setTimeout(() => {
      // add health-bar
      if (this.maxHealth) {
        this._healthBar = new HealthBar(new Vector(0, -this.size.y * HEALTH_BAR_Y_POSITION_PERCENT), this.maxHealth);
        this._container.addChild(this._healthBar);
      }
    }, 0);

    this._alignSprite();
  }

  afterTick() {
    super.afterTick();

    this._alignSprite();
  }

  damage(damageAmount: number) {
    super.damage(damageAmount);

    this._updateHealthBar();
  }

  heal(healAmount: number) {
    super.heal(healAmount);

    this._updateHealthBar();
  }

  /* --- private --- */
  _alignSprite() {
    this.container.x = this.position.x;
    this.container.y = this.position.y;
  }

  _updateHealthBar() {
    if (!this._healthBar) return;

    this._healthBar.setHealth(this.health);
  }

}
