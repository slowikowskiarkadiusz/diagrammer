import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { v2d } from "./v2d";
import { Figure } from "./figures/figure";
import { Circle } from "./figures/circle";
import { Polygon } from "./figures/polygon";
import { Point } from "./figures/point";
import { processLabel } from "../utils";

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit {
  @ViewChild('board') public board?: ElementRef<HTMLElement>;

  public figures: Figure[] = [];

  public previousMousePosition: v2d = new v2d(0, 0);
  public mousePosition: v2d = new v2d(0, 0);

  private draggedNode?: Figure;
  private boardSize: v2d = new v2d(0, 0);
  private draggingNodeInterpolation?: number;

  constructor() {
    let names = [
      "AcubizService",
      "Billing Domain Service",
      "BlobService (BIC)",
      "CarloService (BIC)",
      "Co2 Domain Service",
      "Co2Service (CarLoService)",
      "CompassService (BIC)",
      "DipService (BIC)",
      "EdiService (BIC)",
      "EgenciaService",
      "Employee Domain Service",
      "EmployeeService",
      "ETWCalculatorService",
      "FlexService (BIC)",
      "FtpService (BIC)",
      "HttpService (BIC)",
      "IES Service",
      "JsonService (BIC)",
      "MagayaService (BIC)",
      "MediusService (CarLoService)",
      "MediusService (PostingService)",
      "MediusService (ReservationResponseService)",
      "MediusService (ReservationService)",
      "Package Status Domain Service",
      "Package Status Service (Flex Service)",
      "PackageStatusService (CarLoService)",
      "Reservation Domain Service",
      "ReservationPosting Domain Service",
      "ReservationResponse Domain Service",
      "Revenue Domain Service",
      "Revenue Service (DWH)",
      "RoutingService (BIC)",
      "SharepointService (BIC)",
      "Shipping Order Domain Service",
      "Shipping Order Service (Flex Service)",
      "ShippingOrderService (BIC)",
      "StandardModelService (BIC)",
      "Status Receiver Service",
      "Warehouse Purchase Order Domain Service",
      "WarehouseOrderService (BIC)",
      "WebhookService (BIC)",
      "XmlService (BIC)",
    ];

    for (let i = 0; i < names.length; i++) {
      this.figures.push(new Circle(processLabel(names[i]), new v2d(400, 400), 50));
    }
  }

  public ngAfterViewInit(): void {
    this.boardSize.x = this.board?.nativeElement.clientWidth ?? 0;
    this.boardSize.y = this.board?.nativeElement.clientHeight ?? 0;
    setInterval(() => {
      for (const figure0 of this.figures)
        for (const figure1 of this.figures) {
          if (figure0.isDisabled || figure1.isDisabled) continue;
          if (figure0 != figure1) {
            let isCircleAndCircle = this.isCircle(figure0) && this.isCircle(figure1) && (figure0 as Circle).isIntersectingWithCircle(figure1 as Circle);
            let isPolygonAndPolygon = this.isPolygon(figure0) && this.isPolygon(figure1) && (figure0 as Polygon).isPolygonInside(figure1 as Polygon);
            let isPolygonAndCircle = this.isPolygon(figure0) && this.isCircle(figure1) && (figure0 as Polygon).isCircleInside(figure1 as Circle);
            let isPolygonAndPoint = this.isPolygon(figure0) && this.isPoint(figure1) && (figure0 as Polygon).isPointInside(figure1.center);

            if (isCircleAndCircle || isPolygonAndPolygon || isPolygonAndPoint || isPolygonAndCircle)
              this.collide(figure0, figure1);
          }
        }

    }, 10);

    setInterval(() => {
      this.figures.forEach(f => f.updatePosition());
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
    let differenceMagnitude = new v2d(
      figure0.center.x - figure1.center.x,
      figure0.center.y - figure1.center.y,
    );

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

  public onScroll($event: Event) {
    // console.log($event);
  }

  public onMouseDown($event: MouseEvent, figure: Figure) {
    this.draggedNode = figure;
    this.draggedNode.isDisabled = true;
    this.draggingNodeInterpolation = setInterval(() => {
      figure.moveTo(this.mousePosition);
      this.previousMousePosition = this.mousePosition;
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
