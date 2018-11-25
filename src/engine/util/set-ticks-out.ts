import { ticker } from "pixi.js";

export default (callback: Function, numTicks: number): Function => {
  let ticks = 0;
  const onTick = () => {
    ticks++;
    if (ticks >= numTicks) {
      ticker.shared.remove(onTick);
      callback();
    }
  };
  ticker.shared.add(onTick);

  return onTick;
};

export const clearTicksOut = (onTick: Function) => {
  ticker.shared.remove(onTick);
};
