import { useState } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = ({ metrics }) => {
  const cardData = {
    "Total Sales": { colors: ["#e4e8ef", "#475be8"], percentFillValue: 80, value: "$20.4K", text: "We have booked 120 rooms." },
    "Today Revenue": { colors: ["#e4e8ef", "#4ce13f"], percentFillValue: 50, value: "$8.2K", text: "Available to payout" },
    "Rooms Occupancy": { colors: ["#e4e8ef", "#f29a2e"], percentFillValue: 40, value: "20", text: "Available to payout" },
    "Maintenance Status": { colors: ["#e4e8ef", "#f29a2e"], percentFillValue: 60, value: "15 Pending", text: "Ongoing maintenance requests" },
    "Mails": { colors: ["#e4e8ef", "#475be8"], percentFillValue: 30, value: "50", text: "Unread messages" },
    "Notes": { colors: ["#e4e8ef", "#4ce13f"], percentFillValue: 70, value: "23", text: "New notes added" }
  };

  return (
    <section className="content-area-cards">
      {metrics.map((metric) => (
        <AreaCard
          key={metric}
          colors={cardData[metric]?.colors || ["#e4e8ef", "#ccc"]}
          percentFillValue={cardData[metric]?.percentFillValue || 0}
          cardInfo={{
            title: metric,
            value: cardData[metric]?.value || "N/A",
            text: cardData[metric]?.text || "No data available",
          }}
        />
      ))}
    </section>
  );
};

export default AreaCards;
