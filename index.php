<?php
declare(strict_types=1);

require_once __DIR__ . '/banalytiq/banalytiq.php';
record_visit();

// Simple PHP 8 server to replace Flask
// This serves the main HTML page and static files

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// Get the base path (subfolder) from the script name
$scriptName = $_SERVER['SCRIPT_NAME'];
$basePath = dirname($scriptName);

// Remove the base path from the request path
if ($basePath !== '/' && $basePath !== '\\' && str_starts_with($requestPath, $basePath)) {
    $requestPath = substr($requestPath, strlen($basePath));
}

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
    if ($extension === 'css' || $extension === 'js') {
        // Disable caching for CSS and JS during development
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
    } else {
        // Cache other static files
        header('Cache-Control: public, max-age=3600');
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');
    }

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
        // Get the base path from the current script
        $scriptName = $_SERVER['SCRIPT_NAME'];
        $basePath = dirname($scriptName);
        
        // Normalize the base path
        if ($basePath === '/' || $basePath === '\\') {
            $basePath = '';
        }
        
        $url = "$basePath/static/$filename";
        
        // Add cache-busting for CSS and JS files
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        if ($extension === 'css' || $extension === 'js') {
            $filePath = "static/$filename";
            if (file_exists($filePath)) {
                $timestamp = filemtime($filePath);
                $url .= "?v=$timestamp";
            }
        }
        
        return $url;
    }
    return '/';
}
?> 