import { Component, computed, inject, input } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { DecimalPipe } from '@angular/common';
import { FareConditions, RouteOption } from '../../../../core/models';
import { DurationPipe, TimeWithTimezonePipe } from '../../../../shared/pipes';
import {
  RouteDetailsDialogComponent,
  RouteDetailsDialogData,
} from '../route-details-dialog-component/route-details-dialog-component';

@Component({
  selector: 'app-route-card-component',
  imports: [TuiCurrencyPipe, DecimalPipe, DurationPipe, TimeWithTimezonePipe],
  templateUrl: './route-card-component.html',
  styleUrl: './route-card-component.scss',
})
export class RouteCardComponent {
  private dialogs = inject(TuiDialogService);

  route = input.required<RouteOption>();
  fareClass = input.required<FareConditions>();

  protected firstSegment = computed(() => this.route().segments[0]);
  protected lastSegment = computed(() => {
    const segments = this.route().segments;
    return segments[segments.length - 1];
  });

  protected connectionsLabel = computed(() => {
    const count = this.route().connections;
    if (count === 0) return 'Direct';
    if (count === 1) return '1 stop';
    return `${count} stops`;
  });

  protected onSelect() {
    const data: RouteDetailsDialogData = {
      route: this.route(),
      fareClass: this.fareClass(),
      connectionsLabel: this.connectionsLabel(),
      firstSegment: this.firstSegment(),
      lastSegment: this.lastSegment(),
    };
    this.dialogs
      .open<void>(new PolymorpheusComponent(RouteDetailsDialogComponent), {
        size: 'l',
        data,
      })
      .subscribe();
  }
}
