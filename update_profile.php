<?php
// update_profile.php
session_start();
include 'dbconfig.php';
if (!isset($_SESSION['user_id'])) { header("Location: login.html"); exit(); }
$user_id = (int)$_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
?>
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Edit Profile</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100">
<nav class="bg-white p-4 shadow"><div class="max-w-6xl mx-auto"> <a href="profile.php" class="text-black">Back</a></div></nav>
<div class="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
  <h2 class="text-xl font-bold mb-4 text-black">Edit Profile</h2>
  <form action="update_profile_process.php" method="POST" enctype="multipart/form-data" class="space-y-4">
    <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
    <div><label>Full name</label><input type="text" name="full_name" value="<?php echo htmlspecialchars($user['full_name']); ?>" required class="w-full border px-3 py-2 rounded"></div>
    <div><label>Email</label><input type="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required class="w-full border px-3 py-2 rounded"></div>
    <div><label>Contact</label><input type="text" name="contact" value="<?php echo htmlspecialchars($user['contact']); ?>" class="w-full border px-3 py-2 rounded"></div>
    <div><label>Profile Image</label><input type="file" name="profile_image" accept="image/*" class="w-full"></div>
    <div><label>New Password (leave blank to keep current)</label><input type="password" name="new_password" class="w-full border px-3 py-2 rounded"></div>
    <button class="bg-black text-white px-4 py-2 rounded">Save Changes</button>
  </form>
</div>
</body>
</html>