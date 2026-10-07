const stories = [
  {
    label: "LIVE LONDON",
    title: "Your bus, without the guesswork.",
    text: "Search a route, choose your stop and see live arrival predictions refreshed while you travel.",
    className: "story-bus",
    link: "#routes",
    action: "Check a bus"
  },
  {
    label: "ONE JOURNEY",
    title: "Bus, Tube and walking in one clear plan.",
    text: "Compare real London journey options, timings and individual legs before you leave.",
    className: "story-train",
    link: "#planner",
    action: "Plan a journey"
  }
];

function TransportStory() {
  return (
    <section className="transport-story" aria-label="UrbanGo travel features">
      {stories.map((story, index) => (
        <article className={`story-panel ${story.className}`} key={story.title}>
          <div className="story-overlay" />
          <div className="story-copy">
            <span className="story-number">0{index + 1}</span>
            <p className="eyebrow">{story.label}</p>
            <h2>{story.title}</h2>
            <p>{story.text}</p>
            <a href={story.link}>{story.action} →</a>
          </div>
        </article>
      ))}
    </section>
  );
}

export default TransportStory;
