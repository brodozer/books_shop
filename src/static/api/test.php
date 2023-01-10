<?php

$data = json_decode(file_get_contents('php://input'), true);
$to = "perepelitsa.alex@gmail.com";
$subject = "Books shop";

$name = $data['name'];
$surname = $data['surname'];
$address = $data['street'] . ", ";
$address .= $data['house'] . ", ";
$address .= $data['flatNumber'];
$delivery = $data['deliveryDate'];
$payment = $data['paymentType'];
$books = $data['books'];
$table = "<table>";
$table .= "
<thead>
	<tr>
		<th>Author</th>
		<th>Title</th>
		<th>Qty</th>
		<th>Price</th>
	</tr>
</thead>
";
$table .= "<tbody>";

foreach ($books as $book) {
	$table .= "<tr>";
	foreach($book as $value) {
		$table .= "<td>" . $value . "</td>"; 
	}
	$table .= "</tr>";
}

$table .= "</tbody>";
$table .= "</table>";

$message = "
<html>
<head>
<title>Books shop order</title>
<style>
table, th, td {
	border: 1px solid black;
	border-collapse: collapse;
}
th, td {
	padding: 15px;
}
</style>
</head>
<body>
<h3>Orders #78</h3>
<ul>";
$message .= "<li>Name: " . $name . "</li>";
$message .= "<li>Surname: " . $surname . "</li>";
$message .= "<li>Address: " . $address . "</li>";
$message .= "<li>Delivery date: " . $delivery . "</li>";
$message .= "<li>Payment Type: " . $payment . "</li>";
if(!empty($data['gifts'])) {
	foreach($data['gifts'] as $value) {
		$gifts .= $value . ', ';
	}
	$message .= "<li>Gigts: " . $gifts . "</li>";
}
$message .= "</ul>";
$message .= $table;
$message .= "</body></html>";



$send = mail($to, $subject, $message, $headers);
if($send) {
	$msg = 'Congratulations! data was send';
} else {
	$msg = 'error';
}
$response = ['message' => $msg];
header('Content-type: application/json');
echo json_encode($response);
?>