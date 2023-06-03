import { Figure } from "./figure";
import { v2d } from "../v2d";

export class Triangle extends Figure {
  public v1!: v2d;
  public v2!: v2d;
  public v3!: v2d;

  public constructor(label: string, v1: v2d, v2: v2d, v3: v2d) {
    super(label);

    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  }

  public get center(): v2d {
    return new v2d(0, 0);
  }

  public move(by: v2d, boardSize: v2d): void {
  }

  public get svgPoints(): string {
    let result = this.vertices.map(v => `${ v.x },${ v.y }`).join(' ');
    return result;
  }

  public get vertices(): v2d[] {
    return [this.v1, this.v2, this.v3];
  }
}
