import React, { useState, useRef, useMemo, useEffect } from 'react';
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


export default function EditMeetingRecord({ rowData, rowIndex, showModal, toggleModal, toggleJoinButton, editRowData, getRecordByMeetingId }) {

  const [isWaitForModerator, setIsWaitForModerator] = useState(false);
  const [isSessionRecorded, setIsSessionRecorded] = useState(false);
  const [dateValue1, onChangeDate1] = useState(new Date());
  const [dateValue2, onChangeDate2] = useState(new Date());

  const [formValue, setFormValue] = useState({
    fname: '',
    lname: 'Otto',
    virtualClassroomName: editRowData[0].virtual_classroom_name,
    welcomeMessage: editRowData[0].welcome_message,
    dept_id: editRowData[0].department_id,
    course_id: editRowData[0].course_id,
    section_id: editRowData[0].section_id,
    meeting_id : editRowData[0].meeting_id,
    college_id: '',
    user_id: '',
    user_email: '',
    course_name: rowData.course_name,
    section_name: rowData.section_name,
  });
  // return;
  useEffect(() => {

    if (editRowData) {
      const [firstRowData] = editRowData; // Assuming editRowData is an array
      // console.log('firstRo', firstRowData);
      setIsWaitForModerator(firstRowData.is_wait_for_moderator === 1);
      setIsSessionRecorded(firstRowData.is_session_recorded === 1);

      onChangeDate1(firstRowData.start_date);
      onChangeDate2(firstRowData.end_date);
    }

    // Update course_name and section_name based on rowData
    // if (rowData) {
    //   setFormValue({
    //     ...formValue,
    //     course_name: rowData.course_name,
    //     section_name: rowData.section_name,
    //   });
    // }

  }, [editRowData, rowData]);



  // let courseName = ''; // Define courseName outside the if-else block
  // let sectionName = '';
  // let deptId = '';
  // let courseId = '';
  // let sectionId = '';
  // let vClassName = '';
  // let welMsg = '';
  // if (typeof rowData == 'undefined') {
  //   courseName = 'null';
  //   sectionName = 'null';
  // } else {
  //   courseName = rowData.course_name;
  //   sectionName = rowData.section_name;
  //   deptId = rowData.department_id;
  //   courseId = rowData.course_id;
  //   sectionId = rowData.section_id;
  //   if(editRowData){
  //     vClassName = editRowData[0].virtual_classroom_name;
  //     welMsg = editRowData[0].welcome_message;
  //     if(editRowData[0].is_session_recorded == 1){
  //       setIsSessionRecorded(true);
  //     }else{
  //       setIsSessionRecorded(false);
  //     }

  //     if(editRowData[0].is_wait_for_moderator == 1){
  //       setIsWaitForModerator(true);
  //     }else{
  //       setIsWaitForModerator(false);
  //     }      
  //   }
  // }


  // const localData = JSON.parse(localStorage.getItem("ReqData"));
  // const collegeId = (localData.clgDetails)[0].college_id;
  // const userId = (localData.userDetails)[0].user_id;
  // const userEmail = (localData.userDetails)[0].email;



  // const [formValue, setFormValue] = useState({
  //   fname: '',
  //   lname: 'Otto',
  //   virtualClassroomName: editRowData[0].virtual_classroom_name,
  //   welcomeMessage: editRowData[0].welcome_message,
  //   dept_id: editRowData[0].department_id,
  //   course_id: editRowData[0].course_id,
  //   section_id: editRowData[0].section_id,
  //   college_id: collegeId,
  //   user_id: userId,
  //   user_email: userEmail,
  //   course_name: courseName,
  //   section_name: sectionName,
  // });

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };



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
        // console.log('resp', response);
        let respMeetingId = response.data.data.meetingId;
        let respMeetingName = response.data.data.meetingName;
        // createMeeting(respMeetingId, respMeetingName);
        if (response.data.status_code == 200) {
          alert(`Meeting Details has been updated successfully!`);
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
    const meetingId = formValue.meeting_id;

    const virtualClassroomName = formValue.virtualClassroomName;
    // const sqlFormattedStartDateTime = dateValue1.toISOString().slice(0, 19).replace("T", " ");
    // const sqlFormattedEndDateTime = dateValue2.toISOString().slice(0, 19).replace("T", " ");

    const sqlFormattedStartDateTime = dateValue1;
    const sqlFormattedEndDateTime = dateValue2;


    const welcomeMessage = formValue.welcomeMessage;

    const insertParams = ({
      method: 'updateMeetingDetail',
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
      createdByCollegeId: createdByCollegeId,
      meetingId : meetingId
    });

    insertClassDetails(insertParams);
    toggleModal();
  };

  return (
    <>
      <MDBModal show={showModal} onHide={toggleModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit</MDBModalTitle>
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
                  <div className='form-group row align-items-center'>
                    <label className='col-sm-3 col-form-label font-weight-bold'>Start Date</label>
                    <div className='col-sm-9'>
                      <DateTimePicker
                        className='date-time-picker'
                        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                        onChange={onChangeDate1}
                        value={dateValue1}
                      />
                    </div>
                  </div>
                </div>


                <div className='col-12'>
                  <div className='form-group row align-items-center'>
                    <label className='col-sm-3 col-form-label font-weight-bold'>End Date</label>
                    <div className='col-sm-9'>
                      <DateTimePicker className='endDate-time-picker' style={{ border: '1px solid #ccc', borderRadius: '4px' }} onChange={onChangeDate2} value={dateValue2} />
                    </div>
                  </div>
                </div>

              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn color='secondary' onClick={toggleModal}>
                  Close
                </MDBBtn>
                <MDBBtn type='submit' >Update changes</MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}

