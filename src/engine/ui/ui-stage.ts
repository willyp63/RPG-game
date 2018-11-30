import { Container } from "pixi.js";
import HPUIElement, { HPUIElementAlignment } from "./ui-element";
import HPVector from "../physics/vector";

export default class HPUIStage {

  constructor(
    private rootContainer: Container,
    private size: HPVector,
    private elements: Array<HPUIElement>,
  ) {
    ([HPUIElementAlignment.TopLeft, HPUIElementAlignment.TopRight])
    elements.forEach(element => this.addElement(element));
  }

  addElement(element: HPUIElement) {
    this.elements.push(element);
    element.init(HPVector.Zero, this.size);
    this.rootContainer.addChild(element.sprite);
  }

  removeElementAt(i: number) {
    this.rootContainer.removeChild(this.elements[i].sprite);
    this.elements[i].destroy();
    this.elements.splice(i, 1);
  }

  clearElements() {
    while (this.elements[0]) this.removeElementAt(0);
  }

}
