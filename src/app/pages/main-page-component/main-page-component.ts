import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section-component/hero-section-component';
import { PopularDestinationsComponent } from './components/popular-destinations-component/popular-destinations-component';

@Component({
  selector: 'app-main-page-component',
  imports: [HeroSectionComponent, PopularDestinationsComponent],
  templateUrl: './main-page-component.html',
  styleUrl: './main-page-component.scss',
})
export class MainPageComponent {}
