import HPDirection from "./direction";

export default class HPWallContactMap {

  private map: {
    [HPDirection.Up]: boolean,
    [HPDirection.Down]: boolean,
    [HPDirection.Right]: boolean,
    [HPDirection.Left]: boolean,
  } = {
    [HPDirection.Up]: false,
    [HPDirection.Down]: false,
    [HPDirection.Right]: false,
    [HPDirection.Left]: false,
  };

  setContact(direction: HPDirection) {
    this.map[direction] = true;
  }

  all(directions: Array<HPDirection>) {
    return directions.every(direction => this.map[direction]);
  }

  any(directions: Array<HPDirection>) {
    return directions.some(direction => this.map[direction]);
  }

}
