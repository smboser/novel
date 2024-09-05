import React from 'react';
import { Navbar } from "../components/nav";

export const SettingPage = () => {

    return (
        <div className="formbodymain">
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <Navbar></Navbar>
                </div>
                <div className="x_content">
                    <div className="col-md-12 col-sm-12 col-xs-12 aset">
                        <div className="x_panel">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="ttl_main">
                                    <h2>Alert Setting</h2>
                                </div>
                            </div>

                            <div className="x_content">
                                <table id="datatable" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Active</th>
                                            <th>Alert</th>
                                            <th>Low threashold</th>
                                            <th>High threashold</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td><label className="switch">
                                                <input type="checkbox" defaultChecked={true} />
                                                <span className="slider round"></span>
                                            </label></td>
                                            <td>Co2</td>
                                            <td><img src="images/cross.png" /></td>
                                            <td>
                                                <span className="label label-default dmag">
                                                    <img src="images/default.png" />Default Value
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label className="switch">
                                                <input type="checkbox" defaultChecked={true} />
                                                <span className="slider round"></span>
                                            </label></td>
                                            <td>Co2</td>
                                            <td><img src="images/cross.png" /></td>
                                            <th></th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label className="switch">
                                                    <input type="checkbox" defaultChecked={true} />
                                                    <span className="slider round"></span>
                                                </label>
                                            </td>
                                            <td>Co2</td>
                                            <td><img src="images/cross.png" /></td>
                                            <th></th>
                                        </tr>
                                        <tr>
                                            <td><label className="switch">
                                                <input type="checkbox" defaultChecked={true} />
                                                <span className="slider round"></span>
                                            </label></td>
                                            <td>Co2</td>
                                            <td><img src="images/cross.png" /></td>
                                            <th></th>
                                        </tr>
                                        <tr>
                                            <td><label className="switch">
                                                <input type="checkbox" defaultChecked={true} />
                                                <span className="slider round"></span>
                                            </label></td>
                                            <td>Co2</td>
                                            <td><span className="label label-default dmag"><img src="images/default.png" /> Disable</span></td>
                                            <th><span className="label label-default dmag"><img src="images/default.png" /> Disable</span></th>
                                        </tr>
                                    </tbody>

                                </table>
                                <a href="javascript:void(0);" className="btn btn-success btn-block" role="button">Save</a>
                                <p className="text-muted font-13 m-b-30">Should autosave as well on change...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

