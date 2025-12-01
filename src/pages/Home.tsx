import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Welcome!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
