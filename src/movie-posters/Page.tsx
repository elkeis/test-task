import { useContext } from "react"
import { MoviePosters } from "./context"

export const MoviePostersPage: React.FC = () => {
  const context = useContext(MoviePosters);
  return <div>
    <input type="text" value={context.state.query} onChange={(event) => {
      context.state.query = event.target.value
    }} />
    {JSON.stringify(context.state.data)}
  </div>
}
