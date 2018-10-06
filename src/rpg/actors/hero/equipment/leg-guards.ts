import { Sprite } from "pixi.js";
import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/leg-guards.json';

export default class LegGuards {

  static assets = [TEXTURES_FILE];

  private static get ironUpperLegTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-leg-guards__upper-leg.png"); }
  private static get ironLowerLegTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-leg-guards__lower-leg.png"); }

  public getUpperLegSprite() { return new Sprite(LegGuards.ironUpperLegTexture); }
  public getLowerLegSprite() { return new Sprite(LegGuards.ironLowerLegTexture); }

  constructor() { }

}
