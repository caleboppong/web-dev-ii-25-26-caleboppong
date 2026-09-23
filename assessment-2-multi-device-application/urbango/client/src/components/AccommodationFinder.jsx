function AccommodationFinder() {
  return (
    <section
      className="accommodation-section"
      id="accommodation"
    >
      <div className="accommodation-content">
        <div>
          <p className="eyebrow">
            COMPLETE YOUR JOURNEY
          </p>

          <h2>Staying in London?</h2>

          <p>
            Continue to an external accommodation
            provider to search current London hotel
            availability and prices.
          </p>
        </div>

        <a
          className="accommodation-button"
          href="https://www.booking.com/city/gb/london.en-gb.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Find London accommodation
          <span aria-hidden="true"> ↗</span>
        </a>
      </div>

      <p className="external-service-note">
        Accommodation search and booking are provided
        by an external website. UrbanGo does not
        process hotel bookings or payments.
      </p>
    </section>
  );
}

export default AccommodationFinder;