import { Injectable, inject, signal, computed } from '@angular/core';
import { ScheduleTab, OutboundFlightEntry, InboundFlightEntry } from '../../core/models';
import { AirportsService } from '../../core/services';
import { TuiNotificationService } from '@taiga-ui/core';

const PAGE_SIZE = 25;

@Injectable()
export class AirportScheduleService {
  protected readonly notifications = inject(TuiNotificationService);
  private airportsService = inject(AirportsService);

  private currentCode = signal<string | null>(null);
  readonly activeTab = signal<ScheduleTab>('outbound');
  readonly outboundItems = signal<OutboundFlightEntry[]>([]);
  readonly outboundTotal = signal(0);
  readonly inboundItems = signal<InboundFlightEntry[]>([]);
  readonly inboundTotal = signal(0);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly visibleCount = computed(() =>
    this.activeTab() === 'outbound' ? this.outboundItems().length : this.inboundItems().length,
  );

  readonly visibleTotal = computed(() =>
    this.activeTab() === 'outbound' ? this.outboundTotal() : this.inboundTotal(),
  );
  readonly hasMore = computed(() => this.visibleCount() < this.visibleTotal());

  init(code: string) {
    if (this.currentCode() === code) return;
    this.reset();
    this.currentCode.set(code);
    void this.loadInitial();
  }

  switchTab(tab: ScheduleTab) {
    if (this.activeTab() === tab) return;
    this.activeTab.set(tab);

    const list = tab === 'outbound' ? this.outboundItems() : this.inboundItems();
    if (list.length === 0) {
      void this.loadInitial();
    }
  }

  async loadMore() {
    if (this.isLoading() || !this.hasMore()) return;
    await this.loadPage(this.visibleCount());
  }

  private async loadInitial() {
    await this.loadPage(0);
  }

  private async loadPage(offset: number) {
    const code = this.currentCode();
    if (!code) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      if (this.activeTab() === 'outbound') {
        const data = await this.airportsService.getOutboundFlights(code, {
          limit: PAGE_SIZE,
          offset,
        });
        this.outboundTotal.set(data.total);
        if (offset === 0) {
          this.outboundItems.set(data.items);
        } else {
          this.outboundItems.update((current) => [...current, ...data.items]);
        }
      } else {
        const data = await this.airportsService.getInboundFlights(code, {
          limit: PAGE_SIZE,
          offset,
        });
        this.inboundTotal.set(data.total);
        if (offset === 0) {
          this.inboundItems.set(data.items);
        } else {
          this.inboundItems.update((current) => [...current, ...data.items]);
        }
      }
    } catch (error) {
      console.error('Failed to load schedule', error);
      this.error.set('Failed to load schedule');
      this.notifications
        .open('Failed to load schedule', {
          label: 'Error',
          autoClose: 4000,
        })
        .subscribe();
    } finally {
      this.isLoading.set(false);
    }
  }

  private reset() {
    this.outboundItems.set([]);
    this.outboundTotal.set(0);
    this.inboundItems.set([]);
    this.inboundTotal.set(0);
    this.activeTab.set('outbound');
    this.error.set(null);
  }
}
