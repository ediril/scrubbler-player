# YouTube Player - PHP 8 Version

This is a web application to play YouTube videos with custom keyboard controls and playback speed adjustments.

## Features

- Custom keyboard controls for video playback
- Playback speed adjustment (0.25x to 2x)
- Fullscreen support
- Clean, minimal interface
- No video player shown until a video is loaded

## Requirements

- PHP 8.0 or higher
- Web server (Apache, Nginx, or PHP built-in server)
- Modern web browser

## Installation & Setup

### Option 1: Using PHP Built-in Server (Development)

1. Navigate to the project directory:
   ```bash
   cd /path/to/your/project
   ```

2. Start the PHP built-in server:
   ```bash
   php -S localhost:8000 index.php
   ```

3. Open your browser and go to: `http://localhost:8000`

### Option 2: Using Apache/Nginx (Production)

1. Copy all files to your web server's document root
2. Ensure the `.htaccess` file is in place (for Apache)
3. Make sure your web server has PHP 8+ enabled
4. Access the application through your web server

### For Nginx Users

If using Nginx, add this configuration to your server block:

```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}

location /static/ {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}
```

## Keyboard Controls

- **Space**: Play/Pause
- **←**: Rewind 0.5 seconds
- **→**: Forward 0.5 seconds
- **↑**: Increase playback speed (+0.25x)
- **↓**: Decrease playback speed (-0.25x)
- **F**: Toggle fullscreen

## File Structure

```
├── index.php              # Main PHP application
├── .htaccess              # Apache URL rewriting rules
├── templates/
│   └── index.html         # HTML template
├── static/
│   ├── css/
│   │   └── style.css      # Application styles
│   └── js/
│       └── player.js      # YouTube player logic
└── README-PHP.md          # This file
```

## Migration from Python/Flask

This PHP version replaces the original Python Flask application with:

- **index.php**: Replaces `app.py` - handles routing and static file serving
- **templates/index.html**: Updated to use PHP templating instead of Jinja2
- **.htaccess**: Handles URL rewriting (replaces Flask's routing)

All frontend functionality (CSS, JavaScript) remains exactly the same.

## Troubleshooting

### Static files not loading
- Ensure the `.htaccess` file is present and Apache mod_rewrite is enabled
- For Nginx, ensure the configuration includes the static file handling rules

### PHP errors
- Check that you're using PHP 8.0 or higher
- Ensure all required PHP extensions are installed

### Video not loading
- Check browser console for JavaScript errors
- Ensure you have a stable internet connection for YouTube API access 