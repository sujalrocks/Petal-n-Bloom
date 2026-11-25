<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");

$usersFile = __DIR__ . "/../data/users.json";
$ordersFile = __DIR__ . "/../data/orders.json";

function readData($file) {
    if (!file_exists($file)) {
        return array();
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : array();
}
function saveData($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}
function sendResponse($success, $message, $extra = array()) {
    echo json_encode(array_merge(array("success" => $success, "message" => $message), $extra));
    exit;
}

$action = isset($_GET["action"]) ? $_GET["action"] : "";
$input = json_decode(file_get_contents("php://input"), true);
if (!is_array($input)) {
    $input = $_POST;
}

if ($action == "current") {
    if (isset($_SESSION["user"])) {
        sendResponse(true, "Signed in", array("user" => $_SESSION["user"]));
    }
    sendResponse(false, "Not signed in");
}

if ($action == "signup") {
    $name = trim(isset($input["name"]) ? $input["name"] : "");
    $email = strtolower(trim(isset($input["email"]) ? $input["email"] : ""));
    $phone = trim(isset($input["phone"]) ? $input["phone"] : "");
    $password = isset($input["password"]) ? $input["password"] : "";
    if ($name == "" || $email == "" || $phone == "" || $password == "") {
        sendResponse(false, "Please complete all fields.");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, "Please enter a valid email address.");
    }
    $users = readData($usersFile);
    foreach ($users as $existing) {
        if ($existing["email"] == $email) {
            sendResponse(false, "This email already has an account. Please sign in.");
        }
    }
    $user = array("name" => $name, "email" => $email, "phone" => $phone, "password" => $password);
    $users[] = $user;
    saveData($usersFile, $users);
    unset($user["password"]);
    $_SESSION["user"] = $user;
    sendResponse(true, "Account created.", array("user" => $user));
}

if ($action == "signin") {
    $email = strtolower(trim(isset($input["email"]) ? $input["email"] : ""));
    $password = isset($input["password"]) ? $input["password"] : "";
    $users = readData($usersFile);
    foreach ($users as $user) {
        if ($user["email"] == $email && $user["password"] == $password) {
            unset($user["password"]);
            $_SESSION["user"] = $user;
            sendResponse(true, "Signed in.", array("user" => $user));
        }
    }
    sendResponse(false, "Account not found. Check your details or sign up.");
}

if ($action == "signout") {
    session_unset();
    session_destroy();
    sendResponse(true, "Signed out.");
}

if (!isset($_SESSION["user"])) {
    sendResponse(false, "Please sign in first.");
}

if ($action == "profile") {
    $name = trim(isset($input["name"]) ? $input["name"] : "");
    $email = strtolower(trim(isset($input["email"]) ? $input["email"] : ""));
    $phone = trim(isset($input["phone"]) ? $input["phone"] : "");
    if ($name == "" || $email == "" || $phone == "") {
        sendResponse(false, "Please complete all fields.");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, "Please enter a valid email address.");
    }
    $users = readData($usersFile);
    foreach ($users as $i => $oldUser) {
        if ($oldUser["email"] == $email && $oldUser["email"] != $_SESSION["user"]["email"]) {
            sendResponse(false, "This email is already used by another account.");
        }
        if ($oldUser["email"] == $_SESSION["user"]["email"]) {
            $users[$i]["name"] = $name;
            $users[$i]["email"] = $email;
            $users[$i]["phone"] = $phone;
        }
    }
    saveData($usersFile, $users);
    $_SESSION["user"] = array("name" => $name, "email" => $email, "phone" => $phone);
    sendResponse(true, "Your profile has been updated.", array("user" => $_SESSION["user"]));
}

if ($action == "book") {
    $name = trim(isset($input["name"]) ? $input["name"] : "");
    $phone = trim(isset($input["phone"]) ? $input["phone"] : "");
    $bouquet = trim(isset($input["bouquet"]) ? $input["bouquet"] : "");
    $date = trim(isset($input["date"]) ? $input["date"] : "");
    $address = trim(isset($input["address"]) ? $input["address"] : "");
    $message = trim(isset($input["message"]) ? $input["message"] : "");
    $price = isset($input["price"]) ? (int)$input["price"] : 0;
    if ($name == "" || $phone == "" || $bouquet == "" || $date == "" || $address == "") {
        sendResponse(false, "Please complete all required booking fields.");
    }
    $orders = readData($ordersFile);
    $order = array(
        "id" => "PB" . date("YmdHis") . rand(10,99),
        "name" => $name,
        "email" => $_SESSION["user"]["email"],
        "phone" => $phone,
        "bouquet" => $bouquet,
        "date" => $date,
        "price" => $price,
        "address" => $address,
        "message" => $message,
        "status" => "Booking received"
    );
    array_unshift($orders, $order);
    saveData($ordersFile, $orders);
    sendResponse(true, "Your booking has been received.");
}

if ($action == "orders") {
    $orders = readData($ordersFile);
    $myOrders = array();
    foreach ($orders as $order) {
        if ($order["email"] == $_SESSION["user"]["email"]) {
            $myOrders[] = $order;
        }
    }
    sendResponse(true, "Orders loaded.", array("orders" => $myOrders));
}

sendResponse(false, "Unknown request.");
?>