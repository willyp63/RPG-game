import Item from "../item";
import LegGuards from "./leg-guards";

export default class IronLegGuards extends LegGuards {

  get texture() { return Item.getItemTexture('iron-leg-guards.png'); }
  get upperLegTexture() { return Item.getItemTexture('iron-leg-guards__upper-leg.png'); }
  get lowerLegTexture() { return Item.getItemTexture('iron-leg-guards__lower-leg.png'); }

}
