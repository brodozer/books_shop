<?php
// так как данные отправляю json, нужно декодировать ! 

$json = file_get_contents("php://input");
$data = json_decode($json);

$to = "perepelitsa.alex@gmail.com";
$subject = "Books shop";

$name = $data['name'];
$surname = $data['surname'];
$address = $data['street'] . ",";
$address .= $data['house'] . ",";
$address .= $data['flatNumber'];
$delivery = $data['deliveryDate'];
$payment = $data['paymentType'];
$gifts = '';

if(!empty($data['gifts'])) {
	foreach ($data['gifts'] as $value) {
		$gifts .= $value . ','
	}
}

// обработать массив books, сделать таблицу в цикле, добавить в message

// $books = $data['books'];
// $table = "<table>"
// $table .= "
// <thead>
// 	<tr>
// 		<th>Author</th>
// 		<th>Title</th>
// 		<th>Qty</th>
// 		<th>Price</th>
// 	</tr>
// </thead>
// ";
// $table .= "<tbody>"

// foreach ($books as $book) {
// 	$table .= "<tr>";
// 	foreach($book as $value) {
// 		$table .= "<td>" . $value . "</td>"; 
// 	}
// 	$table .= "</tr>";
// }

// $table .= "</tbody>";
// $table .= "</table>";

$message = "
<html>
<head>
<title>Books shop order</title>
</head>
<body>
<h3>Orders #78</h3>
<ul>";
$message .= "<li>Name: " . $name . "</li>";
$message .= "<li>Surname: " . $surname . "</li>";
$message .= "<li>Address: " . $address . "</li>";
$message .= "<li>Delivery date: " . $delivery . "</li>";
$message .= "<li>Payment Type" . $payment . "</li>";
if(strlen($gifts) !== 0) {
	$message .= "<li>Gifts" . $gifts . "</li>";
}
$message .= "</ul>";
//$message .= $table;
$message .= "
</body>
</html>
"

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: <bookstore@gmail.com>' . "\r\n";


$send = mail($to, $subject, $message, $headers);
if(send) {
	$message = 'Congratulations! data was send';
} else {
	$message = 'error';
}
$response = ['message' => $message];
header('Content-type: application/json');
echo json_encode($response);
?>