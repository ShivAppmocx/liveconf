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

    }



function auth_function()
{
    $auth = isset($_REQUEST['auth']) ? $_REQUEST['auth'] : '';

    $myArray = [
        "auth" => $auth,
    ];
    $aa_var = (form_rester_api_object("getUserIdByAuthCode", $myArray));
    // var_dump($aa_var);die;
  
    $var = (json_encode([$aa_var]));
    $headers = array('x-auth-key: ' . $auth);
    $ab_var = APICall('POST', BASE_URL, $var, $headers);
    $my_data = (json_decode($ab_var));
    $data_arr['auth'] = array();
    $getUserIdByAuthCode = $my_data->data->getUserIdByAuthCode;
    if (count($my_data->data->getUserIdByAuthCode)) {
        array_push($data_arr['auth'], $getUserIdByAuthCode);
    }
    return get_generic_response(200, $data_arr, "Records Found!");


}




