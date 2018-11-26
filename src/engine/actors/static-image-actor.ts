import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Sprite, loader, ObservablePoint } from "pixi.js";

export default abstract class HPStaticImageActor extends HPActor {

  /* @override */
  get imageFile() { return ''; }
  get imageScale() { return 1; }

  constructor(
    position: HPVector,
  ) {
    super(
      position,
      new Sprite(),
    );
  }

  init() {
    this._sprite.texture = loader.resources[this.imageFile].texture;
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
    this._sprite.scale.x = this.imageScale;
    this._sprite.scale.y = this.imageScale;
  }

  onTick() {
    super.onTick();

    this._sprite.scale.x = (this.isFacingLeft ? -1 : 1) * this.imageScale;
  }

  private get _sprite() { return <Sprite>this.sprite; }

}
