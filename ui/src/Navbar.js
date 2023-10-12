import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { apiPath, preURLValue } from './includes/config.js';
import SummaryReport from './SummaryReport';
import DetailedReport from './DetailedReport';
import Reports from './Reports';
import NotFound from './NotFound';
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse
} from 'mdb-react-ui-kit';
import Dropdown from 'react-bootstrap/Dropdown';

export default function Navbar(props) {
  const [showNavColor, setShowNavColor] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  var query = window.location.search;
  var paramters = new URLSearchParams(query);
  var auth_code = paramters.get('auth_code');
  const localData = JSON.parse(localStorage.getItem("ReqData"));
  const collegeId = (localData.clgDetails)[0].college_id;
  const userId = (localData.userDetails)[0].user_id;
  const userEmail = (localData.userDetails)[0].email;
  const userType = (localData.userDetails)[0].user_type;
  const isAllowedUserType = [5, 6, 10].includes(userType);

  return (
    <div>
      <MDBNavbar expand='lg' dark style={{ backgroundColor: '#7A319F' }}>
        <MDBContainer fluid>
          <MDBNavbarBrand href={`${preURLValue}?auth_code=${auth_code}`}>Meetings</MDBNavbarBrand>

          <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNavColor(!showNavColor)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          {/* <MDBCollapse show={showNavColor} navbar>
            <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
              <MDBNavbarItem className='active'>
                <MDBNavbarLink to="/">Reports</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse> */}
           {isAllowedUserType && (
          <MDBCollapse show={showNavColor} navbar>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Reports
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate(`${preURLValue}summary_report?auth_code=${auth_code}`)}>
                  Summary Report
                </Dropdown.Item>
                {/* <Dropdown.Item as={Link} to={`summary_report?auth_code=${auth_code}`}>Summary Report</Dropdown.Item> */}
                <Dropdown.Item as={Link} to={`${preURLValue}detailed_report?auth_code=${auth_code}`}>Detailed report</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </MDBCollapse>
           )}
        </MDBContainer>
      </MDBNavbar>
    </div>
  );
}
