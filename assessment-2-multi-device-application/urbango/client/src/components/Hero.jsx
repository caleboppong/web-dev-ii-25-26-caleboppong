function Hero({ search, setSearch, onSearch, resultCount }) {
  function handleSubmit(event) { event.preventDefault(); onSearch(); }
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">LIVE LONDON, MADE SIMPLE</p>
          <h1>Move through London.<br/><em>Know what’s next.</em></h1>
          <p className="hero-description">Live arrivals, smarter journey planning and the routes you use most — brought together in one travel companion.</p>
          <form className="search-box" onSubmit={handleSubmit}>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try bus route 55, 97 or 215" aria-label="Search bus routes" />
            <button type="submit">Search routes</button>
          </form>
          <div className="hero-meta"><span><b>LIVE</b> TfL-powered data</span><span>{resultCount} route{resultCount === 1 ? "" : "s"} found</span></div>
        </div>
        <div className="hero-visual" role="img" aria-label="Red London bus travelling through the city">
          <div className="hero-route-badge"><span>97</span><div><small>NEXT BUS</small><strong>6 min</strong></div></div>
          <div className="hero-caption"><span>51.5072° N</span><span>LONDON</span></div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
