<?php
// Your DB connection setup here
include 'dbconfig.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $student_id = $_POST['student_id'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // secure hashing

    $sql = "INSERT INTO users (student_id, name, email, password) 
            VALUES ('$student_id', '$name', '$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "
        <script>
            alert('Registration successful!');
            window.location.href = 'login.html';
        </script>
        ";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>