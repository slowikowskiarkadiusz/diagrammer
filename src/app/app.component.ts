import { Component } from '@angular/core';
import { Circle } from "./diagram/figures/circle";
import { v2d } from "./diagram/v2d";
import { processLabel } from "./utils";
import { Figure } from "./diagram/figures/figure";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'diagrammer';
  public figures: Figure[] = [];

  constructor() {
    let names = [
      "AcubizService",
      "Billing Domain Service",
      "BlobService (BIC)",
      "CarloService (BIC)",
      "Co2 Domain Service",
      "Co2Service (CarLoService)",
      // "CompassService (BIC)",
      // "DipService (BIC)",
      // "EdiService (BIC)",
      // "EgenciaService",
      // "Employee Domain Service",
      // "EmployeeService",
      // "ETWCalculatorService",
      // "FlexService (BIC)",
      // "FtpService (BIC)",
      // "HttpService (BIC)",
      // "IES Service",
      // "JsonService (BIC)",
      // "MagayaService (BIC)",
      // "MediusService (CarLoService)",
      // "MediusService (PostingService)",
      // "MediusService (ReservationResponseService)",
      // "MediusService (ReservationService)",
      // "Package Status Domain Service",
      // "Package Status Service (Flex Service)",
      // "PackageStatusService (CarLoService)",
      // "Reservation Domain Service",
      // "ReservationPosting Domain Service",
      // "ReservationResponse Domain Service",
      // "Revenue Domain Service",
      // "Revenue Service (DWH)",
      // "RoutingService (BIC)",
      // "SharepointService (BIC)",
      // "Shipping Order Domain Service",
      // "Shipping Order Service(Flex Service)",
      // "ShippingOrderService (BIC)",
      // "StandardModelService (BIC)",
      // "Status Receiver Service",
      // "Warehouse Purchase Order Domain Service",
      // "WarehouseOrderService (BIC)",
      // "WebhookService (BIC)",
      // "XmlService (BIC)",
    ];

    this.figures.push(new Circle("Warehouse Purchase Order Domain Service", new v2d(400, 550), 75, { fillColor: 'blue' }));
    this.figures[0].isFixed = false;
    this.figures[0].isDraggable = true;

    for (let i = 0; i < names.length; i++) {
      let figure = new Circle(processLabel(names[i]), new v2d(400, 250), 50, { fillColor: 'green' });
      this.figures.push(figure);
      figure.addLine({ from: figure, to: this.figures[0], toOrigin: 'top' });
    }

    for (let i = 0; i < names.length; i++) {
      let figure = new Circle(processLabel(names[i]), new v2d(400, 850), 50, { fillColor: 'green' });
      this.figures.push(figure);
      figure.addLine({ from: figure, to: this.figures[0], toOrigin: 'bottom' });
    }
  }

  public onFigureClicked(figure: Figure) {
    (figure as Circle).radius = (figure as Circle).radius === 50 ? 75 : 50;
  }
}
