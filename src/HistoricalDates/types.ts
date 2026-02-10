export interface EventItem {
  year: number;
  description: string;
}

export interface TimePeriod {
  id: number;
  title: string;
  startYear: number;
  endYear: number;
  events: EventItem[];
}