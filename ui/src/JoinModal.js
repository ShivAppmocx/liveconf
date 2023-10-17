import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { apiPath, preURLValue } from './includes/config.js';
import CryptoJS from 'crypto-js';
import * as qs from 'qs';
import Select from 'react-select';
import EditMeetingRecord from './EditMeetingRecord';
import ModalExample from './ModalExample';
import CustomModal from './CustomModal';
import Papa from 'papaparse';
import Dropzone from 'react-dropzone';



export default function JoinModal({ rowData, rowIndex, showModal, toggleModal, toggleJoinButton, isEdited, isDeleted, editRowData, isRecording, isUploadAttendee }) {

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedSessionOption, setSelectedSessionOption] = useState(null);

    const [selectedRecordingOption, setSelectedRecordingOption] = useState(null);
    const [getRecordByMeetingId, setGetRecordByMeetingId] = useState(null);
    const [openEditCreateModal, setOpenEditCreateModal] = useState(false);
    const [options, setDropdownOption] = useState([]);
    const [sessionOptions, setSessionOptions] = useState([]);

    const [recordingOptions, setRecordingOptions] = useState([]);
    const [hasRecording, sethasRecording] = useState(false);

    const localData = JSON.parse(localStorage.getItem("ReqData"));
    const collegeId = (localData.clgDetails)[0].college_id;
    const userId = (localData.userDetails)[0].user_id;
    const userEmail = (localData.userDetails)[0].email;
    const userType = (localData.userDetails)[0].user_type;

    const fileInputRef = useRef(null);
    const [formValue, setFormValue] = useState({
        selectMeeting: ''
    });
    useEffect(() => {
        var params = '';
        if (isUploadAttendee) {
            params = {
                method: 'getSessionDateByCourseSection',
                collegeId: collegeId,
                userId: userId,
                userEmail: userEmail,
                courseId: rowData.course_id,
                sectionId: rowData.section_id,
                deptId: rowData.department_id,
                userType: userType,
            };
        } else {
            params = {
                method: 'getCreatedMeetingList',
                collegeId: collegeId,
                userId: userId,
                userEmail: userEmail,
                courseId: rowData.course_id,
                sectionId: rowData.section_id,
                deptId: rowData.department_id,
                userType: userType,
            };
        }

        axios
            .get(apiPath, { params })
            .then((response) => {
                if (isUploadAttendee) {
                    var sessionDate = response.data.data;
                    const length = Object.keys(sessionDate).length;
                    if (length > 0) {
                        const sessionDatee = Object.entries(sessionDate).map(([key, value], index) => ({
                            value: key,
                            label: value,
                        }));
                        setSessionOptions(sessionDatee);
                    }
                } else {
                    var meetingData = response.data.data;
                    if (meetingData.length > 0) {
                        const options = meetingData.map((meeting) => ({
                            value: meeting.meeting_id.toString(),
                            label: `Meeting Name: ${meeting.virtual_classroom_name}`,
                        }));
                        setDropdownOption(options);
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [isUploadAttendee, collegeId, userId, userEmail, rowData.course_id, rowData.section_id, rowData.department_id, userType]);


    const formRef = useRef(null);
    const formRef1 = useRef(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        // Perform the delete operation
        setIsConfirmModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsConfirmModalOpen(false);
    };


    const deleteRecordByMeetingId = (event) => {
        event.preventDefault();
        if (selectedOption) {
            // setIsConfirmModalOpen(true);
            const deleteParams = {
                "method": "deleteRecordByMeetingId",
                "meetingId": selectedOption.value,
            };
            axios.get(apiPath, { params: deleteParams })
                .then(response => {
                    if (response.status == 200) {
                        alert("Meeting Deleted Successfully!")
                        toggleModal();
                        window.location.reload()
                        return true;
                    }
                    alert("Meeting Deleted Failed!")
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    const hanfleFileUpload = (event) => {
        // alert('aa'); 
        if (selectedSessionOption == null) {
            alert("Kindly Select Session Date");
            fileInputRef.current.value = ''
            return true;

        }

        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true, // Assumes the first row contains headers
                complete: (result) => {
                    var params = {
                        "method": "saveAttendeeDetails",
                        "attendeeDetails": result,
                        "selectedSessionOption": selectedSessionOption
                    };
                    uploadAttendeeCSV(params);
                },
                error: (error) => {
                    console.error('CSV parsing error:', error);
                },
            });
        }

    }
    const getRecordDataByMeeting = (event) => {
        event.preventDefault();
        if (selectedOption) {
            const joinParams = {
                "method": "getRecordByMeetingId",
                "meetingId": selectedOption.value,
            };
            axios.get(apiPath, { params: joinParams })
                .then(response => {
                    setGetRecordByMeetingId(response.data.data)
                    alert(selectedOption.value);
                    setOpenEditCreateModal(true);
                })
                .catch(error => {
                    console.error(error);
                });
        }

        // toggleModal();
    }

    const getRecordingByMeetingId = (event) => {
        event.preventDefault();
        if (selectedOption) {
            setRecordingOptions([]);
            setSelectedRecordingOption(null);
            const joinParams = {
                "method": "getRecordings",
                "meetingId": selectedOption.value,
            };

            axios.get(apiPath, { params: joinParams })
                .then(response => {
                    if (response.data.messageKey == "noRecordings") {
                        sethasRecording(false);
                        alert(response.data.message);
                        return false;
                    }
                    if (response.data.returncode == "SUCCESS") {
                        // let recUrl = response.data.recordings.recording.playback.format.url;
                        let recUrl = response.data.recordings.recording;
                        const arrayLength = recUrl.length;

                        // Print the number of elements in the array to the console.
                        var options1 = '';

                        if (arrayLength == undefined) {
                            options1 = [({
                                value: `${recUrl.playback.format.url.toString()}`,
                                label: `Recording1`,
                            })];
                        } else if (arrayLength > 0) {
                            options1 = recUrl.map((rec, index) => ({
                                value: rec.playback.format.url.toString(),
                                label: `Recording ${index + 1}`,
                            }));
                        }

                        setRecordingOptions(options1);
                        sethasRecording(true);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    const handleRecording = (event) => {
        event.preventDefault();
        if (selectedRecordingOption) {

            const link = document.createElement('a');
            link.href = selectedRecordingOption.value;
            link.target = '_blank';
            link.click();
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedOption) {

            const localData = JSON.parse(localStorage.getItem("ReqData"));
            const collegeId = (localData.clgDetails)[0].college_id;
            const userId = (localData.userDetails)[0].user_id;
            const userEmail = (localData.userDetails)[0].email;
            const userType = (localData.userDetails)[0].user_type;
            const userName = (localData.userDetails)[0].name;

            const joinParams = {
                "method": "createJoinMeetingLink",
                "collegeId": collegeId,
                "userId": userId,
                "userEmail": userEmail,
                "userRole": userType,
                "meetingId": selectedOption.value,
                "userName": userName
            };

            axios.get(apiPath, { params: joinParams })
                .then(response => {
                    // window.location.href = response.data.data;
                    const link = document.createElement('a');
                    link.href = response.data.data;
                    link.target = '_blank';
                    link.click();
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.log('No option selected');
        }
    };

    const uploadAttendeeCSV = (data) => {
        axios.get(apiPath, { params: data })
            .then(response => {
                alert( response.data.message);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <>
            <MDBModal show={showModal} onHide={toggleModal} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>

                        {isUploadAttendee ? (
                            <MDBModalHeader>
                                <MDBModalTitle>Upload Attendee</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
                            </MDBModalHeader>
                        ) : (
                            <MDBModalHeader>
                                <MDBModalTitle>Meeting List</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
                            </MDBModalHeader>
                        )}

                        <form id="formData" ref={formRef} onSubmit={handleSubmit}>
                            {isUploadAttendee ? (
                                <MDBModalBody>
                                    <h2>Select Session Date:</h2>
                                    <Select
                                        options={sessionOptions}
                                        value={selectedSessionOption}
                                        onChange={(selected) => setSelectedSessionOption(selected)}
                                        name='selectSession'
                                        id='selectSession'
                                        isSearchable={true}
                                        placeholder="Select an option..."
                                    />
                                    {/* {selectedOption && (
                                        <p>You selected: {selectedOption.label}</p>
                                    )} */}
                                    <button  type="button" color="primary" className="btn btn-primary custBtn">
                                        <input type="file" accept=".csv"  ref={fileInputRef}  onChange={hanfleFileUpload} />
                                    </button>
                                </MDBModalBody>
                            ) : (
                                <MDBModalBody>
                                    <h2>Select a Meeting:</h2>
                                    <Select
                                        options={options}
                                        value={selectedOption}
                                        onChange={(selected) => setSelectedOption(selected)}
                                        name='selectMeeting'
                                        id='selectMeeting'
                                        isSearchable={true}
                                        placeholder="Select an option..."
                                    />
                                    {selectedOption && (
                                        <p>You selected: {selectedOption.label}</p>
                                    )}
                                </MDBModalBody>
                            )}

                            {isEdited ? (
                                <MDBModalFooter>
                                    <MDBBtn color='secondary' onClick={toggleModal}>
                                        Close
                                    </MDBBtn>
                                    <MDBBtn onClick={getRecordDataByMeeting}>Go</MDBBtn>
                                </MDBModalFooter>
                            ) : (
                                isDeleted ? (
                                    <MDBModalFooter>
                                        <MDBBtn color='secondary' onClick={toggleModal}>
                                            Close
                                        </MDBBtn>
                                        <MDBBtn onClick={deleteRecordByMeetingId}>Delete</MDBBtn>
                                    </MDBModalFooter>
                                ) : isRecording ? (
                                    <MDBModalFooter>
                                        <MDBBtn color='secondary' onClick={toggleModal}>
                                            Close
                                        </MDBBtn>
                                        <MDBBtn onClick={getRecordingByMeetingId}>Get Recording</MDBBtn>
                                    </MDBModalFooter>
                                ) : isUploadAttendee ? (
                                    ''
                                ) : (
                                    <MDBModalFooter>
                                        <MDBBtn color='secondary' onClick={toggleModal}>
                                            Close
                                        </MDBBtn>
                                        <MDBBtn type='submit'>Join Meeting</MDBBtn>
                                    </MDBModalFooter>
                                )
                            )}

                        </form>
                        {hasRecording && (

                            <MDBModalBody>
                                <form id="formData1" ref={formRef1} onSubmit={handleRecording}>
                                    <h2>Select a Recording:</h2>
                                    <Select
                                        options={recordingOptions}
                                        value={selectedRecordingOption}
                                        onChange={(selected) => setSelectedRecordingOption(selected)}
                                        name='selectRecording'
                                        id='selectRecording'
                                        isSearchable={true}
                                        placeholder="Select an option..."
                                    />
                                    <MDBModalFooter>
                                        <MDBBtn color='secondary' onClick={toggleModal}>
                                            Close
                                        </MDBBtn>
                                        <MDBBtn type='submit'>Open Recording</MDBBtn>
                                    </MDBModalFooter>
                                </form>
                            </MDBModalBody>
                        )}
                    </MDBModalContent>
                    <MDBModalContent>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {setOpenEditCreateModal && <ModalExample rowData={rowData} rowIndex={rowIndex} showModal={openEditCreateModal} toggleModal={false} toggleJoinButton={toggleJoinButton} getRecordByMeetingId={getRecordByMeetingId} />}
            {isConfirmModalOpen && (
                <CustomModal
                    isConfirmModalOpen={isConfirmModalOpen}
                />
            )}
            {/* {isEdited && <EditMeetingRecord rowData={editRowData} showModal1={true}  toggleModal1={true}  />} */}

        </>
    );
}

