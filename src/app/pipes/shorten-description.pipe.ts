import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenDescription',
  standalone: true
})
export class ShortenDescriptionPipe implements PipeTransform {
  // 5) Pipes
  transform(value: string, limit: number = 50): string {
    if (!value) {
      return '';
    }
    if (value.length <= limit) {
      return value;
    }
    return value.substring(0, limit) + '...';
  }
}