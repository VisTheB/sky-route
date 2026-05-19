import { Pipe, PipeTransform } from '@angular/core';

// Форматирует длительность в минутах в строку вида "1h 45m" или "45m".
@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    if (minutes === null || minutes === undefined || isNaN(minutes)) {
      return '';
    }

    const total = Math.max(0, Math.round(minutes));
    const hours = Math.floor(total / 60);
    const mins = total % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }
}
