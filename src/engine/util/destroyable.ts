import HPDestroyable from "./destroyer";

export default class HPDestroyer {

  private destroyables: Array<HPDestroyable> = [];

  add(destroyable: HPDestroyable) {
    this.destroyables.push(destroyable);
  }

  destroy() {
    this.destroyables.forEach(destroyable => destroyable.destroy());
  }
}
