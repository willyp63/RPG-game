import { Sprite } from "pixi.js";
import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/leg-guards.json';

export enum LegGuardType {
  None,
  Iron,
  Wizard,
};

export default class LegGuards {

  static assets = [TEXTURES_FILE];

  private static get ironUpperLegTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-leg-guards__upper-leg.png"); }
  private static get ironLowerLegTexture() { return TextureHelper.get(TEXTURES_FILE, "iron-leg-guards__lower-leg.png"); }
  private static get wizardUpperLegTexture() { return TextureHelper.get(TEXTURES_FILE, "wizard-leg-guards__upper-leg.png"); }
  private static get wizardLowerLegTexture() { return TextureHelper.get(TEXTURES_FILE, "wizard-leg-guards__lower-leg.png"); }

  public getUpperLegSprite() {
    switch(this._type) {
      case LegGuardType.Iron:
        return new Sprite(LegGuards.ironUpperLegTexture);
      case LegGuardType.Wizard:
        return new Sprite(LegGuards.wizardUpperLegTexture);
      default:
        return new Sprite();
    }
  }
  public getLowerLegSprite() {
    switch(this._type) {
      case LegGuardType.Iron:
        return new Sprite(LegGuards.ironLowerLegTexture);
      case LegGuardType.Wizard:
        return new Sprite(LegGuards.wizardLowerLegTexture);
      default:
        return new Sprite();
    }
  }

  constructor(private _type: LegGuardType) { }

}
