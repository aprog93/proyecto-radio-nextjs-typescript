import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import PersistentPlayer from "./PersistentPlayer";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className={`flex-1 ${!isAdminRoute ? "pt-16" : ""}`}>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <PersistentPlayer />}
    </div>
  );
};

export default Layout;
