import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import {fetchAvailablePlaces} from '../http.js'

export default function AvailablePlaces({ onSelectPlace }) {
  const [error, setError] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    setIsFetching(true);
    async function fetchPlaces() {
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places, 
            position.coords.latitude, 
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        })
        
      } catch (error) {
        setError({message: error || 'Could not fetch places data.'});
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

  if(error){
    return(
      <ErrorPage title='An error occured' message={error.message} />
    )
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetchin place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
