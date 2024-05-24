import { MoviePostersCache } from "./movie-posters.cache";

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

interface ImdbResponse {
  Response: boolean,
  Error?: string,
  TotalResults?: number,
  Search: Array<Movie>,
}

export interface Pagination {
  currentPage: number,
  totalPages: number,
  data: Array<Movie>,
}

export class MoviePostersResource extends EventTarget {
  static ITEMS_PER_PAGE = 10; // imperative value;
  private cache: MoviePostersCache;

  constructor(cache: MoviePostersCache) {
    super();
    this.cache = cache;
  }

  async fetchPostersForPage(query: string, page: number) : Promise<Pagination> {
    console.log('fetching posters')
    const key =
      this.cache.findKey(query, page)
      || this.cache.createKey(query, page);

    return this.cache.get(key) || (async () => {
      try {
        const resp = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=8523cbb8&s=${query}&page=${page}`)
        const data = await resp.json() as ImdbResponse;
        if (!data.Response) {
          throw new Error(data.Error || 'Unknown IMDB Error');
        } else {
          const pagesCount = Math.floor(data.TotalResults || 0 / MoviePostersResource.ITEMS_PER_PAGE);
          const pagination =  {
            totalPages: pagesCount,
            currentPage: page > 0 ? Math.min(page, pagesCount) : 0,
            data: data.Search
          }
          this.cache.set(key, pagination);
          return pagination;
        }
      } catch (ex) {
        console.error(ex);
        throw ex;
      }
    })();
  }
}
