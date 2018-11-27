import { loader } from "pixi.js";

export default class HPTextureHelper {

  static get(sheetName: string, spriteName: string) {
    const sheet = loader.resources[sheetName];
    if (!sheet || !sheet.textures) throw `Error fetching texture: ${sheetName} -> ${spriteName}`;
    return sheet.textures[spriteName];
  }
}
