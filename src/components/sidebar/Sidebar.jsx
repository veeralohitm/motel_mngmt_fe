import { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import {
  MdOutlineAttachMoney,
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineShoppingBag,
  MdEmail,
  MdOutlineCleaningServices,
  MdHomeWork,
  MdPeopleAlt,
  MdEqualizer,
  MdContentPaste,
  MdOutlineDescription,
  MdEngineering,
  MdChevronLeft,
  MdChevronRight

} from "react-icons/md";
import { SidebarContext } from "../../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = ({ isCollapsed, setIsCollapsed }) =>  {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useContext(SidebarContext);
  //const [isCollapsed, setIsCollapsed] = useState(false);
  const navbarRef = useRef(null);
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""} ${isCollapsed ? "sidebar-collapsed" : ""}`} ref={navbarRef}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="logo" />
          <span className="sidebar-brand-text">StudioMate</span>
        </div>
        <button className="sidebar-toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
      {isCollapsed ? <MdChevronRight size={24} /> : <MdChevronLeft size={24} />}
    </button>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            {!isAuthenticated ? (
              <li className="menu-item">
                <NavLink to="/" className="menu-link">
                  <span className="menu-link-icon">
                    <MdOutlineGridView size={18} />
                  </span>
                  <span className="menu-link-text">Login</span>
                </NavLink>
              </li>
            ) : (
              <>
                <li className="menu-item user-greeting">Hi, {username}!</li>
                <li className="menu-item">
                  <NavLink to="/dashboard" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdEqualizer size={18} />
                    </span>
                    <span className="menu-link-text">Dashboard</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/usermngmt" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdPeopleAlt size={20} />
                    </span>
                    <span className="menu-link-text">User Management</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/motelmngmt" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdHomeWork size={20} />
                    </span>
                    <span className="menu-link-text">Motel Management</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/reserve" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdOutlineCurrencyExchange size={18} />
                    </span>
                    <span className="menu-link-text">Reserve a Room</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/guestfolio" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdOutlineShoppingBag size={20} />
                    </span>
                    <span className="menu-link-text">Guest Folio</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/housekeeping" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdOutlineCleaningServices size={20} />
                    </span>
                    <span className="menu-link-text">House Keeping</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/journal" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdContentPaste size={20} />
                    </span>
                    <span className="menu-link-text">Journal</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/maintenance" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdEngineering size={20} />
                    </span>
                    <span className="menu-link-text">Maintenance</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/reports" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdOutlineDescription size={20} />
                    </span>
                    <span className="menu-link-text">Reports</span>
                  </NavLink>
                </li>
                <li className="menu-item">
                  <NavLink to="/mail" className="menu-link" activeClassName="active">
                    <span className="menu-link-icon">
                      <MdEmail size={20} />
                    </span>
                    <span className="menu-link-text">Mail / Chat</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        {isAuthenticated && (
          <div className="sidebar-menu sidebar-menu2">
            <ul className="menu-list">
              <li className="menu-item">
                <NavLink to="/" className="menu-link" onClick={handleLogout}>
                  <span className="menu-link-icon">
                    <MdOutlineLogout size={20} />
                  </span>
                  <span className="menu-link-text">Logout</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
