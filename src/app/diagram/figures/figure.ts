import { v2d } from "../v2d";

export abstract class Figure {
  public label!: string;
  public isFixed!: boolean;
  public isDisabled!: boolean;

  protected constructor(label: string) {
    this.label = label;
  }

  public abstract get center(): v2d;

  public abstract get animatedCenter(): v2d;

  public abstract get vertices(): v2d[];

  protected abstract get animatedVertices(): v2d[];

  public abstract moveBy(by: v2d): void;

  public abstract moveTo(to: v2d): void;

  public updatePosition(): void {
    this.animatedVertices.forEach((av, i) => {
      av.x += (this.vertices[i].x - av.x) / 20;
      av.y += (this.vertices[i].y - av.y) / 20;
    });
  }

  protected get minBounds(): v2d {
    let min: v2d = new v2d(this.vertices.reduce((p, c) => p.x < c.x ? p : c).x, this.vertices.reduce((p, c) => p.y < c.y ? p : c).y);
    return min;
  }

  protected get maxBounds(): v2d {
    let max: v2d = new v2d(this.vertices.reduce((p, c) => p.x > c.x ? p : c).x, this.vertices.reduce((p, c) => p.y > c.y ? p : c).y);
    return max;
  }

  public get topLineOrigin(): v2d {
    let min = this.minBounds;
    let max = this.maxBounds;
    let result = new v2d((min.x + max.x) / 2, max.y);
    return result;
  }

  public get bottomLineOrigin(): v2d {
    let min = this.minBounds;
    let max = this.maxBounds;
    let result = new v2d((min.x + max.x) / 2, max.y);
    return result;
  }

  public get leftLineOrigin(): v2d {
    let min = this.minBounds;
    let max = this.maxBounds;
    let result = new v2d(min.x, (min.y + max.y) / 2);
    return result;
  }

  public get rightLineOrigin(): v2d {
    let min = this.minBounds;
    let max = this.maxBounds;
    let result = new v2d(max.x, (min.y + max.y) / 2);
    return result;
  }

  public get linesOrigins(): v2d[] {
    let result = [
      this.topLineOrigin,
      this.bottomLineOrigin,
      this.leftLineOrigin,
      this.rightLineOrigin,
    ];
    return result;
  }
}
