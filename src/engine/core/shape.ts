import Entity from "./entity";

enum Shape {
  Rect,
  InclineRamp,
  DeclineRamp,
};

export default Shape;

export const isRamp = (entity: Entity) => {
  return [Shape.InclineRamp, Shape.DeclineRamp].includes(entity.shape);
}

export const getRampSlope = (ramp: Entity) => {
  let rampSlope = ramp.size.y / ramp.size.x;
  if (ramp.shape === Shape.InclineRamp) rampSlope *= -1;
  return rampSlope;
}
