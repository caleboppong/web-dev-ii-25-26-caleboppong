/*
Task 1 of the supplied Erased Tapes React layout assessment from
the written specification, assets, text content, and desktop wireframe."
 */

/*Creates the full path for files stored inside the public/assets folder.*/
const asset = (name) => `/assets/${name}`;

/*Navigation labels are stored in an array so the same links can be reused in both the header and footer navigation components.*/
const navigationItems = ['Our Blog', 'Our Artists', 'Our Story'];

/* Article content is stored separately from the JSX. Each object represents one article section containing a heading and an array of paragraphs.*/
const sections = [
  {
    heading: 'Heading',
    paragraphs: [
      'Montes ridiculus mus tellus nunc vulputate. Cras facilisi congue et facilisis porttitor litora etiam praesent porttitor. Sollicitudin cubilia scelerisque diam taciti lacus. Dapibus penatibus augue dapibus sagittis; rhoncus accumsan. Accumsan urna et, ultrices placerat justo rutrum. Tristique mattis ante cras accumsan convallis phasellus fermentum magna. Rhoncus curabitur pharetra proin ante nam adipiscing accumsan hac. Rutrum efficitur nullam integer ut ex id. Pulvinar vel at vestibulum vivamus sed nascetur eget.',
      'Laoreet volutpat hendrerit est aliquam; fusce quam tempor. Nisi interdum praesent pellentesque non non blandit cubilia et. Aptent maximus vehicula nullam odio tempor. Placerat dis facilisis potenti iaculis, primis vivamus nec at magnis. Aadipiscing curabitur vestibulum imperdiet dolor primis. Inceptos penatibus inceptos eu habitasse aptent vehicula platea litora congue. Ultricies mauris fringilla rhoncus pharetra iaculis vitae. Venenatis himenaeos eget molestie dignissim consectetur tellus litora. Porta a iaculis mi primis rhoncus.',
      'Curae habitasse elementum amet nunc, natoque at. Tortor vel blandit sociosqu auctor aliquam maximus porta feugiat. Eros phasellus platea mauris condimentum natoque hendrerit tellus id. Ex imperdiet vitae maximus adipiscing neque quam tempor orci. Lobortis porta lacinia cubilia tellus vel placerat; facilisis mi euismod. Neque eu orci nulla penatibus elit nec.',
      'Parturient habitasse facilisis purus donec, enim platea maximus. Primis class varius augue sed class ultricies. Posuere curabitur tristique penatibus montes hac ac imperdiet. Risus per sociosqu, cursus leo condimentum ac fringilla. Nibh curabitur eros tempus nec; nam curae hendrerit. Mattis placerat maximus mollis praesent, eros adipiscing dui.',
    ],
  },
  {
    heading: 'Heading',
    paragraphs: [
      'Habitasse ornare fames facilisis montes pulvinar habitasse fringilla. Risus porta cursus duis vivamus quam adipiscing nec. Ante at posuere eget aptent natoque vivamus ante. Aenean enim dapibus viverra sem efficitur. Felis nam semper integer justo in. Facilisi augue urna torquent lacinia facilisi inceptos. Natoque varius feugiat massa scelerisque natoque, cras tempor inceptos.',
      'Amet ac leo, imperdiet hac litora auctor. Suscipit congue duis sociosqu auctor euismod vivamus urna diam. Nunc enim himenaeos litora facilisi, tincidunt torquent. Eros sapien laoreet duis, volutpat rutrum pulvinar. Natoque semper sapien aptent quis habitant aliquam condimentum luctus. Tempus pellentesque congue varius dapibus pharetra. Fermentum diam auctor bibendum rhoncus leo. Vestibulum tincidunt fames convallis ligula semper porttitor.',
      'Magnis maximus morbi, litora accumsan vivamus facilisi etiam pharetra. Platea congue orci sagittis purus scelerisque. Velit taciti maecenas praesent nam lobortis metus vehicula habitasse porttitor. Porta gravida placerat lobortis litora elit feugiat venenatis. Cras magna himenaeos consequat aliquet ad nec pharetra. Ligula eleifend imperdiet aptent primis placerat. Nec magnis tempus vulputate ipsum ad sagittis mus.',
    ],
  },
  {
    heading: 'Heading',
    paragraphs: [
      'Vulputate nullam tempus montes eu tellus integer adipiscing pulvinar. Pharetra eu luctus id a potenti. Pulvinar egestas conubia ante varius lobortis iaculis metus. Netus sem imperdiet hendrerit vehicula netus est gravida tortor. Nunc ridiculus per montes nulla, facilisis lacinia per leo. Hendrerit scelerisque nulla in suspendisse sit tortor sagittis. Suscipit dictumst ipsum laoreet cras egestas suscipit orci. Per molestie felis erat platea blandit commodo.',
      'Ad venenatis sapien habitant posuere donec porttitor vel nisi. Sodales laoreet donec diam rhoncus lectus euismod orci torquent curae. Fames rhoncus torquent sed convallis; potenti cras. Dictumst arcu libero nulla malesuada mi ridiculus platea. Interdum ullamcorper fringilla himenaeos mollis; in arcu pharetra massa. Nunc mauris taciti montes sapien molestie orci ac quis.',
    ],
  },
];

/* Comment data is stored in an array so each comment can be generated using the same React markup.*/
const comments = [
  {
    name: 'soundseeker92',
    text: "This article beautifully captures the essence of experimental sound. Erased Tapes is truly pushing boundaries. Makes me want to revisit Nils Frahm's early work. I wonder what you think about their older stuff?",
  },
  {
    name: 'Ted Baker',
    text: "I've been following the label for years—so glad someone's finally writing about their impact.",
  },
  {
    name: 'Queen_of_noise',
    text: 'I discovered Erased Tapes through Ólafur Arnalds—this article brought back memories and be and my friends listening together. A bit too poetic for my taste, but still compelling.',
  },
];

/* Reusable navigation component. The footer prop determines whether the component uses the header navigation class or footer navigation class. */
function Navigation({ footer = false }) {
  return (
    <nav
      className={footer ? 'footer-nav' : 'site-nav'}
      aria-label={footer ? 'Footer navigation' : 'Primary navigation'}
    >
      {/* Create one anchor element for every item in navigationItems. */}
      {navigationItems.map((item) => (
        <a href="#" key={item}>
          {item}
        </a>
      ))}
    </nav>
  );
}

/*Reusable social-media component. The compact prop adds an additional CSS class. This allows the footer
 icons to display horizontally while the author icons display vertically.*/
function SocialLinks({ compact = false }) {
  const links = [
    { name: 'Facebook', file: 'facebook-icon.png' },
    { name: 'Instagram', file: 'instagram-icon.svg' },
    { name: 'Twitter', file: 'twitter-icon.svg' },
  ];

  return (
    <div
      className={
        compact
          ? 'social-links social-links--compact'
          : 'social-links'
      }
    >
      {/* Generate a link and image for every social-media platform. */}
      {links.map(({ name, file }) => (
        <a href="#" aria-label={name} key={name}>
          {/*The image has an empty alt value because the accessible platform name is already provided by aria-label on the link.*/}
          <img src={asset(file)} alt="" />
        </a>
      ))}
    </div>
  );
}

/* Site header containing the Erased Tapes logo and primary navigation. */
function Header() {
  return (
    <header className="site-header">
      {/* Clicking the logo moves keyboard and screen-reader users directly to the main page content. */}
      <a
        href="#main-content"
        className="logo-link"
        aria-label="Erased Tapes home"
      >
        <img
          className="logo"
          src={asset('logo.svg')}
          alt="Erased Tapes Records"
        />
      </a>

      <Navigation />
    </header>
  );
}

/* Article body component. The outer map creates each article section. The inner map creates the paragraphs belonging to that section.*/
function ArticleText() {
  return (
    <section className="article-copy" aria-label="Article body">
      {sections.map((section, index) => (
        <div className="copy-section" key={index}>
          <h2>{section.heading}</h2>

          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      ))}
    </section>
  );
}

/* Album artwork gallery. The featured property identifies the main album image, allowing CSS Grid to make it larger than the other album covers. */
function AlbumGallery() {
  const albums = [
    {
      file: 'all-encores.jpg',
      alt: 'All Encores album artwork',
      featured: true,
    },
    {
      file: 'articulation.jpg',
      alt: 'Articulation album artwork',
    },
    {
      file: 'blurred.jpg',
      alt: 'Blurred album artwork',
    },
    {
      file: 'encores-2.jpg',
      alt: 'Encores 2 album artwork',
    },
    {
      file: 'eulogy-for-evolution.jpg',
      alt: 'Eulogy for Evolution album artwork',
    },
  ];

  return (
    <section
      className="album-gallery"
      aria-label="Featured releases"
    >
      {albums.map((album) => (
        <figure
          className={
            album.featured
              ? 'album album--featured'
              : 'album'
          }
          key={album.file}
        >
          <img
            src={asset(album.file)}
            alt={album.alt}
          />
        </figure>
      ))}
    </section>
  );
}

/*Author information section. This section contains the author description, author photograph and a reusable set of social-media links.*/
function Author() {
  return (
    <section className="author">
      <div className="author-copy">
        <h2>The Author</h2>

        <p>
          Sapien leo scelerisque per convallis torquent nunc.
          Lobortis eleifend a nam sit turpis nostra. Tempus
          suspendisse libero curae faucibus lobortis litora
          bibendum praesent! Eget quam magna, diam commodo
          interdum sapien magnis.
        </p>
      </div>

      <img
        className="author-photo"
        src={asset('profile_picture.jpg')}
        alt="Portrait of the article author"
      />

      <SocialLinks />
    </section>
  );
}

/*Comments section. Each comment is represented by an article element because it is an independent contribution with its own author and text.*/
function Comments() {
  return (
    <section className="comments">
      <h2>Comments</h2>

      <div className="comment-list">
        {comments.map((comment) => (
          <article
            className="comment"
            key={comment.name}
          >
            <h3>{comment.name}</h3>
            <p>{comment.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* Site footer. The footer reuses the Navigation and SocialLinks components. Passing the footer and compact props applies the footer-specific layout classes. */
function Footer() {
  return (
    <footer className="site-footer">
      <Navigation footer />

      <p>Copyright © 2023 Erased Disks Ltd.</p>

      <SocialLinks compact />
    </footer>
  );
}

/* Main application component. This component combines all page sections in the same order shown in the supplied desktop wireframe.*/
export default function App() {
  return (
    <>
      <Header />

      {/* The id matches the logo link destination and allows users to skip directly to the main article content.*/}
      <main
        id="main-content"
        className="page-shell"
      >
        <article>
          {/* Article title and introductory paragraph. */}
          <header className="article-header">
            <h1>
              {/*Separate spans allow the main title and subtitle  to use different font sizes in CSS. */}
              <span className="title-main">
                Erased Tapes:
              </span>

              <span className="title-subtitle">
                Exploring the Sonic Frontier
              </span>
            </h1>

            <p className="lead">
              Lorem ipsum odor amet, consectetuer adipiscing elit.
              Mi eu scelerisque turpis posuere tempor? Leo
              condimentum himenaeos molestie elit; maximus iaculis
              proin nulla. Ullamcorper nibh cras conubia suscipit
              dapibus sagittis, facilisi habitant vivamus. Etiam
              fusce posuere himenaeos ipsum commodo sollicitudin
              himenaeos nec.
            </p>
          </header>

          {/* Main article text displayed in responsive columns. */}
          <ArticleText />

          {/* Responsive album artwork grid. */}
          <AlbumGallery />

          {/* Author profile and social links. */}
          <Author />

          {/* Reader comments. */}
          <Comments />
        </article>
      </main>

      <Footer />
    </>
  );
}