import { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";
import {
  createCityAPI,
  deleteCityAPI,
  getCityAPI,
  fetchCitiesAPI,
} from "../utiils/util";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading": {
      return {
        ...state,
        isLoading: true,
      };
    }
    case "cities/loaded": {
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    }
    case "city/loaded": {
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    }
    case "city/created": {
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    }
    case "city/deleted": {
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    }
    case "rejected": {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled Action Type ${state.action}`);
    }
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    fetchCitiesAPI(dispatch);
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity() {
          getCityAPI(dispatch);
        },
        createCity(newCity) {
          createCityAPI(newCity, dispatch);
        },
        deleteCity(id) {
          deleteCityAPI(id, dispatch);
        },
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("Cities Context was used outside the cities provider");
  }
  return context;
}

export { CitiesProvider, useCities };
