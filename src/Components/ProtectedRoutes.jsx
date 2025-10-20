import { Navigate } from "react-router-dom";
import DefaltLayout from "./DefaultLayout";
 
 const ProtectedRoute = ({children}) =>{
     const isAuthenticated = localStorage.getItem("authenticated");
     return isAuthenticated ? children : <Navigate to="/"/>
 }
 export default ProtectedRoute;