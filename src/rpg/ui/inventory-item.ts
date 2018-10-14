import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Sprite, RenderTexture } from "pixi.js";
import Item from "../items/item";

export type DragCallback = (inventoryItem: InventoryItem) => void;

const SIZE = new Vector(16, 16);
const PADDING = new Vector(3, 3);
const INNER_SIZE = SIZE.minus(PADDING.times(2));

export default class InventoryItem extends UIEntity {

  static get size() { return SIZE; }

  get id() { return this._id; }

  private data: any;
  private dragging = false;
  private onPickUpFunc?: DragCallback;
  private onPutDownFunc?: DragCallback;

  constructor(position: Vector, public item: Item, private _id: string) {
    super(
      () => {
        const container = new Sprite(RenderTexture.create(SIZE.x, SIZE.y));
        const sprite = new Sprite(item.texture);

        const scale = sprite.width > sprite.height
          ? INNER_SIZE.x / sprite.width
          : INNER_SIZE.y / sprite.height;

        let position = sprite.width > sprite.height
          ? new Vector(0, (INNER_SIZE.y - sprite.height * scale) / 2)
          : new Vector((INNER_SIZE.x - sprite.width * scale) / 2, 0);
        position = position.plus(PADDING);

        sprite.width *= scale;
        sprite.height *= scale;
        sprite.x += position.x;
        sprite.y += position.y;

        container.addChild(sprite);

        return container;
      },
      position,
    );

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

  onPickUp(func: DragCallback) {
    this.onPickUpFunc = func;
  }

  onPutDown(func: DragCallback) {
    this.onPutDownFunc = func;
  }

  private onDragStart(e: any) {
    this.data = e.data;
    this.sprite.alpha = 0.75;
    this.dragging = true;

    if (this.onPickUpFunc) this.onPickUpFunc(this);
  }

  private onDragEnd() {
    if (this.dragging && this.onPutDownFunc) {
      this.onPutDownFunc(this);
    }

    this.sprite.alpha = 1;
    this.dragging = false;
    this.data = null;
  }

  private onDragMove() {
    if (this.dragging) {
      let newPosition = this.data.getLocalPosition(this.sprite.parent);
      newPosition = new Vector(newPosition.x, newPosition.y);
      this.position = newPosition.minus(SIZE.times(0.5));
    }
  }

}