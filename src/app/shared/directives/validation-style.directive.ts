import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appValidationStyle]',
  standalone: true,
})
export class ValidationStyleDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl,
  ) {}
  ngOnInit(): void {
    this.control.statusChanges?.subscribe(() => {
      if (this.control.dirty || this.control.touched) {
        if (this.control.invalid) {
          this.renderer.addClass(this.el.nativeElement, 'border-red-500');
          this.renderer.removeClass(this.el.nativeElement, 'border-gray-50');
          this.renderer.removeClass(this.el.nativeElement, 'border-green-500');
          return;
        }
        this.renderer.addClass(this.el.nativeElement, 'border-green-500');
        this.renderer.removeClass(this.el.nativeElement, 'border-gray-50');
        this.renderer.removeClass(this.el.nativeElement, 'border-red-500');
      }
    });
  }
}
