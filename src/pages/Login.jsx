import { useState, useRef } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import { userLogin } from "../helper/web-service";
import { useAuth } from "../hooks/useAuth";

// Import redux and actions
import { connect } from 'react-redux';
import { setUserDetails } from "../redux/actions/userActions";

export const LoginPage = () => {
  const [companyPassword, setCompanyPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const {setUserData} = useAuth();
  const inputCompanyPasswordReference = useRef(null);

  // Handler for login
  const handleLogin = async (e) => {
    e.preventDefault();
    let inputField = null;
    try {
      if (companyPassword == "") {
        inputField = inputCompanyPasswordReference;
        throw new Error("Please enter company password.");
      }
      setLoaderVisible(true);
      // Make base64 encryption for company password feild
      let base64Password = btoa(companyPassword);
      // Call API for login and getting data
      let data = await userLogin(base64Password);
      // Set user data
      setLoaderVisible(false);
      await setUserData(data);
    } catch (error) {
      setLoaderVisible(false);
      alert(error.message);
      if (inputField) {
        inputField.current.focus();
      }
    }
  };

  // Handler for toggle
  const handleToggle = () => {
    setVisible(!isVisible);
  };

  return (
    <>
      <CirclesWithBar
        color="#00bfff"
        height="70"
        width="70"
        wrapperClass="loader"
        visible={isLoaderVisible}
      />
      <div className="formbodymain">
        <div className="row">
          <div className="col-md-9 col-sm-9 col-xs-12">
            <div className="ttl_main"></div>
            <div className="x_content">
              <h2 className="ttl_hd"><strong>Novel Aquatech Company Product</strong></h2>
              <div className="form-horizontal form-label-left">
                <div className="form-group">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="backlgbg">
                      <label className="cp">Company Password</label>
                      <input
                        type={isVisible ? "text" : "password"}
                        id="companyPassword"
                        required="required"
                        className="form-control2"
                        placeholder="Enter at least 8+ characters"
                        ref={inputCompanyPasswordReference}
                        value={companyPassword}
                        onChange={(e) => setCompanyPassword(e.target.value)}
                      />
                      <span className="fa fa-fw" onClick={handleToggle}>
                        <img src={isVisible ? "images/eye_1.jpeg" : "images/eyecut_1.jpeg"} />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      defaultChecked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />&nbsp;
                    <label> Remember me</label><br />
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleLogin}>Login</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-3 col-xs-12 rightsidebg">
            <img src="images/loginback.jpg" />
          </div>
        </div>
      </div>
    </>

  );
};

// mapStateToProps
const mapStateToProps = (state) => ({
  users: state.users, // Adjust according to your state shape
});

// mapDispatchToProps
const mapDispatchToProps = (dispatch) => ({
  setUserDetails: (data) => dispatch(setUserDetails(data)), // Use the correct action creator
});

// Connect component to Redux
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);