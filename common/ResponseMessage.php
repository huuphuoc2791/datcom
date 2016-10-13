<?php
/**
 * Created by PhpStorm.
 * User: huuphuoc
 * Date: 10/13/16
 * Time: 15:42
 */

class ResponseMessage {
    public $responseCode;
    public $responseMessage;
    public $data;
    public function __construct()
    {
        $this->responseCode = 0;
        $this->responseMessage = '';
        $this->data = new stdClass();
    }
}