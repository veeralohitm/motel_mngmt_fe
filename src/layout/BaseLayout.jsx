import { Outlet } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { Sidebar } from "../components";
import "./BaseLayout.scss";
const BaseLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <main className="page-wrapper">
      {/* left of page */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      {/* right side/content of the page */}
      <div className={`content-wrapper ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
