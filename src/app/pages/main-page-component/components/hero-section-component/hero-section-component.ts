import { Component } from '@angular/core';
import { SearchFormComponent } from '../../../../shared';

@Component({
  selector: 'app-hero-section-component',
  imports: [SearchFormComponent],
  templateUrl: './hero-section-component.html',
  styleUrl: './hero-section-component.scss',
})
export class HeroSectionComponent {}
