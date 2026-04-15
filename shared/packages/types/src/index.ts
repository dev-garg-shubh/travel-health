export type FlightHealthRequest = {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
};

export type SourcePayload = {
  flightNumber: string;
  source: string;
  fetchedAt: string;
  data: Record<string, unknown>;
};

export type HealthScoreBreakdown = {
  factor: string;
  weight: number;
  score: number;
  reason: string;
};

export type HealthScoreResult = {
  id: string;
  flightNumber: string;
  overallScore: number;
  computedAt: string;
  breakdown: HealthScoreBreakdown[];
};

export type ScoreEvent =
  | { type: "flight.requested"; payload: FlightHealthRequest }
  | { type: "source.data.fetched"; payload: SourcePayload }
  | { type: "health.score.computed"; payload: HealthScoreResult };

export const SCORE_EVENTS_EXCHANGE = "travel_health.events";
export const SCORE_EVENTS_ROUTING_KEYS = {
  flightRequested: "flight.requested",
  sourceDataFetched: "source.data.fetched",
  healthScoreComputed: "health.score.computed"
} as const;
