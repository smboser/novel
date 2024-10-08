import React, { useEffect, useState } from "react";
import { Navbar } from "../components/nav";
import { Footer } from "../components/footer";
import { CirclesWithBar } from "react-loader-spinner";

export const SurveyPage = () => {
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
                        src="https://docs.google.com/spreadsheets/d/1vTZpGTFO13YpA9ccLiqDF0adP2fN08POltMOum2sQPY/edit?embedded=true&amp;rm=demo&amp;gid=1108599173&amp;headers=false#gid=1108599173"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
