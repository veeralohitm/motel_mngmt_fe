import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Motelname",
  "MotelLocation",
  "Username",
  "Role",
  "Action",
];

const TABLE_DATA = [
  {
    id: 100,
    Motelname: "Suprise Homes",
    MotelLocation: "CA",
    Username: "John Doe",
    Role: "Super Admin",
  },
  {
    id: 101,
    Motelname: "Suprise Homes",
    MotelLocation: "CA",
    Username: "John Doe",
    Role: "Super Admin",
  },
  {
    id: 102,
    Motelname: "Suprise Homes",
    MotelLocation: "CA",
    Username: "John Doe",
    Role: "Super Admin",
  },
  {
    id: 103,
    Motelname: "Suprise Homes",
    MotelLocation: "AK",
    Username: "John Doe",
    Role: "Super Admin",
  },
  {
    id: 104,
    Motelname: "Suprise Homes",
    MotelLocation: "VA",
    Username: "John Doe",
    Role: "User",
  },
  {
    id: 105,
    Motelname: "Suprise Homes",
    MotelLocation: "PI",
    Username: "John Doe",
    Role: "Admin",
  },
];

const AreaTable = () => {
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">List of Users</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA?.map((dataItem) => {
              return (
                <tr key={dataItem.id}>
                  <td>{dataItem.Motelname}</td>
                  <td>{dataItem.MotelLocation}</td>
                  <td>{dataItem.Username}</td>
                  <td>{dataItem.Role}</td>
                  {/* <td>
                    <div className="dt-status">
                      <span
                        className={`dt-status-dot dot-${dataItem.Role}`}
                      ></span>
                      <span className="dt-status-text">{dataItem.Role}</span>
                    </div>
                  </td> */}
                
                  <td className="dt-cell-action">
                    <AreaTableAction />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
