import { v2d } from "../v2d";

export class Line {
  public origin?: () => v2d;
  public destination?: () => v2d;
  public sliderValues = [80, 80, 0, 100];

  constructor(origin?: () => v2d, destination?: () => v2d) {
    this.origin = origin;
    this.destination = destination;
  }

  public get animatedSvgPath(): string {
    if (this.origin && this.destination) {
      let destination = this.destination();
      let origin = this.origin();

      let p1 = {
        x: proportion(destination.x, origin.x, this.sliderValues[0] / 100),
        y: proportion(destination.y, origin.y, this.sliderValues[1] / 100),
      };

      let p2 = {
        x: proportion(destination.x, origin.x, this.sliderValues[2] / 100),
        y: proportion(destination.y, origin.y, this.sliderValues[3] / 100),
      };

      return `M ${ origin.x } ${ origin.y } C ${ p1.x } ${ p1.y } ${ p2.x } ${ p2.y } ${ destination.x } ${ destination.y }`;
    } else
      return '';
  }
}

function proportion(min: number, max: number, percent: number): number {
  return min * (1.0 - percent) + (max * percent);
}
