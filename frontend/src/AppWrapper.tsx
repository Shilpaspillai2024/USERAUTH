import App from "./App.tsx";
import AdminApp from "./AdminApp.tsx";

function AppWrapper() {
  const isAdminMode = window.location.pathname.startsWith("/admin");

  return isAdminMode ? <AdminApp /> : <App />;
}

export default AppWrapper;
