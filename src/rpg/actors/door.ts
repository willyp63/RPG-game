import Entity from "../../engine/core/entity";
import Vector from "../../engine/core/vector";
import Collision from "../../engine/core/collision";
import EntityType from "../../engine/core/entity-type";
import { Graphics, RenderTexture } from "pixi.js";
import PIXIEntity from "../../engine/pixi/pixi-entity";
import KeyListener from "../../engine/interaction/key-listener";

const INDICATOR_Y_OFFSET = -20;
const INDICATOR_SIZE = 6;
const INDICATOR_OSCILLATION_SPEED = 0.1;
const INDICATOR_OSCILLATION_PERIOD = 36;

export default class Door extends PIXIEntity {

  get size() { return this._size; }

  private _indicator: Graphics;
  private _shouldShowIndicator = false;
  private _indicatorOscillationTicker = 0;
  private _indicatorOscillationDirection = false;
  private _keyListeners: Array<KeyListener> = [];

  constructor(
    position: Vector,
    private _size: Vector,
    private _goToArea: () => void,
  ) {
    super(
      new PIXI.Sprite(RenderTexture.create(_size.x, _size.y)),
      new Vector(position.x + _size.x / 2, position.y + _size.y / 2),
    );

    this._indicator = new Graphics();
    this._indicator.beginFill(0xFFFFFF);
    this._indicator.drawPolygon([
      0, -INDICATOR_SIZE,
      INDICATOR_SIZE, 0,
      INDICATOR_SIZE / 3, 0,
      INDICATOR_SIZE / 3, INDICATOR_SIZE,
      -INDICATOR_SIZE / 3, INDICATOR_SIZE,
      -INDICATOR_SIZE / 3, 0,
      -INDICATOR_SIZE, 0,
      0, -INDICATOR_SIZE,
    ]);
    this._indicator.endFill();

    this._indicator.y = INDICATOR_Y_OFFSET - this._size.y / 2;

    this._sprite.addChild(this._indicator);

    this._keyListeners.push(new KeyListener(38 /* up arrow */,
      () => {
        if (this._shouldShowIndicator) {
          this._goToArea();
        }
      },
    )); 
  }

  kill() {
    this._keyListeners.forEach(keyListener => keyListener.destroy());

    super.kill();
  }

  onTick() {
    super.onTick();

    if (this._shouldShowIndicator) {
      this._indicator.alpha = 1;

      this._indicator.y += this._indicatorOscillationDirection ? INDICATOR_OSCILLATION_SPEED : -INDICATOR_OSCILLATION_SPEED;

      this._indicatorOscillationTicker++;
      if (this._indicatorOscillationTicker >= INDICATOR_OSCILLATION_PERIOD) {
        this._indicatorOscillationTicker = 0;
        this._indicatorOscillationDirection = !this._indicatorOscillationDirection;
      }
    } else {
      this._indicator.alpha = 0;
    }

    this._shouldShowIndicator = false;
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit && otherEntity.type === EntityType.Friendly) {
      this._shouldShowIndicator = true;
    }
  }

}
