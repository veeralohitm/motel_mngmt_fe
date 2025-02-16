import { useState } from "react";
import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [overallFilter, setOverallFilter] = useState("daily");

  return (
    <div className="content-area">
      <div>
      <AreaTop/>
      </div>
      <div className="d-flex gap-2 mb-4">
        <button className={`btn ${activeTab === "current" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("current")}>Current</button>
        <button className={`btn ${activeTab === "previous" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("previous")}>Previous Day</button>
        <button className={`btn ${activeTab === "overall" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveTab("overall")}>Overall</button>
      </div>

      {activeTab === "current" && (
        <div>
          <AreaCards />
          <AreaCharts />
        </div>
      )}

      {activeTab === "previous" && (
        <div>
          <AreaCards />
          <AreaCharts />
        </div>
      )}

      {activeTab === "overall" && (
        <div>
          <div className="d-flex gap-2 mb-4">
            {["daily", "monthly", "quarterly", "yearly"].map((filter) => (
              <button
                key={filter}
                className={`btn ${overallFilter === filter ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setOverallFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          <AreaCards filter={overallFilter} />
          <AreaCharts filter={overallFilter} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
