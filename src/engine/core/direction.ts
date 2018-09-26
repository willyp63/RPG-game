enum Direction {
  Up,
  Right,
  Down,
  Left,
};

export default Direction;

export const oppositeDirection = (direction?: Direction): Direction => {
  if (direction === Direction.Up) {
    return Direction.Down;
  } else if (direction === Direction.Right) {
    return Direction.Left;
  } else if (direction === Direction.Down) {
    return Direction.Up;
  } else {
    return Direction.Right;
  }
};
