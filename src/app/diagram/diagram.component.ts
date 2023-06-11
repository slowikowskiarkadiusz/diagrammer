import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { v2d } from "./v2d";
import { Figure } from "./figures/figure";
import { Circle } from "./figures/circle";
import { Polygon } from "./figures/polygon";
import { Point } from "./figures/point";
import { Line } from "./figures/line";
import { proportion } from "../utils";

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
    public draggedNode?: Figure;

    public defaultViewBox: { minX: number, minY: number, width: number, height: number } = { minX: 0, minY: 0, width: 1000, height: 1000 };
    public viewBox: { minX: number, minY: number, width: number, height: number } = { minX: 0, minY: 0, width: 1000, height: 1000 };
    public isShiftDown: boolean = false;
    private svgPoint?: DOMPoint;
    private isMouseDown: boolean = false;
    private mouseStartPosition: v2d = new v2d(0, 0);
    private viewboxStartPosition: v2d = new v2d(0, 0);
    private mousePosition: v2d = new v2d(0, 0);
    private viewboxPosition: v2d = new v2d(0, 0);
    private viewboxSize: v2d = new v2d(1000, 1000);
    private viewboxScale: number = 1;

    constructor() {
        this.setViewbox();
    }

    @HostListener('document:keydown.shift', ['$event'])
    public onKeydownHandler($event: KeyboardEvent) {
        this.isShiftDown = $event.key.toLowerCase() === 'shift';
    }

    @HostListener('document:keyup.shift', ['$event'])
    public onKeyupHandler($event: KeyboardEvent) {
        if ($event.key.toLowerCase() === 'shift')
            this.isShiftDown = false;
    }

    public get lines(): Line[] {
        let result = this.figures
            .flatMap(x => x.lines);
        return result;
    }

    private get boardSize(): v2d {
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
        if ($event.shiftKey) {
            let scale = ($event.deltaY < 0) ? proportion(0.9, 0.2, $event.deltaY / 100, true) : proportion(1.1, 2, $event.deltaY / 100, true);

            if ((this.viewboxScale * scale < 2) && (this.viewboxScale * scale > 0.1)) {
                let mousePosition = new v2d(this.mousePosition.x * this.viewboxScale, this.mousePosition.y * this.viewboxScale);
                let viewBoxPosition = new v2d(this.viewboxPosition.x, this.viewboxPosition.y);
                let cpos = new v2d(mousePosition.x + viewBoxPosition.x, mousePosition.y + viewBoxPosition.y);

                this.viewboxPosition.x = (this.viewboxPosition.x - cpos.x) * scale + cpos.x;
                this.viewboxPosition.y = (this.viewboxPosition.y - cpos.y) * scale + cpos.y;
                this.viewboxScale *= scale;

                this.setViewbox();
            }
        }
    }

    public onMouseDown($event: MouseEvent, figure?: Figure) {
        if ($event.shiftKey) {
            this.isMouseDown = true;
            this.mouseStartPosition.x = $event.pageX;
            this.mouseStartPosition.y = $event.pageY;

            this.viewboxStartPosition.x = this.viewboxPosition.x;
            this.viewboxStartPosition.y = this.viewboxPosition.y;

            if (figure && figure.isDraggable) {
                this.draggedNode = figure;
                this.draggedNode.isDragged = true;
            }

            $event.stopImmediatePropagation();
        }
    }

    public onMouseUp($event: MouseEvent) {
        if ($event.shiftKey) {
            this.mouseStartPosition = new v2d($event.pageX, $event.pageY);
            this.viewboxStartPosition = new v2d($event.pageX, $event.pageY);
        }

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
        if (!$event.shiftKey)
            if (figure.isClickable && !figure.isDragged && !figure.isFixed)
                this.onFigureClicked.emit(figure);
    }

    public printViewBox(): string {
        let result = `${ this.viewBox.minX } ${ this.viewBox.minY } ${ this.viewBox.width } ${ this.viewBox.height }`;
        return result;
    }

    private setViewbox() {
        this.viewBox = {
            minX: this.viewboxPosition.x,
            minY: this.viewboxPosition.y,
            width: this.viewboxSize.x * this.viewboxScale,
            height: this.viewboxSize.y * this.viewboxScale,
        };
    }

    public onCenterButtonClick() {
        this.viewBox = { ...this.defaultViewBox };
    }

    public onKeyDown($event: KeyboardEvent) {
    }

    public onKeyUp($event: KeyboardEvent) {
        if ($event.shiftKey)
            this.isShiftDown = false;
    }
}
