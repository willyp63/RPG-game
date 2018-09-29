import { Sprite, ObservablePoint } from "pixi.js";
import Vector from "../core/vector";
import Entity from "../core/entity";
import { HealthBar } from "./health-bar";

export default abstract class PIXIEntity extends Entity {

  static assets: Array<string> = [];

  get sprite() { return this._sprite; }
  protected _sprite: Sprite;

  private _healthBar?: HealthBar;

  constructor(
    sprite: Sprite | Function,
    position: Vector,
  ) {
    super(position);

    this._sprite = typeof sprite === 'function' ? sprite() : sprite;

    // all sprites are anchored at their center
    this.sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };

    // wait for subclass to set width/height..
    setTimeout(() => {
      // add health-bar
      if (this.maxHealth) {
        this._healthBar = new HealthBar(new Vector(0, -this.size.y * .667), this.maxHealth);
        this.sprite.addChild(this._healthBar);
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
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  _updateHealthBar() {
    if (!this._healthBar) return;

    this._healthBar.setHealth(this.health);
  }

}
