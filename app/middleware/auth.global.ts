import { jwtDecode, type JwtPayload } from 'jwt-decode'


export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const token = localStorage.getItem("token");

    if (to.path === "/login") return;

    if (!token) {
      return navigateTo("/login");
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        localStorage.removeItem("token");
        return navigateTo("/login");
      }
    } catch (e) {
      // Token is invalid
      localStorage.removeItem("token");
      return navigateTo("/login");
    }
  }
});
