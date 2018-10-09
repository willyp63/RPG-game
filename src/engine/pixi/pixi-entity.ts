import { ObservablePoint, Sprite } from "pixi.js";
import Vector from "../core/vector";
import Entity from "../core/entity";
import UIEntity from "./ui-entity";
import { HealthBar } from "./health-bar";

export default abstract class PIXIEntity extends Entity {

  static get assets(): Array<string> { return []; }

  get sprite() { return this._sprite; }
  get cameraPosition() { return this.position; }

  public uiEntities: Array<UIEntity> = [];

  protected _sprite: Sprite;
  protected healthBar?: HealthBar;

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

    if (this.maxHealth > 0) {
      this.healthBar = new HealthBar(this.healthBarPosition, this.maxHealth);
      this.uiEntities.push(this.healthBar);
    }
  }

  afterTick() {
    super.afterTick();

    this.alignSprite();
    this.updateHealthBar();
  }

  hideHealthBar() {
    if (!this.healthBar) return;
    this.healthBar.sprite.alpha = 0;
  }

  showHealthBar() {
    if (!this.healthBar) return;
    this.healthBar.sprite.alpha = 1;
  }

  private alignSprite() {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  private updateHealthBar() {
    if (!this.healthBar) return;
    this.healthBar.setHealth(this.health);
    this.healthBar.position = this.healthBarPosition;
  }

  private get healthBarPosition() {
    return this.position.minus(new Vector(0, this.size.y * 0.667));
  }

}
