const BASE_URL = "http://localhost:8000";

export async function fetchCitiesAPI(dispatch) {
  try {
    dispatch({ type: "loading" });
    const res = await fetch(`${BASE_URL}/cities`);
    const data = await res.json();
    dispatch({
      type: "cities/loaded",
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: "rejected",
      payload: "There was n error Loading data ...",
    });
  }
}

export async function getCityAPI(id, dispatch) {
  try {
    dispatch({
      type: "loading",
    });
    const res = await fetch(`${BASE_URL}/cities/${id}`);
    const data = await res.json();
    dispatch({
      type: "city/loaded",
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: "rejected",
      payload: "There was an error in getting city ...",
    });
  }
}
export async function createCityAPI(newCity, dispatch) {
  try {
    dispatch({
      type: "loading",
    });
    const res = await fetch(`${BASE_URL}/cities`, {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    dispatch({
      type: "city/created",
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: "rejected",
      payload: "There was an error in creating city...",
    });
  }
}
export async function deleteCityAPI(id, dispatch) {
  try {
    dispatch({
      type: "loading",
    });

    await fetch(`${BASE_URL}/cities/${id}`, {
      method: "DELETE",
    });

    dispatch({
      type: "city/deleted",
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: "rejected",
      payload: "There was an error n Deleting City ...",
    });
  }
}
