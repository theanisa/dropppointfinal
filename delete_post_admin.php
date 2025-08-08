<?php
// delete_post_admin.php
session_start();
include 'dbconfig.php';
if (!isset($_SESSION['student_id'])) { header("Location: login.html"); exit(); }

// admin list must match admin.php
$adminIds = ['231-115-000']; // same admin ids
if (!in_array($_SESSION['student_id'], $adminIds)) {
    echo "Access denied.";
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $post_id = (int)($_POST['post_id'] ?? 0);
    // delete image if exists
    $s = $conn->prepare("SELECT image FROM posts WHERE id = ?");
    $s->bind_param("i", $post_id);
    $s->execute();
    $r = $s->get_result()->fetch_assoc();
    if (!empty($r['image'])) {
        $p = __DIR__ . '/' . $r['image'];
        if (file_exists($p)) @unlink($p);
    }
    $d = $conn->prepare("DELETE FROM posts WHERE id = ?");
    $d->bind_param("i", $post_id);
    $d->execute();
}

header("Location: admin.php");
exit();
?>