/*
 Build Task 2 of the supplied watch.it responsive-layout assessment from the written specification, assets, text content, and three wireframes."
 The implementation should be reviewed, understood, tested, and adapted by the student. */

// Creates a path to an image stored in the public/assets directory.
const asset = (fileName) => `/assets/${fileName}`;

// Navigation data is kept separate so the links can be generated consistently.
const genres = ['Action', 'Comedy', 'Romance', 'Drama'];

// Movie data supplied with the assessment.
const movies = [
  {
    title: 'Who Framed Roger Rabbit',
    year: 1988,
    image: 'who-framed-roger-rabbit.jpg',
    description:
      'In a world where cartoons and humans coexist, a detective must solve a zany, high-stakes mystery. Packed with wild humor, groundbreaking animation, and noir twists, this unique film will pull you into a world where anything is possible!',
    layout: 'featured',
  },
  {
    title: 'Hook',
    year: 1991,
    image: 'hook.jpg',
    description:
      'Rediscover Neverland in this thrilling twist on Peter Pan! Robin Williams stars as a grown-up Peter, who must rediscover his inner child to rescue his kids from the clutches of Captain Hook. Adventure, magic, and nostalgia blend in this timeless family classic.',
    layout: 'portrait',
  },
  {
    title: 'La La Land',
    year: 2016,
    image: 'la-la-land.jpg',
    description:
      'Love, dreams, and the magic of LA take center stage in this musical masterpiece. Watch as two starry-eyed artists navigate passion and ambition in a world where every moment feels like a cinematic spectacle!',
    layout: 'portrait',
  },
  {
    title: 'Hidden Figures',
    year: 2016,
    image: 'hidden-figures.jpg',
    description:
      "Three unsung heroes of NASA's space race take the spotlight in this inspiring true story. Battling discrimination and defying the odds, these brilliant African-American women prove that intelligence, perseverance, and unity can change history and break barriers.",
    layout: 'landscape',
  },
  {
    title: 'Palm Springs',
    year: 2020,
    image: 'palm-springs.jpg',
    description:
      'A never-ending wedding day turns into an unforgettable time-loop romance! Stuck in the same day, two strangers find love, chaos, and meaning in the most unexpected ways.',
    layout: 'landscape',
  },
  {
    title: 'Barbie',
    year: 2023,
    image: 'barbie.jpg',
    description:
      'Step into the dazzling world of Barbie as she embarks on an unexpected journey from her perfect doll life to the real world. Filled with humor, heart, and empowering messages, this vibrant adventure redefines what it means to dream big!',
    layout: 'landscape',
  },
];

// Header component containing the brand, genre navigation and search button.
function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#movies" aria-label="watch.it home">
        watch.it
      </a>

      <nav className="genre-nav" aria-label="Movie genres">
        {genres.map((genre) => (
          <a href={`#${genre.toLowerCase()}`} key={genre}>
            {genre}
          </a>
        ))}
      </nav>

      <button className="search-button" type="button" aria-label="Search movies">
        Search
      </button>
    </header>
  );
}

// Reusable card component used for every movie in the data array.
function MovieCard({ movie }) {
  const cardClass = `movie-card movie-card--${movie.layout}`;

  return (
    <article className={cardClass}>
      <img
        className="movie-poster"
        src={asset(movie.image)}
        alt={`${movie.title} (${movie.year}) movie poster`}
      />

      <div className="movie-content">
        <p className="movie-description">{movie.description}</p>

        <button
          className="watch-button"
          type="button"
          aria-label={`Watch ${movie.title}`}
        >
          Watch now
        </button>
      </div>
    </article>
  );
}

// Main application component that combines the header and responsive movie grid.
export default function App() {
  return (
    <>
      <Header />

      <main id="movies" className="movie-grid">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.title} />
        ))}
      </main>
    </>
  );
}
