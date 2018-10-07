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

  get upperLegTexture() {
    switch(this._type) {
      case LegGuardType.Iron:
        return LegGuards.ironUpperLegTexture;
      case LegGuardType.Wizard:
        return LegGuards.wizardUpperLegTexture;
      default:
        return undefined;
    }
  }
  get lowerLegTexture() {
    switch(this._type) {
      case LegGuardType.Iron:
        return LegGuards.ironLowerLegTexture;
      case LegGuardType.Wizard:
        return LegGuards.wizardLowerLegTexture;
      default:
        return undefined;
    }
  }

  constructor(private _type: LegGuardType) { }

}
