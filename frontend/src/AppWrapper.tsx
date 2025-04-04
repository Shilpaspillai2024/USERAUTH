import App from "./App.tsx";
import AdminApp from "./AdminApp.tsx";
import { useLocation } from "react-router-dom";

function AppWrapper() {
  const location=useLocation();
  const isAdminMode =location.pathname.startsWith("/admin");

  return isAdminMode ? <AdminApp /> : <App />;
}

export default AppWrapper;
