const Guide = {
    steps: [
        {
            id: 'step1',
            title: '欢迎来到俄罗斯方块',
            content: '经典的俄罗斯方块游戏，控制方块下落并消除整行获得分数！',
            image: null
        },
        {
            id: 'step2',
            title: '移动控制',
            content: '使用方向键或点击屏幕按钮来控制方块的移动方向。',
            controls: [
                { key: '←', action: '左移' },
                { key: '→', action: '右移' },
                { key: '↓', action: '下移' }
            ]
        },
        {
            id: 'step3',
            title: '旋转与加速',
            content: '按上方向键或点击旋转按钮来旋转方块，按空格键快速下落。',
            controls: [
                { key: '↑', action: '旋转' },
                { key: '空格', action: '快速下落' }
            ]
        },
        {
            id: 'step4',
            title: '游戏目标',
            content: '将方块堆叠起来，当某一行完全填满时会自动消除并获得分数。连续消除多行可获得额外奖励！',
            tips: ['消除4行获得最高分！', '合理规划方块位置']
        }
    ],

    currentStep: 0,
    isVisible: false,

    init() {
        if (!Storage.getGuideShown()) {
            this.show();
        }
    },

    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.currentStep = 0;
        
        const modal = document.createElement('div');
        modal.className = 'guide-modal';
        modal.innerHTML = this.generateContent();
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 50);
    },

    generateContent() {
        const step = this.steps[this.currentStep];
        const totalSteps = this.steps.length;
        
        let controlsHtml = '';
        if (step.controls) {
            controlsHtml = `
                <div class="guide-controls">
                    ${step.controls.map(c => `
                        <div class="guide-control-item">
                            <span class="guide-key">${c.key}</span>
                            <span class="guide-action">${c.action}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        let tipsHtml = '';
        if (step.tips) {
            tipsHtml = `
                <div class="guide-tips">
                    ${step.tips.map(tip => `<div class="guide-tip">✦ ${tip}</div>`).join('')}
                </div>
            `;
        }
        
        return `
            <div class="guide-content">
                <div class="guide-header">
                    <div class="guide-title">操作指南</div>
                    <button class="guide-close" onclick="Guide.close()">✕</button>
                </div>
                
                <div class="guide-progress">
                    <div class="guide-progress-bar">
                        <div class="guide-progress-fill" style="width: ${((this.currentStep + 1) / totalSteps) * 100}%"></div>
                    </div>
                    <span class="guide-progress-text">${this.currentStep + 1} / ${totalSteps}</span>
                </div>
                
                <div class="guide-step">
                    <div class="guide-step-title">${step.title}</div>
                    <div class="guide-step-content">${step.content}</div>
                    ${controlsHtml}
                    ${tipsHtml}
                </div>
                
                <div class="guide-footer">
                    <label class="guide-checkbox">
                        <input type="checkbox" id="guide-dont-show">
                        <span>不再显示此引导</span>
                    </label>
                    <div class="guide-buttons">
                        <button 
                            class="btn btn-secondary" 
                            ${this.currentStep === 0 ? 'disabled' : ''}
                            onclick="Guide.prev()"
                        >
                            上一步
                        </button>
                        <button 
                            class="btn" 
                            onclick="Guide.next()"
                        >
                            ${this.currentStep === totalSteps - 1 ? '开始游戏' : '下一步'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateContent();
        } else {
            this.close();
        }
    },

    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateContent();
        }
    },

    updateContent() {
        const modal = document.querySelector('.guide-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.innerHTML = this.generateContent();
                modal.classList.add('show');
            }, 150);
        }
    },

    close() {
        const modal = document.querySelector('.guide-modal');
        if (modal) {
            const dontShow = document.getElementById('guide-dont-show');
            if (dontShow && dontShow.checked) {
                Storage.setGuideShown(true);
            }
            
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                this.isVisible = false;
            }, 300);
        }
    },

    toggle() {
        if (this.isVisible) {
            this.close();
        } else {
            this.show();
        }
    }
};