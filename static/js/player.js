document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    const videoPlayer = document.getElementById('videoPlayer');
    const fullscreenVideo = document.getElementById('fullscreenVideo');
    const videoContainer = document.querySelector('.video-container');
    const fullscreenContainer = document.getElementById('fullscreenContainer');
    const selectVideoBtn = document.getElementById('selectVideo');
    const loadingContainer = document.getElementById('loadingContainer');
    const loadingProgressBar = document.getElementById('loadingProgressBar');
    const loadingText = document.getElementById('loadingText');
    const currentTimeDisplay = document.getElementById('currentTime');
    const playbackSpeedDisplay = document.getElementById('playbackSpeed');
    const playStateDisplay = document.getElementById('playState');
    let controlsVisible = false; // Start with controls hidden
    let isInitialized = false; // Track initialization state

    // Initialize video players
    function initializePlayer() {
        console.log('Initializing player...');
        try {
            videoPlayer.controls = controlsVisible;
            fullscreenVideo.controls = controlsVisible;
            videoPlayer.style.display = 'none'; // Hide video player initially
            fullscreenVideo.style.display = 'none'; // Hide fullscreen video initially
            videoContainer.style.display = 'none'; // Hide video container initially
            videoPlayer.style.width = '100%';
            fullscreenVideo.style.width = '100%';
            videoPlayer.style.height = 'auto';
            fullscreenVideo.style.height = 'auto';
            videoPlayer.style.backgroundColor = '#000';
            fullscreenVideo.style.backgroundColor = '#000';

            // Add click handlers for play/pause
            videoPlayer.addEventListener('click', () => {
                if (videoPlayer.paused) {
                    videoPlayer.play();
                } else {
                    videoPlayer.pause();
                }
            });

            fullscreenVideo.addEventListener('click', () => {
                if (fullscreenVideo.paused) {
                    fullscreenVideo.play();
                } else {
                    fullscreenVideo.pause();
                }
            });

            // Show select video button once initialization is complete
            selectVideoBtn.style.display = 'block';
            isInitialized = true;
            console.log('Player initialization complete');
        } catch (error) {
            console.error('Error during player initialization:', error);
        }
    }

    // Initialize the player
    initializePlayer();

    // Function to reset video player state
    function resetVideoPlayer() {
        console.log('Resetting video player...');
        videoPlayer.pause();
        fullscreenVideo.pause();
        videoPlayer.src = '';
        fullscreenVideo.src = '';
        videoPlayer.load();
        fullscreenVideo.load();
        videoContainer.classList.remove('show');
        fullscreenContainer.classList.remove('show');
        loadingContainer.classList.remove('show');
        videoPlayer.style.display = 'none'; // Hide video player
        fullscreenVideo.style.display = 'none'; // Hide fullscreen video
        videoContainer.style.display = 'none'; // Hide video container
        currentTimeDisplay.textContent = '00:00.000';
        playbackSpeedDisplay.textContent = '1.00x';
        playStateDisplay.textContent = 'PAUSED';
    }

    // Function to format time with sub-second precision
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
    }

    // Function to update info panel
    function updateInfoPanel() {
        const activeVideo = document.fullscreenElement ? fullscreenVideo : videoPlayer;
        const currentTimeElement = document.fullscreenElement ? 
            document.getElementById('fullscreenCurrentTime') : 
            document.getElementById('currentTime');
        const playbackSpeedElement = document.fullscreenElement ? 
            document.getElementById('fullscreenPlaybackSpeed') : 
            document.getElementById('playbackSpeed');
        const playStateElement = document.fullscreenElement ? 
            document.getElementById('fullscreenPlayState') : 
            document.getElementById('playState');

        currentTimeElement.textContent = formatTime(activeVideo.currentTime);
        playbackSpeedElement.textContent = `${activeVideo.playbackRate.toFixed(2)}x`;
        playStateElement.textContent = activeVideo.paused ? 'PAUSED' : 'PLAYING';
    }

    // Function to load and play video
    function loadAndPlayVideo(file) {
        if (!file) {
            console.log('No file provided');
            return;
        }

        console.log('Starting video load process...');
        console.log('File details:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        // Show loading state
        loadingContainer.classList.add('show');
        loadingText.textContent = 'Loading video...';
        loadingProgressBar.style.width = '0%';

        // Show video container
        videoContainer.style.display = 'block'; // Show video container
        videoContainer.classList.add('show');
        console.log('Video container shown');

        // Create object URL and set video source
        const videoURL = URL.createObjectURL(file);
        console.log('Created video URL:', videoURL);
        
        // Set video source
        console.log('Setting video source...');
        videoPlayer.src = videoURL;
        fullscreenVideo.src = videoURL;

        // Set up event listeners before loading
        videoPlayer.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            console.log('Duration:', videoPlayer.duration);
            console.log('Dimensions:', videoPlayer.videoWidth + 'x' + videoPlayer.videoHeight);
            loadingProgressBar.style.width = '50%';
            // Show video players once metadata is loaded
            videoPlayer.style.display = 'block';
            fullscreenVideo.style.display = 'block';
        };

        videoPlayer.onloadeddata = () => {
            console.log('Video data loaded');
            console.log('Ready state:', videoPlayer.readyState);
            loadingProgressBar.style.width = '100%';
            
            // Try to play the video
            console.log('Attempting to play video...');
            videoPlayer.play()
                .then(() => {
                    console.log('Video playback started successfully');
                    setTimeout(() => {
                        loadingContainer.classList.remove('show');
                    }, 500);
                })
                .catch(error => {
                    console.error('Error playing video:', error);
                    loadingText.textContent = 'Error playing video - Please try again';
                });
        };

        videoPlayer.onerror = (e) => {
            console.error('Video error occurred:', e);
            if (videoPlayer.error) {
                console.error('Error code:', videoPlayer.error.code);
                console.error('Error message:', videoPlayer.error.message);
            }
            loadingText.textContent = 'Error loading video - Please try a different file';
            videoContainer.classList.remove('show');
            videoContainer.style.display = 'none'; // Hide video container on error
            videoPlayer.style.display = 'none'; // Hide video player on error
            fullscreenVideo.style.display = 'none'; // Hide fullscreen video on error
            URL.revokeObjectURL(videoURL);
        };

        // Load the video
        console.log('Loading video...');
        videoPlayer.load();
        fullscreenVideo.load();
        console.log('Video load() called');

        // Set controls
        videoPlayer.controls = controlsVisible;
        fullscreenVideo.controls = controlsVisible;
        console.log('Controls set to:', controlsVisible);

        // Add event listeners for playback
        videoPlayer.addEventListener('play', () => {
            console.log('Video play event');
            if (document.fullscreenElement) {
                fullscreenVideo.play();
                videoPlayer.pause();
            }
            updateInfoPanel();
        });

        videoPlayer.addEventListener('pause', () => {
            console.log('Video pause event');
            if (document.fullscreenElement) {
                fullscreenVideo.pause();
            }
            updateInfoPanel();
        });

        videoPlayer.addEventListener('seeked', () => {
            console.log('Video seeked event');
            if (document.fullscreenElement) {
                fullscreenVideo.currentTime = videoPlayer.currentTime;
            }
            updateInfoPanel();
        });

        videoPlayer.addEventListener('ratechange', () => {
            console.log('Video rate change event');
            if (document.fullscreenElement) {
                fullscreenVideo.playbackRate = videoPlayer.playbackRate;
            }
            updateInfoPanel();
        });

        // Add event listeners to fullscreen video
        fullscreenVideo.addEventListener('play', updateInfoPanel);
        fullscreenVideo.addEventListener('pause', updateInfoPanel);
        fullscreenVideo.addEventListener('seeked', updateInfoPanel);
        fullscreenVideo.addEventListener('ratechange', updateInfoPanel);
    }

    // Handle video selection
    selectVideoBtn.addEventListener('click', () => {
        console.log('Select video button clicked, initialized:', isInitialized);
        if (!isInitialized) {
            console.log('Player not yet initialized, please wait...');
            return;
        }

        // Reset any existing video state
        resetVideoPlayer();

        // Create and configure file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';
        fileInput.style.display = 'none'; // Hide the input
        document.body.appendChild(fileInput); // Add to DOM
        
        // Add change event listener before clicking
        fileInput.addEventListener('change', (e) => {
            console.log('File selected:', e.target.files);
            if (e.target.files && e.target.files[0]) {
                loadAndPlayVideo(e.target.files[0]);
            }
            // Clean up the input element
            document.body.removeChild(fileInput);
        });

        // Trigger file selection
        fileInput.click();
    });

    // Update time display
    videoPlayer.addEventListener('timeupdate', updateInfoPanel);
    fullscreenVideo.addEventListener('timeupdate', updateInfoPanel);

    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            // Entering fullscreen
            fullscreenContainer.classList.add('show');
            fullscreenVideo.currentTime = videoPlayer.currentTime;
            fullscreenVideo.playbackRate = videoPlayer.playbackRate;
            if (!videoPlayer.paused) {
                fullscreenVideo.play();
                videoPlayer.pause();
            }
        } else {
            // Exiting fullscreen
            fullscreenContainer.classList.remove('show');
            videoPlayer.currentTime = fullscreenVideo.currentTime;
            videoPlayer.playbackRate = fullscreenVideo.playbackRate;
            if (!fullscreenVideo.paused) {
                videoPlayer.play();
                fullscreenVideo.pause();
            }
        }
        updateInfoPanel();
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        const activeVideo = document.fullscreenElement ? fullscreenVideo : videoPlayer;
        if (!activeVideo.src) return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (activeVideo.paused) {
                    activeVideo.play();
                } else {
                    activeVideo.pause();
                }
                break;
            
            case 'ArrowLeft':
                e.preventDefault();
                // Seek backward in smaller increments
                const seekBackward = () => {
                    activeVideo.currentTime = Math.max(0, activeVideo.currentTime - 0.2);
                    updateInfoPanel();
                };
                seekBackward();
                // If key is held down, continue seeking
                if (!e.repeat) {
                    const interval = setInterval(() => {
                        if (!e.getModifierState('Shift')) {
                            clearInterval(interval);
                            return;
                        }
                        seekBackward();
                    }, 50);
                    document.addEventListener('keyup', () => clearInterval(interval), { once: true });
                }
                break;
            
            case 'ArrowRight':
                e.preventDefault();
                // Seek forward in smaller increments
                const seekForward = () => {
                    activeVideo.currentTime = Math.min(activeVideo.duration, activeVideo.currentTime + 0.2);
                    updateInfoPanel();
                };
                seekForward();
                // If key is held down, continue seeking
                if (!e.repeat) {
                    const interval = setInterval(() => {
                        if (!e.getModifierState('Shift')) {
                            clearInterval(interval);
                            return;
                        }
                        seekForward();
                    }, 50);
                    document.addEventListener('keyup', () => clearInterval(interval), { once: true });
                }
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                if (activeVideo.playbackRate < 2) {
                    activeVideo.playbackRate = Math.min(2, activeVideo.playbackRate + 0.25);
                    updateInfoPanel();
                }
                break;
            
            case 'ArrowDown':
                e.preventDefault();
                if (activeVideo.playbackRate > 0.25) {
                    activeVideo.playbackRate = Math.max(0.25, activeVideo.playbackRate - 0.25);
                    updateInfoPanel();
                }
                break;

            case 'KeyF':
            case 'Escape':
                e.preventDefault();
                if (!document.fullscreenElement) {
                    fullscreenContainer.classList.add('show');
                    fullscreenContainer.requestFullscreen({
                        navigationUI: 'hide'
                    }).catch(err => {
                        console.error(`Error attempting to enable fullscreen: ${err.message}`);
                        fullscreenContainer.classList.remove('show');
                    });
                } else {
                    document.exitFullscreen();
                    fullscreenContainer.classList.remove('show');
                }
                break;

            case 'KeyC':
                e.preventDefault();
                controlsVisible = !controlsVisible;
                videoPlayer.controls = controlsVisible;
                fullscreenVideo.controls = controlsVisible;
                break;
        }
    });
}); 