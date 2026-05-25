const Animations = {
    scorePopups: [],

    createScorePopup(score, x, y) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = '+' + score;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 800);
    },

    triggerLineClear(lineIndex, callback) {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const blockSize = parseInt(canvas.dataset.blockSize) || 30;
        let flashes = 0;
        const flashInterval = setInterval(() => {
            ctx.fillStyle = flashes % 2 === 0 ? '#fff' : '#e94560';
            ctx.fillRect(0, lineIndex * blockSize, canvas.width, blockSize);
            flashes++;
            if (flashes >= 6) {
                clearInterval(flashInterval);
                callback();
            }
        }, 50);
    },

    triggerGameOver(callback) {
        const overlay = document.getElementById('gameOver');
        if (overlay) {
            overlay.classList.add('show', 'game-over-animate');
            setTimeout(() => overlay.classList.remove('game-over-animate'), 500);
        }
        setTimeout(callback, 300);
    },

    animatePieceMove(piece, fromX, fromY, toX, toY, duration = 80) {
        return new Promise(resolve => {
            const canvas = document.getElementById('gameCanvas');
            const blockSize = parseInt(canvas.dataset.blockSize) || 30;
            const startTime = performance.now();
            const deltaX = (toX - fromX) * blockSize;
            const deltaY = (toY - fromY) * blockSize;

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                piece.visualOffsetX = deltaX * eased;
                piece.visualOffsetY = deltaY * eased;
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    piece.visualOffsetX = 0;
                    piece.visualOffsetY = 0;
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    },

    animateHardDrop(piece, startY, endY, callback) {
        const canvas = document.getElementById('gameCanvas');
        const blockSize = parseInt(canvas.dataset.blockSize) || 30;
        const startTime = performance.now();
        const totalDistance = (endY - startY) * blockSize;
        const duration = Math.min(200, totalDistance * 0.8);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 2);
            piece.visualOffsetY = totalDistance * eased;
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                piece.visualOffsetY = 0;
                callback();
            }
        };
        requestAnimationFrame(animate);
    },

    pulseElement(element, scale = 1.1, duration = 200) {
        if (!element) return;
        element.style.transition = `transform ${duration}ms ease`;
        element.style.transform = `scale(${scale})`;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration);
    },

    shakeElement(element, intensity = 5, duration = 300) {
        if (!element) return;
        const originalTransform = element.style.transform;
        let shakes = 0;
        const maxShakes = 6;
        const shakeInterval = setInterval(() => {
            const offsetX = (shakes % 2 === 0 ? 1 : -1) * intensity * (1 - shakes / maxShakes);
            element.style.transform = `translateX(${offsetX}px)`;
            shakes++;
            if (shakes >= maxShakes) {
                clearInterval(shakeInterval);
                element.style.transform = originalTransform;
            }
        }, 50);
    }
};
