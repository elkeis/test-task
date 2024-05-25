import { Pagination } from "./movie-posters.resource";

export interface Movie {
  Title: string,
  imdbID: string,
  Type: string,
  Poster: URL,
}

export type SearchIndex = {
  query: string,
  page: number,
}

export class MoviePostersCache {

  private data: WeakMap<SearchIndex, Pagination> = new WeakMap();
  private keys: Array<SearchIndex> = [];

  constructor(private maxSize: number = 10) {}

  findKey(query: string, pageNumber: number = 0) {
    return this.keys.find(k => {
      return k.page === pageNumber && k.query === query
    });
  }

  createKey(query: string, pageNumber: number = 0) {
    return this.findKey(query, pageNumber) || (() => {
      const key = {query, page: pageNumber};
      this.keys.push(key);
      if (this.keys.length > this.maxSize) {
        this.keys.shift();
      }
      return key;
    })();
  }

  set(key: SearchIndex, pagination: Pagination) {
    if (!this.keys.includes(key)) {
      throw new Error('key should be created using createKey Method');
    } else {
      this.data.set(key, pagination);
    }
  }

  get(key: SearchIndex) {
    return this.data.get(key);
  }

  clearIndex() {
    this.keys = [];
  }
}
