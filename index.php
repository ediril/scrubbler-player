<?php
declare(strict_types=1);

// Simple PHP 8 server to replace Flask
// This serves the main HTML page and static files

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$requestPath = ltrim($requestPath, '/');

// Handle static files
if (str_starts_with($requestPath, 'static/')) {
    serveStaticFile($requestPath);
    return;
}

// Handle root route
if ($requestPath === '' || $requestPath === 'index.php') {
    serveMainPage();
    return;
}

// 404 for other routes
http_response_code(404);
echo "404 - Page not found";

function serveStaticFile(string $filePath): void {
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo "404 - File not found";
        return;
    }

    // Get file extension and set appropriate content type
    $extension = pathinfo($filePath, PATHINFO_EXTENSION);
    $contentTypes = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject'
    ];

    $contentType = $contentTypes[$extension] ?? 'application/octet-stream';
    header("Content-Type: $contentType");

    // Set cache headers for static files
    header('Cache-Control: public, max-age=3600');
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');

    readfile($filePath);
}

function serveMainPage(): void {
    header('Content-Type: text/html; charset=utf-8');
    
    // Include the HTML template
    include 'templates/index.php';
}

// Helper function to generate URLs for static files (replaces Flask's url_for)
function url_for(string $endpoint, string $filename = ''): string {
    if ($endpoint === 'static') {
        return "/static/$filename";
    }
    return '/';
}
?> 