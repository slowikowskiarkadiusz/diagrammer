import { v2d } from "../v2d";
import { Polygon } from "./polygon";

export class Square extends Polygon {
  public v1!: v2d;
  public animatedV1!: v2d;
  public v2!: v2d;
  public animatedV2!: v2d;
  public v3!: v2d;
  public animatedV3!: v2d;
  public v4!: v2d;
  public animatedV4!: v2d;

  public constructor(label: string, v1: v2d, v2: v2d, v3: v2d, v4: v2d) {
    super(label);

    this.v1 = v1.copy();
    this.animatedV1 = v1.copy();
    this.v2 = v2.copy();
    this.animatedV2 = v2.copy();
    this.v3 = v3.copy();
    this.animatedV3 = v3.copy();
    this.v4 = v4.copy();
    this.animatedV4 = v4.copy();
  }

  public moveBy(by: v2d): void {
    this.v1 = this.v1.add(by);
    this.v2 = this.v2.add(by);
    this.v3 = this.v3.add(by);
    this.v4 = this.v4.add(by);
  }

  public moveTo(to: v2d): void {
    let v1Diff = this.v1.subtract(this.center);
    let v2Diff = this.v2.subtract(this.center);
    let v3Diff = this.v3.subtract(this.center);
    let v4Diff = this.v4.subtract(this.center);
    this.v1 = v1Diff.add(to);
    this.v2 = v2Diff.add(to);
    this.v3 = v3Diff.add(to);
    this.v4 = v4Diff.add(to);
  }

  protected get animatedVertices(): v2d[] {
    return [this.animatedV1, this.animatedV2, this.animatedV3, this.animatedV4];
  }

  public get vertices(): v2d[] {
    return [this.v1, this.v2, this.v3, this.v4];
  }

  private sign(p1: v2d, p2: v2d, p3: v2d): number {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  public isPointInSquare(point: v2d): boolean {
    let d1 = this.sign(point, this.v1, this.v2);
    let d2 = this.sign(point, this.v2, this.v3);
    let d3 = this.sign(point, this.v3, this.v4);
    let d4 = this.sign(point, this.v4, this.v1);

    let has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0) || (d4 < 0);
    let has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0) || (d4 > 0);

    return !(has_neg && has_pos);
  }
}
