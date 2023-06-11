import { Figure, FigureOptions } from "./figure";
import { v2d } from "../v2d";
import { Circle } from "./circle";

export class Polygon extends Figure {
    public vs!: v2d[];
    public animatedVs!: v2d[];

    public constructor(label: string, vertices: v2d[], opt: FigureOptions) {
        super(label, opt);

        this.vs = vertices.map(x => x.copy());
        this.animatedVs = vertices.map(x => x.copy());
    }

    protected get minBounds(): v2d {
        let min: v2d = new v2d(this.vertices.reduce((p, c) => p.x < c.x ? p : c).x, this.vertices.reduce((p, c) => p.y < c.y ? p : c).y);
        return min;
    }

    protected get maxBounds(): v2d {
        let max: v2d = new v2d(this.vertices.reduce((p, c) => p.x > c.x ? p : c).x, this.vertices.reduce((p, c) => p.y > c.y ? p : c).y);
        return max;
    }

    protected get animatedMinBounds(): v2d {
        let min: v2d = new v2d(this.animatedVertices.reduce((p, c) => p.x < c.x ? p : c).x, this.animatedVertices.reduce((p, c) => p.y < c.y ? p : c).y);
        return min;
    }

    protected get animatedMaxBounds(): v2d {
        let max: v2d = new v2d(this.animatedVertices.reduce((p, c) => p.x > c.x ? p : c).x, this.animatedVertices.reduce((p, c) => p.y > c.y ? p : c).y);
        return max;
    }

    public moveBy(by: v2d): void {
        this.vs = this.vs.map(x => x.add(by));
    }

    public moveTo(to: v2d): void {
        this.vs = this.vs.map(v => v.subtract(this.center).add(to));
    }

    public instantMoveTo(to: v2d): void {
        this.moveTo(to);

        this.animatedVs = [...this.vs];
    }

    public get size(): v2d {
        //TODO
        return new v2d(0, 0);
    }

    protected get animatedSize(): v2d {
        //TODO
        return new v2d(0, 0);
    }

    protected get animatedVertices(): v2d[] {
        return this.animatedVs;
    }

    public get vertices(): v2d[] {
        return this.vs;
    }

    public get center(): v2d {
        let arr = this.vertices;
        let result = new v2d(0, 0);
        arr.forEach(v => result = result.add(v));
        result = result.divide(arr.length);

        return result;
    }

    public get animatedCenter(): v2d {
        let arr = this.animatedVertices;
        let result = new v2d(0, 0);
        arr.forEach(v => result = result.add(v));
        result = result.divide(arr.length);

        return result;
    }

    public get svgPoints(): string {
        let result = this.vertices.map(v => `${ v.x },${ v.y }`).join(' ');
        return result;
    }

    public get animatedSvgPoints(): string {
        let result = this.animatedVertices.map(v => `${ v.x },${ v.y }`).join(' ');
        return result;
    }

    protected update(areChanges: boolean): boolean {
        return false;
    }

    public isPointInside(point: v2d): boolean {
        let vertices = this.vertices;

        let minX = vertices.reduce((p, c) => (p.x < c.x) ? p : c).x - 1;

        let intersects: boolean[] = [];

        for (let i = 0; i < vertices.length; i++) {
            let ii = (i + 1) % vertices.length;
            intersects.push(this.doIntersect(new v2d(minX, point.y), point, vertices[i], vertices[ii]));
        }

        let howManyIntersects = intersects.filter(x => x).length;

        return howManyIntersects > 0 && howManyIntersects % 2 == 1;
    }

    public isPolygonInside(polygon: Polygon): boolean {
        let result = polygon.vertices.some(x => this.isPointInside(x));
        return result;
    }

    public doesCircleIntersect(circle: Circle): boolean {
        let isAnyInside = this.vertices.some(tv => v2d.distance(tv, circle.center) < circle.radius);

        if (isAnyInside) return true;

        let vertices = this.vertices;
        let verticesPairs: v2d[][] = [];

        for (let i = 0; i < vertices.length; i++) {
            let ii = (i + 1) % vertices.length;
            verticesPairs.push([vertices[i], vertices[ii]]);
        }

        let isAnyColliding = verticesPairs.some(pair => {
            let pointOnLine = this.getClosestPoint(pair[0], pair[1], circle.center);
            let isPointBetween = this.isBetween(pair[0], pair[1], pointOnLine);
            return isPointBetween && v2d.distance(pointOnLine, circle.center) < circle.radius;
        });

        return isAnyColliding;
    }

    private getClosestPoint(A: v2d, B: v2d, P: v2d): v2d {

        let a_to_p = [P.x - A.x, P.y - A.y];
        let a_to_b = [B.x - A.x, B.y - A.y];
        let atb2 = Math.pow(a_to_b[0], 2) + Math.pow(a_to_b[1], 2)
        let atp_dot_atb = a_to_p[0] * a_to_b[0] + a_to_p[1] * a_to_b[1]
        let t = atp_dot_atb / atb2;

        return new v2d(A.x + a_to_b[0] * t, A.y + a_to_b[1] * t);
    }

    private isBetween(start: v2d, end: v2d, pointBetween: v2d): boolean {
        let cross = (pointBetween.y - start.y) * (end.x - start.x) - (pointBetween.x - start.x) * (end.y - start.y)
        if (Math.abs(cross) > Number.EPSILON)
            return false;

        let dot = (pointBetween.x - start.x) * (end.x - start.x) + (pointBetween.y - start.y) * (end.y - start.y)
        if (dot < 0)
            return false;

        let squaredLength = (end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y)
        return dot <= squaredLength;
    }

    private ccw(A: v2d, B: v2d, C: v2d): boolean {
        return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    }

    private doIntersect(p1start: v2d, p1end: v2d, p2start: v2d, p2end: v2d): boolean {
        return this.ccw(p1start, p2start, p2end) != this.ccw(p1end, p2start, p2end) && this.ccw(p1start, p1end, p2start) != this.ccw(p1start, p1end, p2end)
    }
}
