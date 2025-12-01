const API_URL = import.meta.env.VITE_API_URL;

export async function api(path: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  let res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const tokens = await refreshRes.json();
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);

      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${tokens.access_token}`,
      };

      res = await fetch(`${API_URL}${path}`, { ...options, headers: retryHeaders });
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return;
    }
  }

  return res;
}
