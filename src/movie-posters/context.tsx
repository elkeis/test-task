import React, { ConsumerProps, createContext, useEffect, useState } from "react";
import { IMoviePostersState, MoviePostersState } from "./movie-posters.state";
import { MoviePostersStateManager } from "./movie-posters.state-manager";
import { MoviePostersResource } from "./movie-posters.resource";
import { MoviePostersCache } from "./movie-posters.cache";

interface Context {
  state: IMoviePostersState
}

export const MoviePosters = createContext<Context>({
  state: {
    currentPage: 0,
    data: [],
    isLoading: false,
    pagesCount: 0,
    query: '',
    totalResults: 0,
  }
});


export const MoviePostersProvider: React.FC<ConsumerProps<Context>> = ({
  children,
}) => {
  const [state, setState] = useState({
    state: MoviePostersState.instance.watchable
  });

  useEffect(() => {
    const handler = () => {
      setState({
        state: MoviePostersState.instance.watchable
      })
    };

    MoviePostersState.instance.addEventListener('update', handler);
    const manager = new MoviePostersStateManager(
      new MoviePostersResource(
        new MoviePostersCache()
      ),
      MoviePostersState.instance
    );
    return () => {
      MoviePostersState.instance.removeEventListener('update', handler);
      manager.destroy();
    }
  }, [])

  return <MoviePosters.Provider value={state}>
    <MoviePosters.Consumer children={children} />
  </MoviePosters.Provider>
}
