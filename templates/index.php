<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Open Graph / Social Media Meta Tags -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Scrubbler - Piano Learning Player">
    <meta property="og:description" content="A special player to learn piano from synesthesia videos on YouTube. Practice with adjustable playback speed and intuitive controls.">
    <meta property="og:image" content="<?php echo ($_SERVER['REQUEST_SCHEME'] ?? 'https') . '://' . $_SERVER['HTTP_HOST'] . url_for('static', 'img/og-preview.jpg'); ?>">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="675">
    <meta property="og:url" content="<?php echo ($_SERVER['REQUEST_SCHEME'] ?? 'https') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; ?>">
    <meta property="og:site_name" content="Scrubbler">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Scrubbler - Piano Learning Player">
    <meta name="twitter:description" content="A special player to learn piano from synesthesia videos on YouTube. Practice with adjustable playback speed and intuitive controls.">
    <meta name="twitter:image" content="<?php echo ($_SERVER['REQUEST_SCHEME'] ?? 'https') . '://' . $_SERVER['HTTP_HOST'] . url_for('static', 'img/og-preview.jpg'); ?>">
    
    <!-- Additional Meta Tags -->
    <meta name="description" content="A special player to learn piano from synesthesia videos on YouTube. Practice with adjustable playback speed and intuitive controls.">
    <meta name="keywords" content="piano, learning, youtube, synesthesia, music, practice, player">
    
    <link rel="stylesheet" href="<?php echo url_for('static', 'css/style.css'); ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <h1>Scrubbler</h1>
    <h2>A special player to learn piano from synesthesia videos on YouTube</h2>
    <div class="container">
        <div class="video-container">
            <div id="player"></div>
            <div id="keyboardCaptureOverlay" class="keyboard-capture-overlay" tabindex="0"></div>
            <div id="infoPanel" class="info-panel">
                <div id="playbackSpeed"></div>
            </div>
            <div id="mobileControls" class="mobile-controls">
                <button class="control-btn" id="fullscreenBtn" title="Toggle Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
                <button class="control-btn" id="rewindBtn" title="Rewind 0.5s">
                    <i class="fas fa-backward"></i>
                </button>
                <button class="control-btn" id="playPauseBtn" title="Play/Pause">
                    <i class="fas fa-play"></i>
                </button>
                <button class="control-btn" id="forwardBtn" title="Forward 0.5s">
                    <i class="fas fa-forward"></i>
                </button>
                <button class="control-btn" id="speedDownBtn" title="Decrease Speed">
                    <i class="fas fa-minus"></i>
                </button>
                <button class="control-btn" id="speedUpBtn" title="Increase Speed">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
        <div class="controls">
            <input type="text" id="youtubeUrl" placeholder="Enter YouTube URL to stary playing" class="url-input">
            <button id="loadVideo" class="icon-btn" title="Load Video">
                <i class="fas fa-play-circle"></i>
            </button>
        </div>
        
        <div class="suggested-videos">
            <h3>Try one of these videos:</h3>
            <div class="video-suggestions">
                <a href="#" class="suggestion-link" data-url="https://www.youtube.com/watch?v=Fa5QzuJrDMU">Claire de Lune by Claude Debussy</a>
                <a href="#" class="suggestion-link" data-url="https://www.youtube.com/watch?v=TtCEFCxv6Z0">Nocturne in E-flat major (Op. 9 No. 2) by Chopin</a>
                <a href="#" class="suggestion-link" data-url="https://www.youtube.com/watch?v=XWWjOR-6faY">Elvis Costello - She</a>
            </div>
        </div>
        
        <div class="keyboard-shortcuts-container">
            <button id="keyboardShortcutsBtn" class="keyboard-shortcuts-btn">
                <i class="fas fa-keyboard"></i>
                Keyboard Shortcuts
            </button>
        </div>
        
        <div class="keyboard-controls" id="keyboardControls">
            <h3>Keyboard Controls:</h3>
            <ul>
                <li>Space: Play/Pause</li>
                <li>←: Rewind 0.5 seconds</li>
                <li>→: Forward 0.5 seconds</li>
                <li>+: Increase playback speed</li>
                <li>-: Decrease playback speed</li>
                <li>F: Toggle fullscreen</li>
            </ul>
        </div>
    </div>
    <footer class="footer">
        <div class="content has-text-centered">
            <p style="margin: 0; padding: 0;"><a href="https://emrahdiril.com">Emrah Diril</a> &copy; 2025</p>
            <p style="margin: 0; padding: 0;">Created with ✨ & ❤️</p>
        </div>
    </footer>

    <script src="https://www.youtube.com/iframe_api"></script>
    <script src="<?php echo url_for('static', 'js/player.js'); ?>"></script>
</body>
</html>