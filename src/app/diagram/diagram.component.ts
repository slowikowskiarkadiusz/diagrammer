import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { v2d } from "./v2d";
import { Figure } from "./figures/figure";
import { Circle } from "./figures/circle";
import { Polygon } from "./figures/polygon";
import { Point } from "./figures/point";
import { Line } from "./figures/line";

@Component({
    selector: 'app-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit, OnChanges {
    @Input() public height: number = 1000;
    @Input() public figures: Figure[] = [];
    @Input() public maxFontSize: number = 16;

    @Output() public onFigureClicked: EventEmitter<Figure> = new EventEmitter<Figure>();

    @ViewChild('svg') public svg?: ElementRef<HTMLElement>;

    private mousePosition: v2d = new v2d(0, 0);
    private draggedNode?: Figure;
    private draggingNodeInterpolation?: number;
    private beingPressedTimeout?: number;

    constructor() {
    }

    public get lines(): Line[] {
        let result = this.figures
            .flatMap(x => x.lines);
        return result;
    }

    private get boardSize(): v2d {
        let result = new v2d(this.svg?.nativeElement.clientWidth ?? 0, this.svg?.nativeElement.clientHeight ?? 0);
        return result;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['height'] || changes['figures'].currentValue.length !== changes['figures'].previousValue?.length) {
            setTimeout(() => {
                this.figures.forEach(f => f.setBoardSize(this.boardSize));
            }, 0);
        }
    }

    public ngAfterViewInit(): void {
        setInterval(() => {
            for (let i = 0; i < this.figures.length; i++) {
                const figure0 = this.figures[i];
                if (figure0.isDragged || !figure0.isCollidable) continue;
                for (let ii = i + 1; ii < this.figures.length; ii++) {
                    const figure1 = this.figures[ii];
                    if (figure0.isDragged || !figure1.isCollidable) continue;
                    if (figure0 != figure1) {
                        let isCircleAndCircle = this.isCircle(figure0) && this.isCircle(figure1) && (figure0 as Circle).doesCircleIntersect(figure1 as Circle);
                        let isPolygonAndPolygon = this.isPolygon(figure0) && this.isPolygon(figure1) && (figure0 as Polygon).isPolygonInside(figure1 as Polygon);
                        let isPolygonAndCircle = this.isPolygon(figure0) && this.isCircle(figure1) && (figure0 as Polygon).doesCircleIntersect(figure1 as Circle);
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
        let differenceMagnitude = figure0.center.subtract(figure1.center);

        if (differenceMagnitude.x + differenceMagnitude.y == 0) {
            differenceMagnitude.x = (2 * Math.random() - 1) * 1.1;
            differenceMagnitude.y = (2 * Math.random() - 1) * 1.1;
        }

        let max = [Math.abs(differenceMagnitude.x), Math.abs(differenceMagnitude.y)].reduce((p, c) => c > p ? c : p);

        differenceMagnitude.x /= max;
        differenceMagnitude.y /= max;

        this.moveFigureBy(figure0, differenceMagnitude);
        this.moveFigureBy(figure1, differenceMagnitude.multiply(-1));
    }

    public onScroll($event: WheelEvent) {
        if ($event.shiftKey) {
            console.log($event.deltaY);
            $event.stopImmediatePropagation();
        }
    }

    public onMouseDown($event: MouseEvent, figure: Figure) {
        if ($event.shiftKey)
            if (figure.isDraggable) {
                this.draggedNode = figure;
                this.draggedNode.isDragged = true;
                this.draggingNodeInterpolation = setInterval(() => {
                    this.moveFigureTo(figure, this.mousePosition);
                }, 0);
            }
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
        let rect = this.svg!.nativeElement.getBoundingClientRect();
        let x = $event.clientX - rect.left;
        let y = $event.clientY - rect.top;
        this.mousePosition = new v2d(x, y);
    }

    public onFigureClick($event: MouseEvent, figure: Figure) {
        if (figure.isClickable && !figure.isDragged && !figure.isFixed)
            this.onFigureClicked.emit(figure);
    }

    private moveFigureBy(figure: Figure, by: v2d): void {
        figure.moveBy(by);
        // figure.updateLines();
    }

    private moveFigureTo(figure: Figure, to: v2d): void {
        figure.moveTo(to);
        // figure.updateLines();
    }
}
