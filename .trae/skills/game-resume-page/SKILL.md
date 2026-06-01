---
name: "game-resume-page"
description: "Creates a personal resume/profile page for a game. Invoke when user asks to generate a resume page, add personal page, or create developer profile for a game project."
---

# Game Resume Page

This skill creates a personal resume page component for games, adding navigation entry points and a complete resume/profile modal.

## Features

1. **Resume Modal Component**: Displays developer information including name, contact, skills, project experience
2. **Navigation Entry**: "Personal" button in top navigation bar
3. **Pause Menu Entry**: "View Resume" option in pause menu
4. **Responsive Design**: Works on both desktop and mobile

## Implementation

### Step 1: Create Resume Modal in HTML

Add the following modal HTML to `index.html`:

```html
<!-- Resume Modal -->
<div id="resumeModal" class="modal">
    <div class="modal-content resume-modal-content">
        <span class="close" onclick="UI.closeResumeModal()">&times;</span>
        <div class="resume-container">
            <div class="resume-header">
                <div class="resume-avatar" id="resumeAvatar">开</div>
                <h1 id="resumeName">开发者名称</h1>
                <p class="resume-title" id="resumeTitle">游戏开发者 / 全栈工程师</p>
                <div class="resume-social">
                    <a href="#" id="resumeGithub" target="_blank">GitHub</a>
                    <a href="#" id="resumeEmail">邮箱</a>
                </div>
            </div>
            <div class="resume-section">
                <h2>个人简介</h2>
                <p id="resumeBio">热爱游戏开发，专注于创造有趣的游戏体验。</p>
            </div>
            <div class="resume-section">
                <h2>技术栈</h2>
                <div class="resume-tags" id="resumeSkills">
                    <span class="tag">JavaScript</span>
                    <span class="tag">HTML5</span>
                    <span class="tag">Canvas</span>
                    <span class="tag">CSS3</span>
                </div>
            </div>
            <div class="resume-section">
                <h2>项目经验</h2>
                <div class="resume-projects" id="resumeProjects">
                    <div class="project-item">
                        <h3>俄罗斯方块</h3>
                        <p>经典益智游戏，支持多种模式和排行榜系统</p>
                    </div>
                </div>
            </div>
            <div class="resume-section">
                <h2>联系方式</h2>
                <p id="resumeContact">邮箱: developer@example.com</p>
            </div>
        </div>
    </div>
</div>
```

### Step 2: Add Navigation Button

In the navigation bar HTML, add:

```html
<button id="resumeBtn" class="nav-btn" onclick="UI.showResumeModal()">
    <span class="nav-icon">👤</span>
    <span class="nav-text">个人</span>
</button>
```

### Step 3: Add Pause Menu Entry

In the pause menu HTML, add:

```html
<button id="resumeFromPause" class="menu-btn" onclick="UI.showResumeModal()">
    查看简历
</button>
```

### Step 4: Add JavaScript API

Add to `index.html` UI object:

```javascript
showResumeModal() {
    const modal = document.getElementById('resumeModal');
    if (modal) {
        modal.style.display = 'flex';
        Animations.fadeIn(modal);
    }
},

closeResumeModal() {
    const modal = document.getElementById('resumeModal');
    if (modal) {
        Animations.fadeOut(modal, () => {
            modal.style.display = 'none';
        });
    }
},

updateResumeData(data) {
    if (data.name) document.getElementById('resumeName').textContent = data.name;
    if (data.title) document.getElementById('resumeTitle').textContent = data.title;
    if (data.bio) document.getElementById('resumeBio').textContent = data.bio;
    if (data.email) {
        document.getElementById('resumeEmail').href = 'mailto:' + data.email;
        document.getElementById('resumeContact').textContent = '邮箱: ' + data.email;
    }
    if (data.github) document.getElementById('resumeGithub').href = data.github;
    if (data.avatar) document.getElementById('resumeAvatar').textContent = data.avatar;
    if (data.skills) {
        const skillsContainer = document.getElementById('resumeSkills');
        skillsContainer.innerHTML = data.skills.map(s => `<span class="tag">${s}</span>`).join('');
    }
    if (data.projects) {
        const projectsContainer = document.getElementById('resumeProjects');
        projectsContainer.innerHTML = data.projects.map(p => `
            <div class="project-item">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
            </div>
        `).join('');
    }
}
```

### Step 5: Add CSS Styles

Add to `css/styles.css`:

```css
/* Resume Modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
}

.resume-modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 20px;
    padding: 30px;
    max-width: 600px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
}

.resume-container {
    color: #fff;
}

.resume-header {
    text-align: center;
    margin-bottom: 30px;
}

.resume-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto 20px;
}

.resume-header h1 {
    font-size: 28px;
    margin: 10px 0;
}

.resume-title {
    color: #aaa;
    font-size: 14px;
    margin-bottom: 15px;
}

.resume-social {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.resume-social a {
    color: #667eea;
    text-decoration: none;
    padding: 5px 15px;
    border: 1px solid #667eea;
    border-radius: 20px;
    transition: all 0.3s;
}

.resume-social a:hover {
    background: #667eea;
    color: #fff;
}

.resume-section {
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.resume-section h2 {
    font-size: 18px;
    color: #667eea;
    margin-bottom: 15px;
}

.resume-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tag {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 13px;
}

.project-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
}

.project-item h3 {
    font-size: 16px;
    margin-bottom: 5px;
}

.project-item p {
    font-size: 13px;
    color: #aaa;
    margin: 0;
}

/* Navigation Button */
.nav-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s;
}

.nav-btn:hover {
    background: rgba(102, 126, 234, 0.3);
    border-color: #667eea;
}

/* Mobile Responsive */
@media (max-width: 600px) {
    .resume-modal-content {
        padding: 20px;
        width: 95%;
    }

    .resume-avatar {
        width: 80px;
        height: 80px;
        font-size: 32px;
    }

    .resume-header h1 {
        font-size: 22px;
    }
}
```

## Configuration

To customize the resume data, call:

```javascript
UI.updateResumeData({
    name: '你的名字',
    title: '游戏开发者',
    bio: '个人简介...',
    email: 'email@example.com',
    github: 'https://github.com/username',
    avatar: '头',
    skills: ['JavaScript', 'HTML5', 'Canvas'],
    projects: [
        { name: '项目名', description: '项目描述' }
    ]
});
```

## Route Configuration

This skill uses a modal-based approach (no separate route). If you need SPA routing:

```javascript
// Optional: Hash-based routing
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash === '#/resume') {
        UI.showResumeModal();
    } else {
        UI.closeResumeModal();
    }
});
```

## Usage

1. User says "生成简历页面" or "添加个人页"
2. System creates resume modal component
3. Adds navigation button and pause menu entry
4. User can customize data via `UI.updateResumeData()`
