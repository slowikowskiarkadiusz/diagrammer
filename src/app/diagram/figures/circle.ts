import { Figure } from "./figure";
import { v2d } from "../v2d";

export class Circle extends Figure {
  private _center!: v2d;
  public radius: number = 0;

  public constructor(label: string, center: v2d, radius: number) {
    super(label);

    this._center = center;
    this.radius = radius;
  }

  public get center(): v2d {
    return this._center;
  }

  public move(by: v2d, boardSize: v2d): void {
    if (this.isFixed) return;

    if ((this._center.x) + by.x < this.radius)
      this._center.x = this.radius;
    else if ((this._center.x) + by.x > boardSize.x - this.radius)
      this._center.x = boardSize.x - this.radius;
    else
      this._center.x += by.x;

    if ((this._center.y) + by.y < this.radius)
      this._center.y = this.radius;
    else if ((this._center.y) + by.y > boardSize.y - this.radius)
      this._center.y = boardSize.y - this.radius;
    else
      this._center.y += by.y;
  }
}
