<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?php echo url_for('static', 'css/style.css'); ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <h1>Scrubbler Player</h1>
    <div class="container">
        <div class="video-container">
            <div id="player"></div>
            <div id="keyboardCaptureOverlay" class="keyboard-capture-overlay" tabindex="0"></div>
            <div id="infoPanel" class="info-panel">
                <div id="playbackSpeed">1.00x</div>
                <div id="playState">PAUSED</div>
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
        
<!--        <div class="keyboard-controls">
            <h3>Keyboard Controls:</h3>
            <ul>
                <li>Space: Play/Pause</li>
                <li>←: Rewind 0.5 seconds</li>
                <li>→: Forward 0.5 seconds</li>
                <li>+: Increase playback speed</li>
                <li>-: Decrease playback speed</li>
                <li>F: Toggle fullscreen</li>
            </ul>
        </div> -->
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