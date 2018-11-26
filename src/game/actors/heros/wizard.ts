import TGHero from "./hero";
import HPVector from "../../../engine/physics/vector";

export default class TGWizard extends TGHero {

  static get imageFile() { return 'public/imgs/wizard.png'; }

  get size() { return new HPVector(28, 80); }
  get imageFile() { return TGWizard.imageFile; }

}
