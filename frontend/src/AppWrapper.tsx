import { useLocation } from "react-router-dom";
import App from "./App.tsx";
import AdminApp from "./AdminApp.tsx";

function AppWrapper() {
  const location = useLocation(); 
  const isAdminMode = location.pathname.startsWith("/admin"); 
  console.log("Current Path:", location.pathname);
  console.log("isAdminMode:", isAdminMode)

  return isAdminMode ? <AdminApp /> : <App />;
}

export default AppWrapper;
