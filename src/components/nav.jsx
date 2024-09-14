import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { APP_CONST } from "../helper/application-constant";
export const Navbar = () => {
  const { user,removeUserData  } = useAuth();
  const farmer_companies = APP_CONST.farmer_companies;
  const orgName = user.orgName;
  const orgIcon = (farmer_companies.includes(orgName)) ? "images/logomain.png" : user.orgDetails.icon;
  const handleLogout = (event) => {
    console.log("--- Inside handleLogout ---")
    removeUserData();
};
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        {/*-- Brand and toggle get grouped for better mobile display */}
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-expanded="false"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/devices">
            <img src={orgIcon} className="orglog" />
          </a>
        </div>
        {/* Collect the nav links, forms, and other content for toggling */}
        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav">
            <li>
              <NavLink to="/devices">Devices</NavLink>
            </li>
            <li>
              <NavLink to="/report">Reports</NavLink>
            </li>
            <li>
              <NavLink to="/setting">Setting</NavLink>
            </li>
            <li style={{"display": (farmer_companies.includes(orgName) ? "none":"block")}}>
              <NavLink to="/survey">Occupant Survey</NavLink>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li style={{"marginTop":"10px"}}>
              <button type="button" class="btn btn-info btn-sm" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav >
  );
};
