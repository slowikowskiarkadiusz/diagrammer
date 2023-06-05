import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import { FigureWithLabelDirective } from './figure-with-label.directive';

@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    FigureWithLabelDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
