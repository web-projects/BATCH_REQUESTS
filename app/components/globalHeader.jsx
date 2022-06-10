import React from 'react';
import Cookies from 'js-cookie';

export default class GlobalHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: Cookies.get('username'),
        };
    }

    render() {
        const { displayName } = this.state;

        return (
          <nav id="main-navbar" className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
              {/* Sidenav toggler */}
              <button data-mdb-toggle="sidenav" data-mdb-target="#sidenav-1" className="btn shadow-0 p-0 me-3 d-block d-xxl-none dark-theme-prominent"
                aria-controls="#sidenav-1" aria-haspopup="false" aria-expanded="true">
                  <i className="fas fa-bars fa-lg"></i>
              </button>
              {/* Search form into our FAQ */}
              <form className="d-none d-md-flex input-group w-auto my-auto">
                <input autocomplete="off" type="search" className="form-control rounded" placeholder="Search FAQ"
                  style={{minWidth: '255px'}}></input>
                <span className="input-group-text border-0">
                  <i className="fas fa-search dark-theme-prominent"></i>
                </span>
              </form>
              {/* Navbar links */}
              <ul className="navbar-nav ms-auto d-flex flex-row">
                <li className="nav-item current-user-li">
                 <a className="current-user-link" href="javascript:void(0)">
                    Welcome <span className="current-user">{displayName}!</span>
                 </a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
                    href="javascript:void(0)" id="navbarDropdownMenuLink" role="button"
                    data-mdb-toggle="dropdown" aria-expanded="false">
                      <i class="fa-solid fa-user rounded-circle" loading="lazy"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink"
                    data-popper-placement="null" data-mdb-popper="none">
                      <li>
                        <a className="dropdown-item" href="/logout">Logout</a>
                      </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        );
    }
}
