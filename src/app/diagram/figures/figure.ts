import { v2d } from "../v2d";
import { Line, LineOrigin, LineSetup } from "./line";
import { AutoResizeTextDirective } from "../auto-resize-text.directive";
import { processLabel } from "../../utils";

export interface FigureOptions {
    fillColor: string;
    hoverFillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    isFixed?: boolean;
    isCollidable?: boolean;
    isDraggable?: boolean;
    isClickable?: boolean;
    forceOneLineLabel?: boolean;
}

export abstract class Figure {
    private static _id: number = 0;
    public id: string;
    public label!: string;
    public originalLabel!: string;
    public isFixed!: boolean;
    public isCollidable!: boolean;
    public fillColor: string;
    public hoverFillColor: string;
    public strokeColor?: string;
    public strokeWidth?: number;
    public isDragged!: boolean;
    public isDraggable: boolean = false;
    public isClickable: boolean = false;
    public forceOneLineLabel: boolean;
    public lineSetups: LineSetup[] = [];
    public autoResizeTextDirective?: AutoResizeTextDirective;
    public fontSize: string = '16px';
    public lineHeight: string = '16px';

    protected boardSize?: v2d;
    private _lines: { line: Line, setup: LineSetup }[] = [];

    protected constructor(label: string, opt: FigureOptions) {
        this.id = (Figure._id++).toString();
        this.label = processLabel(label);
        this.originalLabel = label;
        this.fillColor = opt?.fillColor;
        this.hoverFillColor = opt?.hoverFillColor ?? opt?.fillColor;
        this.strokeColor = opt.strokeColor;
        this.strokeWidth = opt.strokeWidth;
        this.isFixed = opt?.isFixed == true;
        this.isCollidable = opt?.isCollidable == undefined ? true : opt?.isCollidable;
        this.isDraggable = opt?.isDraggable == true;
        this.isClickable = opt?.isClickable == undefined ? true : opt?.isClickable;
        this.forceOneLineLabel = opt?.forceOneLineLabel == true;
    }

    public abstract get center(): v2d;

    public abstract get animatedCenter(): v2d;

    public abstract get vertices(): v2d[];

    protected abstract get animatedVertices(): v2d[];

    protected abstract update(areChanges: boolean): boolean;

    protected abstract get minBounds(): v2d;

    protected abstract get maxBounds(): v2d;

    protected abstract get animatedMinBounds(): v2d;

    protected abstract get animatedMaxBounds(): v2d;

    public abstract get size(): v2d;

    protected abstract get animatedSize(): v2d;

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

    public get lines(): Line[] {
        let result = this._lines.map(x => x.line);
        return result;
    }

    public clearLines(): void {
        this._lines = [];
    }

    public abstract moveBy(by: v2d): void;

    public abstract moveTo(to: v2d): void;

    public abstract instantMoveTo(to: v2d): void;

    public markForChanges(): void {
        this.autoResizeTextDirective?.update();
    }

    public updateLoop(): void {
        let areChanges = false;
        this.animatedVertices.forEach((av, i) => {
            let differenceX = (this.vertices[i].x - av.x) / 10;
            let differenceY = (this.vertices[i].y - av.y) / 10;
            let moveByX = differenceX;
            let moveByY = differenceY;
            av.x += moveByX < differenceX ? moveByX : differenceX;
            av.y += moveByY < differenceY ? moveByY : differenceY;

            if (differenceY > 0 || differenceX > 0)
                areChanges = true;
        });

        this.update(areChanges);
        // this.autoResizeTextDirective?.update();

        this._lines.forEach(x => x.line = Line.pathFromSetup(x.setup));
    }

    public addLine(setup: LineSetup): void {
        this.lineSetups.push(setup);
        this._lines.push({ line: Line.pathFromSetup(setup), setup: setup });
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

