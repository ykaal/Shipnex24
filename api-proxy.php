<?php
// PHP Proxy for Node.js Backend
error_reporting(0);

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Node.js backend
$nodeBackend = 'http://127.0.0.1:3000';
$requestUri = $_SERVER['REQUEST_URI'];

// Build target URL
$targetUrl = $nodeBackend . $requestUri;

// Initialize cURL
$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Forward request body for POST/PUT
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH'])) {
    $postData = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
}

// Forward headers
$headers = [];
foreach (getallheaders() as $name => $value) {
    if (!in_array(strtolower($name), ['host', 'connection'])) {
        $headers[] = "$name: $value";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Get response headers
curl_setopt($ch, CURLOPT_HEADER, true);

// Execute
$response = curl_exec($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Split headers and body
$responseHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);

curl_close($ch);

// Forward status code
http_response_code($httpCode);

// Forward response headers
foreach (explode("\r\n", $responseHeaders) as $header) {
    if (strpos($header, ':') !== false && !preg_match('/^(Transfer-Encoding|Connection):/i', $header)) {
        header($header);
    }
}

// Output response body
echo $responseBody;
?>
