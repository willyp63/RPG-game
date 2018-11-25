import HPActor, { HPActorArgs } from "../core/actor";
import HPVector from "../physics/vector";
import { Sprite, loader, ObservablePoint } from "pixi.js";

export default abstract class HPStaticImageActor extends HPActor {

  get _sprite() { return <Sprite>this.sprite; }

  constructor(
    position: HPVector,
    size: HPVector,
    private imageFile: string,
    _actorOptions: HPActorArgs,
  ) {
    super(
      position,
      size,
      new Sprite(),
      _actorOptions,
    );
  }

  init() {
    this._sprite.texture = loader.resources[this.imageFile].texture;
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
  }

  flipSprite(isFacingLeft = true) {
    this._sprite.scale.x = isFacingLeft ? -1 : 1;
  }

}
