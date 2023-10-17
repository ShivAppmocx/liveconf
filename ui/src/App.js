import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

import { apiPath, preURLValue } from './includes/config.js';

import CourseSectionDataList from './CourseSectionDataList';
import DatatablePage from './DatatablePage';
import DatatableReact from './DatatableReact';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ModalExample from './ModalExample';
import FormPage from './FormPage';
import Accordion from './Accordion';
import NavTest from './NavTest';
import SummaryReport from './SummaryReport';
import DetailedReport from './DetailedReport';
import Reports from './Reports';
import NotFound from './NotFound';

function AppContent({ authCode }) {
  const [auth, setAuth] = useState(false);

  const params = useMemo(
    () => ({
      method: 'auth_function',
      auth: authCode,
    }),
    [authCode]
  );

  useEffect(() => {
    const setLocalStorageData = (data) => {
      let dta = data;
      localStorage.setItem("ReqData", JSON.stringify(dta));
    };

    axios
      .get(apiPath, { params })
      .then(response => {
        let data = response.data.data;
        console.log('data',data);
        let dataLength = Object.keys(data.userDetails).length;
        if (!dataLength) {
          alert('Invalid Auth!');
          setAuth(false);
        } else {
          setAuth(true);
          setLocalStorageData(data)
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [params]);

  return (
    <Router>
      {auth ? (
        <>
          <Navbar authCode={authCode} />
          <ModalExample />
          {/* Render other components based on routes */}
          <Routes>
            <Route path={preURLValue} element={<CourseSectionDataList authCode={authCode} />} />
            <Route path={preURLValue+"summary_report"} element={<SummaryReport />} />
            <Route path={preURLValue+"detailed_report"} element={<DetailedReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      ) : (
        <p></p>
      )}
    </Router>
  );
}

function App() {
  var query = window.location.search;
  var paramters = new URLSearchParams(query);
  var auth_code = paramters.get('auth_code');

  return (
    <div>
      {/* Pass authCode to the AppContent component */}
      <AppContent authCode={auth_code} />
    </div>
  );
}

export default App;