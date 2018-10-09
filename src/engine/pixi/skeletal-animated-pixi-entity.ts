import PIXIEntity from "./pixi-entity";
import Vector from "../core/vector";
import { Sprite, Texture, ObservablePoint } from "pixi.js";
import setTicksOut, { clearTicksOut } from "../util/set-ticks-out";

const DEFAULT_ANIMATION_TICK_DELAY = 12;

export class SkeletalSprite extends Sprite {

  get id() { return this._id; }
  get childSprites() { return this._childSprites; }

  constructor(
    private _id: string,
    texture: Texture | undefined,
    position: Vector,
    anchor: Vector,
    private _childSprites: Array<SkeletalSprite> = [],
  ) {
    super(texture);

    this.x = position.x;
    this.y = position.y;
    this.anchor = <ObservablePoint>{ x: anchor.x, y: anchor.y };
    _childSprites.forEach(child => this.addChild(child));
  }

}

type FrameChangeFunction = (currentFrame: number) => void;

export class SkeletalAnimation {

  get frames() { return this._frames; }
  get animationSpeed() { return this._animationSpeed; }
  get frameChangeFunc() { return this._frameChangeFunc; }
  get loopFunc() { return this._loopFunc; }
  get isFlippedHorizontally() { return this._isFlippedHorizontally; }
  get stopOnFrameIndex() { return this._stopOnFrameIndex; }

  private _animationSpeed = 1;
  private _frameChangeFunc: FrameChangeFunction = () => {};
  private _loopFunc = () => {};
  private _isFlippedHorizontally?: boolean = undefined;
  private _stopOnFrameIndex = -1;

  constructor(private _frames: Array<SkeletalAnimationFrame>) { }

  speed(animationSpeed: number) {
    this._animationSpeed = animationSpeed;
    return this;
  }

  onFrameChange(frameChangeFunc: FrameChangeFunction) {
    this._frameChangeFunc = frameChangeFunc;
    return this;
  }

  onLoop(loopFunc: () => void) {
    this._loopFunc = loopFunc;
    return this;
  }

  flippedHorizontally(isFlippedHorizontally: boolean = true) {
    this._isFlippedHorizontally = isFlippedHorizontally;
    return this;
  }

  stopOn(stopOnFrameIndex: number) {
    this._stopOnFrameIndex = stopOnFrameIndex;
    return this;
  }

}

export class SkeletalAnimationFrame {

  get jointPivots() { return this._jointPivots; }

  constructor(
    private _jointPivots: Array<SkeletalAnimationJointPivot>,
  ) { }
}

export class SkeletalAnimationJointPivot {

  get spriteId() { return this._spriteId; }
  get rotation() { return this._rotation; }

  constructor(
    private _spriteId: string,
    private _rotation: number,
  ) { }
}

export default abstract class SkeletalAnimatedPIXIEntity extends PIXIEntity {

  get isFacingLeft() { return this.sprite.scale.x < 0; }

  private spriteMap = <any>{};
  private animationTicksOut?: Function;

  constructor(
    position: Vector,
    rootSprites: Array<SkeletalSprite>,
    private defaultFrame: SkeletalAnimationFrame,
  ) {
    super(
      new Sprite(),
      position,
    );

    rootSprites.forEach(sprite => {
      this._sprite.addChild(sprite);
      this.addToSpriteMap(sprite);
    });
  }

  set animation(animation: SkeletalAnimation) {
    this.cancelAnimation();
    this.flipSprite(animation.isFlippedHorizontally);

    animation.stopOnFrameIndex >= 0
      ? this.showFrameAtIndex(animation.stopOnFrameIndex, animation, false)
      : this.showFrameAtIndex(0, animation);
  }

  private showFrameAtIndex(index: number, animation: SkeletalAnimation, scheduleNextFrame = true) {
    this.showFrame(this.defaultFrame);
    this.showFrame(animation.frames[index]);

    if (animation.frames.length === 1) return;

    let nextIndex = index + 1;
    if (nextIndex >= animation.frames.length) nextIndex = 0;

    this.animationTicksOut = setTicksOut(() => {
      this.showFrameAtIndex(nextIndex, animation);
      animation.frameChangeFunc(nextIndex);
      if (nextIndex === 0) animation.loopFunc();
    }, DEFAULT_ANIMATION_TICK_DELAY / animation.animationSpeed);
  }

  private showFrame(frame: SkeletalAnimationFrame) {
    frame.jointPivots.forEach(jointPivot => {
      const sprite = (jointPivot.spriteId === '#root')
        ? this._sprite
        : this.spriteMap[jointPivot.spriteId];
      sprite.rotation = jointPivot.rotation;
    });
  }

  private addToSpriteMap(sprite: SkeletalSprite) {
    this.spriteMap[sprite.id] = sprite;
    sprite.childSprites.forEach(childSprite => this.addToSpriteMap(childSprite));
  }

  private cancelAnimation() {
    if (this.animationTicksOut) clearTicksOut(this.animationTicksOut);
  }

  private flipSprite(flippedHorizontally?: boolean) {
    if (flippedHorizontally === undefined) return;
    this.sprite.scale.x = flippedHorizontally ? Math.abs(this.sprite.scale.x) * -1 : Math.abs(this.sprite.scale.x);
  }

} 
