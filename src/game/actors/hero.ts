import HPVector from "../../engine/physics/vector";
import HPKeyListener from "../../engine/interaction/key-listener";
import HPDirection from "../../engine/physics/direction";
import HPStaticShapeActor from "../../engine/actors/static-shape-actor";

export default class TGHero extends HPStaticShapeActor {

  static get runForce() { return new HPVector(3, 0); }
  static get jumpForce() { return new HPVector(0, -16); }

  get color() { return 0x0000AA; }
  get borderWidth() { return 2; }
  get borderColor() { return 0x000000FF; }

  get size() { return new HPVector(40, 80); }
  get isGravityBound() { return true; }
  get isWallBound() { return true; }

  private keyListeners: Array<HPKeyListener> = [];
  private leftKeyDown = false;
  private rightKeyDown = false;
  private runForce = HPVector.Zero;
  private isOnGround = false;

  constructor() {
    super(
      HPVector.Zero,
    );

    this.keyListeners.push(new HPKeyListener(37 /* left arrow */,
      () => this.onLeftDown(),
      () => this.onLeftUp(),
    ));

    this.keyListeners.push(new HPKeyListener(39 /* right arrow */,
      () => this.onRightDown(),
      () => this.onRightUp(),
    ));

    this.keyListeners.push(new HPKeyListener(38 /* up arrow */,
      () => this.jump(),
    ));
  }

  onTick() {
    super.onTick();

    this.isOnGround = this.wallContact.all([HPDirection.Down]);

    if (this.isOnGround) this.push(this.runForce);
  }

  destroy() {
    this.keyListeners.forEach(listener => listener.destroy());
  }

  private runLeft() {
    this.runForce = TGHero.runForce.flipHorz();
  }

  private runRight() {
    this.runForce = TGHero.runForce;
  }

  private stopRunning() {
    this.runForce = HPVector.Zero;
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
    if (!this.isOnGround) return;
    this.push(TGHero.jumpForce)
  }
  
}
