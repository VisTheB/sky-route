import { Component, computed, input, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { CountryView } from '../../../../core/models';

@Component({
  selector: 'app-country-group-component',
  imports: [TuiIcon, RouterLink],
  templateUrl: './country-group-component.html',
  styleUrl: './country-group-component.scss',
})
export class CountryGroupComponent {
  country = input.required<CountryView>();
  forceExpanded = input<boolean>(false);
  private userExpanded = signal(false);
  isExpanded = computed(() => this.forceExpanded() || this.userExpanded());

  toggle() {
    if (this.forceExpanded()) return;
    this.userExpanded.update((v) => !v);
  }
}
