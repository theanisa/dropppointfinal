<?php
// toggle_claim.php
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

$post_id = (int)($_POST['post_id'] ?? 0);
$user_id = (int)$_SESSION['user_id'];

$stmt = $conn->prepare("SELECT is_claimed, user_id FROM posts WHERE id = ?");
$stmt->bind_param("i", $post_id);
$stmt->execute();
$res = $stmt->get_result();
if (!$res || $res->num_rows === 0) {
    header("Location: dashboard.php");
    exit();
}
$row = $res->fetch_assoc();

// only owner can toggle
if ((int)$row['user_id'] !== $user_id) {
    header("Location: dashboard.php");
    exit();
}

$new = $row['is_claimed'] ? 0 : 1;
$u = $conn->prepare("UPDATE posts SET is_claimed = ? WHERE id = ? AND user_id = ?");
$u->bind_param("iii", $new, $post_id, $user_id);
$u->execute();

header("Location: dashboard.php");
exit();
?>