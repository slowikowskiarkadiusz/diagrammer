import { Figure, FigureOptions } from "./figure";
import { v2d } from "../v2d";

export class Point extends Figure {
  private _center!: v2d;
  public animated_center!: v2d;

  public constructor(label: string, center: v2d, opt: FigureOptions) {
    super(label, opt);

    this._center = center.copy();
    this.animated_center = center.copy();
  }

  protected get minBounds(): v2d {
    let min: v2d = new v2d(this.vertices.reduce((p, c) => p.x < c.x ? p : c).x, this.vertices.reduce((p, c) => p.y < c.y ? p : c).y);
    return min;
  }

  protected get maxBounds(): v2d {
    let max: v2d = new v2d(this.vertices.reduce((p, c) => p.x > c.x ? p : c).x, this.vertices.reduce((p, c) => p.y > c.y ? p : c).y);
    return max;
  }

  protected get animatedMinBounds(): v2d {
    let min: v2d = new v2d(this.animatedVertices.reduce((p, c) => p.x < c.x ? p : c).x, this.animatedVertices.reduce((p, c) => p.y < c.y ? p : c).y);
    return min;
  }

  protected get animatedMaxBounds(): v2d {
    let max: v2d = new v2d(this.animatedVertices.reduce((p, c) => p.x > c.x ? p : c).x, this.animatedVertices.reduce((p, c) => p.y > c.y ? p : c).y);
    return max;
  }

  public get center(): v2d {
    return this._center;
  }

  protected get animatedVertices(): v2d[] {
    return [this.animated_center];
  }

  public get vertices(): v2d[] {
    return [this._center];
  }

  public get animatedCenter(): v2d {
    return this.animated_center;
  }

  protected update(): boolean {
    return false;
  }

  public moveBy(by: v2d): void {
    this._center = this.center.add(by);
  }

  public moveTo(to: v2d): void {
    this._center = to;
  }

}
