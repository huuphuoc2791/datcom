<?php

$methodName = '';

$postedData = json_decode(file_get_contents('php://input'));

$methodName = $postedData->methodName;
$data = $postedData->data;
var_dump($data);

