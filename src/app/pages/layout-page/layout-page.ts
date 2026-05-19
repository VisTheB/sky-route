import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './layout-page.html',
  styleUrl: './layout-page.scss',
})
export class LayoutPage {}
