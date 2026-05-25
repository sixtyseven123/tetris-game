const Audio = {
    ctx: null,
    enabled: true,
    musicEnabled: false,
    musicGain: null,
    musicOsc: null,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.musicGain = this.ctx.createGain();
            this.musicGain.connect(this.ctx.destination);
            this.musicGain.gain.value = 0.15;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    setEnabled(enabled) {
        this.enabled = enabled;
    },

    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (!enabled && this.musicOsc) {
            this.musicOsc.stop();
            this.musicOsc = null;
        }
    },

    playMove() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.value = 200;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialDecayTo && gain.gain.exponentialDecayTo(0.01, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.05);
    },

    playRotate() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.value = 400;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.08);
    },

    playDrop() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.value = 150;
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    },

    playClear(lines) {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const baseFreq = 300 + lines * 100;
        const duration = 0.15 + lines * 0.05;
        for (let i = 0; i < lines + 1; i++) {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.frequency.value = baseFreq + i * 150;
                osc.type = 'square';
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
                osc.start(this.ctx.currentTime);
                osc.stop(this.ctx.currentTime + 0.12);
            }, i * 50);
        }
    },

    playGameOver() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const notes = [400, 350, 300, 200];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sawtooth';
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
                osc.start(this.ctx.currentTime);
                osc.stop(this.ctx.currentTime + 0.2);
            }, i * 150);
        });
    },

    playStart() {
        if (!this.enabled || !this.ctx) return;
        this.resume();
        const notes = [262, 330, 392, 523];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
                osc.start(this.ctx.currentTime);
                osc.stop(this.ctx.currentTime + 0.15);
            }, i * 80);
        });
    },

    startMusic() {
        if (!this.musicEnabled || !this.ctx || this.musicOsc) return;
        this.resume();
        const playNote = (freq, time) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.musicGain);
            osc.frequency.value = freq;
            osc.type = 'triangle';
            gain.gain.setValueAtTime(0.3, time);
            gain.gain.linearRampToValueAtTime(0.01, time + 0.3);
            osc.start(time);
            osc.stop(time + 0.3);
        };
        const melody = [262, 294, 330, 349, 392, 349, 330, 294];
        let time = this.ctx.currentTime;
        const scheduleMelody = () => {
            if (!this.musicEnabled) return;
            melody.forEach((freq, i) => {
                playNote(freq, time + i * 0.25);
            });
            time += melody.length * 0.25;
            setTimeout(scheduleMelody, melody.length * 250);
        };
        scheduleMelody();
    },

    stopMusic() {
        this.musicEnabled = false;
    }
};
