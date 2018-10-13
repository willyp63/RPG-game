import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Sprite } from "pixi.js";
import Item from "../items/item";

export type DragCallback = (inventoryItem: InventoryItem) => void;

const SIZE = new Vector(12, 12);
const MARGIN = 2;

export default class InventoryItem extends UIEntity {

  public inventoryIndex = 0;

  private offset: Vector;
  private data: any;
  private dragging = false;
  private onPickUpFunc?: DragCallback;
  private onPutDownFunc?: DragCallback;

  constructor(position: Vector, public item: Item) {
    super(
      new Sprite(item.texture),
      position,
    );

    const scale = this.sprite.width > this.sprite.height
      ? SIZE.x / this.sprite.width
      : SIZE.y / this.sprite.height;
    this.offset = this.sprite.width > this.sprite.height
      ? new Vector(0, (SIZE.y - this.sprite.height * scale) / 2)
      : new Vector((SIZE.x - this.sprite.width * scale) / 2, 0);
    this.offset = this.offset.plus(new Vector(MARGIN, MARGIN));

    this.sprite.width *= scale;
    this.sprite.height *= scale;
    this.sprite.x += this.offset.x;
    this.sprite.y += this.offset.y;

    this.sprite.interactive = true;
    this.sprite
      // events for drag start
      .on('mousedown', this.onDragStart.bind(this))
      .on('touchstart', this.onDragStart.bind(this))
      // events for drag end
      .on('mouseup', this.onDragEnd.bind(this))
      .on('mouseupoutside', this.onDragEnd.bind(this))
      .on('touchend', this.onDragEnd.bind(this))
      .on('touchendoutside', this.onDragEnd.bind(this))
      // events for drag move
      .on('mousemove', this.onDragMove.bind(this))
      .on('touchmove', this.onDragMove.bind(this));
  }

  set position(position: Vector) {
    this._sprite.x = position.x + this.offset.x;
    this._sprite.y = position.y + this.offset.y;
  }

  onPickUp(func: DragCallback) {
    this.onPickUpFunc = func;
  }

  onPutDown(func: DragCallback) {
    this.onPutDownFunc = func;
  }

  private onDragStart(e: any) {
    this.data = e.data;
    this.sprite.alpha = 0.5;
    this.dragging = true;

    if (this.onPickUpFunc) this.onPickUpFunc(this);
  }

  private onDragEnd() {
    this.sprite.alpha = 1;
    this.dragging = false;
    this.data = null;

    if (this.onPutDownFunc) this.onPutDownFunc(this);
  }

  private onDragMove() {
    if (this.dragging) {
      let newPosition = this.data.getLocalPosition(this.sprite.parent);
      newPosition = new Vector(newPosition.x, newPosition.y);
      this.position = newPosition.minus(SIZE.times(0.5));
    }
  }

}