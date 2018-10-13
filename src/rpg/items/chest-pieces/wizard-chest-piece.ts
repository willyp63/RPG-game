import Item from "../item";
import ChestPiece from "./chest-piece";

export default class WizardChestPiece extends ChestPiece {

  get texture() { return Item.getItemTexture('wizard-chest-piece.png'); }
  get upperArmTexture() { return Item.getItemTexture('wizard-chest-piece__upper-arm.png'); }
  get lowerArmTexture() { return undefined; }

}
