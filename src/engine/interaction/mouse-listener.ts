import HPVector from "../physics/vector";
import { Container, interaction } from "pixi.js";

class _HPMouseTracker {

  get position() { return this._position; }

  setContainer(container: Container) {
    container.interactive = true;
    container.on('pointermove', this.onMouseMove.bind(this));
    this.container = container;
  }

  private container = new Container();
  private _position = HPVector.Zero;

  private onMouseMove(event: interaction.InteractionEvent) {
    const point = event.data.getLocalPosition(this.container);
    this._position = new HPVector(point.x, point.y);
  }

}
export const HPMouseTracker = new _HPMouseTracker();
