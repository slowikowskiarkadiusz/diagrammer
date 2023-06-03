import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { v2d } from "./v2d";
import { Circle } from "./figures/circle";
import { Triangle } from "./figures/triangle";
import { Square } from "./figures/square";
import { Figure } from "./figures/figure";

// interface Figure {
//   label?: string;
//   x: number;
//   y: number;
//   r: number;
//   isFixed?: boolean;
//   isDisabled?: boolean;
// }

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit {
  @ViewChild('board') public board?: ElementRef<HTMLElement>;

  public nodes: Figure[] = [
    new Circle('any label', new v2d(200, 200), 50),
    new Triangle('any label', new v2d(200, 300), new v2d(250, 300), new v2d(225, 350)),
  ];

  public zoom: number = 1;
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
      for (const node0 of this.nodes)
        for (const node1 of this.nodes) {
          if (node0.isDisabled || node1.isDisabled) continue;
          if (node0 != node1 && Figure.doCollideCircleCircle(node0 as Circle, node1 as Circle))
            this.collide(node0, node1);
        }
    }, 0);
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

  private collide(node0: Figure, node1: Figure): void {
    let differenceMagnitude = new v2d(
      node0.center.x - node1.center.x,
      node0.center.y - node1.center.y,
    );

    if (differenceMagnitude.x + differenceMagnitude.y == 0) {
      differenceMagnitude.x = (2 * Math.random() - 1) * 1.1;
      differenceMagnitude.y = (2 * Math.random() - 1) * 1.1;
    }

    let max = [Math.abs(differenceMagnitude.x), Math.abs(differenceMagnitude.y)].reduce((p, c) => c > p ? c : p);

    differenceMagnitude.x /= max;
    differenceMagnitude.y /= max;

    node0.move(differenceMagnitude, this.boardSize);
    node1.move(differenceMagnitude.multiply(-1), this.boardSize);
  }

  public onScroll($event: Event) {
    // console.log($event);
  }

  public onMouseDown($event: MouseEvent, node: Figure) {
    this.draggedNode = node;
    this.draggedNode.isDisabled = true;
    this.draggingNodeInterpolation = setInterval(() => {
      node.center.x = this.mousePosition.x;
      node.center.y = this.mousePosition.y;
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
