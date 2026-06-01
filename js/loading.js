const Loading = {
    progress: 0,
    loadingElements: [],
    isLoading: false,

    start(callback) {
        this.isLoading = true;
        this.progress = 0;
        
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-title">
                    <span class="title-t">T</span>
                    <span class="title-e">E</span>
                    <span class="title-t2">T</span>
                    <span class="title-r">R</span>
                    <span class="title-i">I</span>
                    <span class="title-s">S</span>
                </div>
                <div class="loading-shape">
                    <div class="shape-block"></div>
                </div>
                <div class="loading-progress-bar">
                    <div class="loading-progress-fill"></div>
                </div>
                <div class="loading-percent">0%</div>
                <div class="loading-status">正在加载游戏资源...</div>
            </div>
        `;
        document.body.appendChild(loadingScreen);

        this.animateTitle();
        this.animateShape();
        this.loadAssets(callback);
    },

    animateTitle() {
        const letters = document.querySelectorAll('.loading-title span');
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${index * 0.1}s`;
        });
    },

    animateShape() {
        const shapeBlock = document.querySelector('.shape-block');
        let angle = 0;
        const animate = () => {
            if (!this.isLoading) return;
            angle += 2;
            shapeBlock.style.transform = `rotate(${angle}deg)`;
            requestAnimationFrame(animate);
        };
        animate();
    },

    loadAssets(callback) {
        const assets = [
            { name: '音频初始化', load: () => new Promise(resolve => { setTimeout(resolve, 200); }) },
            { name: '游戏配置', load: () => new Promise(resolve => { setTimeout(resolve, 150); }) },
            { name: '渲染引擎', load: () => new Promise(resolve => { setTimeout(resolve, 250); }) },
            { name: '成就系统', load: () => new Promise(resolve => { setTimeout(resolve, 100); }) },
            { name: '排行榜数据', load: () => new Promise(resolve => { setTimeout(resolve, 150); }) },
            { name: '用户设置', load: () => new Promise(resolve => { setTimeout(resolve, 100); }) }
        ];

        let loaded = 0;

        const updateProgress = (status) => {
            loaded++;
            this.progress = Math.round((loaded / assets.length) * 100);
            
            const progressFill = document.querySelector('.loading-progress-fill');
            const percent = document.querySelector('.loading-percent');
            const statusText = document.querySelector('.loading-status');
            
            if (progressFill) progressFill.style.width = `${this.progress}%`;
            if (percent) percent.textContent = `${this.progress}%`;
            if (statusText) statusText.textContent = status;

            if (loaded === assets.length) {
                this.complete(callback);
            }
        };

        assets.forEach(asset => {
            asset.load().then(() => {
                updateProgress(`已加载: ${asset.name}`);
            });
        });
    },

    complete(callback) {
        setTimeout(() => {
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.remove();
                    this.isLoading = false;
                    if (callback) callback();
                }, 500);
            }
        }, 300);
    },

    show() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    },

    hide() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
};