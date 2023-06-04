import { v2d } from "../v2d";
import { Circle } from "./circle";
import { Triangle } from "./triangle";
import { Square } from "./square";
import { Point } from "./point";

export abstract class Figure {
  public label!: string;
  public isFixed!: boolean;
  public isDisabled!: boolean;

  protected constructor(label: string) {
    this.label = label;
  }

  public abstract get center(): v2d;

  public abstract get animatedCenter(): v2d;

  public abstract get vertices(): v2d[];

  protected abstract get animatedVertices(): v2d[];

  public abstract moveBy(by: v2d): void;

  public abstract moveTo(to: v2d): void;

  public updatePosition(): void {
    this.animatedVertices.forEach((av, i) => {
      av.x += (this.vertices[i].x - av.x) / 20;
      av.y += (this.vertices[i].y - av.y) / 20;
    });
  }

  public static isBetween(start: v2d, end: v2d, pointBetween: v2d): boolean {
    let cross = (pointBetween.y - start.y) * (end.x - start.x) - (pointBetween.x - start.x) * (end.y - start.y)
    if (Math.abs(cross) > Number.EPSILON)
      return false;

    let dot = (pointBetween.x - start.x) * (end.x - start.x) + (pointBetween.y - start.y) * (end.y - start.y)
    if (dot < 0)
      return false;

    let squaredLength = (end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y)
    return dot <= squaredLength;
  }

  public static nearestPointOnLine(linePnt: v2d, lineDir: v2d, pnt: v2d): v2d {
    lineDir.normalize();
    let v = pnt.subtract(linePnt);
    let d = v2d.dot(v, lineDir);
    return linePnt.add(lineDir).multiply(d);
  }

  public static doCollideCircleCircle(circle0: Circle, circle1: Circle): boolean {
    let x = circle0.center.x - circle1.center.x;
    let y = circle0.center.y - circle1.center.y;
    let result = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < (circle0.radius + circle1.radius);
    return result;
  }

  public static doCollideTriangleCircle(triangle: Triangle, circle: Circle): boolean {
    let isAnyInside = triangle.vertices.some(tv => v2d.distance(tv, circle.center) < circle.radius);
    let verticesPairs = [[triangle.v1, triangle.v2], [triangle.v2, triangle.v3], [triangle.v1, triangle.v3]];

    if (isAnyInside) return true;

    let isAnyColliding = verticesPairs.some(pair => {
      let pointOnLine = Figure.nearestPointOnLine(pair[0], pair[1].subtract(pair[0]), circle.center);
      let isPointBetween = Figure.isBetween(pair[0], pair[1], pointOnLine);
      return isPointBetween;
    });

    return isAnyColliding;
  }

  public static doCollideTriangleTriangle(triangle0: Triangle, triangle1: Triangle): boolean {
    let is0in1 = triangle0.vertices.some(v => triangle1.isPointInTriangle(v));
    let is1in0 = triangle1.vertices.some(v => triangle0.isPointInTriangle(v));

    return is1in0 || is0in1;
  }

  public static doCollideTriangleSquare(triangle: Triangle, square: Square): boolean {
    let is0in1 = triangle.vertices.some(v => square.isPointInSquare(v));
    let is1in0 = square.vertices.some(v => triangle.isPointInTriangle(v));

    return is1in0 || is0in1;
  }

  public static doCollideSquareSquare(square0: Square, square1: Square): boolean {
    let is0in1 = square0.vertices.some(v => square1.isPointInSquare(v));
    let is1in0 = square1.vertices.some(v => square0.isPointInSquare(v));

    return is1in0 || is0in1;
  }

  public static doCollideSquarePoint(figure: Square, figure2: Point) {
    let result = figure.isPointInSquare(figure2.center);
    console.log(result);
    return result;
  }
}
