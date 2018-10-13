import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics } from "pixi.js";
import ItemSlot from "./item-slot";
import Item from "../items/item";
import InventoryItem from "./inventory-item";
import Equipment from "./equipment";
import Helm from "../items/helms/helm";
import ChestPiece from "../items/chest-pieces/chest-piece";
import LegGuards from "../items/leg-guards/leg-guards";
import Weapon from "../items/weapons/weapon";

const BORDER = 2;
const MARGIN = 8;
const SIZE = new Vector(128, 128);

const HELM_POSITION = new Vector(ItemSlot.size.x * 2 - Equipment.size.x, ItemSlot.size.y);
const CHEST_PIECE_POSITION = new Vector(ItemSlot.size.x * 2 - Equipment.size.x, ItemSlot.size.y * 2);
const LEG_GUARDS_POSITION = new Vector(ItemSlot.size.x * 2 - Equipment.size.x, ItemSlot.size.y * 3);
const MAIN_HAND_WEAPON_POSITON = new Vector(ItemSlot.size.x - Equipment.size.x, ItemSlot.size.y * 2);
const OFF_HAND_WEAPON_POSITON = new Vector(ItemSlot.size.x * 3 - Equipment.size.x, ItemSlot.size.y * 2);

export default class Inventory extends UIEntity {

  static get size() { return SIZE; }

  public equipment = new Equipment(new Vector(-Equipment.size.x, 0));

  get helm() { return this._helm ? <Helm>this._helm.item : undefined; }
  get chestPiece() { return this._chestPiece ? <ChestPiece>this._chestPiece.item : undefined; }
  get legGuards() { return this._legGuards ? <LegGuards>this._legGuards.item : undefined; }
  get mainHandWeapon() { return this._mainHandWeapon ? <Weapon>this._mainHandWeapon.item : undefined; }
  get offHandWeapon() { return this._offHandWeapon ? <Weapon>this._offHandWeapon.item : undefined; }

  private items: Array<InventoryItem> = [];
  private _helm?: InventoryItem;
  private _onHelmChange?: Function;
  private _chestPiece?: InventoryItem;
  private _onChestPieceChange?: Function;
  private _legGuards?: InventoryItem;
  private _onLegGuardsChange?: Function;
  private _mainHandWeapon?: InventoryItem;
  private _onMainHandWeaponChange?: Function;
  private _offHandWeapon?: InventoryItem;
  private _onOffHandWeaponChange?: Function;
  
  constructor(position: Vector) {
    super(
      () => {
        const box = new Graphics();

        box.beginFill(0xFFFFFF);
        box.lineStyle(BORDER, 0x000000);
        box.drawRect(MARGIN, MARGIN, SIZE.x - MARGIN * 2, SIZE.y - MARGIN * 2);
        box.endFill();

        return box;
      },
      position,
    );

    this.sprite.addChild(this.equipment.sprite);

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const itemSlot = new ItemSlot(new Vector((i + 1) * ItemSlot.size.x, (j + 1) * ItemSlot.size.y));
        this.sprite.addChild(itemSlot.sprite);
      }
    }
  }

  addItem(item: Item) {
    const inventoryItem = new InventoryItem(Vector.zero, item);
    this.items.push(inventoryItem);
    this.sprite.addChild(inventoryItem.sprite);

    this.layoutItems();
  }

  removeItemAt(index: number) {
    const removedItem = this.items.splice(index, 1)[0];
    this.sprite.removeChild(removedItem.sprite);

    this.layoutItems();
  }

  set helm(helm: Helm | undefined) {
    if (this._helm) this.sprite.removeChild(this._helm.sprite);

    if (helm) {
      this._helm = new InventoryItem(HELM_POSITION, helm);
      this.sprite.addChild(this._helm.sprite);

      this._helm.onPickUp(this.onItemPickUp.bind(this));
      this._helm.onPutDown(this.onItemPutDown.bind(this));
    } else {
      this._helm = undefined;
    }

    if (this._onHelmChange) this._onHelmChange();
  }

  onHelmChange(callback: Function) {
    this._onHelmChange = callback;
  }

  set chestPiece(chestPiece: ChestPiece | undefined) {
    if (this._chestPiece) this.sprite.removeChild(this._chestPiece.sprite);

    if (chestPiece) {
      this._chestPiece = new InventoryItem(CHEST_PIECE_POSITION, chestPiece);
      this.sprite.addChild(this._chestPiece.sprite);

      this._chestPiece.onPickUp(this.onItemPickUp.bind(this));
      this._chestPiece.onPutDown(this.onItemPutDown.bind(this));
    } else {
      this._chestPiece = undefined;
    }

    if (this._onChestPieceChange) this._onChestPieceChange();
  }

  onChestPieceChange(callback: Function) {
    this._onChestPieceChange = callback;
  }

  set legGuards(legGuards: LegGuards | undefined) {
    if (this._legGuards) this.sprite.removeChild(this._legGuards.sprite);

    if (legGuards) {
      this._legGuards = new InventoryItem(LEG_GUARDS_POSITION, legGuards);
      this.sprite.addChild(this._legGuards.sprite);

      this._legGuards.onPickUp(this.onItemPickUp.bind(this));
      this._legGuards.onPutDown(this.onItemPutDown.bind(this));
    } else {
      this._legGuards = undefined;
    }

    if (this._onLegGuardsChange) this._onLegGuardsChange();
  }

  onLegGuardsChange(callback: Function) {
    this._onLegGuardsChange = callback;
  }

  set mainHandWeapon(mainHandWeapon: Weapon | undefined) {
    if (this._mainHandWeapon) this.sprite.removeChild(this._mainHandWeapon.sprite);

    if (mainHandWeapon) {
      this._mainHandWeapon = new InventoryItem(MAIN_HAND_WEAPON_POSITON, mainHandWeapon);
      this.sprite.addChild(this._mainHandWeapon.sprite);

      this._mainHandWeapon.onPickUp(this.onItemPickUp.bind(this));
      this._mainHandWeapon.onPutDown(this.onItemPutDown.bind(this));
    } else {
      this._mainHandWeapon = undefined;
    }

    if (this._onMainHandWeaponChange) this._onMainHandWeaponChange();
  }

  onMainHandWeaponChange(callback: Function) {
    this._onMainHandWeaponChange = callback;
  }

  set offHandWeapon(offHandWeapon: Weapon | undefined) {
    if (this._offHandWeapon) this.sprite.removeChild(this._offHandWeapon.sprite);

    if (offHandWeapon) {
      this._offHandWeapon = new InventoryItem(OFF_HAND_WEAPON_POSITON, offHandWeapon);
      this.sprite.addChild(this._offHandWeapon.sprite);

      this._offHandWeapon.onPickUp(this.onItemPickUp.bind(this));
      this._offHandWeapon.onPutDown(this.onItemPutDown.bind(this));
    } else {
      this._offHandWeapon = undefined;
    }

    if (this._onOffHandWeaponChange) this._onOffHandWeaponChange();
  }

  onOffHandWeaponChange(callback: Function) {
    this._onOffHandWeaponChange = callback;
  }

  private layoutItems() {
    let i = 0, j = 0, k = 0;
    this.items.forEach(item => {
      item.onPickUp(this.onItemPickUp.bind(this));
      item.onPutDown(this.onItemPutDown.bind(this));

      item.position = new Vector((i + 1) * ItemSlot.size.x, (j + 1) * ItemSlot.size.y);
      item.inventoryIndex = k;
      i++; k++;
      if (i >= 6) {
        i = 0;
        j++;
      }
    });
  }

  private onItemPickUp(inventoryItem: InventoryItem) {

  }

  private onItemPutDown(inventoryItem: InventoryItem) {
    if (inventoryItem === this._helm) {
      this.helm = undefined;
    } else if (inventoryItem === this._chestPiece) {
      this.chestPiece = undefined;
    } else if (inventoryItem === this._legGuards) {
      this.legGuards = undefined;
    } else if (inventoryItem === this._mainHandWeapon) {
      this.mainHandWeapon = undefined;
    } else if (inventoryItem === this._offHandWeapon) {
      this.offHandWeapon = undefined;
    } else {
      this.removeItemAt(inventoryItem.inventoryIndex);
    }

    if (this.isItemDroppedInSlot(inventoryItem, HELM_POSITION)) {
      const item = inventoryItem.item;
      if (item instanceof Helm) {
        if (this._helm) this.addItem(this._helm.item);
        this.helm = item;
        return;
      }
    } else if (this.isItemDroppedInSlot(inventoryItem, CHEST_PIECE_POSITION)) {
      const item = inventoryItem.item;
      if (item instanceof ChestPiece) {
        if (this._chestPiece) this.addItem(this._chestPiece.item);
        this.chestPiece = item;
        return;
      }
    } else if (this.isItemDroppedInSlot(inventoryItem, LEG_GUARDS_POSITION)) {
      const item = inventoryItem.item;
      if (item instanceof LegGuards) {
        if (this._legGuards) this.addItem(this._legGuards.item);
        this.legGuards = item;
        return;
      }
    } else if (this.isItemDroppedInSlot(inventoryItem, MAIN_HAND_WEAPON_POSITON)) {
      const item = inventoryItem.item;
      if (item instanceof Weapon) {
        if (this._mainHandWeapon) this.addItem(this._mainHandWeapon.item);
        this.mainHandWeapon = item;
        return;
      }
    } else if (this.isItemDroppedInSlot(inventoryItem, OFF_HAND_WEAPON_POSITON)) {
      const item = inventoryItem.item;
      if (item instanceof Weapon) {
        if (this._offHandWeapon) this.addItem(this._offHandWeapon.item);
        this.offHandWeapon = item;
        return;
      }
    }

    this.addItem(inventoryItem.item);
  }

  private isItemDroppedInSlot(inventoryItem: InventoryItem, slotPosition: Vector) {
    const dropPosition =  new Vector(inventoryItem.sprite.x, inventoryItem.sprite.y);
    const positionDiff = dropPosition.minus(slotPosition);
    return positionDiff.x > 0 && positionDiff.x < ItemSlot.size.x && positionDiff.y > 0 && positionDiff.y < ItemSlot.size.y;
  }

}
