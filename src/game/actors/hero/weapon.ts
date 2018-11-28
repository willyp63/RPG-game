import HPTextureHelper from "../../../engine/util/texture-helper";
import { Texture } from "pixi.js";
import HPVector from "../../../engine/physics/vector";

export enum TGWeaponType {
  Fist,
  Staff,
  Sword,
  Crossbow,
}

export default class TGWeapon {

  static get textureFile() { return 'public/imgs/weapons.json'; }

  constructor(private type = TGWeaponType.Fist) { }

  setType(type: TGWeaponType) {
    this.type = type;
  }

  getTexture() {
    return TGWeapon.textureMap[this.type];
  }

  getAnchor() {
    return TGWeapon.anchorMap[this.type];
  }

  private static get staffTexture() { return HPTextureHelper.get(TGWeapon.textureFile, 'staff.png'); }
  private static get swordTexture() { return HPTextureHelper.get(TGWeapon.textureFile, 'sword.png'); }
  private static get crossbowTexture() { return HPTextureHelper.get(TGWeapon.textureFile, 'crossbow.png'); }
  private static get textureMap(): {[index: number]: Texture} {
    return {
      [TGWeaponType.Staff]: TGWeapon.staffTexture,
      [TGWeaponType.Sword]: TGWeapon.swordTexture,
      [TGWeaponType.Crossbow]: TGWeapon.crossbowTexture,
    };
  }
  private static get anchorMap(): {[index: number]: HPVector} {
    return {
      [TGWeaponType.Staff]: new HPVector(0.333, 0.5),
      [TGWeaponType.Sword]: new HPVector(0.0667, 0.5),
      [TGWeaponType.Crossbow]: new HPVector(0.25, 0.5),
    };
  }
}
