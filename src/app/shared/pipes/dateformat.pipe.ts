import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'dateformat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string, dateFormat: string = 'dd/MM/yyyy'): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, dateFormat);
  }
}
