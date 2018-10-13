import { Texture } from "pixi.js";
import Item from "../item";
import Vector from "../../../engine/core/vector";

export default abstract class ChestPiece extends Item {

  get anchor() { return new Vector(0.5, 0.5); }
  get upperArmAnchor() { return new Vector(0, 0.5); }
  get lowerArmAnchor() { return new Vector(0, 0.5); }

  abstract get upperArmTexture(): Texture | undefined;
  abstract get lowerArmTexture(): Texture | undefined;

}
