/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

declare const ym: any;

@Injectable({ providedIn: 'root' })
export class YandexMetrikaService {
  hit(url: string) {
    ym(109305966, 'hit', url);
  }

  goal(goalName: string, params?: Record<string, any>) {
    ym(109305966, 'reachGoal', goalName, params);
  }
}
