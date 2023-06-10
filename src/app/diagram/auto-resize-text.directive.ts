import { AfterViewInit, Directive, Input, ViewContainerRef } from '@angular/core';
import { Figure } from "./figures/figure";

@Directive({
    selector: '[autoResizeText]'
})
export class AutoResizeTextDirective implements AfterViewInit {
    @Input() public maxFontSize: number = 16;
    @Input() public figure?: Figure;

    private originalFontSize: number = 16;
    private _nativeElement?: HTMLElement;
    private fontSize: number = 16;
    private animatedFontSize: number = 1;

    private get nativeElement(): HTMLElement {
        return this._nativeElement ??= this.viewContainerRef.element.nativeElement as HTMLElement;
    }

    constructor(private viewContainerRef: ViewContainerRef) {
    }

    public ngAfterViewInit(): void {
        this.originalFontSize = parseInt(window.getComputedStyle(this.nativeElement).fontSize.replace('px', ''));
        if (this.figure)
            this.figure.autoResizeTextDirective = this;
    }

    public update(): void {
        this.resize();
    }

    private resize(): void {
        let lineHeight = parseInt(window.getComputedStyle(this.nativeElement).lineHeight.replace('px', ''));
        if (isNaN(lineHeight))
            lineHeight = 1;
        let height = this.nativeElement.offsetHeight;

        let lines = height / lineHeight;
        const maxLines = 3;
        lines = lines < maxLines ? maxLines : lines;
        this.fontSize = ((maxLines / lines) * this.originalFontSize);

        let difference = this.fontSize - this.animatedFontSize;
        if (difference < 0.1) return;
        this.animatedFontSize = this.fontSize;

        // this.animatedFontSize += (this.fontSize - this.animatedFontSize) / 20;

        this.figure!.fontSize = this.animatedFontSize + 'px';
        this.figure!.lineHeight = this.animatedFontSize + 'px';
    }
}
