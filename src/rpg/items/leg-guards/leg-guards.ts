import { Texture } from "pixi.js";
import Item from "../item";
import Vector from "../../../engine/core/vector";

export default abstract class LegGuards extends Item {

  get texture() { return Item.getItemTexture('AN ITEM THAT DOES NOT EXIST'); }
  get anchor() { return Vector.zero; }
  get upperLegAnchor() { return new Vector(0.5, 0); }
  get lowerLegAnchor() { return new Vector(0.3125, 0); }

  abstract get upperLegTexture(): Texture;
  abstract get lowerLegTexture(): Texture | undefined;

}
