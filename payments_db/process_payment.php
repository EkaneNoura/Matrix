<?php
header("Content-Type: application/json");


// Database Connection
$host = "localhost";
$user = "root";
$pass = "";
$db_name = "payments_db";

$conn = new mysqli($host, $user, $pass, $db_name);

// Check Connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}

// Read JSON Input
$input_data = json_decode(file_get_contents("php://input"), true);

if (!$input_data) {
    echo json_encode(["success" => false, "message" => "Invalid input data."]);
    exit();
}

$name = $input_data["name"];
$email = $input_data["email"];
$amount = $input_data["amount"];

// Insert into MySQL Database
$stmt = $conn->prepare("INSERT INTO payments (name, email, amount) VALUES (?, ?, ?)");
$stmt->bind_param("ssd", $name, $email, $amount);
$stmt->execute();
$stmt->close();

// Fapshi Payment API URL
$payment_api_url = "https://checkout.fapshi.com/link/70470920";

// Prepare data for API
$post_data = json_encode([
    "amount" => $amount,
    "email" => $email
]);

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $payment_api_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

// Execute API request
$response = curl_exec($ch);
curl_close($ch);

// Convert response to array
$result = json_decode($response, true);

// Return JSON response
if (isset($result['https://checkout.fapshi.com/link/70470920'])) {
    echo json_encode(["success" => true, "https://checkout.fapshi.com/link/70470920" => $result['payment_url']]);
} else {
    echo json_encode(["success" => false, "message" => "Payment initialization failed!"]);
}

$conn->close();
?>
