import { MoviePostersCache } from "./movie-posters.cache";

export interface Movie {
  Title: string,
  Year: number,
  imdbID: string,
  Type: string,
  Poster: URL,
}

export type SearchIndex = {
  query: string,
  page: number,
}

interface ImdbResponse {
  Response: string,
  Error?: string,
  totalResults?: number,
  Search: Array<Movie>,
}

export interface Pagination {
  currentPage: number,
  totalPages: number,
  totalResults: number,
  data: Array<Movie>,
}

export class MoviePostersResource extends EventTarget {
  static ITEMS_PER_PAGE = 10; // imperative value;
  private cache: MoviePostersCache;

  constructor(cache: MoviePostersCache) {
    super();
    this.cache = cache;
  }

  private makeUrl(url: URL|string) {
    if (url.toString() === 'N/A') {
      return new URL('https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg');
    } else {
      return new URL(url);
    }
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
        if (!!data.Error || 'False' === data.Response) {
          throw new Error(data.Error || 'Unknown IMDB Error');
        } else {
          const pagesCount = Math.floor((data.totalResults || 0) / MoviePostersResource.ITEMS_PER_PAGE);
          const pagination =  {
            totalPages: pagesCount,
            currentPage: page > 0 ? Math.min(page, pagesCount) : 1,
            totalResults: data.totalResults || 0,
            data: data?.Search?.map(entry => ({
              ...entry,
              Poster: this.makeUrl(entry.Poster)
            }))
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
