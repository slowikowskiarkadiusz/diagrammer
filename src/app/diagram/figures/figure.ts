import { v2d } from "../v2d";
import { LineOrigin, LineSetup } from "./line";
import { AutoResizeTextDirective } from "../auto-resize-text.directive";

export interface FigureOptions {
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  isFixed?: boolean;
  isDraggable?: boolean;
}

export abstract class Figure {
  public label!: string;
  public isFixed!: boolean;
  public fillColor: string;
  public strokeColor?: string;
  public strokeWidth?: number;
  public isDragged!: boolean;
  public isDraggable: boolean = false;
  public lineSetups: LineSetup[] = [];
  public autoResizeTextDirective?: AutoResizeTextDirective;

  protected boardSize?: v2d;

  protected constructor(label: string, opt: FigureOptions) {
    this.label = label;
    this.fillColor = opt?.fillColor;
    this.strokeColor = opt.strokeColor;
    this.strokeWidth = opt.strokeWidth;
    this.isFixed = opt?.isFixed == true;
    this.isDraggable = opt?.isDraggable == true;
  }

  public abstract get center(): v2d;

  public abstract get animatedCenter(): v2d;

  public abstract get vertices(): v2d[];

  protected abstract get animatedVertices(): v2d[];

  public abstract moveBy(by: v2d): void;

  public abstract moveTo(to: v2d): void;

  public updateLoop(): void {
    this.animatedVertices.forEach((av, i) => {
      av.x += (this.vertices[i].x - av.x) / 20;
      av.y += (this.vertices[i].y - av.y) / 20;
    });

    if (this.update())
      this.autoResizeTextDirective?.update();
  }

  protected abstract update(): boolean;

  protected abstract get minBounds(): v2d;

  protected abstract get maxBounds(): v2d;

  protected abstract get animatedMinBounds(): v2d;

  protected abstract get animatedMaxBounds(): v2d;

  public get topLineOrigin(): v2d {
    let max = this.maxBounds;
    let result = new v2d(this.animatedCenter.x, max.y);
    return result;
  }

  public get bottomLineOrigin(): v2d {
    let min = this.minBounds;
    let result = new v2d(this.animatedCenter.x, min.y);
    return result;
  }

  public get leftLineOrigin(): v2d {
    let min = this.minBounds;
    let result = new v2d(min.x, this.animatedCenter.y);
    return result;
  }

  public get rightLineOrigin(): v2d {
    let max = this.maxBounds;
    let result = new v2d(max.x, this.animatedCenter.y);
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

  public get animatedBottomLineOrigin(): v2d {
    let max = this.animatedMaxBounds;
    let result = new v2d(this.animatedCenter.x, max.y);
    return result;
  }

  public get animatedTopLineOrigin(): v2d {
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
      this.animatedBottomLineOrigin,
      this.animatedTopLineOrigin,
      this.animatedLeftLineOrigin,
      this.animatedRightLineOrigin,
    ];
    return result;
  }

  public addLine(setup: LineSetup): void {
    this.lineSetups.push(setup);
    this.lineSetups.filter((v, i, c) => c.indexOf(v) === i);
  }

  public setBoardSize(newBoardSize: v2d): Figure {
    this.boardSize = newBoardSize;

    return this;
  }

  public getAnimatedLineOrigin(fromOrigin: LineOrigin | undefined): v2d | undefined {
    if (!fromOrigin) return undefined;

    switch (fromOrigin) {
      case 'bottom':
        return this.animatedBottomLineOrigin;
      case 'top':
        return this.animatedTopLineOrigin;
      case 'left':
        return this.animatedLeftLineOrigin;
      case 'right':
        return this.animatedRightLineOrigin;
    }
  }
}
