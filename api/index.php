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

        case "saveMeetingDetail":
            json_output(saveMeetingDetail());
            break;

            case "getCreatedMeetingList":
                json_output(getCreatedMeetingList());
                break;
                case "callMeet":
                    json_output(callMeet());
                    break;

                    case "createJoinMeetingLink":
                        json_output(createJoinMeetingLink());
                        break;

                        case "getCreatedCourseSectionList":
                            json_output(getCreatedCourseSectionList());
                            break;

                            case "getSemesterCourseSectionDetailByUser":
                                json_output(getSemesterCourseSectionDetailByUser());
                                break;


                                case "getRecordByMeetingId":
                                    json_output(getRecordByMeetingId());
                                    break;    

                                    case "deleteRecordByMeetingId":
                                        json_output(deleteRecordByMeetingId());
                                        break;    
                                    
                                        case "getMeetingInfoByMeetingId":
                                            json_output(getMeetingInfoByMeetingId());
                                            break;  

                                            case "getAllMeetings":
                                                json_output(getAllMeetings());
                                                break;  

                                                case "getRecordings":
                                                    json_output(getRecordings());
                                                    break;  
                                          
                                                

                                                              

    }
    
$bbb_url = BIGBLUE_URL;
$bbb_secret = BIGBLUE_SECRET;

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
            
            // echo "<pre>";
            // var_dump($getDeptData);die;
            if (is_array($getDeptData) || is_object($getDeptData)) {
                if (count($getDeptData) ) {
                    array_push($data_arr['deptDetails'], $getDeptData[0]);
                }
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

function getSemesterCourseSectionDetailByUser(){
    $auth = isset($_REQUEST['auth']) ? $_REQUEST['auth'] : '';
    $college_id = isset($_REQUEST['college_id']) ? $_REQUEST['college_id'] : '';
    $user_id = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : '';
    $myArray = [
        "college_id" => $college_id,
        "user_id" => $user_id
     ];
     $apiParameters = (form_rester_api_object("getSemesterCourseSectionDetailByUser", $myArray));
     $encodedParameters = (json_encode([$apiParameters]));
     $headers = array('x-auth-key: ' . $auth);
     $callAPI = APICall('POST', BASE_URL, $encodedParameters, $headers);
     $apiData = (json_decode($callAPI));
     $getSemesterCourseSectionDetailByUser = isset($apiData->data->getSemesterCourseSectionDetailByUser) ? $apiData->data->getSemesterCourseSectionDetailByUser : [];
     $data_arr['getSemesterCourseSectionDetailByUser'] = [];
     $data_arr['getCreatedCourseSectionList'] = getCreatedCourseSectionList();
     
     if (count($getSemesterCourseSectionDetailByUser)) {
        ($data_arr['getSemesterCourseSectionDetailByUser'] = $getSemesterCourseSectionDetailByUser);
    }
    return get_generic_response(200, $data_arr, "Records Found!");
}

function getFacultySectionDetail(){
    $auth = isset($_REQUEST['auth']) ? $_REQUEST['auth'] : '';
    $college_id = isset($_REQUEST['college_id']) ? $_REQUEST['college_id'] : '';
    $faculty_id = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : '';
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
     $data_arr['getCreatedCourseSectionList'] = getCreatedCourseSectionList( $myArray);
     
     if (count($getFacultySectionDetail)) {
        ($data_arr['getFacultySectionDetail'] =  $getFacultySectionDetail);
    }
    return get_generic_response(200, $data_arr, "Records Found!");
}
    

function saveMeetingDetail()
{    
    $courseName = isset($_REQUEST['courseName']) ? $_REQUEST['courseName'] : '';
    $sectionName = isset($_REQUEST['sectionName']) ? $_REQUEST['sectionName'] : '';
    
    $courseId = isset($_REQUEST['courseId']) ? $_REQUEST['courseId'] : '';

    $createdByUserId = isset($_REQUEST['createdByUserId']) ? $_REQUEST['createdByUserId'] : '';
    $createdByUserEmail = isset($_REQUEST['createdByUserEmail']) ? $_REQUEST['createdByUserEmail'] : '';

    $createdByCollegeId = isset($_REQUEST['createdByCollegeId']) ? $_REQUEST['createdByCollegeId'] : '';

    $sectionId = isset($_REQUEST['sectionId']) ? $_REQUEST['sectionId'] : '';
    
    $deptId = isset($_REQUEST['deptId']) ? $_REQUEST['deptId'] : '';
    
    $virtualClassroomName = isset($_REQUEST['virtualClassroomName']) ? $_REQUEST['virtualClassroomName'] : '';
    $welcomeMessage = isset($_REQUEST['welcomeMessage']) ? $_REQUEST['welcomeMessage'] : '';
    $isWaitForModerator = isset($_REQUEST['isWaitForModerator']) ? $_REQUEST['isWaitForModerator'] : '';
    $isSessionRecorded = isset($_REQUEST['isSessionRecorded']) ? $_REQUEST['isSessionRecorded'] : '';
     
    $meetingId =  strtotime('now');

    $isMod = 0;
    $isSes = 0;
    if($isWaitForModerator){
        $isMod = 1;
    }
    if($isSessionRecorded){
        $isSes = 1;
    }
  
    $startDate = isset($_REQUEST['startDate']) ? $_REQUEST['startDate'] : '';
    $endDate = isset($_REQUEST['endDate']) ? $_REQUEST['endDate'] : '';
    $authCode = isset($_REQUEST['authCode']) ? $_REQUEST['authCode'] : '';
    
    $query = "INSERT INTO `meeting_details` ( `course_name`, `section_name`, `course_id`,`section_id`,`dept_id`,`created_by_userId`,`created_by_userEmail`,`created_by_collegeId`,`virtual_classroom_name`, `welcome_message`, `is_wait_for_moderator`, `is_session_recorded`, `start_date`, `end_date`,`meeting_id`,`is_deleted`) VALUES ( '".$courseName."', '".$sectionName."', '".$courseId."','".$sectionId."','".$deptId."','".$createdByUserId ."','".$createdByUserEmail."','".$createdByCollegeId."','".$virtualClassroomName."', '".$welcomeMessage."', '".$isMod."', '".$isSes."', '". $startDate."', '".$endDate."','".$meetingId."','0')"; 
    $insQuery = execute_insert_query($query);
    
    if($insQuery){
        $insertMeetIdValue = $meetingId."-".$sectionId."-".$insQuery;
      
        $insertQuery = "INSERT INTO `meeting_logs` ( `user_id`, `meeting_id`, `log`) VALUES ( '".$createdByUserId."', '".$insertMeetIdValue."', 'add')";
        $insQueryResp = execute_insert_query($insertQuery);                 
        $getMeetingInfoByMeetingId = getMeetingInfoByMeetingId($meetingId);
        return get_generic_response(200, ['meetingName'=>$virtualClassroomName, 'meetingId'=>$meetingId, 'meetingInfo'=>$getMeetingInfoByMeetingId], "Records Addedd Successfully!");
    }
    return get_generic_response(200, ['meetingName'=>'', 'meetingId'=>'', 'meetingInfo'=>''], "Records Addedd Successfully!");
    
    
}

function getCreatedMeetingList(){

    // $collegeId = isset($_REQUEST['collegeId']) ? $_REQUEST['collegeId'] : '';
    $userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : '';
    $userEmail = isset($_REQUEST['userEmail']) ? $_REQUEST['userEmail'] : '';
    // $courseId = isset($_REQUEST['courseId']) ? $_REQUEST['courseId'] : '';
    $sectionId = isset($_REQUEST['sectionId']) ? $_REQUEST['sectionId'] : '';
    // $deptId = isset($_REQUEST['deptId']) ? $_REQUEST['deptId'] : '';
    $userType = isset($_REQUEST['userType']) ? $_REQUEST['userType'] : '';
    $queryCondition = '';
    if($userType == 5 || $userType == 6 ||  $userType == 10){
        $queryCondition = "AND created_by_userId = '".$userId."' AND created_by_userEmail = '".$userEmail."'  ";
    }

    $getDataQuery = execute_query("SELECT DISTINCT(meeting_id),virtual_classroom_name from meeting_details where  section_id = '".$sectionId."' ". $queryCondition." AND is_deleted = 0");
    // $getDataQuery = execute_query("SELECT DISTINCT(meeting_id),virtual_classroom_name from meeting_details where dept_id = '".$deptId."' AND course_id = '".$courseId."' AND section_id = '".$sectionId."' AND created_by_userId = '".$userId."' AND created_by_userEmail = '".$userEmail."' ");
  
    $resMeetingIds = ToArrays($getDataQuery);
    if(count( $resMeetingIds )){
        return get_generic_response(200, $resMeetingIds, "Records Addedd Failed!");   
    }
    return get_generic_response(200, [], "Records Addedd Failed!"); 

}

function getCreatedCourseSectionList($myArray=''){
    $userId = isset($myArray['faculty_id']) ? $myArray['faculty_id'] : '';
    $collegeId = isset($myArray['college_id']) ? $myArray['college_id'] : '';
    $queryCondition = "";
    if($userId!='' && $collegeId!=''){
        $queryCondition = "Where created_by_collegeId = ".$collegeId." AND created_by_userId = ".$userId."";
    }
    $getDataQuery = execute_query("SELECT DISTINCT course_id,section_id,course_name,section_name from meeting_details ".$queryCondition." ");
    $resMeetingIds = ToArrays($getDataQuery);
    if(count( $resMeetingIds )){
        // return get_generic_response(200, $resMeetingIds, "Records Addedd Failed!");   
        return $resMeetingIds; 
    }
    return [];
}

function createJoinMeetingLink(){

    $userRole = isset($_REQUEST['userRole']) ? $_REQUEST['userRole'] : '';
    $userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : '';
    $userEmail = isset($_REQUEST['userEmail']) ? $_REQUEST['userEmail'] : '';
    $userRole = isset($_REQUEST['userRole']) ? $_REQUEST['userRole'] : '';

    $userName = isset($_REQUEST['userName']) ? $_REQUEST['userName'] : '';
    $userUsn = isset($_REQUEST['userUsn']) ? $_REQUEST['userUsn'] : '';

    // $courseId = isset($_REQUEST['courseId']) ? $_REQUEST['courseId'] : '';
    $sectionId = isset($_REQUEST['sectionId']) ? $_REQUEST['sectionId'] : '';
    $authCode = isset($_REQUEST['authCode']) ? $_REQUEST['authCode'] : '';

    $userUsn = isset($_REQUEST['userUsn']) ? $_REQUEST['userUsn'] : '';

    $getMeetingidQuery = execute_query("SELECT id, meeting_id, virtual_classroom_name,is_session_recorded,section_id from meeting_details where  section_id = '".$sectionId."'  ");
    $data = ToArrays($getMeetingidQuery);     
    $logValue = "join";
    
    if(count( $data )){    
        $meetingId = $data[0]['meeting_id'];
        $virtualClassroomName = $data[0]['virtual_classroom_name'];
        $isSessionRecorded = $data[0]['is_session_recorded'];
        $meetingDetailsPrimaryId = $data[0]['id'];
        $meetingSectionId = $data[0]['section_id'];

        $autoStartRecording = "false";
        $allowStartStopRecording = "false";
        
        if( $isSessionRecorded == 1){
            $allowStartStopRecording =  "true";
        }
        $insertMeetIdValue = $meetingId."-".$meetingSectionId."-".$meetingDetailsPrimaryId;
        $bbb_meeting_running_opts = array(  
            "meetingID" => $meetingId,
        );

        $isMeetingRunning = isMeetingRunning($bbb_meeting_running_opts, BIGBLUE_SECRET, BIGBLUE_URL);
        
        $isMeetingRunning = ($isMeetingRunning['running']);
        $logValue = "join";
        $role = "VIEWER";
       
        if($userRole != 1)
        {  
            $role = "MODERATOR";
            if($isMeetingRunning == "false"){
                $logValue = "create";
                $bbb_meeting_create_opts = array(
                    "allowStartStopRecording" => $autoStartRecording ,
                    "autoStartRecording" => $allowStartStopRecording ,
                    "meetingID" => $meetingId,
                    "name" => $virtualClassroomName,
                    "record" => $allowStartStopRecording,
                    "role" => "MODERATOR",
                    "logoutURL" => UI_URL."?auth_code=".$authCode
                );
            
                $createMeetingResponse = create_meeting($bbb_meeting_create_opts, BIGBLUE_SECRET, BIGBLUE_URL);
                if($createMeetingResponse['returncode'] == "SUCCESS" && $logValue == "create")
                {
                    $insertQuery = "INSERT INTO `meeting_logs` ( `user_id`, `meeting_id`, `log`) VALUES ( '".$userId."', '".$insertMeetIdValue."', '".$logValue."')";
                    $insQueryResp = execute_insert_query($insertQuery);
                    $logValue = "join";
                }   
            }
        }
    }

    $bbb_meeting_join_opts = array(
        "meetingID" =>  $meetingId,
        "role" => $role,
        "fullName" => $userName.'-'.$userUsn,
        "userID" =>  $userName.'-'.$userUsn,
    );

    // if($createMeetingResponse['returncode'] == "SUCCESS" || $createMeetingResponse['messageKey']  == "idNotUnique")
    // {
        // if($createMeetingResponse['messageKey']  == "idNotUnique"){
        //     $logValue = "join";
        // }
        if($role == "VIEWER"){
            if($isMeetingRunning == "false"){
                return get_generic_response(401, [], "Meeting is not running!");   
            }
        }
        $joinMeet = join_meeting($bbb_meeting_join_opts, BIGBLUE_SECRET, BIGBLUE_URL);
        $insertMeetIdValue = $meetingId."-".$meetingSectionId."-".$meetingDetailsPrimaryId;
        $insertQuery = "INSERT INTO `meeting_logs` ( `user_id`, `meeting_id`, `log`) VALUES ( '".$userId."', '".$insertMeetIdValue."', '".$logValue."')";
        $insQueryResp = execute_insert_query($insertQuery);        
        return get_generic_response(200, $joinMeet, "Meeting Link!");
    // } else {
    //     return get_generic_response(401, [], "Meeting Link Not Created!");
    // }

    // "isPresenter" => false,
    // "isListeningOnly" => true,
    // "hasJoinedVoice" => true,
    // "hasVideo" => false
}

function callMeet(){
    
    $bbb_meeting_create_opts = array(
        "name" => "Test Meeting",
        "meetingID" => "test-meeting",
        // "duration" => "5"
    );
    
    $bbb_meeting_join_opts = array(
        "fullName" => "Test User",
        "meetingID" => "test-meeting",
        //MODERATOR or VIEWER
        "role" => "MODERATOR",
        "userID" => "test-user",
    );

    create_meeting($bbb_meeting_create_opts, $bbb_secret, $bbb_url);
}

function joinMeet(){
   
    
    
    $bbb_meeting_join_opts = array(
        "fullName" => "Test User",
        "meetingID" => "test-meeting",
        //MODERATOR or VIEWER
        "role" => "MODERATOR",
        "userID" => "test-user",
    );
    join_meeting($bbb_meeting_join_opts, BIGBLUE_SECRET, BIGBLUE_URL);
}

function call_curl($url)
{
    $curl = curl_init();
    curl_setopt_array(
    $curl,
    array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded'
        ),
    )
);

$response = curl_exec($curl);
curl_close($curl);

// Parse the XML response
$xml = simplexml_load_string($response);
$jsonResponse = json_encode($xml);
$arrayResponse = json_decode($jsonResponse, true);

// var_dump($arrayResponse); // This will give you a structured array from the XML response
return $arrayResponse;
}

function create_meeting($bbb_meeting_create_opts, $bbb_secret, $bbb_url)
{
    $url = $bbb_url . "create?" . http_build_query($bbb_meeting_create_opts);
    $url .= "&checksum=" . sha1("create" . http_build_query($bbb_meeting_create_opts) . $bbb_secret);
    $response = call_curl($url);
    return $response;
}
function isMeetingRunning($bbb_meeting_running_opts, $bbb_secret, $bbb_url){
    $url = $bbb_url . "isMeetingRunning?" . http_build_query($bbb_meeting_running_opts);
    $url .= "&checksum=" . sha1("isMeetingRunning" . http_build_query($bbb_meeting_running_opts) . $bbb_secret);
    $response = call_curl($url);
    return $response;

}
function join_meeting($bbb_meeting_join_opts, $bbb_secret, $bbb_url)
{
    $url = $bbb_url . "join?" . http_build_query($bbb_meeting_join_opts);
    $url .= "&checksum=" . sha1("join" . http_build_query($bbb_meeting_join_opts) . $bbb_secret);
    // echo "Open this URL in Browser to join meeting: \n$url\n";
    return $url;
}


function callMeetingAPI($var){
    // API endpoint URL
    $apiUrl = "https://scalelite-lb.quiklrn.net/bigbluebutton/api/";
    $API_SECRET = "c25137dd461f433496672b6581c5ca0bee17c17177e85f68";

    // For create meeting
    $API_NAME = "create";

    $meetingParams = array(
        "name" => "Test Meeting",
        "meetingID" => "abc12345",
        "attendeePW"=>"ap",
        "moderatorPW"=>"mp"
    );

    $joinParams = array(
        "fullName" => "Test User",
        "meetingID" => "abc12345",
        "role" => "MODERATOR"
    );

    // Create URL query strings
    $parameterStr = http_build_query($meetingParams);

    $checksumStr = $API_NAME.$parameterStr.$API_SECRET;
   
    // Calculate checksum using SHA-1 and API_SECRET as key
    // 
    $checksum = hash_hmac('sha1', $checksumStr, $API_SECRET);
    $checksum = sha1($checksumStr.$API_SECRET);
   
    // Create API URL
    $url = $apiUrl . $API_NAME . '?' . $parameterStr . '&checksum=' . $checksum;

    echo $url; // Output the complete URL
    die;


    // API parameters
    $str=  $apiUrl."createname=Test+Meeting&meetingID=". $var['meetingId']."&attendeePW=111222&moderatorPW=mp";
    $sha1Sum = sha1($str.'c25137dd461f433496672b6581c5ca0bee17c17177e85f68');
    
    echo "<pre>";
    var_dump($sha1Sum);
    
    // Construct the query string
   
    $params = array(
        'allowStartStopRecording' => 'true',
        'attendeePW' => 'ap',
        'autoStartRecording' => 'false',
        'meetingID' => $var['meetingId'],
        'moderatorPW' => 'mpc25137dd461f433496672b6581c5ca0bee17c17177e85f68',
        'name' => $var['name'],
        'record' => $var['isRecord'],
        'voiceBridge' => '74777',
        'welcome' => '<br>Welcome to <b>%'.$var['className'].'%</b>!',
        'checksum' => $sha1Sum
    );
   
    $queryString = http_build_query($params);

    // Append the query string to the API URL
    $apiUrlWithQuery = $apiUrl . '?' . $queryString;
    echo "<pre>";
    var_dump($apiUrlWithQuery);die;
    // Initialize cURL session
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $apiUrlWithQuery);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute cURL request
    $response = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        echo 'Curl error: ' . curl_error($ch);
    }

    // Close cURL session
    curl_close($ch);

    // Output the API response
    return $response;


}

function getRecordsToEdit(){
    $userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : '';
    $userEmail = isset($_REQUEST['userEmail']) ? $_REQUEST['userEmail'] : '';
    $courseId = isset($_REQUEST['courseId']) ? $_REQUEST['courseId'] : '';
    $sectionId = isset($_REQUEST['sectionId']) ? $_REQUEST['sectionId'] : '';
    $userType = isset($_REQUEST['userType']) ? $_REQUEST['userType'] : '';
     $getDataQuery = execute_query("SELECT DISTINCT(meeting_id),virtual_classroom_name, welcome_message, is_wait_for_moderator, is_session_recorded, `start_date`, end_date from meeting_details where  section_id = '".$sectionId."' AND created_by_userId = '".$userId."' AND created_by_userEmail = '".$userEmail."' AND is_deleted=0");
    $data = ToArrays($getDataQuery);     
    if(count( $data )){
        return get_generic_response(200, $data, "Records Addedd Failed!");   
    }
    return get_generic_response(200, [], "Records Addedd Failed!"); 
}


function getRecordByMeetingId(){
    $meetingId = isset($_REQUEST['meetingId']) ? $_REQUEST['meetingId'] : '';
    $getDataQuery = execute_query("SELECT DISTINCT(meeting_id),virtual_classroom_name, welcome_message, is_wait_for_moderator, is_session_recorded, `start_date`, end_date from meeting_details where  meeting_id = '".$meetingId."' AND is_deleted=0");
    $data = ToArrays($getDataQuery);    
    
    if(count( $data )){
        return get_generic_response(200, $data[0], "Records Addedd Failed!");   
    }
    return get_generic_response(200, [], "Records Addedd Failed!"); 

}

function deleteRecordByMeetingId(){
    $meetingId = isset($_REQUEST['meetingId']) ? $_REQUEST['meetingId'] : '';
    $getDataQuery = execute_query("DELETE  from meeting_details where  meeting_id = '".$meetingId."' ");
    if($getDataQuery){
        return get_generic_response(200, [], "Records Deleted Successfully!");   
    }
    return get_generic_response(422, [], "Records Deleted Failed!"); 
}

function getMeetingInfoByMeetingId($meetingId){
     // $meetingId = isset($_REQUEST['meetingId']) ? $_REQUEST['meetingId'] : '';
    $bbb_meeting_create_opts = array(
        "meetingID" => $meetingId,
    );
   
    $url = BIGBLUE_URL . "getMeetingInfo?" . http_build_query($bbb_meeting_create_opts);
    $url .= "&checksum=" . sha1("getMeetingInfo" . http_build_query($bbb_meeting_create_opts) . BIGBLUE_SECRET);
    // echo "<pre>";
    // var_dump($url);die;
    // $response = call_curl($url);
    // echo "<pre>";
    // var_dump($response);die;
    return $url;
       
}  


function getAllMeetings(){
  
    $url = BIGBLUE_URL . "getMeetings?";
    $url .= "checksum=" . sha1("getMeetings" . BIGBLUE_SECRET);
    echo "<pre>";
    var_dump($url);die;
}

function getRecordings(){
    $meetingId = isset($_REQUEST['meetingId']) ? $_REQUEST['meetingId'] : '';  
    $bbb_meeting_recording_opts = array(
        "meetingID" => $meetingId,
    );
    $url = BIGBLUE_URL . "getRecordings?" . http_build_query($bbb_meeting_recording_opts);
    $url .= "&checksum=" . sha1("getRecordings" . http_build_query($bbb_meeting_recording_opts) . BIGBLUE_SECRET);
    $response = call_curl($url);
   return $response;

}