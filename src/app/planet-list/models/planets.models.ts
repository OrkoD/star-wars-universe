export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
  id?: string;
}

export interface Response {
  count: number;
  next: string;
  previous: string;
  results: Planet[];
}

export interface Pagination {
  previousPageIndex: number;
  pageIndex: number;
  pageSize: number;
  length: number;
  pageSizeOptions?: number[];
}

export const DefaultPagination: Pagination = {
  previousPageIndex: 0,
  pageIndex: 0,
  pageSize: 10,
  length: null,
  pageSizeOptions: [5, 10, 25, 100]
};

export interface DetailesList {
  name: string;
  property: string;
}
