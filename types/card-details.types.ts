// app/types/card-details.types.ts
export type SampleImage = {
  id: string;
  thumbnail?: string;
  image?: string;
  alt?: string;
};

export type Star = {
  id: string;
  name: string;
};

export type SearchResult = {
  id?: string;
  title?: string;
  date?: string;
  videoLength?: number | string;
  img?: string;
  image?: string;
  imageSize?: { width?: number; height?: number };
  stars?: Star[];
  samples?: SampleImage[];
};
