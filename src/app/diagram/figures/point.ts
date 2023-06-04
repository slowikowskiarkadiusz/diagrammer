import { Figure } from "./figure";
import { v2d } from "../v2d";

export class Point extends Figure {
  private _center!: v2d;
  public animated_center!: v2d;

  public constructor(label: string, center: v2d) {
    super(label);

    this._center = center.copy();
    this.animated_center = center.copy();
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

  public moveBy(by: v2d): void {
    this._center = this.center.add(by);
  }

  public moveTo(to: v2d): void {
    this._center = to;
  }

}
