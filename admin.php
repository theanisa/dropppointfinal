<?php
// admin.php
session_start();
include 'dbconfig.php';
if (!isset($_SESSION['student_id'])) { header("Location: login.html"); exit(); }

// set admin student IDs here
$adminIds = ['231-115-000']; // <-- change/add the admin student_id(s)

if (!in_array($_SESSION['student_id'], $adminIds)) {
    echo "Access denied.";
    exit();
}

$posts = $conn->query("SELECT p.*, u.full_name FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC");
?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Admin | DropPoint</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100">
<div class="max-w-6xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-4">Admin Panel</h1>
  <a href="dashboard.php" class="text-black">Back to Dashboard</a>
  <div class="mt-4">
    <?php while ($p = $posts->fetch_assoc()): ?>
      <div class="bg-white p-4 rounded mb-3">
        <div class="flex justify-between">
          <div><strong><?php echo htmlspecialchars($p['title']); ?></strong> by <?php echo htmlspecialchars($p['full_name']); ?></div>
          <div>
            <form action="delete_post_admin.php" method="POST" onsubmit="return confirm('Delete post?');" style="display:inline;">
              <input type="hidden" name="post_id" value="<?php echo $p['id']; ?>">
              <button class="text-red-600">Delete</button>
            </form>
          </div>
        </div>
      </div>
    <?php endwhile; ?>
  </div>
</div>
</body></html>