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
import apiPath from './includes/config';
import CryptoJS from 'crypto-js';
import * as qs from 'qs';
import Select from 'react-select';
import EditMeetingRecord from './EditMeetingRecord';
import ModalExample from './ModalExample';
import CustomModal from './CustomModal';
export default function JoinModal({ rowData, rowIndex, showModal, toggleModal, toggleJoinButton, isEdited, isDeleted, editRowData, isRecording }) {

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedRecordingOption, setSelectedRecordingOption] = useState(null);
    const [getRecordByMeetingId, setGetRecordByMeetingId] = useState(null);
    const [openEditCreateModal, setOpenEditCreateModal] = useState(false);
    const [options, setDropdownOption] = useState([]);
    const [recordingOptions, setRecordingOptions] = useState([]);
    const [hasRecording, sethasRecording] = useState(false);

    const localData = JSON.parse(localStorage.getItem("ReqData"));
    const collegeId = (localData.clgDetails)[0].college_id;
    const userId = (localData.userDetails)[0].user_id;
    const userEmail = (localData.userDetails)[0].email;
    const userType = (localData.userDetails)[0].user_type;

    const params = useMemo(
        () => ({
            method: 'getCreatedMeetingList',
            collegeId: collegeId,
            userId: userId,
            userEmail: userEmail,
            courseId: rowData.course_id,
            sectionId: rowData.section_id,
            deptId: rowData.department_id,
            userType: userType

        }),
        []
    );

    const [formValue, setFormValue] = useState({
        selectMeeting: ''
    });
    useEffect(() => {
        axios
            .get(apiPath, { params })
            .then(response => {
                var meetingData = response.data.data;
                if (meetingData.length > 0) {
                    const options = meetingData.map((meeting) => ({
                        value: meeting.meeting_id.toString(),
                        label: `Meeting Name: ${meeting.virtual_classroom_name}`,
                    }));
                    setDropdownOption(options);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, [params]);

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

            console.log('Selected value:', selectedOption.value);
            const deleteParams = {
                "method": "deleteRecordByMeetingId",
                "meetingId": selectedOption.value,
            };
            axios.get(apiPath, { params: deleteParams })
                .then(response => {
                    console.log(response);
                    if (response.status == 200) {
                        alert("Meeting Deleted Successfully!")
                        toggleModal();
                        return true;
                    }
                    alert("Meeting Deleted Failed!")


                })
                .catch(error => {
                    console.error(error);
                });

        }
    }
    const getRecordDataByMeeting = (event) => {
        event.preventDefault();
        if (selectedOption) {
            console.log('Selected value:', selectedOption.value);
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
            console.log('Selected value:', selectedOption.value);
            setRecordingOptions([]);
            setSelectedRecordingOption(null);
            const joinParams = {
                "method": "getRecordings",
                "meetingId": selectedOption.value,
            };
            axios.get(apiPath, { params: joinParams })
                .then(response => {
                    console.log('RESPO',response);
                    if(response.data.messageKey == "noRecordings"){
                        sethasRecording(false);
                        alert(response.data.message);
                        return false;
                    }
                    if (response.data.returncode == "SUCCESS") {
                        // let recUrl = response.data.recordings.recording.playback.format.url;
                        let recUrl = response.data.recordings.recording;
                        
                        // const options1 = ({
                        //     value: `${recUrl}`,
                        //     label: `${recUrl}`,
                        // });
                        
                        const options1 = recUrl.map((rec, index) => ({
                            value:rec.playback.format.url.toString(),
                            label: `Recording ${index + 1}`,
                          
                        }));
                       
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
        if(selectedRecordingOption){
        
            const link = document.createElement('a');
            link.href = selectedRecordingOption.value;
            link.target = '_blank';
            link.click();
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedOption) {
            console.log('Selected value:', selectedOption.value);

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
                    console.log('resp', response.data.data);
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

    return (
        <>
            <MDBModal show={showModal} onHide={toggleModal} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Meeting List</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleModal}></MDBBtn>
                        </MDBModalHeader>

                        <form id="formData" ref={formRef} onSubmit={handleSubmit}>
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
                                        <MDBBtn color='seco ndary' onClick={toggleModal}>
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

    