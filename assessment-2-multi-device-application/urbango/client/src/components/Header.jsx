import { useState } from "react";

function Header({ user, onSignIn, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationItems = [
    { id: 1, label: "Home", href: "#top" },
    { id: 2, label: "Plan", href: "#planner" },
    { id: 3, label: "Buses", href: "#routes" },
    { id: 4, label: "Status", href: "#status" },
    { id: 5, label: "My journeys", href: "#journeys" },
    { id: 6, label: "Travel info", href: "#travel-info" }
  ];

  return (
    <header className="site-header">
      <div className="header-container">
        <a className="logo" href="#top" onClick={() => setMenuOpen(false)}><span>Urban</span>Go</a>
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span /><span /><span /></button>
        <nav className={menuOpen ? "main-navigation open" : "main-navigation"} aria-label="Main navigation">
          {navigationItems.map((item) => <a key={item.id} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          {user ? (
            <div className="account-nav"><span className="account-avatar">{user.name.charAt(0).toUpperCase()}</span><span>{user.name.split(" ")[0]}</span><button type="button" onClick={onSignOut}>Sign out</button></div>
          ) : <button className="signin-button" type="button" onClick={onSignIn}>Sign in</button>}
        </nav>
      </div>
    </header>
  );
}

export default Header;
