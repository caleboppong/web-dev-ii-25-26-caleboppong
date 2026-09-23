import { useEffect, useState } from "react";
import { searchLocations } from "../services/urbanGoApi";

function LocationSearch({
  id,
  label,
  placeholder,
  value,
  onChange,
  onSelect
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const cleanValue = value.trim();

    if (cleanValue.length < 2) {
      return undefined;
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true);
      setSearchError("");

      try {
        const data = await searchLocations(cleanValue);
        setSuggestions(data.locations || []);
      } catch {
        setSuggestions([]);
        setSearchError("Unable to search locations.");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(searchTimer);
  }, [value]);

  function handleInputChange(event) {
    const newValue = event.target.value;

    onChange(newValue);

    if (newValue.trim().length < 2) {
      setSuggestions([]);
      setSearchError("");
      setLoading(false);
    }
  }

  function handleSelectLocation(location) {
    onSelect(location);
    setSuggestions([]);
    setSearchError("");
  }

  return (
    <div className="location-search">
      <label htmlFor={id}>{label}</label>

      <div className="location-input-wrapper">
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
        />

        {loading && (
          <span className="location-loading">
            Searching...
          </span>
        )}
      </div>

      {suggestions.length > 0 && (
        <div
          className="location-suggestions"
          role="listbox"
          aria-label={`${label} suggestions`}
        >
          {suggestions.map((location) => (
            <button
              key={location.id}
              type="button"
              className="location-suggestion"
              onClick={() =>
                handleSelectLocation(location)
              }
            >
              <strong>{location.name}</strong>

              <span>
                {location.modes.length > 0
                  ? location.modes.join(" · ")
                  : "London transport location"}
              </span>
            </button>
          ))}
        </div>
      )}

      {searchError && (
        <small className="field-error">
          {searchError}
        </small>
      )}
    </div>
  );
}

export default LocationSearch;