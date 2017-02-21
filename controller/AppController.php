<?php
/**
 * Created by PhpStorm.
 * User: LOC
 * Date: 12/6/2015
 * Time: 8:31 PM
 */
class AppController {
    public $action = '';
    public $data;
    //for test
    public function __construct($action = '') {
        $this->action = $action;
        $this->data = new stdClass();
        $this->data->code = 0;
        $this->data->mesage = '';
    }

    //if this is return false, prevent do action
    protected function beforeDoAction() {
        return true;
    }

    protected function afterDoAction() {
        //do something
    }

    public function doAction() {
        //1. check action to be done
        $action = $this->action;

        if ($this->beforeDoAction() == false) return;

        if (empty($action) || method_exists($this, $action) == false) {
            $this->defaultAction();
            return;
        }

        //2. do the method in action
        $this->$action();
        $this->afterDoAction();
    }

    protected function defaultAction() {
    }
}