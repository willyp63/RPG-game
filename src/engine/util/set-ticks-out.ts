import { ticker } from "pixi.js";

export const setTicksOut = (callback: () => void, numTicks: number): () => void => {
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

export const clearTicksOut = (onTick: () => void) => {
  ticker.shared.remove(onTick);
};

export const setTicksInterval = (callback: () => void, numTicks: number): () => void => {
  let ticks = 0;
  const onTick = () => {
    ticks++;
    if (ticks >= numTicks) {
      ticks = 0;
      callback();
    }
  };
  ticker.shared.add(onTick);

  return onTick;
};

export const clearTicksInterval = clearTicksOut;
