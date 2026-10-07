import { useState } from "react";

function AuthModal({ open, onClose, onAuthenticated }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!open) return null;

  function handleSubmit(event) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem("urbango-users") || "[]");

    if (mode === "signup") {
      if (!name.trim() || !cleanEmail || password.length < 6) {
        setMessage("Enter your name, email and a password of at least 6 characters.");
        return;
      }
      if (users.some((user) => user.email === cleanEmail)) {
        setMessage("An account with this email already exists.");
        return;
      }
      const newUser = { id: Date.now(), name: name.trim(), email: cleanEmail, password };
      localStorage.setItem("urbango-users", JSON.stringify([...users, newUser]));
      onAuthenticated({ id: newUser.id, name: newUser.name, email: newUser.email });
      return;
    }

    const user = users.find((item) => item.email === cleanEmail && item.password === password);
    if (!user) {
      setMessage("Email or password not recognised. You can create an account below.");
      return;
    }
    onAuthenticated({ id: user.id, name: user.name, email: user.email });
  }

  return (
    <div className="auth-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">URBANGO ACCOUNT</p>
        <h2 id="auth-title">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
        <p>Sign in to keep your favourites and journey history together on this device.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
          )}
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} required /></label>
          {message && <p className="auth-message">{message}</p>}
          <button className="primary-button" type="submit">{mode === "signin" ? "Sign in" : "Create account"}</button>
        </form>
        <button className="auth-switch" type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}>
          {mode === "signin" ? "New to UrbanGo? Create an account" : "Already have an account? Sign in"}
        </button>
      </section>
    </div>
  );
}

export default AuthModal;
