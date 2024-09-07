import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export const Navbar = () => {
  const { user } = useAuth();
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
            <img src="images/logomain.png" />
          </a>
        </div>
        {/* Collect the nav links, forms, and other content for toggling */}
        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav">
            <li>
              <NavLink
                to="/devices"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Devices
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/report"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Reports
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/setting"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Setting
              </NavLink>
            </li>
            <li>
              <NavLink to="/survey">Occupant Survey</NavLink>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#">
                <img src="images/avtar.jpg" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
