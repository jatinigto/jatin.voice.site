
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    function updateBar() {
        analyser.getByteFrequencyData(dataArray);
        let volume = Math.max(...dataArray);
        let bar = document.getElementById('bar');
        let status = document.getElementById('status');
        
        let percentage = (volume / 256) * 100;
        bar.style.width = percentage + '%';
        
        // Create sounds only once
        if (!window.clickSound) {
            window.clickSound = new Audio('https://www.myinstants.com/media/sounds/click.mp3');
            window.laughSound = new Audio('https://www.myinstants.com/media/sounds/evil-laugh_1.mp3');
        }
        
        // Track how long they maintain high volume
        window.sustainedScreamTime = window.sustainedScreamTime || 0;
        const requiredSustainTime = 9000; // 9 seconds

        if (percentage >= 92) {
            window.sustainedScreamTime += 16; // Approximately one frame at 60fps
        } else {
            window.sustainedScreamTime = 0;
        }

        if (percentage < 85) {
            bar.style.background = 'linear-gradient(90deg, #00f260, #0575e6)';
            status.innerHTML = '🤫 PATHETIC! SCREAM LIKE YOUR LIFE DEPENDS ON IT! 🔈';
        } else if (percentage < 92) {
            bar.style.background = 'linear-gradient(90deg, #0575e6, #00c6ff)';
            status.innerHTML = '😤 WEAK! MY GRANDMA SCREAMS LOUDER! 🔊';
        } else if (window.sustainedScreamTime < requiredSustainTime) {
            bar.style.background = 'linear-gradient(90deg, #00c6ff, #ff00cc)';
            status.innerHTML = `🌋 HOLD IT! KEEP SCREAMING! ${Math.ceil((requiredSustainTime - window.sustainedScreamTime) / 1000)}s! 🔥`;
        } else {
            bar.style.background = 'linear-gradient(90deg, #ff00cc, #ff8800)';
            const winScreen = `
                <div class="win-screen animate__animated animate__fadeIn">
                    <div class="emoji-container">
                        <span class="floating-emoji">🎉</span>
                        <span class="floating-emoji">🎊</span>
                        <span class="floating-emoji">🎈</span>
                    </div>
                    <h1><span class="rainbow-text">CONGRATULATIONS!</span></h1>
                    <p class="pulse-text">Are you ready for what comes next?</p>
                    <button id="ready" class="next-button animate__animated animate__pulse animate__infinite">I'M READY!</button>
                    <div class="emoji-container">
                        <span class="floating-emoji">🎯</span>
                        <span class="floating-emoji">🎪</span>
                        <span class="floating-emoji">🎨</span>
                    </div>
                    <p class="credit">by Jatin</p>
                </div>
            `;
            document.body.innerHTML = winScreen;
            
            document.getElementById("ready").addEventListener("click", function() {
                window.clickSound.play();
                const waitScreen = `
                    <div class="win-screen animate__animated animate__fadeIn">
                        <h1><span class="rainbow-text">WAIT!</span></h1>
                        <p class="pulse-text">Are you ABSOLUTELY sure?</p>
                        <button id="sure" class="next-button animate__animated animate__shakeX animate__infinite">YES, I'M SURE!</button>
                        <p class="credit">by Jatin</p>
                    </div>
                `;
                document.body.innerHTML = waitScreen;
                
                document.getElementById("sure").addEventListener("click", function() {
                    window.clickSound.play();
                    setTimeout(() => {
                        window.laughSound.play();
                        const finalScreen = `
                            <div class="final-message animate__animated animate__zoomIn">
                                <div class="sparkles"></div>
                                <h1 class="animate__animated animate__rubberBand">GU KHALE 💩</h1>
                                <div class="sparkles"></div>
                                <p class="credit">by Jatin</p>
                            </div>
                        `;
                        document.body.innerHTML = finalScreen;
                    }, 500);
                });
            });
            return;
        }
        requestAnimationFrame(updateBar);
    }
    
    updateBar();
}).catch(err => {
    alert("Please allow microphone access to play!");
    console.error(err);
});
