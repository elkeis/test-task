import { MoviePostersResource } from "./movie-posters.resource";
import { IMoviePostersState, MoviePostersState } from "./movie-posters.state";
import debounce from 'lodash.debounce';

export class MoviePostersStateManager {
  constructor(private resource: MoviePostersResource, private state: MoviePostersState) {
    this.setup();
  }

  private async fetchPostersForNewQuery(changeSet: IMoviePostersState) {
    try {
      this.state.watchable.isLoading = true;
      const pagination = await this.resource.fetchPostersForPage(
        changeSet.query || this.state.query,
        changeSet.currentPage ?? 1
      );
      this.state.watchable.isLoading = false;
      this.state.currentPage = pagination.currentPage;
      this.state.watchable.pagesCount = pagination.totalPages;
      this.state.watchable.data = pagination.data;
      this.state.watchable.totalResults = pagination.totalResults;
    } catch (ex) {
      console.error('error during fetching');
      this.state.watchable.data = [];
    } finally {
      this.state.watchable.isLoading = false;
    }
  }

  private fetchPostersForNewQueryDebounced = debounce(this.fetchPostersForNewQuery.bind(this), 500);

  private async updateHandler(event: Event) {
    console.log(event);
    const {detail: changeSet} = event as CustomEvent<IMoviePostersState>;
    const keys = Object.keys(changeSet);
    if (keys.includes('query') || keys.includes('currentPage')) {
      await this.fetchPostersForNewQueryDebounced(changeSet);
    }
  }

  private updateHandlerBound = this.updateHandler.bind(this);

  public setup() {
    this.state.addEventListener('update', this.updateHandlerBound);
  }

  public destroy() {
    this.state.removeEventListener('update', this.updateHandlerBound);
  }
}
