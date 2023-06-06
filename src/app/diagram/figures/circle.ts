import { Figure, FigureOptions } from "./figure";
import { v2d } from "../v2d";

export class Circle extends Figure {
  private _center!: v2d;
  public animated_center!: v2d;
  public radius: number = 0;
  public animatedRadius: number = 0;

  public constructor(label: string, center: v2d, radius: number, opt: FigureOptions) {
    super(label, opt);

    this._center = center.copy();
    this.animated_center = center.copy();
    this.radius = radius;
  }

  protected get minBounds(): v2d {
    let min: v2d = new v2d(this._center.x - this.radius, this._center.y - this.radius);
    return min;
  }

  protected get maxBounds(): v2d {
    let max: v2d = new v2d(this._center.x + this.radius, this._center.y + this.radius);
    return max;
  }

  protected get animatedMinBounds(): v2d {
    let min: v2d = new v2d(this.animated_center.x - this.animatedRadius, this.animated_center.y - this.animatedRadius);
    return min;
  }

  protected get animatedMaxBounds(): v2d {
    let max: v2d = new v2d(this.animated_center.x + this.animatedRadius, this.animated_center.y + this.animatedRadius);
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
    let previousAnimatedRadius = this.animatedRadius;

    this.animatedRadius += (this.radius - this.animatedRadius) / 10;

    return Math.abs(previousAnimatedRadius - this.animatedRadius) > 0.3;
  }

  public moveBy(by: v2d): void {
    if (this.isFixed) return;

    this.moveTo(this.center.add(by));
  }

  public isIntersectingWithCircle(circle1: Circle): boolean {
    let x = this.center.x - circle1.center.x;
    let y = this.center.y - circle1.center.y;
    let result = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < (this.radius + circle1.radius);
    return result;
  }

  public moveTo(to: v2d): void {
    if (this.isFixed) return;
    this._center = to;

    if (to.x < this.radius)
      this._center.x = this.radius;
    else if (this.boardSize && to.x > this.boardSize.x - this.radius)
      this._center.x = this.boardSize.x - this.radius;
    else
      this._center.x = to.x;

    if (to.y < this.radius)
      this._center.y = this.radius;
    else if (this.boardSize && to.y > this.boardSize.y - this.radius)
      this._center.y = this.boardSize.y - this.radius;
    else
      this._center.y = to.y;
  }
}
