// import React from "react";

import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";

import styles from "./CountryList.module.css";

function CountryList({ cities, isLoading }) {
  const countries = cities.reduce((arr, city) => {
    if (arr.map((el) => el.country).includes(city.country)) {
      return arr;
    } else {
      return [...arr, { country: city.country, emoji: city.emoji }];
    }
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return (
      <Message message="Add your first city by clicking on a country on the map" />
    );
  }
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
