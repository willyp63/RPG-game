import { loader } from "pixi.js";

export default class TextureHelper {

  static get(sheetName: string, spriteName: string) {
    const sheet = loader.resources[sheetName].textures;
    if (!sheet) throw `Error fetching sprite: ${sheetName} -> ${spriteName}`;
    return sheet[spriteName];
  }
}
