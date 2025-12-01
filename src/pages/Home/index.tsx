import { useAuth } from "../../context";

export function HomePage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Welcome!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
