import { useState } from "react";

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "register") {
        const res = await fetch("/api/v1/userRegister", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Could not register");
          return;
        }
        setMode("login");
        setError("Account created, please log in.");
        return;
      }

      const res = await fetch("/api/v1/userLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not log in");
        return;
      }

      onAuthenticated({ token: data.token, email });
    } catch (err) {
      setError("Network error, please try again");
    }
  };

  return (
    <main className="container">
      <h1 className="title">Get Things Done !</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input-box"
            required
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-box"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-box"
          required
        />
        <button type="submit" className="auth-button">
          {mode === "register" ? "Sign Up" : "Log In"}
        </button>
      </form>
      {error && <p className="auth-error">{error}</p>}
      <button
        type="button"
        className="auth-switch"
        onClick={() => {
          setError("");
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
      </button>
    </main>
  );
}

export default Auth;
