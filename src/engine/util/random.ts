export default class HPRandom {

  static int(arg1: number, arg2: number | undefined): number {
    // handle 1 arg case (0 to arg1)
    if (arg2 === undefined) {
      return Math.floor(Math.random() * (arg1 + 1));
    }

    // handle 2 arg case (arg1 to arg2)
    return Math.floor(Math.random() * (arg2 + 1 - arg1)) + arg1;
  }

  static chance(hitPercent: number): boolean {
    return Math.random() < hitPercent;
  }

}
