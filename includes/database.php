<?php
class Database
{
    function __construct()
    {
        $this->open_db_connection();
    }
    public $con;
    function open_db_connection()
    {
        $this->con = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        if ($this->con->connect_errno) {
            die('QUERY ERROR' . $this->con->error);
        }
        // echo 'GOOD CONNECT';
    }

    public function query($sql)
    {
        $result = $this->con->query($sql);
        return $result;
    }
    public function excape_string($string)
    {
        $escape = $this->con->real_escape_string($string);
        return $escape;
    }

    function inserted_id()
    {
        $insert = $this->con->inserted_id;
    }
    public function the_insert_id()
    {
        return mysqli_insert_id($this->con);
    }
}
$db = new Database();
