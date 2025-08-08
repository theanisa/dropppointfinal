<?php
session_start();
include 'dbconfig.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $post_type = $_POST['post_type'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $location = $_POST['location'];
    $item_date = $_POST['item_date'];

    // Handle image upload
    $image_name = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $target_dir = "uploads/";
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        $image_name = time() . "_" . basename($_FILES["image"]["name"]);
        $target_file = $target_dir . $image_name;

        if (!move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            echo "Error uploading file.";
            exit();
        }
    }

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO posts (user_id, post_type, title, description, location, item_date, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $user_id, $post_type, $title, $description, $location, $item_date, $image_name);

    if ($stmt->execute()) {
        header("Location: dashboard.php");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }
}
?>
