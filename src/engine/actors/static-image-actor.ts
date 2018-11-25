import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Sprite, loader, ObservablePoint } from "pixi.js";

export default abstract class HPStaticImageActor extends HPActor {

  abstract get imageFile(): string;

  get sprite() { return this._sprite; }

  private _sprite: Sprite;

  constructor(
    position: HPVector,
  ) {
    super(position);

    this._sprite = new Sprite();
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
  }

  init() {
    this._sprite.texture = loader.resources[this.imageFile].texture;
  }

  flipSprite(isFacingLeft = true) {
    this._sprite.scale.x = isFacingLeft ? -1 : 1;
  }

}
