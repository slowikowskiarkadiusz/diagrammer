import { AfterViewInit, Directive, Input, ViewContainerRef } from '@angular/core';
import { Figure } from "./diagram/figures/figure";

@Directive({
  selector: '[autoResizeText]'
})
export class AutoResizeTextDirective implements AfterViewInit {
  @Input() public maxFontSize: number = 16;
  @Input() public figure?: Figure;

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  public ngAfterViewInit(): void {
    this.update();

    if (this.figure)
      this.figure.autoResizeTextDirective = this;
  }

  public update(): void {
    let native = this.viewContainerRef.element.nativeElement as HTMLElement;

    let fontSize = parseInt(window.getComputedStyle(native).fontSize.replace('px', ''));

    while (native.offsetHeight < native.parentElement!.offsetHeight || native.offsetWidth < native.parentElement!.offsetWidth) {
      native.style.fontSize = (fontSize += 0.5) + 'px';
    }

    while (native.offsetHeight > native.parentElement!.offsetHeight || native.offsetWidth > native.parentElement!.offsetWidth) {
      native.style.fontSize = (fontSize -= 0.5) + 'px';
    }

    if (fontSize > this.maxFontSize)
      native.style.fontSize = this.maxFontSize + 'px';
  }
}
