import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-not-found-page-component',
  imports: [RouterLink, TuiButton],
  templateUrl: './not-found-page-component.html',
  styleUrl: './not-found-page-component.scss',
})
export class NotFoundPageComponent {}
