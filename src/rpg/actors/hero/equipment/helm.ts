import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/helms.json';

export enum HelmType {
  None,
  Viking,
  Wizard,
};

export default class Helm {

  static get assets() { return [TEXTURES_FILE]; }

  private static get vikingTexture() { return TextureHelper.get(TEXTURES_FILE, "viking-helm.png"); }
  private static get wizardTexture() { return TextureHelper.get(TEXTURES_FILE, "wizard-hood.png"); }

  get texture() {
    switch(this._type) {
      case HelmType.Viking:
        return Helm.vikingTexture;
      case HelmType.Wizard:
        return Helm.wizardTexture;
      default:
        return undefined;
    }
  }

  constructor(private _type: HelmType) { }

}
