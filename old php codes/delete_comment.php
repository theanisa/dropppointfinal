<?php
// delete_comment.php
session_start();
include 'dbconfig.php';
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: dashboard.php");
    exit();
}

$comment_id = (int)($_POST['comment_id'] ?? 0);
$user_id = (int)$_SESSION['user_id'];

$stmt = $conn->prepare("DELETE FROM comments WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $comment_id, $user_id);
$stmt->execute();

header("Location: dashboard.php");
exit();
?>