import React from 'react';
import Cookies from 'js-cookie';

export default class GlobalNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: Cookies.get('username'),
        };
    }

    componentDidMount() {
        jQuery(() => {
            const sidenav = document.getElementById('sidenav-1');
            const instance = mdb.Sidenav.getOrCreateInstance(sidenav);

            let innerWidth = null;

            const setMode = (e) => {
              // Check necessary for Android devices
              if (window.innerWidth === innerWidth) {
                return;
              }

              innerWidth = window.innerWidth;

              if (window.innerWidth < 1400) {
                instance.changeMode('over');
                instance.hide();
              } else {
                instance.changeMode('side');
                instance.show();
              }
            };

            setMode();

            // Event listeners
            window.addEventListener('resize', setMode);
        });
    }

    render() {
        const { displayName } = this.state;

        return (
            <nav id="sidenav-1" className="sidenav bg-light" data-mdb-color="dark"
                data-mdb-mode="side" data-mdb-hidden="false" data-mdb-scoll-container="#scrollContainer">
                <div className="mt-4">
                    <div id="header-content" className="ps-3">
                        <img src="/resources/smart_pom_cropped.jpg" alt="User Avatar"
                            className="rounded-circle img-fluid mb-3" style={{maxWidth: '50px'}}></img>

                        <h4>
                            <span style={{whiteSpace: 'nowrap'}}>
                                {displayName}
                            </span>
                        </h4>
                        <p>Support Team</p>
                    </div>
                    <hr className="mb-0" />
                </div>
                <div id="scrollContainer">
                    <ul className="sidenav-menu">
                        <li className="sidenav-item">
                            <a className="sidenav-link" href="/">
                                <i className="fas fa-chart-area fa-fw me-3"></i>
                                Dashboard Stats
                            </a>
                        </li>
                        {/* Reporting */}
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="fa-solid fa-chart-pie fa-fw me-3"></i>
                                Reports
                            </a>
                            <ul className="sidenav-collapse">
                                <li className="sidenav-item">
                                    <a className="sidenav-link">App Roll Call Report</a>
                                </li>
                                <li className="sidenav-item">
                                    <a className="sidenav-link">Aggregate Volume Report</a>
                                </li>
                            </ul>
                        </li>
                        {/* Research */}
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="fa-solid fa-magnifying-glass-chart fa-fw me-3"></i>
                                Research
                            </a>
                            <ul className="sidenav-collapse">
                                <li className="sidenav-item">
                                    <a className="sidenav-link">Configurations</a>
                                </li>
                                <li className="sidenav-item">
                                    <a className="sidenav-link" href="/devices">Device Data</a>
                                </li>
                                <li className="sidenav-item">
                                    <a className="sidenav-link">Connectivity</a>
                                </li>
                                <li className="sidenav-item">
                                    <a className="sidenav-link">Stored Logs</a>
                                </li>
                            </ul>
                        </li>
                        {/* Insights */}
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="fa-solid fa-arrow-up-right-dots fa-fw me-3"></i>
                                Insights
                            </a>
                            <ul className="sidenav-collapse">
                                <li className="sidenav-item">
                                    <a className="sidenav-link">System Connections</a>
                                </li>
                            </ul>
                        </li>
                        {/* FAQ */}
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="fas fa-ellipsis-h fa-fw me-3"></i>
                                FAQ
                            </a>
                        </li>
                    </ul>
                    <hr className="m-0" />
                    {/* Profile */}
                    <ul className="sidenav-menu">
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="fas fa-cogs fa-fw me-3"></i>
                                System Settings
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="fas fa-user fa-fw me-3"></i>
                                Profile
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="fas fa-shield fa-fw me-3"></i>
                                Privacy
                            </a>
                        </li>
                        <li className="sidenav-item">
                            <a className="sidenav-link">
                                <i className="fas fa-user-astronaut fa-fw me-3"></i>
                                Log out
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="text-center" style={{height: '100px'}}>
                    <hr className="mb-4 mt-0" />
                    <p>© SphereCommerce 2022</p>
                </div>
            </nav>
        );
    }
}
