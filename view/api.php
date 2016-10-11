<?php

$methodName = '';


$controller = new controller($methodName);

echo json_encode($controller->data);