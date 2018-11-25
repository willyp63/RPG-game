import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Sprite, loader, ObservablePoint } from "pixi.js";

export default abstract class HPStaticImageActor extends HPActor {

  abstract get imageFile(): string;

  get sprite() { return this._sprite; }

  private _sprite: Sprite;

  constructor(
    position: HPVector,
    imageFile: string,
  ) {
    super(position);

    this._sprite = new Sprite(loader.resources[imageFile].texture);
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
  }
}
