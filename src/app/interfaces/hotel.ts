export interface Hotel {
  id?: number;
  name: string;
  regime: string;
  nights: number;
  detail: string;
  accommodationId?: number;
  soft_delete?: boolean;
}
