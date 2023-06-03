import { v2d } from "../v2d";
import { Circle } from "./circle";
import { Triangle } from "./triangle";
import { Square } from "./square";

export abstract class Figure {
  public label!: string;
  public isFixed!: boolean;
  public isDisabled!: boolean;

  protected constructor(label: string) {
    this.label = label;
  }

  public abstract get center(): v2d;

  public abstract move(by: v2d, boardSize: v2d): void;

  public asCircle(): Circle | null {
    if (this instanceof Circle)
      return this as Circle;

    return null;
  }

  public asSquare(): Square | null {
    if (this instanceof Square)
      return this as Square;

    return null;
  }

  public asTriangle(): Triangle | null {
    if (this instanceof Triangle)
      return this as Triangle;

    return null;
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
    let isAnyOutside = triangle.vertices.some(tv => v2d.distance(tv, circle.center) < circle.radius);
    let verticesPairs = [[triangle.v1, triangle.v2], [triangle.v2, triangle.v3], [triangle.v1, triangle.v3]];

    let isAnyColliding = verticesPairs.some(pair => {
      let pointOnLine = Figure.nearestPointOnLine(pair[0], pair[1].subtract(pair[0]), circle.center);
      let isPointBetween = Figure.isBetween(pair[0], pair[1], pointOnLine);
      return isPointBetween;
    });

    return false;
  }

}
