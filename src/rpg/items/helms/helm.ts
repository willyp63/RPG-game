import Item from "../item";
import Vector from "../../../engine/core/vector";

export default abstract class Helm extends Item {

  get anchor() { return new Vector(0.5, 0.5); }

}
