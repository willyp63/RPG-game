import PIXIEntity from "../../engine/pixi/pixi-entity";
import Vector from "../../engine/core/vector";
import { Sprite, loader } from "pixi.js";
import Entity from "../../engine/core/entity";
import Collision from "../../engine/core/collision";
import EntityType from "../../engine/core/entity-type";

const TEXTURE_FILE = "public/imgs/sign-post.png";
const SIZE = new Vector(30, 32);

export default class SignPost extends PIXIEntity {

  get size() { return SIZE; }

  static assets = [TEXTURE_FILE];

  private _shouldShowMessage = false;
  private _isShowingMessage = false;

  constructor(
    position: Vector,
    private _showMessage: () => void,
    private _hideMessage: () => void,
  ) {
    super(
      new Sprite(loader.resources[TEXTURE_FILE].texture),
      position,
    );
  }

  onTick() {
    super.onTick();

    if (this._shouldShowMessage && !this._isShowingMessage) {
      this._showMessage();
      this._isShowingMessage = true;
    } else if (!this._shouldShowMessage && this._isShowingMessage) {
      this._hideMessage();
      this._isShowingMessage = false;
    }

    this._shouldShowMessage = false;
  }

  onCollision(otherEntity: Entity, collision: Collision) {
    super.onCollision(otherEntity, collision);

    if (collision.hit && otherEntity.type === EntityType.Friendly) {
      this._shouldShowMessage = true;
    }
  }

}
