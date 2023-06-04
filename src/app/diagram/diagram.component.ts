import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { v2d } from "./v2d";
import { Triangle } from "./figures/triangle";
import { Square } from "./figures/square";
import { Figure } from "./figures/figure";
import { Circle } from "./figures/circle";
import { Polygon } from "./figures/polygon";
import { Point } from "./figures/point";

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit {
  @ViewChild('board') public board?: ElementRef<HTMLElement>;

  public figures: Figure[] = [
    new Point('any label', new v2d(200, 200)),
    new Square('any label', new v2d(450, 350), new v2d(450, 450), new v2d(350, 450), new v2d(350, 350)),
  ];

  public previousMousePosition: v2d = new v2d(0, 0);
  public mousePosition: v2d = new v2d(0, 0);

  private draggedNode?: Figure;
  private boardSize: v2d = new v2d(0, 0);
  private draggingNodeInterpolation?: number;

  constructor() {
  }

  public ngAfterViewInit(): void {
    this.boardSize.x = this.board?.nativeElement.clientWidth ?? 0;
    this.boardSize.y = this.board?.nativeElement.clientHeight ?? 0;
    setInterval(() => {
      for (const figure0 of this.figures)
        for (const figure1 of this.figures) {
          if (figure0.isDisabled || figure1.isDisabled) continue;
          if (figure0 != figure1) {
            let isCircleAisCircle = this.isCircle(figure0) && this.isCircle(figure1) && Figure.doCollideCircleCircle(figure0 as Circle, figure1 as Circle);
            let isTriangleAndCircle = this.isTriangle(figure0) && this.isCircle(figure1) && Figure.doCollideTriangleCircle(figure0 as Triangle, figure1 as Circle);
            let isTriangleAndTriangle = this.isTriangle(figure0) && this.isTriangle(figure1) && Figure.doCollideTriangleTriangle(figure0 as Triangle, figure1 as Triangle);
            let isTriangleAndSquare = this.isTriangle(figure0) && this.isSquare(figure1) && Figure.doCollideTriangleSquare(figure0 as Triangle, figure1 as Square);
            let isSquareAndSquare = this.isSquare(figure0) && this.isSquare(figure1) && Figure.doCollideSquareSquare(figure0 as Square, figure1 as Square);

            if (isCircleAisCircle || isTriangleAndCircle || isTriangleAndTriangle || isTriangleAndSquare || isSquareAndSquare)
              this.collide(figure0, figure1);
          }
        }

      this.figures.forEach(f => f.updatePosition());
    }, 0);
  }

  public asCircle(figure: Figure): Circle {
    return figure as Circle;
  }

  public isCircle(figure: Figure): boolean {
    return figure instanceof Circle;
  }

  public asSquare(figure: Figure): Square {
    return figure as Square;
  }

  public isSquare(figure: Figure): boolean {
    return figure instanceof Square;
  }

  public asTriangle(figure: Figure): Triangle {
    return figure as Triangle;
  }

  public isTriangle(figure: Figure): boolean {
    return figure instanceof Triangle;
  }

  public asPolygon(figure: Figure): Polygon {
    return figure as Polygon;
  }

  public isPolygon(figure: Figure): boolean {
    return figure instanceof Polygon;
  }

  public figureType(figure: Figure): 'circle' | 'square' | 'triangle' {
    if (figure instanceof Square)
      return 'square';
    if (figure instanceof Circle)
      return 'circle';
    if (figure instanceof Triangle)
      return 'triangle';

    throw Error('idk');
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

  public onMouseDown($event: MouseEvent, figure: Figure) {
    this.draggedNode = figure;
    this.draggedNode.isDisabled = true;
    this.draggingNodeInterpolation = setInterval(() => {
      figure.moveTo(this.mousePosition);
      this.previousMousePosition = this.mousePosition;
    }, 0);
  }

  public onMouseUp($event: MouseEvent) {
    clearInterval(this.draggingNodeInterpolation);

    if (this.draggedNode) {
      this.draggedNode.isDisabled = false;
      this.draggedNode = undefined;
    }
  }

  public onMouseMove($event: MouseEvent) {
    this.mousePosition = new v2d($event.x, $event.y);
  }
}
