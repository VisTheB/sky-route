import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield, TuiInput, TuiLoader } from '@taiga-ui/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AirportsListService } from './airports-list.service';
import { CountryGroupComponent } from './components/country-group-component/country-group-component';

@Component({
  selector: 'app-airports-list-page-component',
  imports: [ReactiveFormsModule, TuiTextfield, TuiInput, TuiLoader, CountryGroupComponent],
  templateUrl: './airports-list-page-component.html',
  styleUrl: './airports-list-page-component.scss',
  providers: [AirportsListService],
})
export class AirportsListPageComponent implements OnInit {
  protected AirListService = inject(AirportsListService);
  protected searchControl = new FormControl('', { nonNullable: true });

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.AirListService.setSearchQuery(value));
  }

  ngOnInit() {
    void this.AirListService.load();
  }
}
