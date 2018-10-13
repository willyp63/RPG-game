import Item from "../item";
import Helm from "./helm";

export default class VikingHelm extends Helm {

  get texture() { return Item.getItemTexture('viking-helm.png'); }
  
}
