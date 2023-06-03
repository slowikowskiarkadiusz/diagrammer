export class v2d {
  public x!: number;
  public y!: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static copy(from: v2d): v2d {
    return new v2d(from.x, from.y);
  }

  public add(v: v2d): v2d {
    return new v2d(this.x + v.x, this.y + v.y);
  }

  public subtract(v: v2d): v2d {
    return new v2d(this.x - v.x, this.y - v.y);
  }

  public multiply(scalar: number): v2d {
    return new v2d(this.x * scalar, this.y * scalar);
  };

  public divide(scalar: number): v2d {
    return new v2d(this.x / scalar, this.y / scalar);
  };

  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  public normalize(): v2d {
    let vec = new v2d(this.x, this.y);
    return v2d.copy(vec.divide(this.magnitude()));
  }

  public static dot(v1: v2d, v2: v2d): number {
    let a = [v1.x, v1.y];
    let b = [v2.x, v2.y];
    let result = a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
    return result;
  }

  public static distance(v1: v2d, v2: v2d): number {
    let result = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2));
    return result;
  }
}
