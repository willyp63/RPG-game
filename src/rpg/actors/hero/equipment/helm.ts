import { Sprite } from "pixi.js";
import TextureHelper from "../../../../engine/pixi/texture-helper";

const TEXTURES_FILE = 'public/imgs/helms.json';

export enum HelmType {
  None,
  Viking,
  Wizard,
};

export default class Helm {

  static assets = [TEXTURES_FILE];

  private static get vikingTexture() { return TextureHelper.get(TEXTURES_FILE, "viking-helm.png"); }
  private static get wizardTexture() { return TextureHelper.get(TEXTURES_FILE, "wizard-hood.png"); }

  public getSprite() {
    switch(this._type) {
      case HelmType.Viking:
        return new Sprite(Helm.vikingTexture);
      case HelmType.Wizard:
        return new Sprite(Helm.wizardTexture);
      default:
        return new Sprite();
    }
  }

  constructor(private _type: HelmType) { }

}
