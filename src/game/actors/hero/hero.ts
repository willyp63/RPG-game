import {
  RUN_FORCE,
  JUMP_FORCE,
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
  WEAPON_ID,
  FRONT_LOWER_ARM_CLONE_ID,
  SIZE,
} from './constants';
import HPVector from "../../../engine/physics/vector";
import HPKeyListener from "../../../engine/interaction/key-listener";
import HPActorType from "../../../engine/core/actor-type";
import HPDestroyer from "../../../engine/util/destroyable";
import HPSkeletalActor, { HPSkeletalTextureMap } from "../../../engine/actors/skeletal-actor";
import HPTextureHelper from "../../../engine/util/texture-helper";
import BONES from "./bones";
import RESTING_FRAME from "./frames/resting";
import RUN_ANIMATION from './animations/run';
import TGWeapon from './weapon';

export default abstract class TGHero extends HPSkeletalActor {

  static get textureFile() { return 'public/imgs/person.json'; }

  /** @override */
  get weapon() { return new TGWeapon(); }
  get jumpForce() { return JUMP_FORCE; }
  get runForce() { return RUN_FORCE; }

  get type() { return HPActorType.Friendly; }
  get size() { return SIZE; }

  constructor() {
    super(
      HPVector.Zero,
      BONES,
      RESTING_FRAME,
    );
  }

  init() {
    super.init();
    
    this.initSprite();
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
      [FRONT_LOWER_ARM_CLONE_ID]: TGHero.limbTexture,
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

  private initSprite() {
    this.setTextureMap(TGHero.skeletalTextureMap);

    this.setTextureMap({ [WEAPON_ID]: this.weapon.getTexture() });
    this.setAnchor(WEAPON_ID, this.weapon.getAnchor());
  }

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
  }

  private runLeft() {
    this.move(this.runForce.flipHorz());
    this.playAnimation(RUN_ANIMATION);
  }

  private runRight() {
    this.move(this.runForce);
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
    this.push(this.jumpForce);
  }
  
}
