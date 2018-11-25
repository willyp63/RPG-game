import { settings } from "pixi.js";

export default class HPSettings {

  apply() {
    // Disable interpolation when scaling, will make texture be pixelated
    settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  }

}
