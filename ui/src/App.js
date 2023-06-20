import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import apiPath from './includes/config';


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
    axios
      .get(apiPath, { params })
      .then(response => {
        let data = response.data.data;
        let dataLength = Object.keys(data.auth).length;
        if (!dataLength) {
          alert('Invalid Auth!');
          setAuth(false);
          return;
        } else {
          // alert('true');
          setAuth(true);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [params]);

  // console.log(auth);return;
  
  return (
    <div>
      <h1>User Authentication!</h1>
      {auth ? (
        <p>You are logged in!</p>
      ) : (
        <p></p>
      )}
    </div>);
}

export default App;