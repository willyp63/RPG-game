import Item from "../item";
import Helm from "./helm";

export default class WizardHood extends Helm {

  get texture() { return Item.getItemTexture('wizard-hood.png'); }
  
}
