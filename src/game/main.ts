import HPApp from '../engine/core/app';
import HPVector from '../engine/physics/vector';
import HPActorFactory from '../engine/core/actor-factory';
import HPActorData from '../engine/services/data/actor-data';
import HPActor from '../engine/core/actor';
import HPStaticImageActor from '../engine/actors/static-image-actor';
import HPKeyListener from '../engine/interaction/key-listener';
import HPDirection from '../engine/physics/direction';

class TGHero extends HPStaticImageActor {

  static get runForce() { return new HPVector(3, 0); }
  static get jumpForce() { return new HPVector(0, -16); }

  get imageFile() { return 'public/imgs/barbarian.png'; }
  get size() { return new HPVector(94, 107); }
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
    this.flipSprite();
  }

  private runRight() {
    this.runForce = TGHero.runForce;
    this.flipSprite(false);
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

class TGActorFactory extends HPActorFactory {

  protected _createFromData(data: HPActorData): HPActor | undefined {
    return super._createFromData(data) || this.__createFromData(data);
  }

  private __createFromData(data: HPActorData): HPActor | undefined {
    return undefined;
  }
}

const hero = new TGHero();

const app = new HPApp(
  new HPVector(825, 525),
  '#game-container',
  new TGActorFactory(),
  [hero.imageFile],
  'public/areas/test-1.json',
  hero,
  new HPVector(200, 200),
  new HPVector(0, 1),
  0.01,
);

app.start();
