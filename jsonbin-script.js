// 支持JSONBin.io数据同步的综测评分系统

// 用户数据
const users = {
    'admin': { password: '666666', role: 'admin', name: '管理员' },
    'wangxinyu': { password: '307301', role: 'judge', name: '王鑫宇' },
    'shaoyongxiang': { password: '307302', role: 'judge', name: '邵泳翔' },
    'dingzihan': { password: '307303', role: 'judge', name: '丁子涵' },
    'liujunyi': { password: '307305', role: 'judge', name: '刘军易' },
    'wangweixue': { password: '307307', role: 'judge', name: '王溦雪' },
    'chensitong': { password: '307308', role: 'judge', name: '陈思彤' },
    'chenkemeng': { password: '307313', role: 'judge', name: '陈可萌' },
    'liuyanjie': { password: '307316', role: 'judge', name: '刘燕洁' },
    'zhangzhihan': { password: '307317', role: 'judge', name: '张智涵' },
    'xiepu': { password: '307320', role: 'judge', name: '谢溥' },
    'baihaoliang': { password: '307321', role: 'judge', name: '柏昊良' },
    'weiziheng': { password: '307322', role: 'judge', name: '魏子恒' },
    'liding': { password: '307326', role: 'judge', name: '李丁' },
    'hanjiaxin': { password: '307327', role: 'judge', name: '韩佳鑫' },
    'wangzihang': { password: '307328', role: 'judge', name: '王子航' },
    'leimurong': { password: '108114', role: 'judge', name: '雷沐蓉' }
};

// 学生数据（35个学生）
const students = [
    { id: '001', name: '学生001' },
    { id: '002', name: '学生002' },
    { id: '003', name: '学生003' },
    { id: '004', name: '学生004' },
    { id: '005', name: '学生005' },
    { id: '006', name: '学生006' },
    { id: '007', name: '学生007' },
    { id: '008', name: '学生008' },
    { id: '009', name: '学生009' },
    { id: '010', name: '学生010' },
    { id: '011', name: '学生011' },
    { id: '012', name: '学生012' },
    { id: '013', name: '学生013' },
    { id: '014', name: '学生014' },
    { id: '015', name: '学生015' },
    { id: '016', name: '学生016' },
    { id: '017', name: '学生017' },
    { id: '018', name: '学生018' },
    { id: '019', name: '学生019' },
    { id: '020', name: '学生020' },
    { id: '021', name: '学生021' },
    { id: '022', name: '学生022' },
    { id: '023', name: '学生023' },
    { id: '024', name: '学生024' },
    { id: '025', name: '学生025' },
    { id: '026', name: '学生026' },
    { id: '027', name: '学生027' },
    { id: '028', name: '学生028' },
    { id: '029', name: '学生029' },
    { id: '030', name: '学生030' },
    { id: '031', name: '学生031' },
    { id: '032', name: '学生032' },
    { id: '033', name: '学生033' },
    { id: '034', name: '学生034' },
    { id: '035', name: '学生035' }
];

// 评分项目
const scoringItems = [
    { key: 'ideology', label: '思想政治', maxScore: 3 },
    { key: 'behavior', label: '行为规范', maxScore: 5 },
    { key: 'attitude', label: '学习态度', maxScore: 3 },
    { key: 'health', label: '身心健康', maxScore: 3 },
    { key: 'social', label: '学生工作', maxScore: 3 },
];

// 当前登录用户
let currentUser = null;


// JSONBin.io配置 - 请替换为您的实际配置
const JSONBIN_CONFIG = {
    binId: '68bc403443b1c97be93900a1', // 替换为您的Bin ID
    masterKey: '$2a$10$M69mCff7TrvGixakZX7dTe7g6DNxzcB5auPCw3gYuUktMT9UMdbWm', // 替换为您的Master Key
    accessKey: '$2a$10$M69mCff7TrvGixakZX7dTe7g6DNxzcB5auPCw3gYuUktMT9UMdbWm' // 替换为您的Access Key
};

// 检查JSONBin.io配置
function checkJsonBinConfig() {
    if (JSONBIN_CONFIG.binId === 'YOUR_BIN_ID_HERE' || !JSONBIN_CONFIG.binId) {
        console.error('JSONBin.io配置错误: 请设置正确的Bin ID');
        return false;
    }
    if (JSONBIN_CONFIG.masterKey === 'YOUR_MASTER_KEY_HERE' || !JSONBIN_CONFIG.masterKey) {
        console.error('JSONBin.io配置错误: 请设置正确的Master Key');
        return false;
    }
    if (JSONBIN_CONFIG.accessKey === 'YOUR_ACCESS_KEY_HERE' || !JSONBIN_CONFIG.accessKey) {
        console.error('JSONBin.io配置错误: 请设置正确的Access Key');
        return false;
    }
    return true;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面初始化开始...');
    
    try {
        // 检查是否有保存的登录状态
        const savedUser = localStorage.getItem('currentUser');
        console.log('保存的用户状态:', savedUser);
        
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            console.log('当前用户:', currentUser);
            showUserInfo();
            if (currentUser.role === 'admin') {
                showAdminPage();
            } else {
                showScoringPage();
            }
        } else {
            console.log('没有保存的登录状态，显示登录页面');
            showLoginPage();
        }

        // 绑定登录表单事件
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('绑定登录表单事件');
            loginForm.addEventListener('submit', handleLogin);
        } else {
            console.error('找不到登录表单元素！');
        }
        
        // 页面加载时同步一次（只有在已登录的情况下）
        if (savedUser) {
            console.log('开始同步数据...');
            syncData();
        }
        
        console.log('页面初始化完成');
    } catch (error) {
        console.error('页面初始化出错:', error);
    }
});

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    console.log('开始处理登录...');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('用户名:', username);
    console.log('密码长度:', password.length);

    if (users[username] && users[username].password === password) {
        console.log('登录验证成功');
        
        currentUser = {
            username: username,
            role: users[username].role,
            name: users[username].name
        };
        
        // 保存登录状态
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('登录状态已保存');
        
        showUserInfo();
        
        if (currentUser.role === 'admin') {
            console.log('显示管理页面');
            showAdminPage();
        } else {
            console.log('显示评分页面');
            showScoringPage();
        }
        
        showAlert('登录成功！', 'success');
        
        // 登录后立即同步数据
        console.log('开始同步数据...');
        syncData();
    } else {
        console.log('登录验证失败');
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
            const uploadSuccess = await uploadDataToJsonBin(localScores);
            if (uploadSuccess) {
                updateSyncStatus('success', '同步成功');
            } else {
                updateSyncStatus('error', '上传失败');
            }
        } else {
            updateSyncStatus('success', '同步成功（无本地数据）');
        }
        
    } catch (error) {
        console.error('数据同步失败:', error);
        updateSyncStatus('error', `同步失败: ${error.message}`);
    }
}

// 上传数据到JSONBin.io
async function uploadDataToJsonBin(scores) {
    if (!checkJsonBinConfig()) {
        console.log('请先配置JSONBin.io的Bin ID和API Key');
        return false;
    }
    
    try {
        console.log('开始上传数据到JSONBin.io...', { binId: JSONBIN_CONFIG.binId, dataSize: Object.keys(scores).length });
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.masterKey,
                'X-Access-Key': JSONBIN_CONFIG.accessKey,
                'X-Bin-Name': 'scoring-system-data',
                'X-Bin-Private': 'true'
            },
            body: JSON.stringify(scores)
        });
        
        console.log('上传响应状态:', response.status, response.statusText);
        
        if (response.ok) {
            const result = await response.json();
            console.log('数据上传成功:', result);
            return true;
        } else {
            const errorText = await response.text();
            console.error('数据上传失败:', response.status, response.statusText, errorText);
            throw new Error(`上传失败: ${response.status} ${response.statusText} - ${errorText}`);
        }
    } catch (error) {
        console.error('上传数据时出错:', error);
        throw error;
    }
}

// 从JSONBin.io获取数据
async function fetchDataFromJsonBin() {
    if (!checkJsonBinConfig()) {
        console.log('请先配置JSONBin.io的Bin ID和API Key');
        return null;
    }
    
    try {
        console.log('从JSONBin.io获取数据...', { binId: JSONBIN_CONFIG.binId });
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.binId}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.masterKey,
                'X-Access-Key': JSONBIN_CONFIG.accessKey,
                'X-Bin-Private': 'true'
            }
        });
        
        console.log('获取数据响应状态:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('成功获取数据:', data);
            return data.record || {};
        } else {
            const errorText = await response.text();
            console.error('获取数据失败:', response.status, response.statusText, errorText);
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
    } else {
        // 如果元素不存在，只在控制台输出
        console.log(`同步状态: ${status} - ${text}`);
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
                <div class="student-info">
                    <div class="student-name">${student.name}</div>
                    <div class="student-id">学号：${student.id}</div>
                </div>
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
async function submitScore(event, studentId) {
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
    
    // 自动同步到云端
    try {
        updateSyncStatus('syncing', '正在同步到云端...');
        await syncData();
        showAlert(isUpdate ? '评分更新成功！已自动同步到云端。' : '评分提交成功！已自动同步到云端。', 'success');
    } catch (error) {
        console.error('自动同步失败:', error);
        showAlert(isUpdate ? '评分更新成功！但同步到云端失败，请手动点击"同步数据"按钮。' : '评分提交成功！但同步到云端失败，请手动点击"同步数据"按钮。', 'warning');
    }
    
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
        const uploadSuccess = await uploadDataToJsonBin(scores);
        
        if (uploadSuccess) {
            updateSyncStatus('success', '上传成功');
            showAlert('数据已成功上传到服务器！', 'success');
        } else {
            updateSyncStatus('error', '上传失败');
            showAlert('数据上传失败！请检查网络连接和API配置。', 'error');
        }
    } catch (error) {
        console.error('上传失败:', error);
        updateSyncStatus('error', '上传失败');
        showAlert(`数据上传失败！错误信息: ${error.message}`, 'error');
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

// 测试JSONBin.io连接
async function testJsonBinConnection() {
    try {
        updateSyncStatus('syncing', '测试连接中...');
        
        // 首先检查配置
        if (!checkJsonBinConfig()) {
            updateSyncStatus('error', '配置错误');
            showAlert('JSONBin.io配置错误！请检查Bin ID和API Key是否正确设置。', 'error');
            return;
        }
        
        console.log('当前配置:', {
            binId: JSONBIN_CONFIG.binId,
            masterKeyLength: JSONBIN_CONFIG.masterKey ? JSONBIN_CONFIG.masterKey.length : 0,
            accessKeyLength: JSONBIN_CONFIG.accessKey ? JSONBIN_CONFIG.accessKey.length : 0,
            masterKeyPrefix: JSONBIN_CONFIG.masterKey ? JSONBIN_CONFIG.masterKey.substring(0, 10) + '...' : 'none',
            accessKeyPrefix: JSONBIN_CONFIG.accessKey ? JSONBIN_CONFIG.accessKey.substring(0, 10) + '...' : 'none'
        });
        
        // 测试获取数据
        console.log('测试获取数据...');
        const testData = await fetchDataFromJsonBin();
        console.log('测试获取数据结果:', testData);
        
        // 测试上传数据（上传一个测试对象）
        console.log('测试上传数据...');
        const testScores = { 
            test: { 
                testUser: { 
                    score: { test: 100 }, 
                    totalScore: 100, 
                    timestamp: new Date().toISOString() 
                } 
            } 
        };
        const uploadResult = await uploadDataToJsonBin(testScores);
        
        if (uploadResult) {
            updateSyncStatus('success', '连接测试成功');
            showAlert('JSONBin.io连接测试成功！数据可以正常上传和获取。', 'success');
        } else {
            updateSyncStatus('error', '连接测试失败');
            showAlert('JSONBin.io连接测试失败！请检查网络连接和API配置。', 'error');
        }
    } catch (error) {
        console.error('连接测试失败:', error);
        updateSyncStatus('error', '连接测试失败');
        showAlert(`连接测试失败: ${error.message}。请检查控制台获取详细错误信息。`, 'error');
    }
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

