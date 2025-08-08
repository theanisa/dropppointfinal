<?php
// delete_post.php
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

$stmt = $conn->prepare("SELECT image FROM posts WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $post_id, $user_id);
$stmt->execute();
$res = $stmt->get_result();
if ($res && $res->num_rows === 1) {
    $row = $res->fetch_assoc();
    // delete image file if exists
    if (!empty($row['image'])) {
        $path = __DIR__ . '/' . $row['image'];
        if (file_exists($path)) @unlink($path);
    }
    $d = $conn->prepare("DELETE FROM posts WHERE id = ? AND user_id = ?");
    $d->bind_param("ii", $post_id, $user_id);
    $d->execute();
}

header("Location: dashboard.php");
exit();
?>