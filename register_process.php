<?php
include 'dbconfig.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $student_id = $_POST['student_id'];
    $full_name = $_POST['name']; // Change variable name to match table
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (student_id, full_name, email, password) 
            VALUES ('$student_id', '$full_name', '$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "
        <script>
            alert('Registration successful!');
            window.location.href = 'login.html';
        </script>
        ";
    } else {
        echo "Error: " . $conn->error;
    }

    $conn->close();
}
?>