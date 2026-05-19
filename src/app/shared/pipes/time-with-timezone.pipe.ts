import { Pipe, PipeTransform } from '@angular/core';

// Извлекает локальное время из ISO-строки с часовым поясом, не конвертируя его в часовой пояс пользователя.
// Это нужно для расписаний рейсов, где время вылета/прилёта должно отображаться в локальном поясе соответствующего аэропорта.
@Pipe({
  name: 'timeWithTz',
  standalone: true,
})
export class TimeWithTimezonePipe implements PipeTransform {
  private static readonly MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  transform(
    iso: string | null | undefined,
    format: 'time' | 'month' | 'monthtime' | 'yearmonthtime' = 'time',
  ): string {
    if (!iso) return '';

    const parsed = this.parseIso(iso);
    if (!parsed) return '';

    const { year, month, day, hour, minute } = parsed;
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    const monthLabel = TimeWithTimezonePipe.MONTHS[month - 1] ?? '';

    switch (format) {
      case 'time':
        return `${hh}:${mm}`;
      case 'month':
        return monthLabel;
      case 'monthtime':
        return `${day} ${monthLabel}, ${hh}:${mm}`;
      case 'yearmonthtime':
        return `${day} ${monthLabel}, ${year} ${hh}:${mm}`;
    }
  }

  private parseIso(iso: string): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  } | null {
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
    if (!match) return null;

    return {
      year: parseInt(match[1], 10),
      month: parseInt(match[2], 10),
      day: parseInt(match[3], 10),
      hour: parseInt(match[4], 10),
      minute: parseInt(match[5], 10),
    };
  }
}
