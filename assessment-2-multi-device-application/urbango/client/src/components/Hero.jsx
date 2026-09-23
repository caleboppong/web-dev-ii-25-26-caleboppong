function Hero({
  search,
  setSearch,
  onSearch,
  resultCount
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">
          SMART LONDON TRAVEL
        </p>

        <h1>
          Move around London with confidence.
        </h1>

        <p className="hero-description">
          Search bus routes, check live arrivals
          and save the journeys you use most.
        </p>

        <form
          className="search-box"
          onSubmit={handleSubmit}
        >
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search route, destination or area"
            aria-label="Search routes"
          />

          <button type="submit">
            Search
          </button>
        </form>

        <p>
          {resultCount} routes available
        </p>
      </div>
    </section>
  );
}

export default Hero;