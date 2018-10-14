import UIEntity from "../../engine/pixi/ui-entity";
import { Sprite } from "pixi.js";
import Vector from "../../engine/core/vector";
import Inventory from './inventory';
import Equipment from "./equipment";
import Helm from "../items/helms/helm";
import InventoryItem from "./inventory-item";
import Item from "../items/item";
import { v4 as uuid } from 'uuid';
import ChestPiece from "../items/chest-pieces/chest-piece";
import LegGuards from "../items/leg-guards/leg-guards";
import Weapon from "../items/weapons/weapon";

export default class EquipmenyInventory extends UIEntity {

  static get size() { return new Vector(Inventory.size.x + Equipment.size.x, Inventory.size.y); }

  get helm() { return this.equipment.helm; }
  get chestPiece() { return this.equipment.chestPiece; }
  get legGuards() { return this.equipment.legGuards; }
  get mainHandWeapon() { return this.equipment.mainHandWeapon; }
  get offHandWeapon() { return this.equipment.offHandWeapon; }

  private inventory = new Inventory(new Vector(Equipment.size.x, 0));
  private equipment = new Equipment(new Vector(0, 0), this.inventory);

  constructor(position: Vector) {
    super(
      new Sprite(),
      position,
    );

    this.sprite.addChild(this.inventory.sprite);
    this.sprite.addChild(this.equipment.sprite);
  }

  addItemToInventory(item: Item) {
    this.inventory.addItem(this.createAndAddInventoryItem(item));
  }

  setHelm(helm: Helm | undefined) {
    this.equipment.setHelm(helm ? this.createAndAddInventoryItem(helm) : undefined, false);
  }

  setChestPiece(chestPiece: ChestPiece | undefined) {
    this.equipment.setChestPiece(chestPiece ? this.createAndAddInventoryItem(chestPiece) : undefined, false);
  }

  setLegGuards(legGuards: LegGuards | undefined) {
    this.equipment.setLegGuards(legGuards ? this.createAndAddInventoryItem(legGuards) : undefined, false);
  }

  setMainHandWeapon(mainHandWeapon: Weapon | undefined) {
    this.equipment.setMainHandWeapon(mainHandWeapon ? this.createAndAddInventoryItem(mainHandWeapon) : undefined, false);
  }

  setOffHandWeapon(offHandWeapon: Weapon | undefined) {
    this.equipment.setOffHandWeapon(offHandWeapon ? this.createAndAddInventoryItem(offHandWeapon) : undefined, false);
  }

  onHelmChange(callback: Function) { this.equipment.onHelmChange = callback; }
  onChestPieceChange(callback: Function) { this.equipment.onChestPieceChange = callback; }
  onLegGuardsChange(callback: Function) { this.equipment.onLegGuardsChange = callback; }
  onMainHandWeaponChange(callback: Function) { this.equipment.onMainHandWeaponChange = callback; }
  onOffHandWeaponChange(callback: Function) { this.equipment.onOffHandWeaponChange = callback; }

  private createAndAddInventoryItem(item: Item) {
    const inventoryItem = new InventoryItem(Vector.zero, item, uuid());
    inventoryItem.onPickUp(this.onItemPickUp.bind(this));
    inventoryItem.onPutDown(this.onItemPutDown.bind(this));
    this.sprite.addChild(inventoryItem.sprite);
    return inventoryItem;
  }

  private onItemPickUp(inventoryItem: InventoryItem) {
    this.inventory.removeItemWithId(inventoryItem.id);
    this.equipment.removeItemWithId(inventoryItem.id);
  }

  private onItemPutDown(inventoryItem: InventoryItem) {
    const dropPosition = inventoryItem.position.plus(InventoryItem.size.times(0.5));
    const didLandInEquipmentSlot = this.equipment.onItemDrop(inventoryItem, dropPosition);

    if (!didLandInEquipmentSlot) this.inventory.addItem(inventoryItem);
  }
}
