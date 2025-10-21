<?php
include 'db_connect.php'; // include the connection file

// Get all form data
$checkin = $_POST['checkin'] ?? '';
$checkout = $_POST['checkout'] ?? '';
$guests = $_POST['guests'] ?? '';
$roomType = $_POST['roomType'] ?? '';
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$specialRequests = $_POST['specialRequests'] ?? '';
$nights = $_POST['nights'] ?? '';
$totalAmount = $_POST['totalAmount'] ?? '';

// Simple validation
if ($checkin == '' || $checkout == '' || $firstName == '' || $lastName == '' || $email == '') {
  echo "Missing required fields.";
  exit;
}

// Prepare and insert into database
$sql = "INSERT INTO bookings (checkin, checkout, guests, roomType, firstName, lastName, email, phone, specialRequests, nights, totalAmount)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssissssssss", $checkin, $checkout, $guests, $roomType, $firstName, $lastName, $email, $phone, $specialRequests, $nights, $totalAmount);

if ($stmt->execute()) {
  echo "success";
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
