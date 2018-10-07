import PIXIEntity from './pixi-entity';
import Vector from '../core/vector';
import { extras, Texture } from 'pixi.js';

const DEFAULT_ANIMATION_SPEED = 0.1;

type FrameChangeFunction = (currentFrame: number) => void;

export class PIXIAnimation {

  public animationSpeed = DEFAULT_ANIMATION_SPEED;
  public isLooping = true;
  public frameChangeFunc: FrameChangeFunction = () => {};
  public loopFunc = () => {};
  public isFlippedHorizontally?: boolean = undefined;
  public stopOnFrameIndex = -1;

  constructor(public textures: Array<Texture>) { }

  speed(animationSpeed: number) {
    this.animationSpeed = animationSpeed;
    return this;
  }

  loop(isLooping: boolean) {
    this.isLooping = isLooping;
    return this;
  }

  onFrameChange(frameChangeFunc: FrameChangeFunction) {
    this.frameChangeFunc = frameChangeFunc;
    return this;
  }

  onLoop(loopFunc: () => void) {
    this.loopFunc = loopFunc;
    return this;
  }

  flippedHorizontally(isFlippedHorizontally: boolean = true) {
    this.isFlippedHorizontally = isFlippedHorizontally;
    return this;
  }

  stopOn(stopOnFrameIndex: number) {
    this.stopOnFrameIndex = stopOnFrameIndex;
    return this;
  }

}


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

    this.sprite.onFrameChange = () => animation.frameChangeFunc(this.sprite.currentFrame);
    this.sprite.onLoop = animation.loopFunc;
    this.sprite.textures = animation.textures;
    this.sprite.animationSpeed = animation.animationSpeed;
    this.sprite.loop = animation.isLooping;
    this.sprite.scale.x = animation.isFlippedHorizontally ? Math.abs(this.sprite.scale.x) * -1 : Math.abs(this.sprite.scale.x) * 1;

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
