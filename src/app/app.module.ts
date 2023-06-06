import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import { AutoResizeTextDirective } from "./diagram/auto-resize-text.directive";

@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    AutoResizeTextDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
