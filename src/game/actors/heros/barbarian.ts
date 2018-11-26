import TGHero from "./hero";
import HPVector from "../../../engine/physics/vector";

export default class TGBarbarian extends TGHero {

  static get imageFile() { return 'public/imgs/barbarian.png'; }

  get size() { return new HPVector(33, 100); }
  get imageFile() { return TGBarbarian.imageFile; }

}
