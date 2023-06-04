import { Figure } from "./figure";
import { v2d } from "../v2d";

export abstract class Polygon extends Figure {
  public get center(): v2d {
    let arr = this.vertices;
    let result = new v2d(0, 0);
    arr.forEach(v => result = result.add(v));
    result = result.divide(arr.length);

    return result;
  }

  public get animatedCenter(): v2d {
    let arr = this.animatedVertices;
    let result = new v2d(0, 0);
    arr.forEach(v => result = result.add(v));
    result = result.divide(arr.length);

    return result;
  }

  public get svgPoints(): string {
    let result = this.vertices.map(v => `${ v.x },${ v.y }`).join(' ');
    return result;
  }

  public get animatedSvgPoints(): string {
    let result = this.animatedVertices.map(v => `${ v.x },${ v.y }`).join(' ');
    return result;
  }

  private ccw(A: v2d, B: v2d, C: v2d): boolean {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  }

  private doIntersect(p1start: v2d, p1end: v2d, p2start: v2d, p2end: v2d): boolean {
    return this.ccw(p1start, p2start, p2end) != this.ccw(p1end, p2start, p2end) && this.ccw(p1start, p1end, p2start) != this.ccw(p1start, p1end, p2end)
  }
}
