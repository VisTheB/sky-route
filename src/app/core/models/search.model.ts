import { FareConditions } from './fare-conditions.model';

export type MaxConnectionsParam = '0' | '1' | '2' | '3' | 'unbound';

export const MAX_CONNECTIONS_VALUES: MaxConnectionsParam[] = ['0', '1', '2', '3', 'unbound'];

export const MAX_CONNECTIONS_LABELS: Record<MaxConnectionsParam, string> = {
  '0': 'Direct only',
  '1': 'Up to 1 stop',
  '2': 'Up to 2 stops',
  '3': 'Up to 3 stops',
  unbound: 'Any',
};

export type SearchParams = {
  from: string;
  to: string;
  date: string;
  class: FareConditions;
  max_connections: MaxConnectionsParam;
};
