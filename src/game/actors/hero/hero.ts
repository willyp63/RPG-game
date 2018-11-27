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
import { HPMouseTracker } from '../../../engine/interaction/mouse-tracker';

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

  /** @override */
  performAbility(abilityNum: number) { }

  init() {
    super.init();
    
    this.initSprite();
    this.addKeyListeners();
  }

  destroy() {
    this.destroyer.destroy();
  }

  get targetPosition() {
    return HPMouseTracker.position;
  }

  get targetUnitVector() {
    return HPMouseTracker.position.minus(this.position).toUnitVector();
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
  private isLeftDown = false;
  private isRightDown = false;

  private initSprite() {
    this.setTextureMap(TGHero.skeletalTextureMap);

    this.setTextureMap({ [WEAPON_ID]: this.weapon.getTexture() });
    this.setAnchor(WEAPON_ID, this.weapon.getAnchor());
  }

  private addKeyListeners() {
    // move
    this.destroyer.add(new HPKeyListener(65/* a */,
      () => this.onLeftDown(),
      () => this.onLeftUp(),
    ));
    this.destroyer.add(new HPKeyListener(68/* d */,
      () => this.onRightDown(),
      () => this.onRightUp(),
    ));

    // jump
    this.destroyer.add(new HPKeyListener(87/* w */,
      () => this.jump(),
    ));

    // abilities
    this.destroyer.add(new HPKeyListener(81/* q */, () => this.performAbility(0)));
    this.destroyer.add(new HPKeyListener(69/* e */, () => this.performAbility(1)));
    this.destroyer.add(new HPKeyListener(82/* r */, () => this.performAbility(2)));
    this.destroyer.add(new HPKeyListener(70/* f */, () => this.performAbility(3)));
    this.destroyer.add(new HPKeyListener(67/* c */, () => this.performAbility(4)));
  }

  private onLeftDown() {
    this.isLeftDown = true;
    this.runLeft();
  }

  private onLeftUp() {
    this.isLeftDown = false;
    this.isRightDown ? this.runRight() : this.stopRunning();
  }

  private onRightDown() {
    this.isRightDown = true;
    this.runRight();
  }

  private onRightUp() {
    this.isRightDown = false;
    this.isLeftDown ? this.runLeft() : this.stopRunning();
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

  private jump() {
    if (!this.isOnGround) return;
    this.push(this.jumpForce);
  }
  
}
