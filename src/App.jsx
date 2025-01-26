import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Statistics from "./screens/statistics/StatisticsScreen";
import Login from "./screens/login/login";
import Reserve from "./screens/reserveroom/reserve";
import MotelManagement from "./screens/motelmanagement/motelmanagement";
import UserManagement from "./screens/usermanagement/usermanagement";
import GuestFolio from "./screens/guestfolio/guestfolio";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
   
          <Route element={<BaseLayout />}>
          <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="/guestfolio" element={<GuestFolio />} />
            <Route path="/motelmngmt" element={<MotelManagement />} />
            <Route path="/usermngmt" element={<UserManagement />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>
      </Router>
    </>
  );
}

export default App;
