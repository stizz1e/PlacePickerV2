import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import {fetchAvailablePlaces} from '../http.js'
import { useFetch } from "../hooks/useFetch.js";

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );
      resolve(sortedPlaces);
    });
  });
}


export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching, 
    error, 
    fetchedData: availablePlaces, 
  } = useFetch(fetchSortedPlaces, []);


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
