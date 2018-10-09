import { loader } from "pixi.js";

export default class TextureHelper {

  static get(sheetName: string, spriteName: string) {
    const sheet = loader.resources[sheetName];
    if (!sheet || !sheet.textures) throw `Error fetching sprite: ${sheetName} -> ${spriteName}`;
    return sheet.textures[spriteName];
  }
}
