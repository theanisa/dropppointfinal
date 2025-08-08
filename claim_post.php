<?php
session_start();
include 'dbconfig.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

if (!isset($_GET['post_id'])) {
    header("Location: dashboard.php");
    exit();
}

$post_id = (int)$_GET['post_id'];
$user_id = (int)$_SESSION['user_id'];

// only owner allowed to change status
$user_id = (int)$_SESSION['user_id'];
$stmt = $conn->prepare("UPDATE posts SET status = 'claimed' WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $post_id, $user_id);
$stmt->execute();

header("Location: dashboard.php");
exit();
?>