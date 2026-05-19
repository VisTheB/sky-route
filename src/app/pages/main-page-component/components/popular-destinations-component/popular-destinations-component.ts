import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiDay } from '@taiga-ui/cdk';
import { NowService, AnalyticsService } from '../../../../core/services';

type Card = {
  title: string;
  image: string;
  departure_offset: number;
  max_connections: string;
};

@Component({
  selector: 'app-popular-destinations-component',
  imports: [RouterLink],
  templateUrl: './popular-destinations-component.html',
  styleUrl: './popular-destinations-component.scss',
})
export class PopularDestinationsComponent implements OnInit, OnDestroy {
  private nowService = inject(NowService);
  private analytics = inject(AnalyticsService);

  protected onCardClick(title: string) {
    this.analytics.popularDestinationClicked(title);
  }
  date = signal<TuiDay | null>(null);
  private readonly imgPath = '/popular/';
  private autoplayId: ReturnType<typeof setInterval> | null = null;
  private readonly autoplayDelay = 4000;
  readonly visibleCount = 3;
  readonly activeIndex = signal(0);

  private readonly rawCards: Card[] = [
    {
      title: 'Sochi',
      image: this.imgPath + 'sochi.jpg',
      departure_offset: 7,
      max_connections: '0',
    },
    {
      title: 'Saint Petersburg',
      image: this.imgPath + 'piter.jpg',
      departure_offset: 7,
      max_connections: '0',
    },
    {
      title: 'Beijing',
      image: this.imgPath + 'beijing.jpg',
      departure_offset: 31,
      max_connections: '2',
    },
    {
      title: 'Paris',
      image: this.imgPath + 'paris.jpg',
      departure_offset: 32,
      max_connections: '2',
    },
    {
      title: 'Rome',
      image: this.imgPath + 'rome.jpg',
      departure_offset: 32,
      max_connections: '2',
    },
  ];

  readonly cards = computed(() => {
    const baseDate = this.date();
    return this.rawCards.map((card) => ({
      ...card,
      departure: baseDate ? baseDate.append({ day: card.departure_offset }).toJSON() : null,
    }));
  });

  ngOnInit() {
    this.loadDate();
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  private async loadDate() {
    try {
      const now = await this.nowService.getNow();
      this.date.set(TuiDay.fromLocalNativeDate(now));
    } catch (error) {
      console.error('Failed to fetch /now', error);
      this.date.set(TuiDay.currentLocal());
    }
  }

  private startAutoplay() {
    this.autoplayId = setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }

  private stopAutoplay() {
    if (this.autoplayId !== null) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }

  next() {
    const total = this.rawCards.length;
    this.activeIndex.update((i) => (i + 1) % total);
  }

  prev() {
    const total = this.rawCards.length;
    this.activeIndex.update((i) => (i - 1 + total) % total);
  }

  goTo(index: number) {
    this.activeIndex.set(index);
    this.stopAutoplay();
    this.startAutoplay();
  }

  readonly visibleCards = computed(() => {
    const all = this.cards();
    const start = this.activeIndex();
    const result = [];
    for (let i = 0; i < this.visibleCount; i++) {
      result.push(all[(start + i) % all.length]);
    }
    return result;
  });

  trackByTitle(_index: number, card: { title: string }) {
    return card.title;
  }
}
