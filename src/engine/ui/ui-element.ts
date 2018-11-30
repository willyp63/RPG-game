import HPVector from "../physics/vector";
import { Container } from "pixi.js";
import HPDestroyable from "../util/destroyer";

export enum HPUIElementAlignment {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}

export enum HPUIElementLayoutDirection {
  Horz,
  Vert,
}

export enum HPUIElementPosition {
  Static,
  Absolute,
}

const DEFAULTS = {
  position: HPUIElementPosition.Static,
  alignment: HPUIElementAlignment.TopLeft,
  layoutDirection: HPUIElementLayoutDirection.Horz,
  margin: HPVector.Zero,
  children: [],
};

export default class HPUIElement implements HPDestroyable {

  get size() { return this._size.plus(this.margin.times(2)); }

  position: HPUIElementPosition;
  alignment: HPUIElementAlignment;
  layoutDirection: HPUIElementLayoutDirection;
  margin: HPVector;
  children: Array<HPUIElement>;
  sprite: Container;

  constructor(
    _options: {
      position?: HPUIElementPosition,
      alignment?: HPUIElementAlignment,
      layoutDirection?: HPUIElementLayoutDirection,
      margin?: HPVector,
      children?: Array<HPUIElement>,
      sprite?: Container,
    },
  ) {
    const options = Object.assign({}, DEFAULTS, _options); 
    this.position = options.position;
    this.alignment = options.alignment;
    this.layoutDirection = options.layoutDirection;
    this.margin = options.margin;
    this.children = options.children;
    this.sprite = options.sprite || new Container();
  }

  /** @override */
  paint() { }
  destroy() { }

  init(position: HPVector, parentSize: HPVector) {
    this.addChildren();
    this.positionSelf(position, parentSize);
    this.paint();
  }

  private _size = HPVector.Zero;

  private addChildren() {
    if (!this.children.length) return;

    let childOffset = this.margin;
    this.children.forEach(child => {

      child.alignment = this.alignment;
      child.init(childOffset, this._size);
      this.sprite.addChild(child.sprite);

      if (this.layoutDirection === HPUIElementLayoutDirection.Horz) {
        this._size = this._size.newX(this._size.x + child.size.x);
        this._size = this._size.newY(Math.max(this._size.y, child.size.y));
        childOffset = childOffset.newX(childOffset.x + child.size.x);
      } else {
        this._size = this._size.newX(Math.max(this._size.x, child.size.x));
        this._size = this._size.newY(this._size.y + child.size.y);
        childOffset = childOffset.newY(childOffset.y + child.size.y);
      }
    });
  }

  private positionSelf(position: HPVector, parentSize: HPVector) {
    let spritePosition = position.plus(this.getAlignmentOffset(parentSize));
    this.sprite.x = spritePosition.x;
    this.sprite.y = spritePosition.y;
  }

  private getAlignmentOffset(parentSize: HPVector) {
    if (this.position !== HPUIElementPosition.Absolute) return HPVector.Zero;

    if (this.alignment === HPUIElementAlignment.TopRight) {
      return new HPVector(parentSize.x - this.size.x, 0);
    } else if (this.alignment === HPUIElementAlignment.BottomLeft) {
      return new HPVector(0, parentSize.y - this.size.y);
    } else if (this.alignment === HPUIElementAlignment.BottomRight) {
      return new HPVector(parentSize.x - this.size.x, parentSize.y - this.size.y);
    }
    return HPVector.Zero;
  }
  
}
