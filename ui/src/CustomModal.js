import React, { useState } from 'react';
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

export default function  CustomModal() {
  
  return (
    <>

     
        <MDBModal>
        <MDBModalFooter>
                                    <MDBBtn color='secondary' >
                                        Close
                                    </MDBBtn>
                                    <MDBBtn >Go</MDBBtn>
                                </MDBModalFooter>
        </MDBModal>
    </>
  );
}

