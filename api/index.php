<?php

require '../../quiklrn_app/config.php';
include '../../quiklrn_app/rester_api.php';

// require 'external_api.php';
header('Access-Control-Allow-Origin: *');

$method_name = '';
if (isset($_REQUEST['method']) && $_REQUEST['method'] != '') {
    $method_name = $_REQUEST['method'];
}

switch ($method_name) {

    case "test":
        json_output(test());
        break;

    case "auth_function":
        json_output(auth_function());
        break;

    case "getFacultySectionDetail":
        json_output(getFacultySectionDetail());
        break;

        

    }

function auth_function()
{
    $auth = isset($_REQUEST['auth']) ? $_REQUEST['auth'] : '';
    $myArray = [
        "auth" => $auth,
    ];
    $aa_var = (form_rester_api_object("getUserIdByAuthCode", $myArray));
   
    $var = (json_encode([$aa_var]));
    $headers = array('x-auth-key: ' . $auth);
    $ab_var = APICall('POST', BASE_URL, $var, $headers);
    $my_data = (json_decode($ab_var));
    $data_arr['userDetails'] = array();
    $data_arr['clgDetails'] = array();
    $data_arr['deptDetails'] = array();
    
    $getUserIdByAuthCode = $my_data->data->getUserIdByAuthCode;

    if (count($my_data->data->getUserIdByAuthCode)) {
        // echo "<pre>";
        array_push($data_arr['userDetails'], $getUserIdByAuthCode[0]);
    
        $userId = ($getUserIdByAuthCode[0]->user_id);
        $getClgFilteredData = getCollegeDetails($userId,$auth);
        if (count($getClgFilteredData)) {
            array_push($data_arr['clgDetails'], $getClgFilteredData[0]);
            $getDeptData = getDepartmentDetails( $getClgFilteredData[0]->college_id, $userId, $auth);    
            if (count($getDeptData)) {
                array_push($data_arr['dept_details'], $getDeptData[0]);
            }
        }
    }

    return get_generic_response(200, $data_arr, "Records Found!");
}

function getCollegeDetails($userId,$auth){
        $paramsArray = [
            "user_id" => $userId,
        ];
        $getClgMethod = "";
        $formVar = (form_rester_api_object("getCollegeIdName", $paramsArray));
        $encodedVar = (json_encode([$formVar]));
        $headers = array('x-auth-key: ' . $auth);
        $api_data = APICall('POST', BASE_URL, $encodedVar, $headers);
        $clgApiDecodedData = (json_decode($api_data));
        $getClgFilteredData = isset($clgApiDecodedData->data->getCollegeIdName) ? $clgApiDecodedData->data->getCollegeIdName : null;
        return  $getClgFilteredData;
}
function getDepartmentDetails($collegeId, $userId, $auth){
    $myArray = [
        "college_id" => $collegeId,
        "match_user" => " AND U.user_id = ($userId)",
    ];

    $formVar = (form_rester_api_object("getDepartmentIDName", $myArray));
    $encodedVar = (json_encode([$formVar]));
    $headers = array('x-auth-key: ' . $auth);
    $api_data = APICall('POST', BASE_URL, $encodedVar, $headers);
   
    $deptApiDecodedData = (json_decode($api_data));
    $getDeptData = isset($deptApiDecodedData->data->getDepartmentIDName) ? $deptApiDecodedData->data->getDepartmentIDName : null;
    return $getDeptData;
}

function getFacultySectionDetail(){
    $auth = isset($_REQUEST['auth']) ? $_REQUEST['auth'] : '';
    $college_id = isset($_REQUEST['college_id']) ? $_REQUEST['college_id'] : '';
    $faculty_id = isset($_REQUEST['faculty_id']) ? $_REQUEST['faculty_id'] : '';
    $myArray = [
        "college_id" => $college_id,
        "faculty_id" => $faculty_id
     ];
     $apiParameters = (form_rester_api_object("getFacultySectionDetail", $myArray));
     $encodedParameters = (json_encode([$apiParameters]));
     $headers = array('x-auth-key: ' . $auth);
     $callAPI = APICall('POST', BASE_URL, $encodedParameters, $headers);
     $apiData = (json_decode($callAPI));
     $getFacultySectionDetail = isset($apiData->data->getFacultySectionDetail) ? $apiData->data->getFacultySectionDetail : [];
     $data_arr['getFacultySectionDetail'] = [];
     if (count($getFacultySectionDetail)) {
        array_push($data_arr['getFacultySectionDetail'], $getFacultySectionDetail);
    }
    return get_generic_response(200, $data_arr, "Records Found!");
}
    



