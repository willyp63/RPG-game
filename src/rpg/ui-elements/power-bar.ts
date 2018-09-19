import { UIElement } from "../../engine/stage";
import { Container, Sprite, Graphics } from "pixi.js";
import { Vector } from "../../engine/physics";

export default class PowerBar extends UIElement {

  static assets = ["imgs/power-bar.png"];
  
  constructor(position: Vector, color: number) {
    super(
      () => {
        const sprite = new Container();

        const imageOverlay = new Sprite(PIXI.loader.resources["imgs/power-bar.png"].texture);
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
