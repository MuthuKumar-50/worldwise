// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";

import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";

import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

function Form() {
  const [mapLat, mapLng] = useUrlPosition();
  const navigate = useNavigate();
  const { createCity, isLoading: isLoadingFormData } = useCities();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");

  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [geoCodingError, setGeoCodingError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newcity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: mapLat, lng: mapLng },
    };

    console.log(newcity);

    await createCity(newcity);
    navigate("/app/cities");
  }

  useEffect(() => {
    if (!mapLat && !mapLng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeoCoding(true);
        console.log(`${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`);
        const res = await fetch(
          `${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`
        );
        const data = await res.json();
        console.log(data);

        if (!data.countryCode) {
          throw new Error("That doesn't seem to be city. click somewhere else");
        }
        setCityName(data.city || data.locality);
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
        setGeoCodingError("");
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }

    fetchCityData();
  }, [mapLat, mapLng]);

  if (isLoadingGeoCoding) {
    return <Spinner />;
  }

  if (geoCodingError) {
    return <Message message={geoCodingError} />;
  }

  if (!mapLat && !mapLng) {
    return <Message message="Start by Clicking somewhere on the Map" />;
  }

  return (
    <form
      className={`${styles.form} ${isLoadingFormData ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
