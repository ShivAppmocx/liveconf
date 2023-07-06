import DataTable from "react-data-table-component";
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import apiPath from './includes/config';

const DatatableReact = (props) =>  {

    // const [facultySectionData, setfacultySectionData] = useState([]);
    // const [facultySectionData, setfacultySectionData] = useState([]);
    const [records, setRecords] = useState([]);

    const { authCode } = props;
    const localData  =  JSON.parse(localStorage.getItem("ReqData"));
    const collegeId = (localData.clgDetails)[0].college_id;
    const userId = (localData.userDetails)[0].user_id;

     const params = useMemo(
            () => ({
              method: 'getFacultySectionDetail',
              auth: authCode,
              college_id : collegeId,
              faculty_id : userId
            }),
            [authCode]
          );
      
          useEffect(() => {
            axios
              .get(apiPath, { params })
              .then(response => {
                 let responseFacultySectionData = ((response.data.data.getFacultySectionDetail)[0]);
                //  setfacultySectionData(responseFacultySectionData);
                setRecords(responseFacultySectionData);

              })
              .catch(error => {
                console.error(error);
              });
          }, [params]);

        //   console.log(facultySectionData, 'facultySectionData');


  const columns = [
    {
      name: "Section Name",
      selector: (row) => row.section_name,
      sortable: true
    },
    {
      name: "Column Name",
      selector: (row) => row.course_name,
      sortable: true
    },
    {
      name : "Action",
      selector: (row) => <button>Add</button>
    }
  ];






//   const [records, setRecords] = useState(data);
  const handleFilter = (event) => {
    // console.log('data',records);
    const newData = records.filter((row) => {
        console.log('aa',row);
    //   return row.name.toLowerCase().includes(event.target.value.toLowerCase());
    return (row.course_name ?? '').toLowerCase().includes(event.target.value.toLowerCase());
    })
    setRecords(newData);
  }

  return (
    <div className="container">
      <div className="text-end"><input type="text" onChange={handleFilter} placeholder="Filter..."/></div>
      <DataTable
        columns={columns}
        data={records}
        selectableRows
        fixedHeader
        pagination
      />
    </div>
  );
}

export default DatatableReact;