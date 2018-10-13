import Item from "../item";
import LegGuards from "./leg-guards";

export default class IronLegGuards extends LegGuards {

  get upperLegTexture() { return Item.getItemTexture('iron-leg-guards__upper-leg.png'); }
  get lowerLegTexture() { return Item.getItemTexture('iron-leg-guards__lower-leg.png'); }

}
