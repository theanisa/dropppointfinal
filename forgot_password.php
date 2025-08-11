<?php
include 'dbconfig.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $student_id = trim($_POST['student_id']);
    $email = trim($_POST['email']);

    $stmt = $conn->prepare("SELECT * FROM users WHERE student_id = ? AND email = ?");
    $stmt->bind_param("ss", $student_id, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $token = bin2hex(random_bytes(32)); // Unique token
        $stmt = $conn->prepare("UPDATE users SET password_reset_token = ? WHERE student_id = ?");
        $stmt->bind_param("ss", $token, $student_id);
        $stmt->execute();

        // Email reset link
        $resetLink = "http://localhost/droppointfinal/reset_password.php?token=" . $token;
        
        // For demo — echo instead of sending email
        echo "Password reset link (send via email): <a href='$resetLink'>$resetLink</a>";
    } else {
        echo "No matching account found.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Forgot Password</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
<div class="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Forgot Your Password?</h2>
    <p class="text-gray-600 mb-6">
        If you have forgotten your password, please contact the administrator to reset it for you.
    </p>
    <div class="bg-gray-200 p-4 rounded mb-4">
        <p class="font-semibold text-gray-800">Admin Contact</p>
        <p class="text-gray-700">📱 Phone: 01319632951</p>
    </div>

</body>
</html>