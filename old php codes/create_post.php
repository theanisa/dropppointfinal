<?php
session_start();
include 'dbconfig.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: dashboard.php");
    exit();
}

$user_id = (int)$_SESSION['user_id'];
$post_type = $_POST['post_type'] ?? '';
$title = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');
$location = trim($_POST['location'] ?? '');
$item_date = !empty($_POST['item_date']) ? $_POST['item_date'] : null;
$imagePath = null;

// handle file upload safely
if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $allowed = ['image/jpeg','image/png','image/gif','image/webp'];
    $fileTmp = $_FILES['image']['tmp_name'];
    $mime = mime_content_type($fileTmp);
    if (!in_array($mime, $allowed)) {
        echo "Invalid image type.";
        exit;
    }

    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $safeName = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $targetDir = __DIR__ . '/uploads/';
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
    $targetPath = $targetDir . $safeName;
    if (!move_uploaded_file($fileTmp, $targetPath)) {
        echo "Failed to save image.";
        exit;
    }
    // store relative path for display
    $imagePath = 'uploads/' . $safeName;
}

$stmt = $conn->prepare("INSERT INTO posts (user_id, post_type, title, description, location, item_date, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issssss", $user_id, $post_type, $title, $description, $location, $item_date, $imagePath);

if ($stmt->execute()) {
    header("Location: dashboard.php");
    exit();
} else {
    echo "DB Error: " . $stmt->error;
}
?>