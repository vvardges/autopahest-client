import { COLUMNS } from "@/constants";

export type Column = (typeof COLUMNS)[number];

export type Row = {
  index: number;
  publish: boolean;
  manufacturer: string;
  models: string[];
  bodies: string[];
  name: string;
  description: string;
  brand: string;
  price: string;
  origin: string;
  images: string;
  actions: string;
  english: string;
  amArticle: string;
  oemArticle: string;
  weight: string;
  _filled: boolean;
};
