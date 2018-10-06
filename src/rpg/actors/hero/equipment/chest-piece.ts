import { Sprite } from "pixi.js";
import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/chest-pieces.json';

export default class ChestPiece {

  static assets = [TEXTURES_FILE];

  private static get ironTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-chest-piece.png"); }
  private static get ironUpperArmtexture() { return TextureHelper.get(TEXTURES_FILE, "iron-chest-piece__upper-arm.png"); }

  public getSprite() { return new Sprite(ChestPiece.ironTexture); }
  public getUpperArmSprite() { return new Sprite(ChestPiece.ironUpperArmtexture); }
  public getLowerArmSprite() { return new Sprite(); }

  constructor() { }

}
