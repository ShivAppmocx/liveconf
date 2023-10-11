// import { MDBDataTable, MDBBtn } from 'mdbreact';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import apiPath from './includes/config';
import Select from 'react-select';
import $ from 'jquery';

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

const DetailedReport = (props) => {

    const localData = JSON.parse(localStorage.getItem("ReqData"));
    const collegeId = (localData.clgDetails)[0].college_id;
    const userId = (localData.userDetails)[0].user_id;
    const userType = (localData.userDetails)[0].user_type;
    const [courseOptions, setCourseOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [dateOptions, setDateOptions] = useState([]);

    const formRef = useRef(null);

    const [selectedCourseOption, setSelectedCourseOption] = useState(null);
    const [selectedSectionOption, setSectionCourseOption] = useState(null);
    const [selectedDateOption, setSelectedDateOption] = useState(null);


    const { authCode } = props;
    const handleSubmit = (event) => {
        event.preventDefault();
        const getSectionByCourseParams = {
            method: "getCSVDataforDetailedReport",
            sectionId: selectedSectionOption.value,
            date: selectedDateOption.label
        };

        axios
            .get(apiPath, { params: getSectionByCourseParams }) // Use 'params' to pass query parameters
            .then(response => {
                if (response.data) {
                    const csvData = response.data;
                    const blob = new Blob([csvData], { type: "text/csv" });
                    const blobUrl = window.URL.createObjectURL(blob);
                    var date = Date.now();
                    const a = document.createElement("a");
                    a.href = blobUrl;
                    a.download = `detailedReport_${date}.csv`; // Set the desired file name
                    a.click();
                    window.URL.revokeObjectURL(blobUrl);
                } else {
                    console.error("No data received from the API");
                }
            })
            .catch(error => {
                console.error(error);
            });
    };
    const getSectionForCourse = (selected) => {
        setSelectedCourseOption(selected)
        const getSectionByCourseParams = {
            method: "getSectionforSummaryReport",
            selectedCourse: selected.value
        };

        axios
            .get(apiPath, { params: getSectionByCourseParams }) // Use 'params' to pass query parameters
            .then(response => {
                let respData = response.data.data;
                let sectionList = respData.sectionData;
                sectionList = Object.values(sectionList);
                var sectionOptions = sectionList.map((val, index) => ({
                    value: val.section_id,
                    label: val.section_name
                }));
                setSectionOptions(sectionOptions);

                let dateList = respData.dateData;
                dateList = Object.values(dateList);
                var createdAtOptions = dateList.map((val1, index) => {
                    const dateString = val1.created_at;
                    const dateObject = new Date(dateString);

                    const year = dateObject.getFullYear();
                    const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
                    const day = dateObject.getDate();

                    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

                    return {
                        value: val1, // Use the formatted date as the 'value'
                        label: formattedDate, // Use the formatted date as the 'label'
                    };
                });
                setDateOptions(createdAtOptions);

            })
            .catch(error => {
                console.error(error);
            });

    }
    var landingMethod = 'getFacultySectionDetail';
    if (userType == 1) {
        landingMethod = 'getSemesterCourseSectionDetailByUser';
    }


    const params = useMemo(
        () => ({
            method: "getCourseforSummaryReport",
            auth: authCode,
            college_id: collegeId,
            user_id: userId
        }),
        [authCode]
    );

    useEffect(() => {
        axios
            .get(apiPath, { params })
            .then(response => {
                let courseList = response.data.data;

                var courseOptions = courseList.map((val, index) => ({
                    value: val.course_id,
                    label: val.course_name
                }));

                setCourseOptions(courseOptions);
            })
            .catch(error => {
                console.error(error);
            });
    }, [params]);


    return (
        <>
            <h2 id="detailedHeading"><u>Detailed Report</u></h2>
            <hr />
            <div className='container'>
                <form id="formData" ref={formRef} onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-md-3'>
                            <h3>Select a Course:</h3>
                            <Select
                                options={courseOptions}
                                value={selectedCourseOption}
                                // onChange={(selected) => setSelectedCourseOption(selected)}
                                onChange={(selected) => getSectionForCourse(selected)}
                                name='course'
                                id='course'
                                isSearchable={true}
                                placeholder="Select an option..."
                            />
                            </div>
                            <div className='col-md-3'>
                            <h3>Select a Section:</h3>
                            <Select
                                options={sectionOptions}
                                value={selectedSectionOption}
                                onChange={(selected1) => setSectionCourseOption(selected1)}
                                name='section'
                                id='section'
                                isSearchable={true}
                                placeholder="Select an option..."
                            />
                            </div>
                            <div className='col-md-3'>
                            <h3>Select a Date:</h3>
                            <Select
                                options={dateOptions}
                                value={selectedDateOption}
                                onChange={(selected2) => setSelectedDateOption(selected2)}
                                name='date'
                                id='date'
                                isSearchable={true}
                                placeholder="Select an option..."
                            />
                            </div>
                            <div className='col-md-3' id="DetailedSubmitButton">
                            <MDBBtn type='submit'>Go</MDBBtn>
                            </div>
                            </div>
                        </form>
                        </div>
                    </>
                    );
}

                    export default DetailedReport;

