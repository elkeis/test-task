import React, { ConsumerProps, createContext, useCallback, useMemo, useState } from "react";

interface MoviePosters {
  isAnyCharacteristic: boolean,
  anyApi: () => void,
}

export const MoviePosters = createContext<MoviePosters>({
  movies
  anyApi: () => { throw new Error('Method is not implemented!') }
});


export const MoviePostersProvider: React.FC<ConsumerProps<MoviePosters>> = ({
  children,
}) => {
  const [isAnyCharacteristic, setisAnyCharacteristic] = useState(false);
  const anyApi = useCallback(() => {
    setisAnyCharacteristic(true);
    setTimeout(() => setisAnyCharacteristic(false), 2000);
  }, []);

  const api = useMemo<MoviePosters>(() => {
    return {
      anyApi,
      isAnyCharacteristic,
    }
  }, [isAnyCharacteristic]);

  return <MoviePosters.Provider value={api}>
    <MoviePosters.Consumer children={children} />
  </MoviePosters.Provider>
}
