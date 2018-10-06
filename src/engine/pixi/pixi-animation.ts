import { Texture } from "pixi.js";

const DEFAULT_ANIMATION_SPEED = 0.1;

type FrameChangeFunction = (currentFrame: number) => void;

export default class PIXIAnimation {

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
