export type MarvelImage = { path: string; extension: string };
export type MarvelUrl = { type: string; url: string };

export type Character = {
  id: number;
  name: string;
  description: string;
  modified: string;
  resourceURI: string;
  urls: MarvelUrl[];
  thumbnail: MarvelImage;
  comics: { available: number; items: { name: string; resourceURI: string }[] };
  series: { available: number; items: { name: string; resourceURI: string }[] };
  stories: { available: number; items: { name: string; resourceURI: string }[] };
  events: { available: number; items: { name: string; resourceURI: string }[] };
};

export type MarvelListResponse<T> = {
  code: number;
  status: string;
  data: { offset: number; limit: number; total: number; count: number; results: T[] };
};

export type CharacterSummary = {
  id: number;
  name: string;
  thumbnailUrl: string;
  comicsAvailable: number;
  seriesAvailable: number;
  eventsAvailable: number;
  modified: string;
};
