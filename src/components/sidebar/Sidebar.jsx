import { useContext, useEffect, useRef } from "react";
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
  MdOutlineMessage,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlineShoppingBag,
} from "react-icons/md";
import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const navigate = useNavigate();

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Remove authentication status from localStorage
    //window.location.href = "/"; // Redirect to login page
    navigate("/"); 
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="" />
          <span className="sidebar-brand-text">StudioMate</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
          {!isAuthenticated ? (
          <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Login</span>
              </Link>
            </li>
             ) : (
            <><li className="menu-item">
                  <Link to="/dashboard" className="menu-link" active>
                    <span className="menu-link-icon">
                      <MdOutlineGridView size={18} />
                    </span>
                    <span className="menu-link-text">Dashboard</span>
                  </Link>
                </li><li className="menu-item">
                    <Link to="/usermngmt" className="menu-link">
                      <span className="menu-link-icon">
                        <MdOutlineBarChart size={20} />
                      </span>
                      <span className="menu-link-text">User Managment</span>
                    </Link>
                  </li><li className="menu-item">
                    <Link to="/motelmngmt" className="menu-link">
                      <span className="menu-link-icon">
                        <MdOutlineAttachMoney size={20} />
                      </span>
                      <span className="menu-link-text">Motel Management</span>
                    </Link>
                  </li><li className="menu-item">
                    <Link to="/reserve" className="menu-link">
                      <span className="menu-link-icon">
                        <MdOutlineCurrencyExchange size={18} />
                      </span>
                      <span className="menu-link-text">Reserve a Room</span>
                    </Link>
                  </li>
                  <li className="menu-item">
              <Link to="/dashboard" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineShoppingBag size={20} />
                </span>
                <span className="menu-link-text">Guest Folio</span>
              </Link>
            </li>
                  
                  </>
              )}
{/*             <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineShoppingBag size={20} />
                </span>
                <span className="menu-link-text">Products</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Customer</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineMessage size={18} />
                </span>
                <span className="menu-link-text">Messages</span>
              </Link>
            </li> */}
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            {/* <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </Link>
            </li> */}
{isAuthenticated ? (
            <li className="menu-item">
              <Link to="/" className="menu-link" onClick={handleLogout}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </Link>
            </li>
):(<></>)}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
