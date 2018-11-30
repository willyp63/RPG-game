import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Sprite, loader, ObservablePoint } from "pixi.js";

export default abstract class HPStaticImageActor extends HPActor {

  /** @override */
  get imageFile() { return ''; }

  constructor(
    position: HPVector,
  ) {
    super(
      position,
      new Sprite(),
    );
  }

  init() {
    super.init();
    
    this._sprite.texture = loader.resources[this.imageFile].texture;
    this._sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
  }

  onTick() {
    super.onTick();

    this._sprite.scale.x = (this.isFacingLeft ? -1 : 1);
  }

  private get _sprite() { return <Sprite>this.sprite; }

}
