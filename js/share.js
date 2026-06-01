const Share = {
    GAME_NAME: '俄罗斯方块',

    generateShareText(playerName, score, time) {
        const formattedTime = this.formatTime(time);
        return `我在【${this.GAME_NAME}】中获得了${score}分，通关时间为${formattedTime}，快来挑战吧！`;
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}分${secs}秒`;
        }
        return `${secs}秒`;
    },

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (e) {
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    },

    async generateScoreImage(playerName, score, time) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 400;
        canvas.height = 300;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 3;
        ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#e94560';
        ctx.textAlign = 'center';
        ctx.fillText(this.GAME_NAME, canvas.width / 2, 50);

        ctx.font = '16px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('得分截图', canvas.width / 2, 80);

        ctx.fillStyle = '#b0b0b0';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`玩家: ${playerName || '匿名玩家'}`, 40, 130);

        ctx.fillStyle = '#00f5ff';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`\u5206\u6570: ${score}`, 40, 180);

        ctx.fillStyle = '#b0b0b0';
        ctx.font = '14px Arial';
        ctx.fillText(`\u901A\u5173\u65F6\u95F4: ${this.formatTime(time)}`, 40, 220);

        ctx.fillStyle = '#e94560';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`\u65F6\u95F4: ${new Date().toLocaleString('zh-CN')}`, canvas.width - 20, canvas.height - 20);

        const ctx2 = ctx;
        const size = 20;
        const colors = ['#00f5ff', '#0000ff', '#ffa500', '#ffff00', '#00ff00', '#800080', '#ff0000'];
        for (let i = 0; i < 7; i++) {
            ctx2.fillStyle = colors[i];
            const x = canvas.width - 60 + (i % 3) * 25;
            const y = 120 + Math.floor(i / 3) * 25;
            ctx2.fillRect(x, y, size - 2, size - 2);
        }

        return canvas.toDataURL('image/png');
    },

    showSharePanel(playerName, score, time) {
        const panel = document.createElement('div');
        panel.className = 'share-panel';
        panel.innerHTML = `
            <div class="share-panel-content">
                <h3>分享成绩</h3>
                <div class="share-image-container">
                    <img id="shareImage" src="" alt="得分截图">
                </div>
                <div class="share-stats">
                    <div class="share-stat">
                        <span class="stat-label">玩家</span>
                        <span class="stat-value">${playerName || '匿名玩家'}</span>
                    </div>
                    <div class="share-stat">
                        <span class="stat-label">分数</span>
                        <span class="stat-value highlight">${score}</span>
                    </div>
                    <div class="share-stat">
                        <span class="stat-label">时间</span>
                        <span class="stat-value">${this.formatTime(time)}</span>
                    </div>
                </div>
                <textarea id="shareText" readonly>${this.generateShareText(playerName, score, time)}</textarea>
                <div class="share-buttons">
                    <button class="btn btn-secondary" onclick="Share.copyShareText()">复制文本</button>
                    <button class="btn btn-secondary" onclick="Share.downloadImage()">保存图片</button>
                    <button class="btn btn-secondary" onclick="Share.closeSharePanel()">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        setTimeout(() => {
            panel.classList.add('show');
            this.generateScoreImage(playerName, score, time).then(src => {
                document.getElementById('shareImage').src = src;
            });
        }, 50);
    },

    closeSharePanel() {
        const panel = document.querySelector('.share-panel');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => panel.remove(), 300);
        }
    },

    async copyShareText() {
        const textarea = document.getElementById('shareText');
        if (textarea) {
            const success = await this.copyToClipboard(textarea.value);
            if (success) {
                this.showCopySuccess();
            }
        }
    },

    showCopySuccess() {
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = '已复制到剪贴板！';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    downloadImage() {
        const img = document.getElementById('shareImage');
        if (img && img.src) {
            const link = document.createElement('a');
            link.download = `tetris-score-${Date.now()}.png`;
            link.href = img.src;
            link.click();
        }
    }
};