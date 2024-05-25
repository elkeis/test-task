import { Movie } from "./movie-posters.resource";

export interface IMoviePostersState {
  query: string;
  pagesCount: number;
  currentPage: number;
  isLoading: boolean;
  data: Array<Movie>;
  totalResults: number;
}

export class MoviePostersState extends EventTarget implements IMoviePostersState {
  public static instance =  new MoviePostersState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private updateSet: Partial<IMoviePostersState> = {};

  query: string = '';
  pagesCount: number = 0;
  currentPage: number = 0;
  totalResults: number = 0;
  isLoading: boolean = false;
  data: Array<Movie> = [];

  watchable = new Proxy(this, {
    set(target: MoviePostersState, prop: keyof IMoviePostersState, newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target.scheduleUpdate(prop, newValue);
      return true;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private scheduleUpdate(prop: keyof IMoviePostersState, value: any) {
    this.updateSet[prop] = value;
    queueMicrotask(() => {
      if (Object.keys(this.updateSet).length > 0) {
        const updateSet = this.updateSet;
        this.updateSet = {};
        Object.assign(this, updateSet);
        this.dispatchEvent(new CustomEvent<Partial<MoviePostersState>>('update', {detail: updateSet}));
      }
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).state = MoviePostersState.instance;
