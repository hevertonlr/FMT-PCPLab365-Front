import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appValidationStyle]',
  standalone: true,
})
export class ValidationStyleDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl,
  ) {}
  @HostListener('input') onInputChange() {
    this.updateStyles();
  }

  @HostListener('blur') onBlur() {
    this.updateStyles();
  }

  private updateStyles() {
    const control = this.control.control;
    if (!control) return;
    if (!control.invalid || !control.valid) {
      this.renderer.removeClass(this.el.nativeElement, 'invalid');
      this.renderer.removeClass(this.el.nativeElement, 'valid');
    }

    if (control.invalid && (control.dirty || control.touched)) {
      this.renderer.addClass(this.el.nativeElement, 'invalid');
      this.renderer.removeClass(this.el.nativeElement, 'valid');
    } else if (control.valid && (control.dirty || control.touched)) {
      this.renderer.addClass(this.el.nativeElement, 'valid');
      this.renderer.removeClass(this.el.nativeElement, 'invalid');
    }
  }
}
