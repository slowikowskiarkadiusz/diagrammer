import { v2d } from "../v2d";
import { Figure } from "./figure";

export interface LineSetup {
  from: Figure;
  to: Figure;
  fromOrigin?: LineOrigin;
  toOrigin?: LineOrigin;
  color?: string;
  width?: number;
}

export type LineOrigin = 'top' | 'bottom' | 'left' | 'right';

export class Line {
  public static readonly sliderValues = [80, 80, 0, 100];

  public svgPath!: string;
  public color: string = 'white';
  public width: number = 2;

  constructor(svgPath: string) {
    this.svgPath = svgPath;
  }

  public static fromSetup(setup: LineSetup): Line {
    let fromLinesOrigins = setup.from.animatedLinesOrigins;
    let toLinesOrigins = setup.to.animatedLinesOrigins;

    let minDistance = { distance: Infinity, fromIndex: 0, toIndex: 0 };

    let fromOrigin = setup.from.getAnimatedLineOrigin(setup.fromOrigin);
    let toOrigin = setup.to.getAnimatedLineOrigin(setup.toOrigin);

    for (let i = 0; i < (!!fromOrigin ? 1 : fromLinesOrigins.length); i++) {
      const from = setup.from.getAnimatedLineOrigin(setup.fromOrigin) ?? fromLinesOrigins[i];
      for (let ii = 0; ii < (!!toOrigin ? 1 : toLinesOrigins.length); ii++) {
        const to = setup.to.getAnimatedLineOrigin(setup.toOrigin) ?? toLinesOrigins[ii];
        let distance = v2d.distance(from, to);

        if (distance < minDistance.distance)
          minDistance = { distance, fromIndex: i, toIndex: ii };
      }
    }

    let origin = fromOrigin ?? setup.from.animatedLinesOrigins[minDistance.fromIndex];
    let destination = toOrigin ?? setup.to.animatedLinesOrigins[minDistance.toIndex];

    let p1 = {
      x: proportion(destination.x, origin.x, this.sliderValues[0] / 100),
      y: proportion(destination.y, origin.y, this.sliderValues[1] / 100),
    };

    let p2 = {
      x: proportion(destination.x, origin.x, this.sliderValues[2] / 100),
      y: proportion(destination.y, origin.y, this.sliderValues[3] / 100),
    };

    let result = new Line(`M ${ origin.x } ${ origin.y } C ${ p1.x } ${ p1.y } ${ p2.x } ${ p2.y } ${ destination.x } ${ destination.y }`);

    if (setup.color) result.color = setup.color;
    if (setup.width) result.width = setup.width;

    return result;
  }
}

function proportion(min: number, max: number, percent: number): number {
  return min * (1.0 - percent) + (max * percent);
}
