import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import apiPath from './includes/config';
import CourseSectionDataList from './CourseSectionDataList';
import DatatablePage from './DatatablePage';
import DatatableReact from './DatatableReact';

import Navbar from './Navbar';
import ModalExample from './ModalExample';
import FormPage from './FormPage';

function App() {
  const [posts, setPosts] = useState([]);
  const [auth, setAuth] = useState(false);

  var query = window.location.search;
  var paramters = new URLSearchParams(query);
  var auth_code = paramters.get('auth_code');
  const params = useMemo(
    () => ({
      method: 'auth_function',
      auth: auth_code,
    }),
    [auth_code]
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
        let dataLength = Object.keys(data.userDetails).length;
        if (!dataLength) {
          alert('Invalid Auth!');
          setAuth(false);
          return;
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
    <div>
      {/* <h1>User Authentication!</h1> */}
      {auth ? (
        <>
        <Navbar />
        <CourseSectionDataList authCode={auth_code} />
        <ModalExample />
        <FormPage />

        {/* <DatatablePage /> */}
        {/* <DatatableReact authCode={auth_code}/> */}
        {/* <p>You are logged in!</p> */}
        </>
   
      ) : (
        <p></p>
      )}
    </div>);
}

export default App;