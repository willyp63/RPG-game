import PIXIEntity from './pixi-entity';
import Vector from '../core/vector';
import { extras, Texture } from 'pixi.js';
import PIXIAnimation from './pixi-animation';

export default abstract class AnimatedPIXIEntity extends PIXIEntity {

  get sprite() { return <extras.AnimatedSprite>this._sprite; }

  constructor(position: Vector, textures: Array<Texture>) {
    super(
      new extras.AnimatedSprite(textures),
      position,
    );
  }

  set animation(animation: PIXIAnimation) {
    this.sprite.textures = animation.textures;
    this.sprite.animationSpeed = animation.animationSpeed;
    this.sprite.loop = animation.isLooping;
    this.sprite.onFrameChange = () => animation.frameChangeFunc(this.sprite.currentFrame);
    this.sprite.onLoop = animation.loopFunc;
    this.sprite.scale.x = animation.isFlippedHorizontally ? -1 : 1;

    if (animation.stopOnFrameIndex >= 0) {
      this.sprite.gotoAndStop(animation.stopOnFrameIndex);
    } else {
      this.sprite.play();
    }
  }

}
