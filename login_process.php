<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SESSION['email'])) {
    header("Location: login.html");
    exit;
}

echo "<h1>Welcome, " . htmlspecialchars($_SESSION['name']) . "!</h1>";
echo "<p>Your email: " . htmlspecialchars($_SESSION['email']) . "</p>";
echo '<a href="logout.php">Logout</a>';
?>
