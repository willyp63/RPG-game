import Item from "../item";
import LegGuards from "./leg-guards";

export default class WizardLegGuards extends LegGuards {

  get upperLegTexture() { return Item.getItemTexture('wizard-leg-guards__upper-leg.png'); }
  get lowerLegTexture() { return Item.getItemTexture('wizard-leg-guards__lower-leg.png'); }

}
