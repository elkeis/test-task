import { useContext, useMemo } from "react"
import { MoviePosters } from "./context"
import './Page.scss';

export const MoviePostersPage: React.FC = () => {
  const context = useContext(MoviePosters);
  return <div className="MoviePostersPage">
    <div className="header">
      <div className="title">
        Movie Catalog
      </div>
      <div className="search">
        <input type="text" value={context.state.query} onChange={(event) => {
          context.state.query = event.target.value
        }} />
      </div>
      <div className="user-data">user avatar</div>
    </div>
    <div className="body">
      {context.state.isLoading && <div className="loading">Loading...</div>}
      {useMemo(() => {
        if (context.state.data && context.state.query) {
          return <div className="search-description">
            {context.state.query}, {context.state.totalResults}
          </div>
        }
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [context.state.data])}
      <div className="movies">

        {context.state.data?.map(movie => (
          <div className="movie" key={movie.imdbID}>
            <img src={movie.Poster.toString()} alt={movie.Title} />
            <div className="description">
              <div className="title">
                {movie.Title}
              </div>
              <div className="year">
                {movie.Year}
              </div>
              <div className="imdbID">
                {movie.imdbID}
              </div>
              <div className="type">
                {movie.Type}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <input
          type="number"
          value={context.state.currentPage}
          min={1}
          max={context.state.pagesCount}
          onChange={event => {
            context.state.currentPage = Math.max(1, Math.min(event.target.valueAsNumber, context.state.pagesCount));
          }}
        />/{context.state.pagesCount}
      </div>
    </div>
  </div>
}
