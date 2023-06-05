import { AfterViewInit, Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appFigureWithLabel]'
})
export class FigureWithLabelDirective implements AfterViewInit {
  constructor(private viewContainerRef: ViewContainerRef) {
  }

  public ngAfterViewInit(): void {
    let native = this.viewContainerRef.element.nativeElement as HTMLElement;

    let fontSize = parseInt(window.getComputedStyle(native).fontSize.replace('px', ''));

    while (native.offsetHeight < native.parentElement!.offsetHeight || native.offsetWidth < native.parentElement!.offsetWidth) {
      native.style.fontSize = (fontSize += 0.5) + 'px';
    }

    while (native.offsetHeight > native.parentElement!.offsetHeight || native.offsetWidth > native.parentElement!.offsetWidth) {
      native.style.fontSize = (fontSize -= 0.5) + 'px';
    }
  }
}
