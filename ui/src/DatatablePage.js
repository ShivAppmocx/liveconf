import React from 'react';
import { MDBDataTable, MDBBtn } from 'mdbreact';

const DatatablePage = () => {
  function MyButton(props) {
    const handleCreateEvent= () => {
      alert('create Event');
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
 
  const data = [
    {
        "section_id": 1088,
        "section_report_id": 2586,
        "course_name": "Engineering Physics (16PH12/16PH22)",
        "section_name": "Section A",
        "term_batch_sem_no": 0,
        "start_date": "NA",
        "end_date": "NA",
        "Test_name": "Quiz 1",
        "is_archived": 0
    },
    {
        "section_id": 1088,
        "section_report_id": 3296,
        "course_name": "Engineering Physics (16PH12/16PH22)",
        "section_name": "Section A",
        "term_batch_sem_no": 0,
        "start_date": "NA",
        "end_date": "NA",
        "Test_name": "Attendance",
        "is_archived": 0
    },
    {
        "section_id": 1089,
        "section_report_id": 3309,
        "course_name": "Basic Electronics Engineering (16EC14/16EC24)",
        "section_name": "Section A",
        "term_batch_sem_no": 0,
        "start_date": "NA",
        "end_date": "NA",
        "Test_name": "Test 2",
        "is_archived": 0
    },
    {
        "section_id": 1314,
        "section_report_id": 3284,
        "course_name": "Aptitude",
        "section_name": "Section A",
        "term_batch_sem_no": 0,
        "start_date": "NA",
        "end_date": "NA",
        "Test_name": "Quiz 1",
        "is_archived": 0
    },
    {
        "section_id": 3200,
        "section_report_id": 3389,
        "course_name": "architecture 1-3-SEM",
        "section_name": "CV-3-SEM-SEC-B-2021-22",
        "term_batch_sem_no": 1,
        "start_date": "2021-12-01",
        "end_date": "2023-02-28",
        "Test_name": "Test 1",
        "is_archived": 0
    },
    {
        "section_id": 3200,
        "section_report_id": 3394,
        "course_name": "architecture 1-3-SEM",
        "section_name": "CV-3-SEM-SEC-B-2021-22",
        "term_batch_sem_no": 1,
        "start_date": "2021-12-01",
        "end_date": "2023-02-28",
        "Test_name": "Test 2",
        "is_archived": 0
    }
];


const columns = [
  {
    label: 'Sr. No',
    field: 'sr_no',
    sort: 'asc',
    width: 100
  },
  {
    label: 'Course Name',
    field: 'course_name',
    sort: 'asc',
    width: 200
  },
  {
    label: 'Section Name',
    field: 'section_name',
    sort: 'asc',
    width: 250
  },
  {
    label: 'Action',
    field: 'action',
    sort: 'disabled',
    width: 100,
    // render: (data) => <MyButton   {...data} />
  }
];

const mappedData = {
  columns,
  rows: data.map((row, index) => ({
    ...row,
    sr_no: index + 1,
    action: <MyButton {...data}/> // Replace with your action button component or JSX
  
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
}

export default DatatablePage;

