import HPVector from "../../engine/physics/vector";
import HPKeyListener from "../../engine/interaction/key-listener";
import HPStaticShapeActor from "../../engine/actors/static-shape-actor";
import TGFireBall from "./fire-ball";
import HPActorType from "../../engine/core/actor-type";
import HPDestroyer from "../../engine/util/destroyable";

export default class TGHero extends HPStaticShapeActor {

  static get runForce() { return new HPVector(3, 0); }
  static get jumpForce() { return new HPVector(0, -16); }
  static get shootForce() { return new HPVector(16, 0); }

  get type() { return HPActorType.Friendly; }
  get size() { return new HPVector(40, 80); }

  private destroyer = new HPDestroyer();
  private leftKeyDown = false;
  private rightKeyDown = false;

  constructor() {
    super(
      HPVector.Zero,
      {
        color: 0x0000FF,
        borderWidth: 2,
        borderColor: 0x000000,
        cornerRadius: 4,
      },
    );

    this.destroyer.add(new HPKeyListener(37 /* left arrow */,
      () => this.onLeftDown(),
      () => this.onLeftUp(),
    ));

    this.destroyer.add(new HPKeyListener(39 /* right arrow */,
      () => this.onRightDown(),
      () => this.onRightUp(),
    ));

    this.destroyer.add(new HPKeyListener(38 /* up arrow */,
      () => this.jump(),
    ));

    this.destroyer.add(new HPKeyListener(90 /* z */,
      () => this.shootFireBall(),
    ));
  }

  destroy() {
    this.destroyer.destroy();
  }

  private runLeft() {
    this.move(TGHero.runForce.flipHorz());
  }

  private runRight() {
    this.move(TGHero.runForce);
  }

  private stopRunning() {
    this.move(HPVector.Zero);
  }

  private onLeftDown() {
    this.leftKeyDown = true;
    this.runLeft();
  }

  private onLeftUp() {
    this.leftKeyDown = false;
    this.rightKeyDown ? this.runRight() : this.stopRunning();
  }

  private onRightDown() {
    this.rightKeyDown = true;
    this.runRight()
  }

  private onRightUp() {
    this.rightKeyDown = false;
    this.leftKeyDown ? this.runLeft() : this.stopRunning();
  }

  private jump() {
    if (this.isOnGround) this.push(TGHero.jumpForce);
  }

  private shootFireBall() {
    const fireBall = new TGFireBall(this.position);
    fireBall.push(TGHero.shootForce.flipHorz(this.isFacingLeft));
    this.newBornActors.push(fireBall);
  }
  
}
