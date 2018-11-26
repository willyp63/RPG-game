import HPVector from "../../../engine/physics/vector";
import HPKeyListener from "../../../engine/interaction/key-listener";
import TGFireBall from "../fire-ball";
import HPActorType from "../../../engine/core/actor-type";
import HPDestroyer from "../../../engine/util/destroyable";
import HPStaticImageActor from "../../../engine/actors/static-image-actor";

const RUN_FORCE = new HPVector(3, 0);
const JUMP_FORCE = new HPVector(0, -16);
const SHOOT_FORCE = new HPVector(16, 0);

export default abstract class TGHero extends HPStaticImageActor {

  get type() { return HPActorType.Friendly; }

  constructor() {
    super(HPVector.Zero);
  }

  init() {
    super.init();
    this.addKeyListeners();
  }

  destroy() {
    this.destroyer.destroy();
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

  private onLeftDown() {
    this.leftKeyDown = true;
    this.move(RUN_FORCE.flipHorz());
  }

  private onLeftUp() {
    this.leftKeyDown = false;
    this.rightKeyDown
      ? this.move(RUN_FORCE)
      : this.move(HPVector.Zero);
  }

  private onRightDown() {
    this.rightKeyDown = true;
    this.move(RUN_FORCE);
  }

  private onRightUp() {
    this.rightKeyDown = false;
    this.leftKeyDown
      ? this.move(RUN_FORCE.flipHorz())
      : this.move(HPVector.Zero);
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