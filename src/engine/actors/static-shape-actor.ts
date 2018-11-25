import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Graphics } from "pixi.js";

interface HPStaticShapeOptions {
  color: number;
  borderWidth: number;
  borderColor: number;
  cornerRadius: number;
  isRound: false;
}

interface HPStaticShapeArgs {
  color: number;
  borderWidth?: number;
  borderColor?: number;
  cornerRadius?: number;
  isRound?: false;
}

const defaultOptions: HPStaticShapeOptions = {
  color: 0xFFFFFF,
  borderWidth: 0,
  borderColor: 0x000000,
  cornerRadius: 0,
  isRound: false,
};

export default abstract class HPStaticShapeActor extends HPActor {

  get sprite() { return this._sprite; }
  private _sprite: Graphics;

  private options: HPStaticShapeOptions;

  constructor(
    position: HPVector,
    _options: HPStaticShapeArgs,
  ) {
    super(position);

    this.options = Object.assign({}, defaultOptions, _options);
    this._sprite = new Graphics();
  }

  init() {
    this._sprite.beginFill(this.options.color);

    let adjustedSize = this.size;
    if (this.options.borderWidth > 0) {
      this._sprite.lineStyle(this.options.borderWidth, this.options.borderColor);
      const borderSize = new HPVector(this.options.borderWidth, this.options.borderWidth);
      adjustedSize = this.size.minus(borderSize);
    }

    if (this.options.isRound) {
      this._sprite.drawEllipse(0, 0, adjustedSize.x / 2, adjustedSize.y / 2);
    } else {
      this.options.cornerRadius > 0
        ? this._sprite.drawRoundedRect(adjustedSize.x / -2, adjustedSize.y / -2, adjustedSize.x, adjustedSize.y, this.options.cornerRadius)
        : this._sprite.drawRect(adjustedSize.x / -2, adjustedSize.y / -2, adjustedSize.x, adjustedSize.y);
    }
    
    this._sprite.endFill();
  }

}
