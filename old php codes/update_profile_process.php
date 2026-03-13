<?php
// update_profile_process.php
session_start();
include 'dbconfig.php';
if (!isset($_SESSION['user_id'])) { header("Location: login.html"); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header("Location: profile.php"); exit(); }

$user_id = (int)$_SESSION['user_id'];
$full_name = trim($_POST['full_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$contact = trim($_POST['contact'] ?? '');
$new_password = trim($_POST['new_password'] ?? '');

$profile_image = null;
if (!empty($_FILES['profile_image']['name']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
    $tmp = $_FILES['profile_image']['tmp_name'];
    $ext = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
    $fname = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $dir = __DIR__ . '/uploads/';
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    if (move_uploaded_file($tmp, $dir . $fname)) {
        $profile_image = 'uploads/' . $fname;
    }
}

if ($new_password !== '') {
    $hash = password_hash($new_password, PASSWORD_DEFAULT);
    if ($profile_image) {
        $stmt = $conn->prepare("UPDATE users SET full_name=?, email=?, contact=?, profile_image=?, password=? WHERE id=?");
        $stmt->bind_param("sssssi", $full_name, $email, $contact, $profile_image, $hash, $user_id);
    } else {
        $stmt = $conn->prepare("UPDATE users SET full_name=?, email=?, contact=?, password=? WHERE id=?");
        $stmt->bind_param("ssssi", $full_name, $email, $contact, $hash, $user_id);
    }
} else {
    if ($profile_image) {
        $stmt = $conn->prepare("UPDATE users SET full_name=?, email=?, contact=?, profile_image=? WHERE id=?");
        $stmt->bind_param("ssssi", $full_name, $email, $contact, $profile_image, $user_id);
    } else {
        $stmt = $conn->prepare("UPDATE users SET full_name=?, email=?, contact=? WHERE id=?");
        $stmt->bind_param("sssi", $full_name, $email, $contact, $user_id);
    }
}

if ($stmt->execute()) {
    $_SESSION['full_name'] = $full_name;
    header("Location: profile.php");
    exit();
} else {
    echo "Update error: " . $stmt->error;
}
?>