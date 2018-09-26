import { Container, Sprite, Graphics } from "pixi.js";
import UIElement from "../../engine/pixi/ui-element";
import Vector from "../../engine/core/vector";

export default class PowerBar extends UIElement {

  static assets = ["public/imgs/power-bar.png"];
  
  constructor(position: Vector, color: number) {
    super(
      () => {
        const sprite = new Container();

        const imageOverlay = new Sprite(PIXI.loader.resources["public/imgs/power-bar.png"].texture);
        const remainingBar = new Graphics();
        remainingBar.beginFill(color);
        remainingBar.drawRect(0, 0, imageOverlay.width, imageOverlay.height);
        remainingBar.endFill();

        sprite.addChild(remainingBar);
        sprite.addChild(imageOverlay);
  
        return sprite;
      },
      position,
    );
  }
}
