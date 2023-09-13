import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import apiPath from './includes/config';
import { MDBDataTable, MDBBtn } from 'mdbreact';
import JoinModal from './JoinModal';
import ModalExample from './ModalExample';
import Accordion from './Accordion'; // Import your Accordion component
import EditMeetingRecord from './EditMeetingRecord';

const CourseSectionDataList = (props) => {

  const [showModal, setShowModal] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [editRowData, setEditRowData] = useState([]);
  const [rowIndexx, setRowIndexx] = useState(null);


  const [facultySectionData, setfacultySectionData] = useState([]);
  const [createdCourseSectionList, setCreatedCourseSectionList] = useState([]);

  const { authCode } = props;
  const localData = JSON.parse(localStorage.getItem("ReqData"));
  const collegeId = (localData.clgDetails)[0].college_id;
  const userId = (localData.userDetails)[0].user_id;
  const userType = (localData.userDetails)[0].user_type;

  var landingMethod = 'getFacultySectionDetail';
  if (userType == 1) {
    landingMethod = 'getSemesterCourseSectionDetailByUser';
  }

  const params = useMemo(
    () => ({
      method: landingMethod,
      auth: authCode,
      college_id: collegeId,
      user_id: userId
    }),
    [authCode]
  );

  useEffect(() => {
    const storedEnabledButtons = JSON.parse(localStorage.getItem('enabledJoinButtons')) || [];
    setEnabledJoinButtons(storedEnabledButtons);
    axios
      .get(apiPath, { params })
      .then(response => {
        // let responseFacultySectionData = ((response.data.data.getFacultySectionDetail)[0]);
        let responseFacultySectionData = response.data.data[landingMethod];
        // console.log('resp',responseFacultySectionData);return;
        let responseCreatedCourseSection = (response.data.data.getCreatedCourseSectionList);
        setfacultySectionData(responseFacultySectionData);
        setCreatedCourseSectionList(responseCreatedCourseSection);

      })
      .catch(error => {
        console.error(error);
      });
  }, [params]);


  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleJoinModal = () => {
    setShowJoinModal(!showJoinModal);
  };
  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const isButtonEnabled = userId === 5 || userId === 10; // Define the condition

  function CreateButton({ rowData, rowIndex, rowObject, toggleJoinButton, toggleModal }) {
    const handleCreateEvent = () => {
      setRowData(rowObject);
      setRowIndexx(rowIndex);
      toggleModal();
    }
    const isCreateButtonEnabled = userType === 5 || userType === 10 || userType === 6; // Define the condition

    return (
      <>
        {isCreateButtonEnabled && ( // Only render the button if the condition is met
          <button
            type="button"
            color="primary"
            className="btn btn-success custBtn"
            onClick={handleCreateEvent}
          >
            Create
          </button>
        )}
      </>
    );
  }

  function JoinButton({ rowData, rowIndex, rowObject, toggleJoinButton, toggleModal }) {
    const handleJoinEvent = () => {
      // toggleJoinModal();
    setRowData(rowObject);
    setIsEdited(false);
    setIsDeleted(false);
    setIsRecording(false);

    const localData = JSON.parse(localStorage.getItem("ReqData"));
    const collegeId = (localData.clgDetails)[0].college_id;
    const userId = (localData.userDetails)[0].user_id;
    const userEmail = (localData.userDetails)[0].email;
    const userType = (localData.userDetails)[0].user_type;
    const userName = (localData.userDetails)[0].name;
    const userUsn = (localData.userDetails)[0].usn;

    var editParams = {
      "method": "createJoinMeetingLink",
      "collegeId": collegeId,
      "userId": userId,
      "userEmail": userEmail,
      "userRole": userType,
      "userName" : userName, 
      "userUsn" : userUsn, 
      // "courseId" : rowObject.course_id,
      "sectionId" : rowObject.section_id,
      "authCode" : authCode
  };

  axios.get(apiPath, { params: editParams })
      .then(response => {
        if( response.data.status_code == 401){
          alert('Meeting is not running! Wait For Moderator To Join.');
          return;
        }
        // window.location.href = response.data.data;
        const link = document.createElement('a');
        link.href = response.data.data;
        link.target = '_blank';
        link.click();
      })
      .catch(error => {
          console.error(error);
      });
    
      
    const { rowData } = props;
      // alert(`Course : ${rowObject.section_name} \nSection : ${rowObject.course_name}`);
    }
    const isJoinButtonEnabled = createdCourseSectionList.some(item =>
      rowData === `joinButton:-:${item.course_name}:-:${item.section_id}`
    );
    

    return (
      <>
        {isJoinButtonEnabled && ( // Only render the button if the condition is met
          <button
            type="button"
            color="primary"
            className="btn btn-dark custBtn"
            onClick={handleJoinEvent}
          >
            Join
          </button>
        )}
      </>
    );
    
    // return (
    //   <button
    //     type="button"
    //     color="primary"
    //     // class="btn btn-primary custBtn"
    //     {...props}
    //     className={`btn btn-primary custBtn ${isJoinButtonEnabled ? '' : 'disabled'}`}
    //     onClick={isJoinButtonEnabled ? handleJoinEvent : null}
    //   >
    //     Join
    //   </button>
    // );
  }

  function EditButton({ rowData, rowIndex, rowObject, toggleJoinButton }) {
    const handleEditEvent = () => {
     
      const localData = JSON.parse(localStorage.getItem("ReqData"));
      const collegeId = (localData.clgDetails)[0].college_id;
      const userId = (localData.userDetails)[0].user_id;
      const userEmail = (localData.userDetails)[0].email;
      const userType = (localData.userDetails)[0].user_type;
      const userName = (localData.userDetails)[0].name;
      var editParams = {
          "method": "getRecordsToEdit",
          "collegeId": collegeId,
          "userId": userId,
          "userEmail": userEmail,
          "userRole": userType,
          "userName" : userName,
          "courseId" : rowObject.course_id,
          "sectionId" : rowObject.section_id
      };

      axios.get(apiPath, { params: editParams })
          .then(response => {
              setRowData(rowObject);
              setRowIndexx(rowIndex);
              toggleEditModal();
              setIsEdited(true);
              setIsDeleted(false);
              setIsRecording(false);
              setEditRowData(response.data.data);
          })
          .catch(error => {
              console.error(error);
          });
    }
    const isEditButtonVisible = userType === 5 || userType === 10 || userType === 6; // Define the condition
    const isEditButtonEnabled = createdCourseSectionList.some(item =>
      rowData === `editButton:-:${item.course_name}:-:${item.section_id}`
    );
    return (
      <>
        {isEditButtonVisible && ( // Only render the button if the condition is met
          <button
            type="button"
            color="primary"
            className={`btn btn-info custBtn ${isEditButtonEnabled ? '' : 'disabled'}`}
            onClick={handleEditEvent}
          >
            Edit
          </button>
        )}
      </>
    );
  }

  function DeleteButton({ rowData, rowIndex, rowObject, toggleJoinButton }) {
    const handleDeleteEvent = () => {
     
      const localData = JSON.parse(localStorage.getItem("ReqData"));
      const collegeId = (localData.clgDetails)[0].college_id;
      const userId = (localData.userDetails)[0].user_id;
      const userEmail = (localData.userDetails)[0].email;
      const userType = (localData.userDetails)[0].user_type;
      const userName = (localData.userDetails)[0].name;
      var editParams = {
          "method": "getRecordsToEdit",
          "collegeId": collegeId,
          "userId": userId,
          "userEmail": userEmail,
          "userRole": userType,
          "userName" : userName,  
          "courseId" : rowObject.course_id,
          "sectionId" : rowObject.section_id
      };

      axios.get(apiPath, { params: editParams })
          .then(response => {

              setRowData(rowObject);
              setRowIndexx(rowIndex);
              toggleJoinModal();
              setIsDeleted(true);
              setIsEdited(false);
              setIsRecording(false);
              setEditRowData(response.data.data);
          })
          .catch(error => {
              console.error(error);
          });
    }
    const isDeleteButtonvisible = userType === 5 || userType === 10 || userType === 6; // Define the condition
    const isDeleteButtonEnabled = createdCourseSectionList.some(item =>
      rowData === `deleteButton:-:${item.course_name}:-:${item.section_id}`
    );
    return (
      <>
        {isDeleteButtonvisible && ( // Only render the button if the condition is met
          <button
            type="button"
            color="primary"
            className={`btn btn-danger custBtn ${isDeleteButtonEnabled ? '' : 'disabled'}`}
            onClick={handleDeleteEvent}
          >
            Delete
          </button>
        )}
      </>
    );
  }

  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // Add state for accordion

  function RecordingButton({ rowData, rowIndex, rowObject, toggleJoinButton }) {

    setIsAccordionOpen(true);

    const handleRecordingEvent = () => { 
      const localData = JSON.parse(localStorage.getItem("ReqData"));
      const collegeId = (localData.clgDetails)[0].college_id;
      const userId = (localData.userDetails)[0].user_id;
      const userEmail = (localData.userDetails)[0].email;
      const userType = (localData.userDetails)[0].user_type;
      const userName = (localData.userDetails)[0].name;
      var editParams = {
          "method": "getRecordsToEdit",
          "collegeId": collegeId,
          "userId": userId,
          "userEmail": userEmail,
          "userRole": userType,
          "userName" : userName,  
          "courseId" : rowObject.course_id,
          "sectionId" : rowObject.section_id
      };

      axios.get(apiPath, { params: editParams })
          .then(response => {
              setRowData(rowObject);
              setRowIndexx(rowIndex);
              toggleJoinModal();
              setIsDeleted(false);
              setIsRecording(true);
              setIsEdited(false);
              setEditRowData(response.data.data);
          })
          .catch(error => {
              console.error(error);
          });
    }

    const isCreateButtonEnabled = userType === 5 || userType === 10 || userType === 6; // Define the condition
    const isCreatedButton = createdCourseSectionList.some(item =>
      rowData === `recordingButton:-:${item.course_name}:-:${item.section_id}`
    );
    return (
      <>
        { isCreatedButton && ( // Only render the button if the condition is met
          <button
            type="button"
            color="primary"
            className={`btn btn-warning custBtn ${isCreatedButton ? '' : 'disabled'}`}
            onClick={handleRecordingEvent}
          >
            Recordings
          </button>
        )}
      </>
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

  // const mappedData = {
  //   columns,
  //   rows: facultySectionData.map((row, index) => ({
  //     ...row,
  //     sr_no: index + 1,
  //     action: [<CreateButton rowData={row} rowIndex={index} />, <JoinButton rowData={row} rowIndex={index} />] // Replace with your action button component or JSX    
  //   }))
  // };

  const [enabledJoinButtons, setEnabledJoinButtons] = useState([]);

  const toggleJoinButton = (rowIndex) => {
    const updatedEnabledButtons = [...enabledJoinButtons];
    updatedEnabledButtons[rowIndex] = true;
    setEnabledJoinButtons(updatedEnabledButtons);
    localStorage.setItem('enabledJoinButtons', JSON.stringify(updatedEnabledButtons));
  };

  const mappedData = {
    columns,
    rows: facultySectionData.map((row, index) => {
      // console.log('rowww', row); // Log the row data here
      const isJoinButtonEnabled = enabledJoinButtons[index];
      // disabled={!isJoinButtonEnabled}
      return {
        ...row,
        sr_no: index + 1,
        action: [<CreateButton rowData={`createButton:-:${row.course_name}:-:${row.section_name}`} rowIndex={index} rowObject={row} toggleModal={() => toggleModal(index)} />, 

        <EditButton rowData={`editButton:-:${row.course_name}:-:${row.section_id}`} rowIndex={index} rowObject={row} />,
        <DeleteButton rowData={`deleteButton:-:${row.course_name}:-:${row.section_id}`} rowIndex={index} rowObject={row} />,
        <br /> ,
        <JoinButton rowData={`joinButton:-:${row.course_name}:-:${row.section_id}`} rowIndex={index} rowObject={row} toggleModal={() => toggleModal(index)} />,
        <RecordingButton rowData={`recordingButton:-:${row.course_name}:-:${row.section_id}`} rowIndex={index} rowObject={row} />
      ] // Replace with your action button component or JSX    
      };
    })
  };
  // console.log('mapped', mappedData.rows);
  return (
    <>
      <MDBDataTable
        striped
        bordered
        hover
        data={mappedData}
      />
      {showModal && <ModalExample rowData={rowData} rowIndex={rowIndexx} showModal={showModal} toggleModal={toggleModal} toggleJoinButton={toggleJoinButton} authCode={authCode} />}
      {showJoinModal && <JoinModal rowData={rowData} rowIndex={rowIndexx} showModal={showJoinModal} toggleModal={toggleJoinModal} toggleJoinButton={toggleJoinButton} isEdited={isEdited} isDeleted={isDeleted} editRowData={editRowData} isRecording={isRecording}  />}
      {showEditModal && <EditMeetingRecord rowData={rowData} rowIndex={rowIndexx} showModal={showEditModal} toggleModal={toggleEditModal}  editRowData={editRowData}   />}
      
      {/* {isAccordionOpen && ( // Conditionally render the accordion
        <Accordion title="Accordion Title" content="Accordion Content" />
      )} */}
   
    </>
  );
};

export default CourseSectionDataList;
