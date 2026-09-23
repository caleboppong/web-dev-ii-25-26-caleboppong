const travelOptions = [
  {
    id: 1,
    icon: "💳",
    title: "Contactless",
    description:
      "Learn how to use a contactless bank card or mobile device for pay-as-you-go travel across London.",
    link: "https://tfl.gov.uk/fares/ways-to-pay/pay-as-you-go",
    buttonText: "Contactless information"
  },
  {
    id: 2,
    icon: "🔵",
    title: "Oyster",
    description:
      "Manage an Oyster or contactless account, check journeys, payments and available travel services.",
    link: "https://contactless.tfl.gov.uk/",
    buttonText: "Manage Oyster"
  },
  {
    id: 3,
    icon: "🎫",
    title: "Travelcards",
    description:
      "Check official Travelcard information, zones and available ticket options before travelling.",
    link: "https://tfl.gov.uk/fares/ways-to-pay/travelcards-and-group-tickets",
    buttonText: "View Travelcards"
  },
  {
    id: 4,
    icon: "£",
    title: "Check a fare",
    description:
      "Use TfL's official Single Fare Finder to check the cost of an eligible rail journey before travelling.",
    link: "https://tfl.gov.uk/fares/find-fares/single-fare-finder",
    buttonText: "Check official fare"
  }
];

function TravelInformation() {
  return (
    <section
      className="travel-information"
      id="travel-info"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            TRAVEL INFORMATION
          </p>

          <h2>Paying for London travel</h2>

          <p>
            UrbanGo does not sell transport tickets.
            Continue to official Transport for London
            services for current fares, Oyster,
            contactless and Travelcard information.
          </p>
        </div>
      </div>

      <div className="travel-information-grid">
        {travelOptions.map((option) => (
          <article
            className="travel-information-card"
            key={option.id}
          >
            <div className="travel-information-icon">
              {option.icon}
            </div>

            <h3>{option.title}</h3>

            <p>{option.description}</p>

            <a
              className="external-action"
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {option.buttonText}
              <span aria-hidden="true"> ↗</span>
            </a>
          </article>
        ))}
      </div>

      <p className="external-service-note">
        External travel services open on official
        Transport for London websites.
      </p>
    </section>
  );
}

export default TravelInformation;