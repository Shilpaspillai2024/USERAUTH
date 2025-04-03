import { useLocation } from "react-router-dom";
import App from "./App.tsx";
import AdminApp from "./AdminApp.tsx";

function AppWrapper() {
  const location = useLocation(); 
  const isAdminMode = location.pathname.startsWith("/admin"); 

  return isAdminMode ? <AdminApp /> : <App />;
}

export default AppWrapper;
