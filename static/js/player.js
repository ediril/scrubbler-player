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
    
    // Set up the keyboard capture overlay
    setupKeyboardCapture();
    
    // Add click handler to the player container
    const playerContainer = document.querySelector('.video-container');
    if (playerContainer) {
        playerContainer.addEventListener('click', (e) => {
            // Ignore clicks on the info panel and mobile controls
            if (e.target.closest('#infoPanel') || e.target.closest('#mobileControls')) return;
            
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        });
    }
}

// Unified keyboard handler for all modes
function handleKeydown(e) {
    if (!player) return;
    
    // Don't handle keyboard events if user is typing in an input field
    if (document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable) {
        return;
    }
    
    console.log('Keydown:', e.code);
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
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
            
        case 'Equal':  // + key
        case 'NumpadAdd':  // Numpad + key
            e.preventDefault();
            currentPlaybackRate = Math.min(currentPlaybackRate + 0.25, 2);
            player.setPlaybackRate(currentPlaybackRate);
            showSpeedNotification(currentPlaybackRate);
            break;
            
        case 'Minus':  // - key
        case 'NumpadSubtract':  // Numpad - key
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

// Set up the keyboard capture overlay
function setupKeyboardCapture() {
    const overlay = document.getElementById('keyboardCaptureOverlay');
    if (!overlay) return;
    
    // Focus the overlay to ensure it captures keyboard events
    overlay.focus({ preventScroll: true });
    
    // Add keyboard event listener to the overlay
    overlay.addEventListener('keydown', handleKeydown);
    
    // Maintain focus on the overlay periodically, but not when user is in an input
    setInterval(() => {
        if (document.activeElement !== overlay && 
            document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA' &&
            !document.activeElement.isContentEditable) {
            overlay.focus({ preventScroll: true });
        }
    }, 100);
}

// Helper function to show speed notification
function showSpeedNotification(speed) {
    const speedElement = document.getElementById('playbackSpeed');
    if (speedElement) {
        speedElement.textContent = speed.toFixed(2) + 'x';
        // Add a highlight effect
        speedElement.style.transition = 'color 0.3s ease';
        speedElement.style.color = '#ff4444';
        setTimeout(() => {
            speedElement.style.color = '#ffeeee';
        }, 300);
    }
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
        document.addEventListener('keydown', handleKeydown);
        
        // Update the display
        document.body.classList.add('custom-fullscreen-active');
    } else {
        // Exit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        // Remove the custom fullscreen container after exit
        document.removeEventListener('keydown', handleKeydown);
        const customFullscreen = document.getElementById('customFullscreen');
        if (customFullscreen) {
            customFullscreen.remove();
        }
        
        // Update the display
        document.body.classList.remove('custom-fullscreen-active');
    }
    
    isFullscreen = !isFullscreen;
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
    const playStateElement = document.getElementById('playState');
        
    let iconHTML = '';
    if (state === YT.PlayerState.PLAYING) {
        iconHTML = '<i class="fas fa-play play-icon"></i>';
    } else if (state === YT.PlayerState.PAUSED) {
        iconHTML = '<i class="fas fa-pause play-icon"></i>';
    }

    document.getElementById('playbackSpeed').innerHTML = currentPlaybackRate.toFixed(2) + 'x ' + iconHTML;
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
        if (overlay) overlay.focus({ preventScroll: true });
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
        
        // Remove overlay listener to avoid duplicates
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) {
            overlay.removeEventListener('keydown', handleKeydown);
        }
        
        // Add global keydown handler for fullscreen
        document.removeEventListener('keydown', handleKeydown); // Remove any existing
        document.addEventListener('keydown', handleKeydown);
    } else {
        console.log('Exited fullscreen via browser API');
        isFullscreen = false;
        
        // Remove global keydown handler
        document.removeEventListener('keydown', handleKeydown);
        
        // Re-add overlay listener for normal mode
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) {
            overlay.addEventListener('keydown', handleKeydown);
        }
    }
});

// Also handle webkit/moz fullscreen change events for broader browser support
document.addEventListener('webkitfullscreenchange', function() {
    const wasFullscreen = isFullscreen;
    isFullscreen = !!document.webkitFullscreenElement;
    
    if (isFullscreen && !wasFullscreen) {
        // Entering fullscreen
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) {
            overlay.removeEventListener('keydown', handleKeydown);
        }
        document.removeEventListener('keydown', handleKeydown);
        document.addEventListener('keydown', handleKeydown);
    } else if (!isFullscreen && wasFullscreen) {
        // Exiting fullscreen
        document.removeEventListener('keydown', handleKeydown);
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) {
            overlay.addEventListener('keydown', handleKeydown);
        }
    }
});

document.addEventListener('mozfullscreenchange', function() {
    const wasFullscreen = isFullscreen;
    isFullscreen = !!document.mozFullScreenElement;
    
    if (isFullscreen && !wasFullscreen) {
        // Entering fullscreen
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) {
            overlay.removeEventListener('keydown', handleKeydown);
        }
        document.removeEventListener('keydown', handleKeydown);
        document.addEventListener('keydown', handleKeydown);
    } else if (!isFullscreen && wasFullscreen) {
        // Exiting fullscreen
        document.removeEventListener('keydown', handleKeydown);
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) {
            overlay.addEventListener('keydown', handleKeydown);
        }
    }
});

document.addEventListener('MSFullscreenChange', function() {
    const wasFullscreen = isFullscreen;
    isFullscreen = !!document.msFullscreenElement;
    
    if (isFullscreen && !wasFullscreen) {
        // Entering fullscreen
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) {
            overlay.removeEventListener('keydown', handleKeydown);
        }
        document.removeEventListener('keydown', handleKeydown);
        document.addEventListener('keydown', handleKeydown);
    } else if (!isFullscreen && wasFullscreen) {
        // Exiting fullscreen
        document.removeEventListener('keydown', handleKeydown);
        const overlay = document.getElementById('keyboardCaptureOverlay');
        if (overlay) {
            overlay.addEventListener('keydown', handleKeydown);
        }
    }
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
            // Check if we're on iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            
            if (isIOS) {
                // For iOS, we'll use a custom fullscreen approach
                document.body.classList.add('ios-fullscreen');
                videoContainer.classList.add('ios-fullscreen');
                isFullscreen = true;
                
                // Lock screen orientation if possible
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(() => {
                        console.log('Orientation lock not supported');
                    });
                }
            } else {
                // Standard fullscreen for other devices
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
            }
            
            // The fullscreenchange event will handle the event listeners
        } catch (err) {
            console.error('Error attempting to enable fullscreen:', err);
        }
    } else {
        console.log('Exiting fullscreen');
        // Exit fullscreen
        try {
            // Check if we're on iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            
            if (isIOS) {
                // For iOS, remove our custom fullscreen classes
                document.body.classList.remove('ios-fullscreen');
                videoContainer.classList.remove('ios-fullscreen');
                isFullscreen = false;
                
                // Unlock screen orientation if possible
                if (screen.orientation && screen.orientation.unlock) {
                    screen.orientation.unlock();
                }
            } else {
                // Standard fullscreen exit for other devices
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
            }
            
            // The fullscreenchange event will handle the event listeners
        } catch (err) {
            console.error('Error attempting to exit fullscreen:', err);
        }
    }
}

// Add event listeners for suggestion buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for suggestion links
    document.querySelectorAll('.suggestion-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            
            const url = this.getAttribute('data-url');
            const videoId = extractVideoId(url);
            
            if (videoId && player) {
                // Update the URL input field
                document.getElementById('youtubeUrl').value = url;
                
                // Stop current video first if one is playing
                if (player.getPlayerState() === YT.PlayerState.PLAYING || 
                    player.getPlayerState() === YT.PlayerState.PAUSED) {
                    player.stopVideo();
                }
                
                // Load and play the new video immediately
                player.loadVideoById({
                    videoId: videoId,
                    startSeconds: 0
                });
                
                // Show the video container when a video is loaded
                const videoContainer = document.querySelector('.video-container');
                if (videoContainer) {
                    videoContainer.classList.add('video-loaded');
                }
                
                // Re-focus on the keyboard capture overlay after a short delay
                setTimeout(() => {
                    const overlay = document.getElementById('keyboardCaptureOverlay');
                    if (overlay) overlay.focus({ preventScroll: true });
                }, 300);
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // Mobile control buttons event listeners
    const playPauseBtn = document.getElementById('playPauseBtn');
    const rewindBtn = document.getElementById('rewindBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const speedUpBtn = document.getElementById('speedUpBtn');
    const speedDownBtn = document.getElementById('speedDownBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // Update play/pause button icon based on player state
    function updatePlayPauseIcon(state) {
        if (playPauseBtn) {
            const icon = playPauseBtn.querySelector('i');
            if (icon) {
                icon.className = state === YT.PlayerState.PLAYING ? 'fas fa-pause' : 'fas fa-play';
            }
        }
    }

    // Add event listener for player state changes
    if (player) {
        player.addEventListener('onStateChange', function(event) {
            updatePlayPauseIcon(event.data);
        });
    }

    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (!player) return;
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        });
    }

    // Rewind button
    if (rewindBtn) {
        rewindBtn.addEventListener('click', function() {
            if (!player) return;
            player.seekTo(player.getCurrentTime() - 0.5, true);
        });
    }

    // Forward button
    if (forwardBtn) {
        forwardBtn.addEventListener('click', function() {
            if (!player) return;
            player.seekTo(player.getCurrentTime() + 0.5, true);
        });
    }

    // Speed up button
    if (speedUpBtn) {
        speedUpBtn.addEventListener('click', function() {
            if (!player) return;
            currentPlaybackRate = Math.min(currentPlaybackRate + 0.25, 2);
            player.setPlaybackRate(currentPlaybackRate);
            showSpeedNotification(currentPlaybackRate);
        });
    }

    // Speed down button
    if (speedDownBtn) {
        speedDownBtn.addEventListener('click', function() {
            if (!player) return;
            currentPlaybackRate = Math.max(currentPlaybackRate - 0.25, 0.25);
            player.setPlaybackRate(currentPlaybackRate);
            showSpeedNotification(currentPlaybackRate);
        });
    }

    // Fullscreen button
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            toggleCustomFullscreen();
        });
    }
});