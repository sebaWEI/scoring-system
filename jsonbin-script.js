// 支持JSONBin.io数据同步的综测评分系统

// 用户数据
const users = {
    'admin': { password: '666666', role: 'admin', name: '管理员' },
    'judge1': { password: '123456', role: 'judge', name: '评委1' },
    'judge2': { password: '123456', role: 'judge', name: '评委2' },
    'judge3': { password: '123456', role: 'judge', name: '评委3' },
    'judge4': { password: '123456', role: 'judge', name: '评委4' },
    'judge5': { password: '123456', role: 'judge', name: '评委5' },
    'judge6': { password: '123456', role: 'judge', name: '评委6' },
    'judge7': { password: '123456', role: 'judge', name: '评委7' },
    'judge8': { password: '123456', role: 'judge', name: '评委8' },
    'judge9': { password: '123456', role: 'judge', name: '评委9' },
    'judge10': { password: '123456', role: 'judge', name: '评委10' },
    'judge11': { password: '123456', role: 'judge', name: '评委11' },
    'judge12': { password: '123456', role: 'judge', name: '评委12' },
    'judge13': { password: '123456', role: 'judge', name: '评委13' },
    'judge14': { password: '123456', role: 'judge', name: '评委14' },
    'judge15': { password: '123456', role: 'judge', name: '评委15' },
    'judge16': { password: '123456', role: 'judge', name: '评委16' }
};

// 学生数据（35个学生）
const students = [
    { id: '001' },
    { id: '002' },
    { id: '003' },
    { id: '004' },
    { id: '005' },
    { id: '006' },
    { id: '007' },
    { id: '008' },
    { id: '009' },
    { id: '010' },
    { id: '011' },
    { id: '012' },
    { id: '013' },
    { id: '014' },
    { id: '015' },
    { id: '016' },
    { id: '017' },
    { id: '018' },
    { id: '019' },
    { id: '020' },
    { id: '021' },
    { id: '022' },
    { id: '023' },
    { id: '024' },
    { id: '025' },
    { id: '026' },
    { id: '027' },
    { id: '028' },
    { id: '029' },
    { id: '030' },
    { id: '031' },
    { id: '032' },
    { id: '033' },
    { id: '034' },
    { id: '035' }
];

// 评分项目
const scoringItems = [
    { key: 'ideology', label: '思想政治', maxScore: 100 },
    { key: 'behavior', label: '行为规范', maxScore: 100 },
    { key: 'attitude', label: '学习态度', maxScore: 100 },
    { key: 'health', label: '身心健康', maxScore: 100 },
    { key: 'academic', label: '学术科研', maxScore: 100 },
    { key: 'social', label: '社会工作', maxScore: 100 },
    { key: 'practice', label: '实践活动', maxScore: 100 }
];

// 当前登录用户
let currentUser = null;


// JSONBin.io配置 - 请替换为您的实际配置
const JSONBIN_CONFIG = {
    binId: '68bc3f9943b1c97be939002c', // 替换为您的Bin ID
    apiKey: '$2a$10$M69mCff7TrvGixakZX7dTe7g6DNxzcB5auPCw3gYuUktMT9UMdbWm' // 替换为您的Private Key
};

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
    
    // 页面加载时同步一次
    syncData();
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
        
        // 登录后立即同步数据
        syncData();
    } else {
        showAlert('用户名或密码错误！', 'error');
    }
}

// 同步数据到JSONBin.io
async function syncData() {
    if (!currentUser) return;
    
    try {
        updateSyncStatus('syncing', '同步中...');
        
        // 先获取服务器数据
        const serverData = await fetchDataFromJsonBin();
        if (serverData) {
            // 合并服务器数据到本地
            mergeServerData(serverData);
        }
        
        // 获取合并后的本地数据
        const localScores = JSON.parse(localStorage.getItem('scores') || '{}');
        
        // 如果有本地数据，上传到服务器
        if (Object.keys(localScores).length > 0) {
            await uploadDataToJsonBin(localScores);
        }
        
        updateSyncStatus('success', '同步成功');
        
    } catch (error) {
        console.log('数据同步失败:', error);
        updateSyncStatus('error', '同步失败');
    }
}

// 上传数据到JSONBin.io
async function uploadDataToJsonBin(scores) {
    if (JSONBIN_CONFIG.binId === 'YOUR_BIN_ID_HERE') {
        console.log('请先配置JSONBin.io的Bin ID和API Key');
        return;
    }
    
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            },
            body: JSON.stringify(scores)
        });
        
        if (response.ok) {
            console.log('数据上传成功');
        } else {
            console.error('数据上传失败:', response.statusText);
        }
    } catch (error) {
        console.error('上传数据时出错:', error);
    }
}

// 从JSONBin.io获取数据
async function fetchDataFromJsonBin() {
    if (JSONBIN_CONFIG.binId === 'YOUR_BIN_ID_HERE') {
        console.log('请先配置JSONBin.io的Bin ID和API Key');
        return null;
    }
    
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.binId}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.apiKey
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.record || {};
        } else {
            console.error('获取数据失败:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('获取数据时出错:', error);
        return null;
    }
}

// 更新同步状态
function updateSyncStatus(status, text) {
    const indicator = document.getElementById('syncIndicator');
    if (indicator) {
        indicator.className = `sync-indicator ${status}`;
        indicator.textContent = text;
    }
}

// 检查本地是否有新数据
async function hasLocalNewData(localScores, serverScores) {
    if (!serverScores || Object.keys(serverScores).length === 0) {
        return Object.keys(localScores).length > 0;
    }
    
    // 检查是否有新的学生评分
    for (const studentId in localScores) {
        if (!serverScores[studentId]) {
            return true; // 本地有新的学生数据
        }
        
        // 检查是否有新的评委评分
        for (const judgeUsername in localScores[studentId]) {
            if (!serverScores[studentId][judgeUsername]) {
                return true; // 本地有新的评委评分
            }
            
            // 检查时间戳，如果本地数据更新则认为是新数据
            const localTimestamp = localScores[studentId][judgeUsername].timestamp;
            const serverTimestamp = serverScores[studentId][judgeUsername].timestamp;
            if (localTimestamp && serverTimestamp && localTimestamp > serverTimestamp) {
                return true; // 本地数据更新
            }
        }
    }
    
    return false;
}

// 合并服务器数据
function mergeServerData(serverScores) {
    const localScores = JSON.parse(localStorage.getItem('scores') || '{}');
    
    // 智能合并数据：保留本地数据，只添加服务器中本地没有的数据
    Object.keys(serverScores).forEach(studentId => {
        if (!localScores[studentId]) {
            localScores[studentId] = {};
        }
        Object.keys(serverScores[studentId]).forEach(judgeUsername => {
            // 只有当本地没有该评委的评分时，才使用服务器数据
            if (!localScores[studentId][judgeUsername]) {
                localScores[studentId][judgeUsername] = serverScores[studentId][judgeUsername];
            }
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
                <div class="student-id">学号：${student.id}</div>
                <div class="score-status ${isScored ? 'scored' : 'not-scored'}">
                    ${isScored ? '已评分' : '未评分'}
                </div>
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
    
    // 检查是否为更新操作
    const isUpdate = getStudentScore(studentId, currentUser.username) !== null;
    
    // 保存评分数据
    saveStudentScore(studentId, currentUser.username, score, totalScore);
    
    showAlert(isUpdate ? '评分更新成功！请点击"手动同步数据"按钮同步到云端。' : '评分提交成功！请点击"手动同步数据"按钮同步到云端。', 'success');
    
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

// 渲染结果表格（只有管理员可以看到）
function renderResultsTable() {
    const resultsTable = document.getElementById('resultsTable');
    const scores = JSON.parse(localStorage.getItem('scores') || '{}');
    
    // 统计评分进度
    let totalStudents = students.length;
    let scoredStudents = 0;
    let totalJudges = Object.keys(users).filter(username => users[username].role === 'judge').length;
    let completedJudges = 0;
    
    // 计算完成情况
    Object.keys(users).forEach(username => {
        if (users[username].role === 'judge') {
            let judgeCompleted = true;
            students.forEach(student => {
                if (!scores[student.id] || !scores[student.id][username]) {
                    judgeCompleted = false;
                }
            });
            if (judgeCompleted) completedJudges++;
        }
    });
    
    let tableHTML = `
        <div class="progress-summary">
            <h3>评分进度统计</h3>
            <p>总学生数：${totalStudents}人</p>
            <p>评委总数：${totalJudges}人</p>
            <p>已完成评分的评委：${completedJudges}人</p>
            <p>完成率：${((completedJudges / totalJudges) * 100).toFixed(1)}%</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>学号</th>
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
    const headers = ['学号'];
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
        const row = [student.id];
        
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

// 上传数据到服务器
async function uploadDataToServer() {
    const scores = JSON.parse(localStorage.getItem('scores') || '{}');
    
    if (Object.keys(scores).length === 0) {
        showAlert('没有数据需要上传！', 'warning');
        return;
    }
    
    try {
        updateSyncStatus('syncing', '上传中...');
        await uploadDataToJsonBin(scores);
        updateSyncStatus('success', '上传成功');
        showAlert('数据已成功上传到服务器！', 'success');
    } catch (error) {
        console.error('上传失败:', error);
        updateSyncStatus('error', '上传失败');
        showAlert('数据上传失败！', 'error');
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

// 清空当前用户的数据
function clearCurrentUserData() {
    if (confirm('确定要清空当前用户的所有评分数据吗？此操作不可恢复！')) {
        const scores = JSON.parse(localStorage.getItem('scores') || '{}');
        
        // 清空当前用户的所有评分
        Object.keys(scores).forEach(studentId => {
            if (scores[studentId][currentUser.username]) {
                delete scores[studentId][currentUser.username];
            }
        });
        
        localStorage.setItem('scores', JSON.stringify(scores));
        showAlert('当前用户数据已清空！', 'success');
        
        // 重新渲染页面
        if (currentUser.role === 'admin') {
            renderResultsTable();
        } else {
            renderStudentList();
        }
    }
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
