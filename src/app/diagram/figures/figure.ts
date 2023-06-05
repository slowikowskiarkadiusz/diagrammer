import { v2d } from "../v2d";
import { Line } from "./line";
import { min } from "rxjs";

export abstract class Figure {
  public label!: string;
  public isFixed!: boolean;
  public isDisabled!: boolean;

  protected boardSize?: v2d;

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

  protected abstract get minBounds(): v2d;

  protected abstract get maxBounds(): v2d;

  protected abstract get animatedMinBounds(): v2d;

  protected abstract get animatedMaxBounds(): v2d;

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

  public get animatedTopLineOrigin(): v2d {
    let max = this.animatedMaxBounds;
    let result = new v2d(this.animatedCenter.x, max.y);
    return result;
  }

  public get animatedBottomLineOrigin(): v2d {
    let min = this.animatedMinBounds;
    let result = new v2d(this.animatedCenter.x, min.y);
    return result;
  }

  public get animatedLeftLineOrigin(): v2d {
    let min = this.animatedMinBounds;
    let result = new v2d(min.x, this.animatedCenter.y);
    return result;
  }

  public get animatedRightLineOrigin(): v2d {
    let max = this.animatedMaxBounds;
    let result = new v2d(max.x, this.animatedCenter.y);
    return result;
  }

  public get animatedLinesOrigins(): v2d[] {
    let result = [
      this.animatedTopLineOrigin,
      this.animatedBottomLineOrigin,
      this.animatedLeftLineOrigin,
      this.animatedRightLineOrigin,
    ];
    return result;
  }

  public lineTo(figure: Figure): Line {
    let myLinesOrigins = this.animatedLinesOrigins;
    let otherLinesOrigins = figure.animatedLinesOrigins;

    let minDistance = { distance: Infinity, myIndex: 0, otherIndex: 0 };
    for (let i = 0; i < myLinesOrigins.length; i++) {
      const my = myLinesOrigins[i];
      for (let ii = 0; ii < otherLinesOrigins.length; ii++) {
        const other = otherLinesOrigins[ii];
        let distance = v2d.distance(my, other);

        if (distance < minDistance.distance)
          minDistance = { distance, myIndex: i, otherIndex: ii };
      }
    }

    let result = new Line(() => this.animatedLinesOrigins[minDistance.myIndex], () => figure.animatedLinesOrigins[minDistance.otherIndex]);
    return result;
  }

  public setBoardSize(newBoardSize: v2d): Figure {
    this.boardSize = newBoardSize;

    return this;
  }
}
