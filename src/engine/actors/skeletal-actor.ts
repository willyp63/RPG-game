import HPActor from "../core/actor";
import HPVector from "../physics/vector";
import { Container, Sprite, ObservablePoint, Texture } from "pixi.js";
import { setTicksOut, clearTicksOut } from "../util/set-ticks-out";

export interface HPSkeletalBone {
  id: string;
  anchor?: HPVector;
  position: HPVector;
  children?: Array<HPSkeletalBone>;
}

export interface HPSkeletalFrame {
  pivots: {[index: string]: number};
  rootPivot?: number;
}

export interface HPSkeletalAnimation {
  frames: Array<HPSkeletalFrame>;
  speed: number;
}

export interface HPSkeletalTextureMap {
  [index: string]: Texture;
}

export default abstract class HPSkeletalActor extends HPActor {

  constructor(
    position: HPVector,
    private bones: Array<HPSkeletalBone>,
    private restingFrame: HPSkeletalFrame,
  ) {
    super(
      position,
      new Container(),
    );
  }

  setTextureMap(textureMap: HPSkeletalTextureMap) {
    Object.keys(textureMap).forEach(boneId => {
      this.getBone(boneId).texture = textureMap[boneId];
    });
  }

  setAnchor(boneId: string, anchor: HPVector) {
    this.getBone(boneId).anchor = <ObservablePoint>{ x: anchor.x, y: anchor.y };
  }

  playAnimation(animation: HPSkeletalAnimation) {
    this._cancelAnimation();
    this._playAnimation(animation);
  }

  cancelAnimation() {
    this._cancelAnimation();
    this.performPivots(this.restingFrame);
  }

  init() {
    super.init();
    
    this.bones.forEach(bone => {
      const sprite = this.initBone(bone);
      this.sprite.addChild(sprite);
    });
    this.performPivots(this.restingFrame);
  }

  onTick() {
    super.onTick();

    this.sprite.scale.x = (this.isFacingLeft ? -1 : 1);
  }

  private boneIdToBoneSprite: {[index: string]: Sprite } = <any>{};
  private animationTicksOut?: () => void;

  private getBone(id: string) {
    const bone = this.boneIdToBoneSprite[id];
    if (bone === undefined) throw new Error(`Can't find bone with id: ${id}`);
    return bone;
  }

  private initBone(bone: HPSkeletalBone): Sprite {
    const sprite = new Sprite();

    sprite.x = bone.position.x;
    sprite.y = bone.position.y;
    sprite.anchor = bone.anchor
      ? <ObservablePoint>{ x: bone.anchor.x, y: bone.anchor.y }
      : <ObservablePoint>{ x: 0.5, y: 0.5 };

    this.boneIdToBoneSprite[bone.id] = sprite;

    // ensure a pivot value for every bone in resting frame
    if (this.restingFrame.pivots[bone.id] === undefined) {
      this.restingFrame.pivots[bone.id] = 0;
    }

    if (bone.children) {
      bone.children.forEach(childBone => {
        const childSprite = this.initBone(childBone);
        sprite.addChild(childSprite);
      });
    }
    
    return sprite;
  }

  private _playAnimation(animation: HPSkeletalAnimation, i = 0) {
    this.setFrame(animation.frames[i]);

    let nextIndex = i + 1;
    if (nextIndex >= animation.frames.length) nextIndex = 0;

    this.animationTicksOut = setTicksOut(() => {
      this._playAnimation(animation, nextIndex);
    }, 1 / animation.speed);
  }

  private _cancelAnimation() {
    if (this.animationTicksOut) clearTicksOut(this.animationTicksOut);
  }

  private setFrame(frame: HPSkeletalFrame) {
    this.performPivots(this.restingFrame);
    this.performPivots(frame);
  }

  private performPivots(frame: HPSkeletalFrame) {
    this.sprite.rotation = frame.rootPivot === undefined ? 0 : frame.rootPivot;

    Object.keys(frame.pivots).forEach(boneId => {
      this.getBone(boneId).rotation = frame.pivots[boneId];
    });
  }

}
