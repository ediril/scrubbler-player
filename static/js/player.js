let player;
let currentPlaybackRate = 1.0;
let isFullscreen = false;

// Initialize YouTube player when API is ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: '', // Will be set when loading a video
        playerVars: {
            'playsinline': 1,
            'controls': 0,      // Hide YouTube controls
            'enablejsapi': 1,
            'origin': window.location.origin,
            'rel': 0,           // Disable related videos
            'showinfo': 0,      // Hide video title and uploader info
            'modestbranding': 1, // Hide YouTube logo
            'iv_load_policy': 3,  // Hide video annotations
            'fs': 0,            // Disable YouTube's fullscreen button
            'disablekb': 1,     // Disable YouTube's keyboard controls
            'cc_load_policy': 0, // Disable closed captions
            'widget_referrer': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('YouTube player is ready');
    updateInfoPanel();
    // Set initial playback rate
    player.setPlaybackRate(currentPlaybackRate);
    
    // Auto-play the video
    player.playVideo();
    
    // Set up the keyboard capture overlay
    setupKeyboardCapture();
    
    // Add click handler to the player container
    const playerContainer = document.querySelector('.video-container');
    if (playerContainer) {
        playerContainer.addEventListener('click', (e) => {
            // Ignore clicks on the info panel
            if (e.target.closest('#infoPanel')) return;
            
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        });
    }
}

// Set up the keyboard capture overlay
function setupKeyboardCapture() {
    const overlay = document.getElementById('keyboardCaptureOverlay');
    if (!overlay) return;
    
    // Focus the overlay to ensure it captures keyboard events
    overlay.focus();
    
    // Add keyboard event listener to the overlay
    overlay.addEventListener('keydown', function(e) {
        // Don't handle keyboard events if user is typing in an input field
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA' ||
            document.activeElement.isContentEditable) {
            return;
        }
        
        console.log('Overlay keydown:', e.code);
        
        // Handle specific keys
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                console.log('Space key - play/pause');
                const state = player.getPlayerState();
                if (state === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                } else {
                    player.playVideo();
                }
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                console.log('Left arrow - rewinding');
                player.seekTo(player.getCurrentTime() - 0.5, true);
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                console.log('Right arrow - forwarding');
                player.seekTo(player.getCurrentTime() + 0.5, true);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                console.log('Up arrow - increasing speed');
                currentPlaybackRate = Math.min(currentPlaybackRate + 0.25, 2);
                player.setPlaybackRate(currentPlaybackRate);
                showSpeedNotification(currentPlaybackRate);
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                console.log('Down arrow - decreasing speed');
                currentPlaybackRate = Math.max(currentPlaybackRate - 0.25, 0.25);
                player.setPlaybackRate(currentPlaybackRate);
                showSpeedNotification(currentPlaybackRate);
                break;
                
            case 'KeyF':
                e.preventDefault();
                console.log('F key - fullscreen');
                toggleCustomFullscreen();
                break;
        }
        
        // Update the display
        updateInfoPanel();
    });
    
    // Maintain focus on the overlay periodically, but not when user is in an input
    setInterval(() => {
        if (document.activeElement !== overlay && 
            document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA' &&
            !document.activeElement.isContentEditable) {
            overlay.focus();
        }
    }, 100);
}

// Helper function to show speed notification
function showSpeedNotification(speed) {
    const notification = document.createElement('div');
    notification.textContent = `Speed: ${speed.toFixed(2)}x`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'rgba(0,0,0,0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 1500);
}

// Helper function to toggle fullscreen
function toggleFullscreen() {
    if (!isFullscreen) {
        // Create a fullscreen container for custom fullscreen
        const fullscreenContainer = document.createElement('div');
        fullscreenContainer.id = 'customFullscreen';
        fullscreenContainer.className = 'custom-fullscreen-container';
        
        // Clone the player and info panel
        const videoContainer = document.querySelector('.video-container');
        const clonedContainer = videoContainer.cloneNode(true);
        
        // Append to the page
        fullscreenContainer.appendChild(clonedContainer);
        document.body.appendChild(fullscreenContainer);
        
        // Request fullscreen on our container instead of the iframe
        fullscreenContainer.requestFullscreen();
        
        // Setup keyboard events for fullscreen mode
        document.addEventListener('keydown', handleFullscreenKeydown);
        
        // Update the display
        document.body.classList.add('custom-fullscreen-active');
    } else {
        // Exit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        // Remove the custom fullscreen container after exit
        document.removeEventListener('keydown', handleFullscreenKeydown);
        const customFullscreen = document.getElementById('customFullscreen');
        if (customFullscreen) {
            customFullscreen.remove();
        }
        
        // Update the display
        document.body.classList.remove('custom-fullscreen-active');
    }
    
    isFullscreen = !isFullscreen;
}

// Handle keydown events in fullscreen mode
function handleFullscreenKeydown(e) {
    if (!player) return;
    
    console.log('Fullscreen keydown:', e.code);
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
                document.querySelector(".ytp-pause-overlay-container")?.remove();

            } else {
                player.playVideo();
            }
            break;
            
        case 'ArrowLeft':
            e.preventDefault();
            player.seekTo(player.getCurrentTime() - 0.5, true);
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            player.seekTo(player.getCurrentTime() + 0.5, true);
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            currentPlaybackRate = Math.min(currentPlaybackRate + 0.25, 2);
            player.setPlaybackRate(currentPlaybackRate);
            showSpeedNotification(currentPlaybackRate);
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            currentPlaybackRate = Math.max(currentPlaybackRate - 0.25, 0.25);
            player.setPlaybackRate(currentPlaybackRate);
            showSpeedNotification(currentPlaybackRate);
            break;
            
        case 'KeyF':
        case 'Escape':
            e.preventDefault();
            toggleFullscreen();
            break;
    }
    
    // Update the info panel
    updateInfoPanel();
}

function onPlayerStateChange(event) {
    updateInfoPanel();
    
    // When the video is paused, try to handle the "More Videos" overlay
    if (event.data === YT.PlayerState.PAUSED) {
        // Simply make the onPlayerStateChange function set a global flag
        // The interval below will try repeatedly to hide the overlay
        pauseOverlayCheck = true;
    } else {
        pauseOverlayCheck = false;
    }
}

// Flag to indicate if we should be checking for pause overlay
let pauseOverlayCheck = false;

// Check for pause overlay and remove it every 500ms when paused
setInterval(() => {
    if (pauseOverlayCheck && player) {
        try {
            // Try different ways to hide the overlay
            const iframe = player.getIframe();
            const overlay = document.querySelector('.ytp-pause-overlay-container');
            if (overlay) {
                overlay.style.display = 'none';
            }
            
            // Try to inject CSS that targets the overlay
            const styleElem = document.createElement('style');
            styleElem.textContent = '.ytp-pause-overlay-container, .ytp-pause-overlay { display: none !important; }';
            document.head.appendChild(styleElem);
        } catch (e) {
            console.log('Error trying to hide pause overlay:', e);
        }
    }
}, 500);

function updateInfoPanel() {
    if (!player) return;
    
    const state = player.getPlayerState();
    
    document.getElementById('playbackSpeed').textContent = currentPlaybackRate.toFixed(2) + 'x';
    document.getElementById('playState').textContent = getStateText(state);
}

function getStateText(state) {
    switch(state) {
        case YT.PlayerState.PLAYING: return 'PLAYING';
        case YT.PlayerState.PAUSED: return 'PAUSED';
        case YT.PlayerState.ENDED: return 'ENDED';
        default: return '';
    }
}

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Event Listeners
document.getElementById('loadVideo').addEventListener('click', () => {
    const url = document.getElementById('youtubeUrl').value;
    const videoId = extractVideoId(url);
    
    if (videoId) {
        player.loadVideoById(videoId);
        
        // Show the video container when a video is loaded
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.classList.add('video-loaded');
        }
        
        // Re-focus on the keyboard capture overlay
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) overlay.focus();
    } else {
        alert('Please enter a valid YouTube URL');
    }
});

document.addEventListener('fullscreenchange', function() {
    console.log('Fullscreen change detected');
    
    // Check if we're in fullscreen mode
    if (document.fullscreenElement) {
        console.log('Entered fullscreen via browser API');
        isFullscreen = true;
        
        // Add global keydown handler for fullscreen
        document.addEventListener('keydown', handleGlobalKeydown);
    } else {
        console.log('Exited fullscreen via browser API');
        isFullscreen = false;
        
        // Remove global keydown handler
        document.removeEventListener('keydown', handleGlobalKeydown);
    }
});

// Also handle webkit/moz fullscreen change events for broader browser support
document.addEventListener('webkitfullscreenchange', function() {
    isFullscreen = !!document.webkitFullscreenElement;
});
document.addEventListener('mozfullscreenchange', function() {
    isFullscreen = !!document.mozFullScreenElement;
});
document.addEventListener('MSFullscreenChange', function() {
    isFullscreen = !!document.msFullscreenElement;
});

// Update info panel every 100ms
setInterval(updateInfoPanel, 100);

// Toggle custom fullscreen mode
function toggleCustomFullscreen() {
    console.log('Toggle fullscreen called');
    
    // Get the video container element
    const videoContainer = document.querySelector('.video-container');
    
    if (!isFullscreen) {
        console.log('Entering fullscreen');
        // Try to enter fullscreen
        try {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) { /* Firefox */
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) { /* IE/Edge */
                videoContainer.msRequestFullscreen();
            }
            isFullscreen = true;
            
            // Add a global keydown handler that works in fullscreen
            document.addEventListener('keydown', handleGlobalKeydown);
        } catch (err) {
            console.error('Error attempting to enable fullscreen:', err);
        }
    } else {
        console.log('Exiting fullscreen');
        // Exit fullscreen
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
            isFullscreen = false;
            
            // Remove the global keydown handler
            document.removeEventListener('keydown', handleGlobalKeydown);
        } catch (err) {
            console.error('Error attempting to exit fullscreen:', err);
        }
    }
}

// Global keydown handler that works in all modes
function handleGlobalKeydown(e) {
    if (!player) return;
    
    console.log('Global keydown:', e.code);
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
                // Try to hide the pause overlay
                document.querySelector(".ytp-pause-overlay-container")?.remove();
            } else {
                player.playVideo();
            }
            break;
            
        case 'ArrowLeft':
            e.preventDefault();
            player.seekTo(player.getCurrentTime() - 0.5, true);
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            player.seekTo(player.getCurrentTime() + 0.5, true);
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            currentPlaybackRate = Math.min(currentPlaybackRate + 0.25, 2);
            player.setPlaybackRate(currentPlaybackRate);
            showSpeedNotification(currentPlaybackRate);
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            currentPlaybackRate = Math.max(currentPlaybackRate - 0.25, 0.25);
            player.setPlaybackRate(currentPlaybackRate);
            showSpeedNotification(currentPlaybackRate);
            break;
            
        case 'KeyF':
            e.preventDefault();
            toggleCustomFullscreen();
            break;
            
        case 'Escape':
            if (isFullscreen) {
                e.preventDefault();
                toggleCustomFullscreen();
            }
            break;
    }
    
    // Update the info panel
    updateInfoPanel();
}