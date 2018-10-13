import Item from "../item";
import ChestPiece from "./chest-piece";

export default class IronChestPiece extends ChestPiece {

  get texture() { return Item.getItemTexture('iron-chest-piece.png'); }
  get upperArmTexture() { return Item.getItemTexture('iron-chest-piece__upper-arm.png'); }
  get lowerArmTexture() { return undefined; }

}
