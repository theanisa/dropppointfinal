<?php
// profile.php
session_start();
include 'dbconfig.php';
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}
$user_id = (int)$_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Profile | DropPoint</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
<nav class="bg-white shadow p-4 flex justify-between">
 <a href="dashboard.php" class="text-2xl font-bold italic bg-black-100  text-black px-4 py-2 rounded-full shadow font-sans">DropPoint</a>
 <a href="logout.php" 
           class="bg-red-500 hover:bg-black hover:text-white text-white px-4 py-2 rounded-full transition">
           Logout
        </a>

</nav>

<div class="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
<div class="flex flex-col items-center">
  <div class="relative">
    <?php if (!empty($user['profile_image'])): ?>
      <img src="<?php echo htmlspecialchars($user['profile_image']); ?>" class="w-32 h-32 rounded-full object-cover border-4 border-gray-800 shadow">
    <?php else: ?>
      <div class="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-3xl font-bold border-4 border-gray-800 shadow">
        <span><?php echo strtoupper(substr($user['full_name'],0,1)); ?></span>
      </div>
    <?php endif; ?>
    <span class="absolute bottom-2 right-2 bg-gray-900 text-white rounded-full px-2 py-1 text-xs shadow">User</span>
  </div>
  <h2 class="mt-4 text-3xl font-extrabold text-gray-900"><?php echo htmlspecialchars($user['full_name']); ?></h2>
  <p class="text-gray-500 font-medium mt-1">Student ID: <?php echo htmlspecialchars($user['student_id']); ?></p>
</div>

  <div class="mt-6 flex flex-col items-center text-center">
    <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
    <p><strong>Contact:</strong> <?php echo htmlspecialchars($user['contact']); ?></p>
  </div>

  <div class="mt-6 flex justify-center">
    <a href="update_profile.php" class="bg-orange-500 font-bold text-black hover:bg-black hover:text-white px-4 py-2 rounded">Edit Profile</a>
  </div>

  <hr class="my-6">

  <h3 class="font-semibold text-xl mb-3">My Posts</h3>
  <?php
  $pst = $conn->prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC");
  $pst->bind_param("i", $user_id);
  $pst->execute();
  $pres = $pst->get_result();
  if ($pres->num_rows === 0) {
    echo "<p class='text-gray-500'>You haven't posted yet.</p>";
  } else {
    while ($p = $pres->fetch_assoc()) {
      echo "<div class='mb-4 p-3 border border-gray-300 rounded bg-gray-50'>";
     echo "<div class='flex justify-between'><strong class='text-gray-900'>" . htmlspecialchars($p['title']) . "</strong>";
      echo "<span class='text-sm text-gray-500'>" . htmlspecialchars($p['created_at']) . "</span></div>";
      echo "<p class='text-sm mt-1 text-gray-700'>" . nl2br(htmlspecialchars($p['description'])) . "</p>";
      if (!empty($p['image'])) echo "<img src='" . htmlspecialchars($p['image']) . "' class='mt-2 w-full max-h-60 object-cover rounded border border-gray-200'>";
      echo "<div class='mt-2'>";
      echo ($p['is_claimed'] ? "<span class='text-green-600 font-semibold'>Claimed</span>" : "<span class='text-yellow-600'>Active</span>");
      echo " <form action='delete_post.php' method='POST' class='inline ml-2' onsubmit=\"return confirm('Delete post?');\"><input type='hidden' name='post_id' value='" . $p['id'] . "'><button class='text-red-600'>Delete</button></form>";
      echo "</div></div>";
    }
  }
  ?>
</div>
</body>
</html>