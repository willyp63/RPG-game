import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/chest-pieces.json';

export enum ChestPieceType {
  None,
  Iron,
  Wizard,
};

export default class ChestPiece {

  static get assets() { return [TEXTURES_FILE]; }

  private static get ironTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-chest-piece.png"); }
  private static get ironUpperArmtexture() { return TextureHelper.get(TEXTURES_FILE, "iron-chest-piece__upper-arm.png"); }
  private static get wizardTexture() { return TextureHelper.get(TEXTURES_FILE, "wizard-chest-piece.png"); }
  private static get wizardUpperArmtexture() { return TextureHelper.get(TEXTURES_FILE, "wizard-chest-piece__upper-arm.png"); }

  get texture() {
    switch(this._type) {
      case ChestPieceType.Iron:
        return ChestPiece.ironTexture;
      case ChestPieceType.Wizard:
        return ChestPiece.wizardTexture;
      default:
        return undefined;
    }
  }
  get upperArmTexture() {
    switch(this._type) {
      case ChestPieceType.Iron:
        return ChestPiece.ironUpperArmtexture;
      case ChestPieceType.Wizard:
        return ChestPiece.wizardUpperArmtexture;
      default:
        return undefined;
    }
  }
  get lowerArmTexture() { return undefined; }

  constructor(private _type: ChestPieceType) { }

}
