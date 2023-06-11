import { Figure, FigureOptions } from "./figure";
import { v2d } from "../v2d";

export class Point extends Figure {
    private _center!: v2d;
    public animated_center!: v2d;

    public constructor(label: string, center: v2d, opt: FigureOptions) {
        super(label, opt);

        this._center = center.copy();
        this.animated_center = center.copy();
    }

    protected get minBounds(): v2d {
        return new v2d(0, 0);
    }

    protected get maxBounds(): v2d {
        return new v2d(0, 0);
    }

    protected get animatedMinBounds(): v2d {
        return new v2d(0, 0);
    }

    protected get animatedMaxBounds(): v2d {
        return new v2d(0, 0);
    }

    public get center(): v2d {
        return this._center;
    }

    protected get animatedVertices(): v2d[] {
        return [this.animated_center];
    }

    public get vertices(): v2d[] {
        return [this._center];
    }

    public get animatedCenter(): v2d {
        return this.animated_center;
    }

    protected update(areChanges: boolean): boolean {
        return false;
    }

    public get size(): v2d {
        return new v2d(0, 0);
    }

    protected get animatedSize(): v2d {
        return new v2d(0, 0);
    }

    public moveBy(by: v2d): void {
        this._center = this.center.add(by);
    }

    public moveTo(to: v2d, instant: boolean = false): void {
        this._center = to;
        if (instant)
            this.animated_center = this._center;
    }

    public instantMoveTo(to: v2d): void {
        this.moveTo(to);

        this.animated_center = this._center;
    }
}
