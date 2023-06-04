import { Figure } from "./figure";
import { v2d } from "../v2d";

export class Circle extends Figure {
  private _center!: v2d;
  public animated_center!: v2d;
  public radius: number = 0;

  public constructor(label: string, center: v2d, radius: number) {
    super(label);

    this._center = center.copy();
    this.animated_center = center.copy();
    this.radius = radius;
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
    if (this.isFixed) return;

    // if ((this._center.x) + by.x < this.radius)
    //   this._center.x = this.radius;
    // else if ((this._center.x) + by.x > boardSize.x - this.radius)
    //   this._center.x = boardSize.x - this.radius;
    // else
    //   this._center.x += by.x;
    //
    // if ((this._center.y) + by.y < this.radius)
    //   this._center.y = this.radius;
    // else if ((this._center.y) + by.y > boardSize.y - this.radius)
    //   this._center.y = boardSize.y - this.radius;
    // else
    //   this._center.y += by.y;
  }

  public moveTo(to: v2d): void {
  }
}
