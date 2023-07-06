import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import apiPath from './includes/config';
import { MDBDataTable, MDBBtn } from 'mdbreact';



const CourseSectionDataList = (props) => {
  const [facultySectionData, setfacultySectionData] = useState([]);

  const { authCode } = props;
  const localData = JSON.parse(localStorage.getItem("ReqData"));
  const collegeId = (localData.clgDetails)[0].college_id;
  const userId = (localData.userDetails)[0].user_id;

  const params = useMemo(
    () => ({
      method: 'getFacultySectionDetail',
      auth: authCode,
      college_id: collegeId,
      faculty_id: userId
    }),
    [authCode]
  );

  useEffect(() => {
    axios
      .get(apiPath, { params })
      .then(response => {
        let responseFacultySectionData = ((response.data.data.getFacultySectionDetail)[0]);
        setfacultySectionData(responseFacultySectionData);
      })
      .catch(error => {
        console.error(error);
      });
  }, [params]);


  function CreateButton(props) {   
    const handleCreateEvent = () => {
      const { rowData } = props;
      alert(`Course : ${rowData.section_name} \nSection : ${rowData.course_name}`);  
    }
    return (
      <button
        type="button"
        color="primary"
        class="btn btn-primary"
        {...props}
        onClick={handleCreateEvent}
      >
        Create
      </button>
    );
  }

  const columns = [
    {
      label: <strong>Sr. No</strong>,
      field: 'sr_no',
      sort: 'asc',
      width: 100
    },
    {
      label: <strong>Course Name</strong>,
      field: 'course_name',
      sort: 'asc',
      width: 200
    },
    {
      label: <strong>Section Name</strong>,
      field: 'section_name',
      sort: 'asc',
      width: 250
    },
    {
      label: <strong>Action</strong>,
      field: 'action',
      sort: 'disabled',
      width: 100,
      // render: (data) => <CreateButton   {...data} />
    }
  ];
  
  const mappedData = {
    columns,
    rows: facultySectionData.map((row, index) => ({
      ...row,
      sr_no: index + 1,
      action: [<CreateButton rowData = {row} rowIndex={index}/>] // Replace with your action button component or JSX    
    }))
  };
  
  return (
    <MDBDataTable
      striped
      bordered
      hover
      data={mappedData}
    />
  );

};

export default CourseSectionDataList;
