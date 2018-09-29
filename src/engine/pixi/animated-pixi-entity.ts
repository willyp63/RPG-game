import PIXIEntity from './pixi-entity';
import Vector from '../core/vector';
import { extras, Texture } from 'pixi.js';
import PIXIAnimation from './pixi-animation';

export default abstract class AnimatedPIXIEntity extends PIXIEntity {

  get sprite() { return <extras.AnimatedSprite>this._sprite; }

  private _animation?: PIXIAnimation;

  constructor(position: Vector, textures: Array<Texture>) {
    super(
      new extras.AnimatedSprite(textures),
      position,
    );
  }

  set animation(animation: PIXIAnimation) {

    if (animation.isFlippedHorizontally === undefined) {
      animation.isFlippedHorizontally = this.isFacingLeft;
    }

    this.sprite.textures = animation.textures;
    this.sprite.animationSpeed = animation.animationSpeed;
    this.sprite.loop = animation.isLooping;
    this.sprite.onFrameChange = () => animation.frameChangeFunc(this.sprite.currentFrame);
    this.sprite.onLoop = animation.loopFunc;
    this.sprite.scale.x = animation.isFlippedHorizontally ? -1 : 1;

    if (this._healthBar) {
      this._healthBar.scale.x = this.sprite.scale.x;
    }

    if (animation.stopOnFrameIndex >= 0) {
      this.sprite.gotoAndStop(animation.stopOnFrameIndex);
    } else {
      this.sprite.gotoAndPlay(0);
    }

    this._animation = animation;
  }

  get isFacingLeft() {
    return this._animation ? this._animation.isFlippedHorizontally : false;
  }

}
