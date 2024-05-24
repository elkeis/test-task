import { Movie } from "./movie-posters.resource";

interface IMoviePostersState {
  query: string;
  pagesCount: number;
  currentPage: number;
  isLoading: boolean;
  data: Array<Movie>;
}

export class MoviePostersState extends EventTarget implements IMoviePostersState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private updateSet: Partial<MoviePostersState> = {};

  query: string = '';
  pagesCount: number = 0;
  currentPage: number = 0;
  isLoading: boolean = false;
  data: Array<Movie> = [];

  proxy = new Proxy(this, {
    set(target: MoviePostersState, prop: keyof MoviePostersState, newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target.scheduleUpdate(prop, newValue);
      return true;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private scheduleUpdate(prop: keyof MoviePostersState, value: any) {
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
