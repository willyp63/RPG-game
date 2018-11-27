import {
  RUN_FORCE,
  JUMP_FORCE,
  SHOOT_FORCE,
  BACK_UPPER_ARM_ID,
  BACK_LOWER_ARM_ID,
  BACK_UPPER_LEG_ID,
  BACK_LOWER_LEG_ID,
  CHEST_ID,
  HEAD_ID,
  FRONT_UPPER_ARM_ID,
  FRONT_LOWER_ARM_ID,
  FRONT_UPPER_LEG_ID,
  FRONT_LOWER_LEG_ID,
} from './constants';
import HPVector from "../../../engine/physics/vector";
import HPKeyListener from "../../../engine/interaction/key-listener";
import TGFireBall from "../fire-ball";
import HPActorType from "../../../engine/core/actor-type";
import HPDestroyer from "../../../engine/util/destroyable";
import HPSkeletalActor, { HPSkeletalTextureMap } from "../../../engine/actors/skeletal-actor";
import HPTextureHelper from "../../../engine/util/texture-helper";
import BONES from "./bones";
import RESTING_FRAME from "./frames/resting";
import RUN_ANIMATION from './animations/run';

export default abstract class TGHero extends HPSkeletalActor {

  static get textureFile() { return 'public/imgs/person.json'; }

  get type() { return HPActorType.Friendly; }
  get size() { return new HPVector(15, 55); }

  constructor() {
    super(
      HPVector.Zero,
      BONES,
      RESTING_FRAME,
    );
  }

  init() {
    super.init();
    this.setTextureMap(TGHero.skeletalTextureMap);
    this.addKeyListeners();
  }

  destroy() {
    this.destroyer.destroy();
  }

  private static get headTexture() { return HPTextureHelper.get(TGHero.textureFile, 'head.png'); }
  private static get chestTexture() { return HPTextureHelper.get(TGHero.textureFile, 'body.png'); }
  private static get limbTexture() { return HPTextureHelper.get(TGHero.textureFile, 'limb.png'); }
  private static get skeletalTextureMap(): HPSkeletalTextureMap {
    return {
      [HEAD_ID]: TGHero.headTexture,
      [CHEST_ID]: TGHero.chestTexture,
      [FRONT_UPPER_ARM_ID]: TGHero.limbTexture,
      [BACK_UPPER_ARM_ID]: TGHero.limbTexture,
      [FRONT_LOWER_ARM_ID]: TGHero.limbTexture,
      [BACK_LOWER_ARM_ID]: TGHero.limbTexture,
      [FRONT_UPPER_LEG_ID]: TGHero.limbTexture,
      [BACK_UPPER_LEG_ID]: TGHero.limbTexture,
      [FRONT_LOWER_LEG_ID]: TGHero.limbTexture,
      [BACK_LOWER_LEG_ID]: TGHero.limbTexture,
    };
  }

  private destroyer = new HPDestroyer();
  private leftKeyDown = false;
  private rightKeyDown = false;

  private addKeyListeners() {
    // left arrow
    this.destroyer.add(new HPKeyListener(37,
      () => this.onLeftDown(),
      () => this.onLeftUp(),
    ));

    // right arrow
    this.destroyer.add(new HPKeyListener(39,
      () => this.onRightDown(),
      () => this.onRightUp(),
    ));

    // up arrow
    this.destroyer.add(new HPKeyListener(38,
      () => this.jump(),
    ));

    // Z
    this.destroyer.add(new HPKeyListener(90,
      () => this.shootFireBall(),
    ));
  }

  private runLeft() {
    this.move(RUN_FORCE.flipHorz());
    this.playAnimation(RUN_ANIMATION);
  }

  private runRight() {
    this.move(RUN_FORCE);
    this.playAnimation(RUN_ANIMATION);
  }

  private stopRunning() {
    this.move(HPVector.Zero);
    this.cancelAnimation();
  }

  private onLeftDown() {
    this.leftKeyDown = true;
    this.runLeft();
  }

  private onLeftUp() {
    this.leftKeyDown = false;
    this.rightKeyDown
      ? this.runRight()
      : this.stopRunning();
  }

  private onRightDown() {
    this.rightKeyDown = true;
    this.runRight();
  }

  private onRightUp() {
    this.rightKeyDown = false;
    this.leftKeyDown
      ? this.runLeft()
      : this.stopRunning();
  }

  private jump() {
    if (!this.isOnGround) return;
    this.push(JUMP_FORCE);
  }

  private shootFireBall() {
    const fireBall = new TGFireBall(this.position);
    fireBall.push(SHOOT_FORCE.flipHorz(this.isFacingLeft));
    this.newBornActors.push(fireBall);
  }
  
}
