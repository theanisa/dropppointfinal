<?php
session_start();
include 'dbconfig.php';
if (!isset($_SESSION['student_id'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dashboard | DropPoint</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

<!-- Navbar -->
<nav class="bg-white shadow-md px-6 py-4 flex justify-between items-center">
  <h1 class="text-2xl font-bold text-black ">DropPoint</h1>
  <div class="flex items-center space-x-4">
    <span class="text-sm text-gray-700"><?php echo $_SESSION['student_id']; ?></span>
    <a href="profile.php" class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">P</a>
  </div>
</nav>

<!-- Main Layout -->
<div class="flex mt-6 mx-4 gap-6">
  
  <!-- Sidebar/Profile -->
  <div class="hidden md:block w-1/4 bg-white rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold mb-4">Profile Menu</h2>
    <ul class="space-y-3 text-gray-700 text-sm">
      <li><a href="profile.php" class="hover:text-black">View Profile</a></li>
      <li><a href="update_profile.php" class="hover:text-black">Edit Profile</a></li>
      <li><a href="logout.php" class="hover:text-black">Logout</a></li>
    </ul>
  </div>

  <!-- Post Section -->
  <div class="w-full md:w-2/4">
    <!-- Post prompt box -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <p class="text-gray-800 font-semibold">Lost something? Found something?</p>
      <button onclick="toggleForm()" class="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray transition">
        Post Here
      </button>
    </div>

    <!-- Hidden Post Form -->
    <div id="postForm" class="hidden bg-white p-6 rounded-lg shadow-md mb-6">
      <form action="create_post.php" method="POST" enctype="multipart/form-data" class="space-y-4">
        <div>
          <label class="block font-medium text-sm">Post Type</label>
          <select name="post_type" required class="w-full px-3 py-2 border rounded">
            <option value="">Select</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        <div>
          <label class="block font-medium text-sm">Title</label>
          <input type="text" name="title" required class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block font-medium text-sm">Description</label>
          <textarea name="description" required class="w-full px-3 py-2 border rounded"></textarea>
        </div>
        <div>
          <label class="block font-medium text-sm">Location</label>
          <input type="text" name="location" required class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block font-medium text-sm">Date</label>
          <input type="date" name="item_date" class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block font-medium text-sm">Upload Image</label>
          <input type="file" name="image" accept="image/*" class="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Post
        </button>
      </form>
    </div>

    <!-- Placeholder for posts -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <h3 class="text-lg font-bold mb-4">Recent Posts</h3>
      <p class="text-gray-500">No recent posts yet.</p>
    </div>
  </div>

  <!-- Optional right column -->
  <div class="hidden md:block w-1/4">
    <!-- Reserved for future use -->
  </div>
</div>

<script>
  function toggleForm() {
    const form = document.getElementById('postForm');
    form.classList.toggle('hidden');
  }
</script>

</body>
</html>
