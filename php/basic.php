<?php
$name = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $name = trim($name);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Simple PHP Example</title>
    <link rel="stylesheet" href="../styles/style.css">
</head>
<body>

    <header class="site-header">
        <a class="logo" href="../index.html">Petal n Bloom</a>
        <a href="../index.html">Back to home</a>
    </header>

    <main class="orders-page">
        <h1>My First PHP Page</h1>
        <p>This is a very basic example of a PHP form.</p>

        <form method="POST" action="">
            <label for="name">Enter your name:</label>
            <input type="text" id="name" name="name" required>

            <button class="button" type="submit">Submit</button>
        </form>

        <?php
        if ($name != "") {
            echo "<h2>Hello, " . htmlspecialchars($name) . "!</h2>";
            echo "<p>Welcome to Petal n Bloom.</p>";
        }
        ?>

    </main>

</body>
</html>
