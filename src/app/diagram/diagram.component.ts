import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { v2d } from "./v2d";
import { Figure } from "./figures/figure";
import { Circle } from "./figures/circle";
import { Polygon } from "./figures/polygon";
import { Point } from "./figures/point";
import { processLabel } from "../utils";
import { Line } from "./figures/line";

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit {
  @Input() public figures: Figure[] = [];
  @Input() public maxFontSize: number = 16;

  @Output() public onFigureClicked: EventEmitter<Figure> = new EventEmitter<Figure>();

  @ViewChild('svg') public svg?: any;

  private mousePosition: v2d = new v2d(0, 0);
  private draggedNode?: Figure;
  private draggingNodeInterpolation?: number;

  constructor() {
  }

  public get lines(): Line[] {
    let result = this.figures
      .flatMap(x => x.lineSetups)
      .map(x => Line.fromSetup(x));
    return result;
  }

  private get boardSize(): v2d {
    let result = new v2d(this.svg?.nativeElement.clientWidth ?? 0, this.svg?.nativeElement.clientHeight ?? 0);
    return result;
  }

  public ngAfterViewInit(): void {
    this.figures.forEach(f => f.setBoardSize(this.boardSize));

    setInterval(() => {
      for (const figure0 of this.figures) {
        if (figure0.isDraggable) continue;
        for (const figure1 of this.figures) {
          if (figure0.isDragged || figure1.isDragged) continue;
          if (figure0 != figure1) {
            let isCircleAndCircle = this.isCircle(figure0) && this.isCircle(figure1) && (figure0 as Circle).isIntersectingWithCircle(figure1 as Circle);
            let isPolygonAndPolygon = this.isPolygon(figure0) && this.isPolygon(figure1) && (figure0 as Polygon).isPolygonInside(figure1 as Polygon);
            let isPolygonAndCircle = this.isPolygon(figure0) && this.isCircle(figure1) && (figure0 as Polygon).isCircleInside(figure1 as Circle);
            let isPolygonAndPoint = this.isPolygon(figure0) && this.isPoint(figure1) && (figure0 as Polygon).isPointInside(figure1.center);

            if (isCircleAndCircle || isPolygonAndPolygon || isPolygonAndPoint || isPolygonAndCircle)
              this.collide(figure0, figure1);
          }
        }
      }

    }, 10);

    setInterval(() => {
      this.figures.forEach(f => f.updateLoop());
    }, 0);
  }

  public asCircle(figure: Figure): Circle {
    return figure as Circle;
  }

  public isCircle(figure: Figure): boolean {
    return figure instanceof Circle;
  }

  public asPoint(figure: Figure): Point {
    return figure as Point;
  }

  public isPoint(figure: Figure): boolean {
    return figure instanceof Point;
  }

  public asPolygon(figure: Figure): Polygon {
    return figure as Polygon;
  }

  public isPolygon(figure: Figure): boolean {
    return figure instanceof Polygon;
  }

  private collide(figure0: Figure, figure1: Figure): void {
    let differenceMagnitude = new v2d(
      figure0.center.x - figure1.center.x,
      figure0.center.y - figure1.center.y,
    );

    if (differenceMagnitude.x + differenceMagnitude.y == 0) {
      differenceMagnitude.x = (2 * Math.random() - 1) * 1.1;
      differenceMagnitude.y = (2 * Math.random() - 1) * 1.1;
    }

    let max = [Math.abs(differenceMagnitude.x), Math.abs(differenceMagnitude.y)].reduce((p, c) => c > p ? c : p);

    differenceMagnitude.x /= max;
    differenceMagnitude.y /= max;

    figure0.moveBy(differenceMagnitude);
    figure1.moveBy(differenceMagnitude.multiply(-1));
  }

  public onScroll($event: Event) {
    // console.log($event);
  }

  private beingPressedTimeout?: number;

  public onMouseDown($event: MouseEvent, figure: Figure) {
    this.beingPressedTimeout = setTimeout(() => {
      if (figure.isDraggable) {
        this.draggedNode = figure;
        this.draggedNode.isDragged = true;
        this.draggingNodeInterpolation = setInterval(() => {
          figure.moveTo(this.mousePosition);
        }, 0);
      }
    }, 150);
  }

  public onMouseUp($event: MouseEvent) {
    clearInterval(this.draggingNodeInterpolation);
    clearTimeout(this.beingPressedTimeout);

    setTimeout(() => {
      if (this.draggedNode) {
        this.draggedNode.isDragged = false;
        this.draggedNode = undefined;
      }
    }, 0);
  }

  public onMouseMove($event: MouseEvent) {
    this.mousePosition = new v2d($event.x, $event.y);
  }

  public onFigureClick($event: MouseEvent, figure: Figure) {
    if (!figure.isDragged)
      this.onFigureClicked.emit(figure);
  }
}
