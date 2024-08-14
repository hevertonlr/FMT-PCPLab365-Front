import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputFormatter]',
  standalone: true,
})
export class InputFormatterDirective {
  @Input('appInputFormatter') formatType: 'cep' | 'cpf' | 'phone';
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const input = this.el.nativeElement;
    input.value = this.formatValue(input.value);
  }

  private formatValue(value: string): string {
    value = value.replace(/\D/g, '');

    switch (this.formatType) {
      case 'cep':
        return this.formatCep(value);
      case 'cpf':
        return this.formatCpf(value);
      case 'phone':
        return this.formatPhone(value);
      default:
        return value;
    }
  }

  private formatCep = (value: string): string =>
    (value.length > 8 ? value.substring(0, 8) : value).replace(
      /^(\d{5})(\d{3})$/,
      '$1-$2',
    );

  private formatCpf = (value: string): string =>
    (value.length > 11 ? value.substring(0, 11) : value).replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      '$1.$2.$3-$4',
    );

  private formatPhone = (value: string): string =>
    (value.length > 11 ? value.substring(0, 11) : value).replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      '($1) $2-$3',
    );
}
