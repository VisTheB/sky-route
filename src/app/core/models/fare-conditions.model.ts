export enum FareConditions {
  Economy = 'Economy',
  Comfort = 'Comfort',
  Business = 'Business',
}

export const FARE_CONDITIONS_LABELS: Record<FareConditions, string> = {
  [FareConditions.Economy]: 'Economy',
  [FareConditions.Comfort]: 'Comfort',
  [FareConditions.Business]: 'Business',
};
