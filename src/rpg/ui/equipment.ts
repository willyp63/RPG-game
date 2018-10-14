import UIEntity from "../../engine/pixi/ui-entity";
import Vector from "../../engine/core/vector";
import { Graphics } from "pixi.js";
import ItemSlot from "./item-slot";
import InventoryItem from "./inventory-item";
import Helm from "../items/helms/helm";
import ChestPiece from "../items/chest-pieces/chest-piece";
import LegGuards from "../items/leg-guards/leg-guards";
import Weapon from "../items/weapons/weapon";
import Inventory from "./inventory";

const BORDER = 2;
const MARGIN = 8;
const SIZE = new Vector(80, 80);

const HELM_POSITION = new Vector(ItemSlot.size.x * 2, ItemSlot.size.y);
const CHEST_PIECE_POSITION = new Vector(ItemSlot.size.x * 2, ItemSlot.size.y * 2);
const LEG_GUARDS_POSITION = new Vector(ItemSlot.size.x * 2, ItemSlot.size.y * 3);
const MAIN_HAND_WEAPON_POSITION = new Vector(ItemSlot.size.x * 1, ItemSlot.size.y * 2);
const OFF_HAND_WEAPON_POSITION = new Vector(ItemSlot.size.x * 3, ItemSlot.size.y * 2);

export default class Equipment extends UIEntity {

  static get size() { return SIZE; }

  get helm() { return this._helm ? <Helm>this._helm.item : undefined; }
  get chestPiece() { return this._chestPiece ? <ChestPiece>this._chestPiece.item : undefined; }
  get legGuards() { return this._legGuards ? <LegGuards>this._legGuards.item : undefined; }
  get mainHandWeapon() { return this._mainHandWeapon ? <Weapon>this._mainHandWeapon.item : undefined; }
  get offHandWeapon() { return this._offHandWeapon ? <Weapon>this._offHandWeapon.item : undefined; }

  private _helm?: InventoryItem;
  private _chestPiece?: InventoryItem;
  private _legGuards?: InventoryItem;
  private _mainHandWeapon?: InventoryItem;
  private _offHandWeapon?: InventoryItem;

  public onHelmChange?: Function;
  public onChestPieceChange?: Function;
  public onLegGuardsChange?: Function;
  public onMainHandWeaponChange?: Function;
  public onOffHandWeaponChange?: Function;

  private headSlot = new ItemSlot(HELM_POSITION);
  private chestPieceSlot = new ItemSlot(CHEST_PIECE_POSITION);
  private legGuardsSlot = new ItemSlot(LEG_GUARDS_POSITION);
  private mainHandWeaponSlot = new ItemSlot(MAIN_HAND_WEAPON_POSITION);
  private offHandWeaponSlot = new ItemSlot(OFF_HAND_WEAPON_POSITION);

  constructor(
    position: Vector,
    private inventory: Inventory,
  ) {
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

    this.sprite.addChild(this.headSlot.sprite);
    this.sprite.addChild(this.chestPieceSlot.sprite);
    this.sprite.addChild(this.legGuardsSlot.sprite);
    this.sprite.addChild(this.mainHandWeaponSlot.sprite);
    this.sprite.addChild(this.offHandWeaponSlot.sprite);
  }

  setHelm(helm: InventoryItem | undefined, addOldItemToInventory = true) {
    if (this._helm !== undefined && addOldItemToInventory) this.inventory.addItem(this._helm);
    this._helm = helm;
    if (this._helm) this._helm.position = HELM_POSITION.plus(this.position);
    if (this.onHelmChange) this.onHelmChange();
  }

  setChestPiece(chestPiece: InventoryItem | undefined, addOldItemToInventory = true) {
    if (this._chestPiece !== undefined && addOldItemToInventory) this.inventory.addItem(this._chestPiece);
    this._chestPiece = chestPiece;
    if (this._chestPiece) this._chestPiece.position = CHEST_PIECE_POSITION.plus(this.position);
    if (this.onChestPieceChange) this.onChestPieceChange();
  }

  setLegGuards(legGuards: InventoryItem | undefined, addOldItemToInventory = true) {
    if (this._legGuards !== undefined && addOldItemToInventory) this.inventory.addItem(this._legGuards);
    this._legGuards = legGuards;
    if (this._legGuards) this._legGuards.position = LEG_GUARDS_POSITION.plus(this.position);
    if (this.onLegGuardsChange) this.onLegGuardsChange();
  }

  setMainHandWeapon(mainHandWeapon: InventoryItem | undefined, addOldItemToInventory = true) {
    if (this._mainHandWeapon !== undefined && addOldItemToInventory) this.inventory.addItem(this._mainHandWeapon);
    this._mainHandWeapon = mainHandWeapon;
    if (this._mainHandWeapon) this._mainHandWeapon.position = MAIN_HAND_WEAPON_POSITION.plus(this.position);
    if (this.onMainHandWeaponChange) this.onMainHandWeaponChange();
  }

  setOffHandWeapon(offHandWeapon: InventoryItem | undefined, addOldItemToInventory = true) {
    if (this._offHandWeapon !== undefined && addOldItemToInventory) this.inventory.addItem(this._offHandWeapon);
    this._offHandWeapon = offHandWeapon;
    if (this._offHandWeapon) this._offHandWeapon.position = OFF_HAND_WEAPON_POSITION.plus(this.position);
    if (this.onOffHandWeaponChange) this.onOffHandWeaponChange();
  }

  removeItemWithId(id: string) {
    if (this._helm && this._helm.id === id) this.setHelm(undefined, false);
    if (this._chestPiece && this._chestPiece.id === id) this.setChestPiece(undefined, false);
    if (this._legGuards && this._legGuards.id === id) this.setLegGuards(undefined, false);
    if (this._mainHandWeapon && this._mainHandWeapon.id === id) this.setMainHandWeapon(undefined, false);
    if (this._offHandWeapon && this._offHandWeapon.id === id) this.setOffHandWeapon(undefined, false);
  }

  onItemDrop(inventoryItem: InventoryItem, dropPosition: Vector): boolean {
    if (inventoryItem.item instanceof Helm && this.headSlot.containsPoint(dropPosition)) {
      this.setHelm(inventoryItem);
    } else if (inventoryItem.item instanceof ChestPiece && this.chestPieceSlot.containsPoint(dropPosition)) {
      this.setChestPiece(inventoryItem);
    } else if (inventoryItem.item instanceof LegGuards && this.legGuardsSlot.containsPoint(dropPosition)) {
      this.setLegGuards(inventoryItem);
    } else if (inventoryItem.item instanceof Weapon && this.mainHandWeaponSlot.containsPoint(dropPosition)) {
      this.setMainHandWeapon(inventoryItem);
    } else if (inventoryItem.item instanceof Weapon && this.offHandWeaponSlot.containsPoint(dropPosition)) {
      this.setOffHandWeapon(inventoryItem);
    } else {
      return false;
    }
    return true;
  }

}
