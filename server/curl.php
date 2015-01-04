<?php
if(!isset($_POST['url'])) {
header("HTTP/1.1 500 Internal Server Error");
exit();
}
 header("Access-Control-Allow-Origin: *");
$url = $_POST['url'];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:13.0) Gecko/20100101 Firefox/13.0.1');
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$result = curl_exec($ch);
curl_close($ch);

if (!$result) {
    header("HTTP/1.1 500 Internal Server Error");
} else {
    echo $result;
}
