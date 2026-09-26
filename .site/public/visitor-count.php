<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');

$url = 'https://shagwrath.goatcounter.com/counter/TOTAL.json';
$body = false;

if (function_exists('curl_init')) {
    $curl = curl_init($url);

    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_USERAGENT => 'ShagsLab-VisitorCounter/1.0',
    ]);

    $body = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    curl_close($curl);

    if ($body === false || $status < 200 || $status >= 300) {
        $body = false;
    }
}
elseif (filter_var(ini_get('allow_url_fopen'), FILTER_VALIDATE_BOOLEAN)) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'header' => "User-Agent: ShagsLab-VisitorCounter/1.0\r\n",
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
}

if ($body === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Unable to reach GoatCounter']);
    exit;
}

$data = json_decode($body, true);

if (!is_array($data) || !array_key_exists('count', $data)) {
    http_response_code(502);
    echo json_encode(['error' => 'Invalid GoatCounter response']);
    exit;
}

echo json_encode([
    'count' => (string) $data['count'],
]);