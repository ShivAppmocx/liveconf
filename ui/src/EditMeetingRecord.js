import React, { useState, useRef, useMemo } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBInputGroup,
  MDBValidation,
  MDBValidationItem
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { DateTimePicker } from 'react-datetime-picker';
import apiPath from './includes/config';
import CryptoJS from 'crypto-js';
import * as qs from 'qs';


export default function EditMeetingRecord({ rowData, rowIndex, showModal, toggleModal, toggleJoinButton, getRecordByMeetingId }) {

  console.log('getRecordByMeetingId', getRecordByMeetingId );
  
 
  let courseName = ''; // Define courseName outside the if-else block
  let sectionName = '';
  let deptId = '';
  let courseId = '';
  let sectionId = '';
  let vClassName = '';
  let welMsg = '';
  if (typeof rowData == 'undefined') {
    courseName = 'null';
    sectionName = 'null';
  } else {
    courseName = rowData.course_name;
    sectionName = rowData.section_name;
    deptId = rowData.department_id;
    courseId = rowData.course_id;
    sectionId = rowData.section_id;
    if(getRecordByMeetingId){
      vClassName = getRecordByMeetingId.virtual_classroom_name;
      welMsg = getRecordByMeetingId.welcome_message;
      console.log('inn',vClassName);      
    }
  }

  const [dateValue1, onChangeDate1] = useState(new Date());
  const [dateValue2, onChangeDate2] = useState(new Date());

  const localData = JSON.parse(localStorage.getItem("ReqData"));
  const collegeId = (localData.clgDetails)[0].college_id;
  const userId = (localData.userDetails)[0].user_id;
  const userEmail = (localData.userDetails)[0].email;

  const initialFormValue = getRecordByMeetingId
  ? {
      fname: '',
      lname: 'Otto',
      virtualClassroomName: getRecordByMeetingId.virtual_classroom_name,
      welcomeMessage: getRecordByMeetingId.welcome_message,
      dept_id: getRecordByMeetingId.department_id,
      course_id: getRecordByMeetingId.course_id,
      section_id: getRecordByMeetingId.section_id,
      college_id: collegeId,
      user_id: userId,
      user_email: userEmail,
    }
  : {
      fname: '',
      lname: 'Otto',
      course_name: courseName,
      section_name: sectionName,
      virtualClassroomName: '',
      welcomeMessage: '',
      dept_id: deptId,
      course_id: courseId,
      section_id: sectionId,
      college_id: collegeId,
      user_id: userId,
      user_email: userEmail,
    };

    console.log('initialFormValue',initialFormValue);

const [formValue, setFormValue] = useState(initialFormValue);


  // const [formValue, setFormValue] = useState({
  //   fname: '',
  //   lname: 'Otto',
  //   course_name: courseName,
  //   section_name: sectionName,
  //   virtualClassroomName: vClassName,
  //   welcomeMessage: welMsg,
  //   dept_id: deptId,
  //   course_id: courseId,
  //   section_id: sectionId,
  //   college_id: collegeId,
  //   user_id: userId,
  //   user_email: userEmail
  // });

  if (getRecordByMeetingId && getRecordByMeetingId.welcomeMessage) {
    // setFormValue(prevFormValue => ({
    //   ...prevFormValue,
    //   welcomeMessage: getRecordByMeetingId.welcomeMessage
    // }));
   
    // setFormValue({ ...formValue, "welcomeMessage": getRecordByMeetingId.welcomeMessage });
    
  }
  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const getFormData = (e) => {
    e.preventDefault();
    alert('aa');
  }
  const [isWaitForModerator, setIsWaitForModerator] = useState(true);
  const [isSessionRecorded, setIsSessionRecorded] = useState(true);

  const handleWaitForModeratorChange = () => {
    setIsWaitForModerator(!isWaitForModerator);
  };

  const handleSessionRecordedChange = () => {
    setIsSessionRecorded(!isSessionRecorded);
  };

  const insertClassDetails = (params) => {
    axios
      .get(apiPath, { params })
      .then(response => {
        console.log('resp', response);
        let respMeetingId = response.data.data.meetingId;
        let respMeetingName = response.data.data.meetingName;
        // createMeeting(respMeetingId, respMeetingName);
        if (response.data.status_code == 200) {
          alert(`Meeting with meeting id ${response.data.data.meetingId} has been Created and Saved Successfully!`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }


  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const courseName = formValue.course_name;
    const sectionName = formValue.section_name;
    const courseId = formValue.course_id;
    const sectionId = formValue.section_id;
    const deptId = formValue.dept_id;
    const createdByUserId = formValue.user_id;
    const createdByUserEmail = formValue.user_email;
    const createdByCollegeId = formValue.college_id;

    const virtualClassroomName = formValue.virtualClassroomName;
    const sqlFormattedStartDateTime = dateValue1.toISOString().slice(0, 19).replace("T", " ");
    const sqlFormattedEndDateTime = dateValue2.toISOString().slice(0, 19).replace("T", " ");
    const welcomeMessage = formValue.welcomeMessage;


    const insertParams = ({
      method: 'saveMeetingDetail',
      courseName: courseName,
      sectionName: sectionName,
      virtualClassroomName: virtualClassroomName,
      welcomeMessage: welcomeMessage,
      isWaitForModerator: isWaitForModerator,
      isSessionRecorded: isSessionRecorded,
      startDate: sqlFormattedStartDateTime,
      endDate: sqlFormattedEndDateTime,
      deptId: deptId,
      sectionId: sectionId,
      courseId: courseId,
      createdByUserId: createdByUserId,
      createdByUserEmail: createdByUserEmail,
      createdByCollegeId: createdByCollegeId
    });

    insertClassDetails(insertParams);
    toggleModal();
    toggleJoinButton(rowIndex);
  };

  return (
    <>
      <MDBModal show={showModal} onHide={toggleModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modal title</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
            </MDBModalHeader>
            <form id="formData" ref={formRef} onSubmit={handleSubmit}>
              <MDBModalBody>
                <MDBValidation className='row g-2'>
                  <div className='col-md-6'>
                    <MDBInput
                      value={formValue.dept_id}
                      namey='dept_id'
                      id='dept_id'
                      hidden
                    />
                    <MDBInput
                      value={formValue.course_id}
                      namey='course_id'
                      id='course_id'
                      hidden
                    />
                    <MDBInput
                      value={formValue.section_id}
                      namey='section_id'
                      id='section_id'
                      hidden
                    />
                    <MDBInput
                      value={formValue.course_name}
                      name='course_name'
                      onChange={onChange}
                      id='course_name'
                      required readonly
                      label='Course Name'
                    />
                  </div>

                  <div className='col-md-6'>
                    <MDBInput
                      value={formValue.section_name}
                      name='section_name'
                      onChange={onChange}
                      id='section_name'
                      required readonly
                      label='Section Name'
                    />
                  </div>

                  <MDBValidationItem className='col-md-12' feedback='Please provide a Virtual ClassRoom Name.' invalid>
                    <MDBInput
                      value={formValue.virtualClassroomName}
                      name='virtualClassroomName'
                      onChange={onChange}
                      id='virtualClassroomName'
                      required
                      label='Virtual Classroom Name'
                    />
                  </MDBValidationItem>
                  <MDBValidationItem className='col-md-12' feedback='Please provide Welcome Message.' invalid>
                    <MDBTextArea
                      value={formValue.welcomeMessage}
                      name='welcomeMessage'
                      onChange={onChange}
                      id='welcomeMessage'
                      required
                      label='Welcome Message'
                    />
                  </MDBValidationItem>
                </MDBValidation>
                <div className='row g-2'>
                  <div className='col-6'>
                    <MDBCheckbox
                      id='form6Example8'
                      label='Wait for Moderator'
                      checked={isWaitForModerator}
                      onChange={handleWaitForModeratorChange}
                    />
                  </div>
                  <div className='col-6'>
                    <MDBCheckbox
                      id='form6Example9'
                      label='Session can be recorded'
                      checked={isSessionRecorded}
                      onChange={handleSessionRecordedChange}
                    />
                  </div>
                </div>

                <div className='col-12'>
                  <label>Start Date</label>
                  <DateTimePicker onChange={onChangeDate1} value={dateValue1} />
                </div>
                <div className='col-12'>
                  <label>End Date</label>

                  <DateTimePicker onChange={onChangeDate2} value={dateValue2} />
                </div>

              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn color='secondary' onClick={toggleModal}>
                  Close
                </MDBBtn>
                <MDBBtn type='submit' >Save changes</MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

