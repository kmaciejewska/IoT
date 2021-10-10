<?php
	$Temp = $_POST["temperature"];
	
	$Write="<p>Temperature: " . $Temp . " Celsius </p>";
	file_put_contents('control.html', $Write);
?>