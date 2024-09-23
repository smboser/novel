import React, { useEffect, useState } from "react";
import { Navbar } from "../components/nav";
import { Footer } from "../components/footer";
import { CirclesWithBar } from "react-loader-spinner";

// Connect with Redux and import and require actions
import { connect } from 'react-redux';
import { setUserDetails } from "../redux/actions/userActions";

export const SurveyPage = (props) => {
  const [isLoaderVisible, setLoaderVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderVisible(false); // some time delay to load google sheet
    }, 2000);
  }, []);
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
          <div className="col-md-12 col-sm-12 col-xs-12">
            <Navbar />
          </div>
          <div className="">
            <div className="col-md-12 col-sm-12 col-xs-12 report" id="style-3">
              <div className="x_panel">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="ttl_main center">
                    <h2 style={{ textAlign: "left" }}>
                      Result from the Occupant Survey
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div
                      className="centerwrapperbox"
                      style={{ paddingTop: "1em" }}
                    >
                      <h2 className="dev_ttlmain"> </h2>
                      <iframe
                        id="iframe-IAQ"
                        height="500"
                        width={"100%"}
                        style={{ border: "0px" }}
                        src="https://docs.google.com/spreadsheets/d/1AorkoDXY2A3Zmwb_c5MYGlUrCyeKKZ8mig_Fm8nA6Xw/edit?embedded=true&amp;rm=demo&amp;gid=1108599173&amp;headers=false#gid=1108599173"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

// mapStateToProps
const mapStateToProps = (state) => ({
  userDetails: state.users.userDetails, // Ensure the correct path to userDetails
});

// mapDispatchToProps
const mapDispatchToProps = (dispatch) => ({
  setUserDetails: (data) => dispatch(setUserDetails(data)),
});

// Connect component to Redux
export default connect(mapStateToProps, mapDispatchToProps)(SurveyPage);