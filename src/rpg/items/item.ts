import { Texture } from "pixi.js";
import TextureHelper from "../../engine/pixi/texture-helper";
import Vector from "../../engine/core/vector";

const TEXTURES_FILE = 'public/imgs/items.json';

export default abstract class Item {

  static get assets() { return [TEXTURES_FILE]; }

  static getItemTexture(textureName: string) { return TextureHelper.get(TEXTURES_FILE, textureName); }

  abstract get texture(): Texture;
  abstract get anchor(): Vector;

}
