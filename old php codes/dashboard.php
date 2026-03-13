<?php
session_start();
include 'dbconfig.php';
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

$full_name = $_SESSION['full_name'] ?? '';
$user_id = (int)$_SESSION['user_id'];

// build WHERE for search/filter safely using prepared statements
$where = [];
$params = [];
$types = '';

if (!empty($_GET['search'])) {
    $where[] = "(title LIKE ? OR description LIKE ? OR location LIKE ?)";
    $s = '%' . $_GET['search'] . '%';
    $params[] = $s; $params[] = $s; $params[] = $s;
    $types .= 'sss';
}

if (!empty($_GET['type'])) {
    $where[] = "post_type = ?";
    $params[] = $_GET['type'];
    $types .= 's';
}

$whereSQL = count($where) ? 'WHERE ' . implode('AND ', $where) : '';

$sql = "SELECT p.*, u.full_name FROM posts p JOIN users u ON p.user_id = u.id $whereSQL ORDER BY p.created_at DESC";
$stmt = $conn->prepare($sql);
if ($params) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$postsResult = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Dashboard | DropPoint</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">

<header class="bg-white shadow">
  <!-- navbar -->
   <nav>
  <div class="max-w-8xl px-4 py-3 pl-8 flex items-center justify-between">
    <a href="dashboard.php" class="text-2xl font-bold italic bg-black-100  text-black px-4 py-2 rounded-full shadow font-sans">DropPoint</a>
    <form method="GET" class="flex gap-2 items-center justify-center">
      <input type="text" name="search" value="<?php echo htmlspecialchars($_GET['search'] ?? ''); ?>" placeholder="Search posts or location..." class="border rounded px-3 py-1 w-64">
      <select name="type" class="border rounded px-2 py-1">
        <option value="">All</option>
        <option value="lost" <?php if(($_GET['type'] ?? '')=='lost') echo 'selected'; ?>>Lost</option>
        <option value="found" <?php if(($_GET['type'] ?? '')=='found') echo 'selected'; ?> >Found</option>
      </select>
     <button class="bg-orange-500 text-black px-3 py-1 rounded">Search</button>
    </form>
  </div>
        </nav>
</header>

<main class="max-w-8xl mx-auto pl-12 px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
  <section class="lg:col-span-2 space-y-6">
    <div class="bg-white p-4 rounded shadow flex gap-3">
      <div class="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center text-xl text-white"><?php echo strtoupper(substr($full_name,0,1)); ?></div>
      <div class="flex-1">
        <p class="font-bold text-xl font-family:'Baloo' ">Lost anything? Found anything?</p>
        <button onclick="document.getElementById('postForm').classList.toggle('hidden')" class="mt-2 text-xl w-full text-left border rounded px-3 py-2 text-gray-600">Share Details Here!</button>
      </div>
    </div>

    <form id="postForm" class="hidden bg-white p-4 rounded shadow" action="create_post.php" method="POST" enctype="multipart/form-data">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select name="post_type" required class="border rounded px-3 py-2">
          <option value="">Select Type</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input type="text" name="title" placeholder="Title (optional)" class="border rounded px-3 py-2">
      </div>
      <textarea name="description" required placeholder="Describe the item..." class="w-full border rounded px-3 py-2 mt-3"></textarea>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <input type="text" name="location" placeholder="Location" class="border rounded px-3 py-2">
        <input type="date" name="item_date" class="border rounded px-3 py-2">
        <input type="file" name="image" accept="image/*" class="border rounded px-3 py-2">
      </div>
      <div class="mt-3 flex gap-2">
        <button type="submit" class="bg-orange-500 hover:text-white hover:bg-black text-black font-bold px-4 py-2 rounded">Post</button>
        <button type="button" onclick="document.getElementById('postForm').classList.add('hidden')" class="px-4 py-2 border hover:bg-black hover:text-white rounded">Cancel</button>
      </div>
    </form>

    <?php if ($postsResult->num_rows === 0): ?>
      <div class="bg-white p-6 rounded shadow text-center text-gray-600">No posts found.</div>
    <?php else: ?>
      <?php while ($post = $postsResult->fetch_assoc()): ?>
        <article class="bg-white p-4 rounded shadow">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-sm text-gray-500"><?php echo htmlspecialchars($post['full_name']); ?> • <span class="font-medium text-sm"><?php echo htmlspecialchars(ucfirst($post['post_type'])); ?></span></div>
              <?php if (!empty($post['title'])): ?><h3 class="font-bold text-lg mt-1"><?php echo htmlspecialchars($post['title']); ?></h3><?php endif; ?>
              <p class="text-gray-700 mt-2"><?php echo nl2br(htmlspecialchars($post['description'])); ?></p>
              <?php if (!empty($post['image'])): ?>
                <div class="mt-3"><img src="<?php echo htmlspecialchars($post['image']); ?>" alt="post image" class="w-full max-h-80 object-cover rounded"></div>
              <?php endif; ?>
              <div class="mt-2 text-sm text-gray-500">Location: <?php echo htmlspecialchars($post['location']); ?> • <?php echo htmlspecialchars($post['created_at']); ?></div>
            </div>

            <div class="text-right">
              <?php if ((int)$post['user_id'] === $user_id): ?>
                <!-- Owner: toggle claim + delete -->
                <form action="toggle_claim.php" method="POST" style="display:inline;">
                  <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                  <button class="bg-yellow-500 text-xl text-white px-3 py-1 rounded text-sm"><?php echo $post['is_claimed'] ? 'Unclaim' : 'Mark as Claimed'; ?></button>
                </form>
                <form action="delete_post.php" method="POST" onsubmit="return confirm('Delete post?');" style="display:inline;margin-left:6px;">
                  <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                  <button class="bg-red-600 text-xl text-white px-3 py-1 rounded text-sm">Delete</button>
                </form>
              <?php else: ?>
                <!-- Non-owner: show claimed status -->
                <?php if ($post['is_claimed']): ?>
                  <div class="text-green-600 text-xl font-semibold">✅ Claimed</div>
                <?php endif; ?>
              <?php endif; ?>
            </div>
          </div>

          <!-- Comments block -->
          <?php
          $cstmt = $conn->prepare("SELECT c.*, u.full_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC");
          $cstmt->bind_param("i", $post['id']);
          $cstmt->execute();
          $cres = $cstmt->get_result();
          ?>
          <div class="mt-4 border-t pt-3">
            <?php if ($cres->num_rows > 0): ?>
              <?php while ($c = $cres->fetch_assoc()): ?>
                <div class="mb-2">
                  <div class="text-sm font-semibold"><?php echo htmlspecialchars($c['full_name']); ?> <span class="text-xs text-gray-500 ml-2"><?php echo htmlspecialchars($c['created_at']); ?></span></div>
                  <div class="text-gray-700"><?php echo nl2br(htmlspecialchars($c['comment'])); ?></div>
                  <?php if ((int)$c['user_id'] === $user_id): ?>
                    <form method="POST" action="delete_comment.php" class="inline">
                      <input type="hidden" name="comment_id" value="<?php echo $c['id']; ?>">
                      <button class="text-xs text-red-500">Delete</button>
                    </form>
                  <?php endif; ?>
                </div>
              <?php endwhile; ?>
            <?php else: ?>
              <div class="text-sm text-gray-500 mb-2">No comments yet.</div>
            <?php endif; ?>
            <?php $cstmt->close(); ?>

            <!-- comment form -->
            <form action="add_comment.php" method="POST" class="mt-2 flex gap-2">
              <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
              <input type="text" name="comment" placeholder="Write a comment..." class="flex-1 border px-3 py-2 rounded" required>
              <button type="submit" class="bg-gray-800 font-bold hover:bg-orange-500 hover:text-black text-white px-4 py-2 rounded">Comment</button>
            </form>
          </div>
        </article>
      <?php endwhile; ?>
    <?php endif; ?>
  </section>

  <!-- Right profile column -->
  <aside class=" flex flex-col items-center space-y-4 text-center">
    
    <div class="flex items-center gap-4">
     <?php
      // profile image small
      $imgRow = $conn->prepare("SELECT profile_image FROM users WHERE id = ?");
      $imgRow->bind_param("i", $user_id);
      $imgRow->execute();
      $imgRes = $imgRow->get_result()->fetch_assoc();
      ?>
      <a href="profile.php" class="block">
        <?php if (!empty($imgRes['profile_image'])): ?>
          <img src="<?php echo htmlspecialchars($imgRes['profile_image']); ?>" class="w-24 h-24 border-4 border-gray-500 shadow rounded-full object-cover border" alt="Profile">
        <?php else: ?>
          <div class="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center"><?php echo strtoupper(substr($full_name,0,1)); ?></div>
        <?php endif; ?>
      </a>
    </div>
    <div class="welcome-box text-center">
      
    <h3 class="text-2xl font-extrabold text-gray-800 bg-gradient-to-r from-orange-500 to-black bg-clip-text text-transparent tracking-wide">
        👋 Welcome, <?php echo htmlspecialchars($full_name); ?>!
    </h3>
    <p class="text-sm text-gray-400 mt-1">Glad to see you back at DropPoint 🚀</p>

    <a href="profile.php" 
       class="mt-4 inline-block bg-orange-500 hover:bg-black hover:text-white text-black font-semibold px-5 py-2 rounded-full transition">
       Edit Profile
    </a>
</div>
  </aside>
</main>

<script>
function toggleForm(){ document.getElementById('postForm').classList.toggle('hidden'); }
</script>
</body>
</html>