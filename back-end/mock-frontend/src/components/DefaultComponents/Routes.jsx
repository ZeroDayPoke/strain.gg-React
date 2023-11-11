import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import { Strains, StrainDetails, AddStrainForm } from "../StrainComponents";
import { Stores, StoreDetails, AddStoreForm } from "../StoreComponents";
import { FAQPage, LoginForm, SignupForm, Account, AdminPage, ResetPasswordForm, Logout, About } from "../DefaultComponents";

function AppRoutes() {
  const user = useSelector((state) => state.user);
  const isAuthenticated = user && user.roles && user.roles.length > 1;
  const isAdmin = isAuthenticated && user.roles.includes("CLOUD_CHASER");

  return (
    <Routes>
    <Route path="/" element={<h1>Welcome to Strain.gg</h1>} />
    <Route path="/strains" element={<Strains />} />
    <Route path="/stores" element={<Stores />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/about" element={<About />} />
    <Route
      path="/add-strain"
      element={
        isAuthenticated ? <AddStrainForm /> : <Navigate to="/login" />
      }
    />
    <Route
      path="/add-store"
      element={
        isAuthenticated ? <AddStoreForm /> : <Navigate to="/login" />
      }
    />
    <Route
      path="/login"
      element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" />}
    />
    <Route
      path="/signup"
      element={!isAuthenticated ? <SignupForm /> : <Navigate to="/" />}
    />
    <Route
      path="/account"
      element={isAuthenticated ? <Account /> : <Navigate to="/login" />}
    />
    <Route
      path="/admin"
      element={isAdmin ? <AdminPage /> : <Navigate to="/" />}
    />
    <Route path="/stores/:storeId" element={<StoreDetails />} />
    <Route path="/strains/:strainId" element={<StrainDetails />} />
    <Route path="/reset-password" element={<ResetPasswordForm />} />
    <Route path="*" element={<h1>404 Not Found</h1>} />
    <Route
      path="/logout"
      element={isAuthenticated ? <Logout /> : <Navigate to="/login" />}
    />
  </Routes>
  );
}

export default AppRoutes;
