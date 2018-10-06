import { Sprite } from "pixi.js";
import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/chest-pieces.json';

export enum ChestPieceType {
  None,
  Iron,
  Wizard,
};

export default class ChestPiece {

  static assets = [TEXTURES_FILE];

  private static get ironTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-chest-piece.png"); }
  private static get ironUpperArmtexture() { return TextureHelper.get(TEXTURES_FILE, "iron-chest-piece__upper-arm.png"); }
  private static get wizardTexture() { return TextureHelper.get(TEXTURES_FILE, "wizard-chest-piece.png"); }
  private static get wizardUpperArmtexture() { return TextureHelper.get(TEXTURES_FILE, "wizard-chest-piece__upper-arm.png"); }

  public getSprite() {
    switch(this._type) {
      case ChestPieceType.Iron:
        return new Sprite(ChestPiece.ironTexture);
      case ChestPieceType.Wizard:
        return new Sprite(ChestPiece.wizardTexture);
      default:
        return new Sprite();
    }
  }
  public getUpperArmSprite() {
    switch(this._type) {
      case ChestPieceType.Iron:
        return new Sprite(ChestPiece.ironUpperArmtexture);
      case ChestPieceType.Wizard:
        return new Sprite(ChestPiece.wizardUpperArmtexture);
      default:
        return new Sprite();
    }
  }
  public getLowerArmSprite() { return new Sprite(); }

  constructor(private _type: ChestPieceType) { }

}
