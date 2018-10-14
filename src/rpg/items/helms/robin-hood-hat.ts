import Item from "../item";
import Helm from "./helm";

export default class RobinHoodHat extends Helm {

  get texture() { return Item.getItemTexture('robin-hood-hat.png'); }
  
}
