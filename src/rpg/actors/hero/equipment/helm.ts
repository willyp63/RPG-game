import { Sprite, loader, ObservablePoint } from "pixi.js";

const TEXTURES_FILE = 'public/imgs/viking-helm.png';

export default class Helm {

  static assets = [TEXTURES_FILE];

  public sprite: Sprite;

  constructor() {
    this.sprite = new Sprite(loader.resources[TEXTURES_FILE].texture);
    this.sprite.anchor = <ObservablePoint>{ x: 0.5, y: 0.5 };
  }

}
