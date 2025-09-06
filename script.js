// 简化版综测评分系统
// 使用浏览器本地存储，支持多设备数据同步

// 用户数据
const users = {
    'admin': { password: '123456', role: 'admin', name: '班长' },
    'judge1': { password: '123456', role: 'judge', name: '评委1' },
    'judge2': { password: '123456', role: 'judge', name: '评委2' },
    'judge3': { password: '123456', role: 'judge', name: '评委3' }
};

// 学生数据
const students = [
    { id: '001', name: '张三', class: '计算机1班' },
    { id: '002', name: '李四', class: '计算机1班' },
    { id: '003', name: '王五', class: '计算机1班' },
    { id: '004', name: '赵六', class: '计算机1班' },
    { id: '005', name: '钱七', class: '计算机1班' },
    { id: '006', name: '孙八', class: '计算机1班' },
    { id: '007', name: '周九', class: '计算机1班' },
    { id: '008', name: '吴十', class: '计算机1班' }
];

// 评分项目
const scoringItems = [
    { key: 'academic', label: '学术表现', maxScore: 30 },
    { key: 'social', label: '社会实践', maxScore: 25 },
    { key: 'innovation', label: '创新创业', maxScore: 20 },
    { key: 'culture', label: '文体活动', maxScore: 15 },
    { key: 'morality', label: '品德表现', maxScore: 10 }
];

// 当前登录用户
let currentUser = null;

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有保存的登录状态
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserInfo();
        if (currentUser.role === 'admin') {
            showAdminPage();
        } else {
            showScoringPage();
        }
    } else {
        showLoginPage();
    }

    // 绑定登录表单事件
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // 定期同步数据（通过URL参数）
    setInterval(syncDataFromURL, 5000);
});

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        currentUser = {
            username: username,
            role: users[username].role,
            name: users[username].name
        };
        
        // 保存登录状态
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showUserInfo();
        
        if (currentUser.role === 'admin') {
            showAdminPage();
        } else {
            showScoringPage();
        }
        
        showAlert('登录成功！', 'success');
    } else {
        showAlert('用户名或密码错误！', 'error');
    }
}

// 从URL参数同步数据
function syncDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
        try {
            const serverData = JSON.parse(decodeURIComponent(dataParam));
            mergeServerData(serverData);
        } catch (error) {
            console.log('URL数据解析失败');
        }
    }
}

// 合并服务器数据
function mergeServerData(serverScores) {
    const localScores = JSON.parse(localStorage.getItem('scores') || '{}');
    
    // 合并数据，服务器数据优先
    Object.keys(serverScores).forEach(studentId => {
        if (!localScores[studentId]) {
            localScores[studentId] = {};
        }
        Object.keys(serverScores[studentId]).forEach(judgeUsername => {
            localScores[studentId][judgeUsername] = serverScores[studentId][judgeUsername];
        });
    });
    
    localStorage.setItem('scores', JSON.stringify(localScores));
    
    // 刷新页面显示
    if (currentUser && currentUser.role === 'admin') {
        renderResultsTable();
    } else if (currentUser) {
        renderStudentList();
    }
}

// 显示用户信息
function showUserInfo() {
    document.getElementById('currentUser').textContent = `欢迎，${currentUser.name}`;
    document.getElementById('userInfo').style.display = 'block';
}

// 显示登录页面
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('scoringPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

// 显示评分页面
function showScoringPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('scoringPage').style.display = 'block';
    document.getElementById('adminPage').style.display = 'none';
    
    renderStudentList();
}

// 显示管理页面
function showAdminPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('scoringPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    
    renderResultsTable();
}

// 渲染学生列表
function renderStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        
        // 检查是否已经评分
        const existingScore = getStudentScore(student.id, currentUser.username);
        const isScored = existingScore !== null;
        
        studentCard.innerHTML = `
            <div class="student-header">
                <div class="student-name">${student.name}</div>
                <div class="student-id">学号：${student.id}</div>
            </div>
            <form class="scoring-form" onsubmit="submitScore(event, '${student.id}')">
                ${scoringItems.map(item => `
                    <div class="score-item">
                        <label for="${student.id}_${item.key}">${item.label} (0-${item.maxScore}分)：</label>
                        <input type="number" 
                               id="${student.id}_${item.key}" 
                               name="${item.key}" 
                               min="0" 
                               max="${item.maxScore}" 
                               value="${isScored ? existingScore[item.key] || '' : ''}"
                               required>
                    </div>
                `).join('')}
                <button type="submit" class="btn btn-primary submit-btn">
                    ${isScored ? '更新评分' : '提交评分'}
                </button>
            </form>
        `;
        
        studentList.appendChild(studentCard);
    });
}

// 提交评分
function submitScore(event, studentId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const score = {};
    let totalScore = 0;
    
    scoringItems.forEach(item => {
        const value = parseInt(formData.get(item.key));
        score[item.key] = value;
        totalScore += value;
    });
    
    // 保存评分数据
    saveStudentScore(studentId, currentUser.username, score, totalScore);
    
    showAlert('评分提交成功！', 'success');
    
    // 重新渲染学生列表
    setTimeout(() => {
        renderStudentList();
    }, 1000);
}

// 保存学生评分
function saveStudentScore(studentId, judgeUsername, score, totalScore) {
    const scores = JSON.parse(localStorage.getItem('scores') || '{}');
    
    if (!scores[studentId]) {
        scores[studentId] = {};
    }
    
    scores[studentId][judgeUsername] = {
        score: score,
        totalScore: totalScore,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('scores', JSON.stringify(scores));
}

// 获取学生评分
function getStudentScore(studentId, judgeUsername) {
    const scores = JSON.parse(localStorage.getItem('scores') || '{}');
    return scores[studentId] && scores[studentId][judgeUsername] ? scores[studentId][judgeUsername].score : null;
}

// 渲染结果表格
function renderResultsTable() {
    const resultsTable = document.getElementById('resultsTable');
    const scores = JSON.parse(localStorage.getItem('scores') || '{}');
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>学号</th>
                    <th>姓名</th>
                    <th>班级</th>
                    ${Object.keys(users).filter(username => users[username].role === 'judge').map(username => 
                        `<th>${users[username].name}</th>`
                    ).join('')}
                    <th>平均分</th>
                    <th>总分</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    students.forEach(student => {
        const studentScores = scores[student.id] || {};
        const judgeScores = [];
        let totalScore = 0;
        let judgeCount = 0;
        
        Object.keys(users).forEach(username => {
            if (users[username].role === 'judge') {
                const score = studentScores[username];
                if (score) {
                    judgeScores.push(score.totalScore);
                    totalScore += score.totalScore;
                    judgeCount++;
                } else {
                    judgeScores.push('-');
                }
            }
        });
        
        const averageScore = judgeCount > 0 ? (totalScore / judgeCount).toFixed(2) : '-';
        
        tableHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                ${judgeScores.map(score => `<td>${score}</td>`).join('')}
                <td>${averageScore}</td>
                <td>${totalScore}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    resultsTable.innerHTML = tableHTML;
}

// 导出Excel
function exportToExcel() {
    const scores = JSON.parse(localStorage.getItem('scores') || '{}');
    
    // 创建工作簿数据
    const workbookData = [];
    
    // 添加表头
    const headers = ['学号', '姓名', '班级'];
    Object.keys(users).forEach(username => {
        if (users[username].role === 'judge') {
            headers.push(users[username].name);
        }
    });
    headers.push('平均分', '总分');
    workbookData.push(headers);
    
    // 添加数据行
    students.forEach(student => {
        const studentScores = scores[student.id] || {};
        const row = [student.id, student.name, student.class];
        
        let totalScore = 0;
        let judgeCount = 0;
        
        Object.keys(users).forEach(username => {
            if (users[username].role === 'judge') {
                const score = studentScores[username];
                if (score) {
                    row.push(score.totalScore);
                    totalScore += score.totalScore;
                    judgeCount++;
                } else {
                    row.push(0);
                }
            }
        });
        
        const averageScore = judgeCount > 0 ? (totalScore / judgeCount).toFixed(2) : 0;
        row.push(averageScore, totalScore);
        
        workbookData.push(row);
    });
    
    // 转换为CSV格式
    const csvContent = workbookData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // 添加BOM以支持中文
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `综测评分结果_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Excel文件导出成功！', 'success');
}

// 分享链接
function shareLink() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: '综测评分系统',
            text: '请使用此链接进行综测评分',
            url: url
        });
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(url).then(() => {
            showAlert('链接已复制到剪贴板！', 'success');
        });
    }
}

// 复制所有数据
function copyAllData() {
    const scores = JSON.parse(localStorage.getItem('scores') || '{}');
    const dataString = JSON.stringify(scores, null, 2);
    
    navigator.clipboard.writeText(dataString).then(() => {
        showAlert('所有数据已复制到剪贴板！', 'success');
    });
}

// 退出登录
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoginPage();
    showAlert('已退出登录', 'success');
}

// 显示提示信息
function showAlert(message, type) {
    // 移除现有的提示
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}
