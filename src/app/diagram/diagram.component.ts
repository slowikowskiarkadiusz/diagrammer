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

    private svgMousePosition: v2d = new v2d(0, 0);
    // private mousePosition: v2d = new v2d(0, 0);
    private draggedNode?: Figure;
    // private previousMousePosition: v2d = new v2d(0, 0);
    private svgPoint?: DOMPoint;
    private isMouseDown: boolean = false;

    public viewBox: { minX: number, minY: number, width: number, height: number } = { minX: 0, minY: 0, width: 1000, height: 1000 };
    private mouseStartPosition: v2d = new v2d(0, 0);
    private viewboxStartPosition: v2d = new v2d(0, 0);
    private mousePosition: v2d = new v2d(0, 0);
    private viewboxPosition: v2d = new v2d(0, 0);
    private viewboxSize: v2d = new v2d(0, 0);
    private viewboxScale: number = 0;

    constructor() {
    }

    public get lines(): Line[] {
        let result = this.figures
            .flatMap(x => x.lines);
        return result;
    }

    private get boardSize(): v2d {
        // let result = new v2d(this.svg?.nativeElement.clientWidth ?? 0, this.svg?.nativeElement.clientHeight ?? 0);
        let result = new v2d(this.viewBox?.width ?? 0, this.viewBox?.height ?? 0);
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
        this.svgPoint = (this.svg!.nativeElement as any).createSVGPoint();
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

        figure0.moveBy(differenceMagnitude);
        figure1.moveBy(differenceMagnitude.multiply(-1));
    }

    public onScroll($event: WheelEvent) {
        var scale = ($event.deltaY < 0) ? 0.8 : 1.2;

        if ((this.viewboxScale * scale < 8.) && (this.viewboxScale * scale > 1. / 256.)) {
            let mpos = new v2d(this.mousePosition.x * this.viewboxScale, this.mousePosition.y * this.viewboxScale);
            let vpos = new v2d(this.viewboxPosition.x, this.viewboxPosition.y);
            let cpos = new v2d(mpos.x + vpos.x, mpos.y + vpos.y);

            this.viewboxPosition.x = (this.viewboxPosition.x - cpos.x) * scale + cpos.x;
            this.viewboxPosition.y = (this.viewboxPosition.y - cpos.y) * scale + cpos.y;
            this.viewboxScale *= scale;

            this.setViewbox();
        }
        // if ($event.shiftKey) {
        //     let diff = $event.deltaY;
        //
        //     if (this.viewBox.width - diff > 0)
        //         this.viewBox.width -= diff;
        //     if (this.viewBox.height - diff > 0)
        //         this.viewBox.height -= diff;
        // }
        // $event.stopImmediatePropagation();
        // $event.stopPropagation();
    }

    public onMouseDown($event: MouseEvent, figure?: Figure) {
        this.isMouseDown = true;

        if ($event.shiftKey) {
            if (figure && figure.isDraggable) {
                this.draggedNode = figure;
                this.draggedNode.isDragged = true;
            }
            // if (this.draggingNodeInterpolation) clearInterval(this.draggingNodeInterpolation);
            // this.draggingNodeInterpolation = setInterval(() => {
            //     if (figure && figure.isDraggable)
            //         this.moveFigureTo(figure, this.svgMousePosition);
            //     else {
            //         let diff = this.mousePosition.subtract(this.previousMousePosition);
            //         if (!isNaN(diff.x))
            //             this.viewBox.minX -= diff.x;
            //         if (!isNaN(diff.y))
            //             this.viewBox.minY -= diff.y;
            //     }
            // }, 0);

            $event.stopImmediatePropagation();
        }
    }

    private setViewbox() {
        this.viewBox = {
            minX: this.viewboxPosition.x,
            minY: this.viewboxPosition.y,
            width: this.viewboxSize.x * this.viewboxScale,
            height: this.viewboxSize.y * this.viewboxScale,
        };
    }

    public onMouseUp($event: MouseEvent) {
        this.mouseStartPosition = new v2d($event.pageX, $event.pageY);
        this.viewboxStartPosition = new v2d($event.pageX, $event.pageY);

        this.isMouseDown = false;
        setTimeout(() => {
            if (this.draggedNode) {
                this.draggedNode.isDragged = false;
                this.draggedNode = undefined;
            }
        }, 0);
    }

    public onMouseMove($event: MouseEvent) {
        this.mousePosition = new v2d($event.offsetX, $event.offsetY);

        if (this.isMouseDown) {
            if (this.draggedNode && this.draggedNode.isDraggable) {
                this.svgPoint!.x = $event.clientX;
                this.svgPoint!.y = $event.clientY;
                let transformed = this.svgPoint!.matrixTransform((this.svg!.nativeElement as any).getScreenCTM().inverse());
                this.svgMousePosition = new v2d(transformed.x, transformed.y);

                this.draggedNode.moveTo(this.svgMousePosition);
            } else {
                this.viewboxPosition = new v2d(
                    this.viewboxStartPosition.x + (this.mouseStartPosition.x - $event.pageX) * this.viewboxScale,
                    this.viewboxStartPosition.y + (this.mouseStartPosition.y - $event.pageY) * this.viewboxScale,
                );

                this.setViewbox();
            }
        }
    }

    public onFigureClick($event: MouseEvent, figure: Figure) {
        if (figure.isClickable && !figure.isDragged && !figure.isFixed)
            this.onFigureClicked.emit(figure);
    }

    public printViewBox(): string {
        let result = `${ this.viewBox.minX } ${ this.viewBox.minY } ${ this.viewBox.width } ${ this.viewBox.height }`;
        return result;
    }
}
