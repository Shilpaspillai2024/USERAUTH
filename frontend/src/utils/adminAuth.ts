export const isAdminAuthenticated = (): boolean => {
    const token = localStorage.getItem("adminToken");
    return !!token;
  };
  
  export const getAdminToken = (): string | null => {
    return localStorage.getItem("adminToken");
  };
  
  export const setAdminToken = (token: string): void => {
    localStorage.setItem("adminToken", token);
  };
  
  export const removeAdminToken = (): void => {
    localStorage.removeItem("adminToken");
  };