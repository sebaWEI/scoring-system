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
async function handleLogin(e) {
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
        
        // 登录后立即刷新数据
        console.log('开始刷新数据...');
        await syncData();
    } else {
        console.log('登录验证失败');
        showAlert('用户名或密码错误！', 'error');
    }
}

// 同步数据到JSONBin.io（现在只是刷新显示）
async function syncData() {
    if (!currentUser) return;
    
    try {
        updateSyncStatus('syncing', '刷新数据中...');
        
        // 刷新页面显示
        if (currentUser.role === 'admin') {
            await renderResultsTable();
            updateSyncStatus('success', '数据刷新完成');
        } else {
            await renderStudentList();
            updateSyncStatus('success', '数据刷新完成');
        }
        
    } catch (error) {
        console.error('数据刷新失败:', error);
        updateSyncStatus('error', `刷新失败: ${error.message}`);
    }
}

// 管理员专用：刷新云端数据
async function downloadCloudData() {
    if (!currentUser || currentUser.role !== 'admin') {
        showAlert('只有管理员可以执行此操作！', 'error');
        return;
    }
    
    try {
        updateSyncStatus('syncing', '刷新云端数据中...');
        
        // 刷新管理页面显示
        await renderResultsTable();
        updateSyncStatus('success', '云端数据刷新完成');
        showAlert('云端数据刷新成功！', 'success');
        
    } catch (error) {
        console.error('刷新云端数据失败:', error);
        updateSyncStatus('error', `刷新失败: ${error.message}`);
        showAlert('刷新云端数据失败！', 'error');
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
        console.log('从JSONBin.io获取数据...', { 
            binId: JSONBIN_CONFIG.binId,
            masterKeyLength: JSONBIN_CONFIG.masterKey?.length,
            accessKeyLength: JSONBIN_CONFIG.accessKey?.length
        });
        
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
            
            // 检查是否已被清空
            if (data.record && data.record._cleared) {
                console.log('数据已被清空，返回空对象');
                return {};
            }
            
            return data.record || {};
        } else {
            const errorText = await response.text();
            console.error('获取数据失败:', response.status, response.statusText, errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
    } catch (error) {
        console.error('获取数据时出错:', error);
        throw error;
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

// 合并服务器数据（已废弃，现在完全依赖云端数据）
function mergeServerData(serverScores) {
    console.log('mergeServerData已废弃，现在完全依赖云端数据');
    // 这个函数现在不再需要，因为所有数据都直接从云端获取
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
    
    // 恢复同步按钮为评委模式
    const syncButton = document.getElementById('syncButton');
    if (syncButton) {
        syncButton.textContent = '手动同步数据';
        syncButton.onclick = syncData;
    }
    
    renderStudentList();
}

// 显示管理页面
function showAdminPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('scoringPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    
    // 修改同步按钮文本为管理员模式
    const syncButton = document.getElementById('syncButton');
    if (syncButton) {
        syncButton.textContent = '下载云端数据';
        syncButton.onclick = downloadCloudData;
    }
    
    renderResultsTable();
}

// 渲染学生列表
async function renderStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '<div class="loading">正在加载数据...</div>';

    try {
        // 从云端获取数据
        const cloudData = await fetchDataFromJsonBin();
        const scores = cloudData || {};

        students.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = 'student-card';
            
            // 检查是否已经评分
            const studentScores = scores[student.id] || {};
            const existingScore = studentScores[currentUser.username];
            const isScored = existingScore && existingScore.score;
        
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
                               value="${isScored && existingScore.score ? existingScore.score[item.key] || '' : ''}"
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
    
    } catch (error) {
        console.error('渲染学生列表失败:', error);
        studentList.innerHTML = `
            <div class="error-message">
                <h3>数据加载失败</h3>
                <p>无法从云端获取数据，请检查网络连接后重试。</p>
                <p><strong>错误信息:</strong> ${error.message}</p>
                <div style="margin-top: 20px;">
                    <button onclick="renderStudentList()" class="btn btn-primary">重新加载</button>
                    <button onclick="testConnection()" class="btn btn-warning">测试连接</button>
                </div>
            </div>
        `;
    }
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
    const existingScore = await getStudentScore(studentId, currentUser.username);
    const isUpdate = existingScore !== null;
    
    try {
        updateSyncStatus('syncing', '正在保存到云端...');
        
        // 保存评分数据到云端
        await saveStudentScore(studentId, currentUser.username, score, totalScore);
        
        updateSyncStatus('success', '保存成功');
        showAlert(isUpdate ? '评分更新成功！' : '评分提交成功！', 'success');
        
        // 重新渲染学生列表
        await renderStudentList();
        
    } catch (error) {
        console.error('保存评分失败:', error);
        updateSyncStatus('error', '保存失败');
        showAlert('保存评分失败，请检查网络连接后重试！', 'error');
    }
}

// 保存学生评分（直接上传到云端）
async function saveStudentScore(studentId, judgeUsername, score, totalScore) {
    try {
        // 先获取云端数据
        const cloudData = await fetchDataFromJsonBin();
        const scores = cloudData || {};
        
        // 更新评分数据
        if (!scores[studentId]) {
            scores[studentId] = {};
        }
        
        scores[studentId][judgeUsername] = {
            score: score,
            totalScore: totalScore,
            timestamp: new Date().toISOString()
        };
        
        // 直接上传到云端
        const uploadSuccess = await uploadDataToJsonBin(scores);
        if (!uploadSuccess) {
            throw new Error('上传到云端失败');
        }
        
        console.log('评分已保存到云端');
        
    } catch (error) {
        console.error('保存评分失败:', error);
        throw error;
    }
}

// 获取学生评分（从云端）
async function getStudentScore(studentId, judgeUsername) {
    try {
        const cloudData = await fetchDataFromJsonBin();
        const scores = cloudData || {};
        return scores[studentId] && scores[studentId][judgeUsername] ? scores[studentId][judgeUsername].score : null;
    } catch (error) {
        console.error('获取评分失败:', error);
        return null;
    }
}

// 渲染结果表格（只有管理员可以看到）
async function renderResultsTable() {
    const resultsTable = document.getElementById('resultsTable');
    
    try {
        // 从云端获取数据
        const scores = await fetchDataFromJsonBin() || {};
        console.log('从云端获取的数据:', scores);
    
    // 统计评分进度
    let totalStudents = students.length;
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
        <div class="detailed-scores">
            <h3>详细评分数据</h3>
            <p><small>显示每个评委对每个学生的各项评分</small></p>
        </div>
    `;
    
    // 为每个学生创建详细的评分表格
    students.forEach(student => {
        const studentScores = scores[student.id] || {};
        
        tableHTML += `
            <div class="student-score-section">
                <h4>${student.name} (学号: ${student.id})</h4>
                <table class="score-detail-table">
                    <thead>
                        <tr>
                            <th>评委</th>
                            ${scoringItems.map(item => `<th>${item.label}</th>`).join('')}
                            <th>总分</th>
                            <th>评分时间</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // 显示每个评委的评分
        Object.keys(users).forEach(username => {
            if (users[username].role === 'judge') {
                const score = studentScores[username];
                if (score) {
                    tableHTML += `
                        <tr>
                            <td>${users[username].name}</td>
                            ${scoringItems.map(item => `<td>${score.score && score.score[item.key] ? score.score[item.key] : '-'}</td>`).join('')}
                            <td><strong>${score.totalScore}</strong></td>
                            <td>${new Date(score.timestamp).toLocaleString()}</td>
                        </tr>
                    `;
                } else {
                    tableHTML += `
                        <tr>
                            <td>${users[username].name}</td>
                            ${scoringItems.map(() => `<td>-</td>`).join('')}
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    `;
                }
            }
        });
        
        // 计算该学生的平均分和总分
        let totalScore = 0;
        let judgeCount = 0;
        const itemAverages = {};
        
        // 初始化各项平均分
        scoringItems.forEach(item => {
            itemAverages[item.key] = 0;
        });
        
        Object.keys(users).forEach(username => {
            if (users[username].role === 'judge') {
                const score = studentScores[username];
                if (score) {
                    totalScore += score.totalScore;
                    judgeCount++;
                    scoringItems.forEach(item => {
                        if (score.score && score.score[item.key]) {
                            itemAverages[item.key] += score.score[item.key];
                        }
                    });
                }
            }
        });
        
        // 计算平均分
        const averageScore = judgeCount > 0 ? (totalScore / judgeCount).toFixed(2) : 0;
        scoringItems.forEach(item => {
            itemAverages[item.key] = judgeCount > 0 ? (itemAverages[item.key] / judgeCount).toFixed(2) : 0;
        });
        
        // 添加平均分行
        tableHTML += `
                        <tr class="average-row">
                            <td><strong>平均分</strong></td>
                            ${scoringItems.map(item => `<td><strong>${itemAverages[item.key]}</strong></td>`).join('')}
                            <td><strong>${averageScore}</strong></td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    });
    
    resultsTable.innerHTML = tableHTML;
    
    } catch (error) {
        console.error('渲染结果表格失败:', error);
        resultsTable.innerHTML = `
            <div class="error-message">
                <h3>数据加载失败</h3>
                <p>无法从云端获取数据，请检查网络连接后重试。</p>
                <p><strong>错误信息:</strong> ${error.message}</p>
                <div style="margin-top: 20px;">
                    <button onclick="renderResultsTable()" class="btn btn-primary">重新加载</button>
                    <button onclick="testConnection()" class="btn btn-warning">测试连接</button>
                </div>
            </div>
        `;
    }
}

// 导出Excel
async function exportToExcel() {
    try {
        const scores = await fetchDataFromJsonBin() || {};
    
    // 创建工作簿数据
    const workbookData = [];
    
    // 添加总体统计信息
    workbookData.push(['综测评分详细数据导出']);
    workbookData.push(['导出时间', new Date().toLocaleString()]);
    workbookData.push(['总学生数', students.length]);
    workbookData.push(['评委总数', Object.keys(users).filter(username => users[username].role === 'judge').length]);
    workbookData.push([]); // 空行
    
    // 为每个学生创建详细评分数据
    students.forEach(student => {
        const studentScores = scores[student.id] || {};
        
        // 学生信息标题
        workbookData.push([`学生: ${student.name} (学号: ${student.id})`]);
        workbookData.push([]);
        
        // 表头
        const headers = ['评委'];
        scoringItems.forEach(item => {
            headers.push(item.label);
        });
        headers.push('总分', '评分时间');
        workbookData.push(headers);
        
        // 每个评委的评分数据
        Object.keys(users).forEach(username => {
            if (users[username].role === 'judge') {
                const score = studentScores[username];
                const row = [users[username].name];
                
                if (score) {
                    scoringItems.forEach(item => {
                        row.push(score.score && score.score[item.key] ? score.score[item.key] : 0);
                    });
                    row.push(score.totalScore);
                    row.push(new Date(score.timestamp).toLocaleString());
                } else {
                    scoringItems.forEach(() => {
                        row.push(0);
                    });
                    row.push(0);
                    row.push('未评分');
                }
                
                workbookData.push(row);
            }
        });
        
        // 计算该学生的平均分
        let totalScore = 0;
        let judgeCount = 0;
        const itemAverages = {};
        
        // 初始化各项平均分
        scoringItems.forEach(item => {
            itemAverages[item.key] = 0;
        });
        
        Object.keys(users).forEach(username => {
            if (users[username].role === 'judge') {
                const score = studentScores[username];
                if (score) {
                    totalScore += score.totalScore;
                    judgeCount++;
                    scoringItems.forEach(item => {
                        if (score.score && score.score[item.key]) {
                            itemAverages[item.key] += score.score[item.key];
                        }
                    });
                }
            }
        });
        
        // 添加平均分行
        const averageRow = ['平均分'];
        scoringItems.forEach(item => {
            const avg = judgeCount > 0 ? (itemAverages[item.key] / judgeCount).toFixed(2) : 0;
            averageRow.push(avg);
        });
        const averageScore = judgeCount > 0 ? (totalScore / judgeCount).toFixed(2) : 0;
        averageRow.push(averageScore);
        averageRow.push('-');
        workbookData.push(averageRow);
        
        workbookData.push([]); // 空行分隔
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
    link.setAttribute('download', `综测评分详细数据_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showAlert('详细评分数据已导出！', 'success');
    
    } catch (error) {
        console.error('导出Excel失败:', error);
        showAlert('导出失败，请检查网络连接后重试！', 'error');
    }
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
    const scores = JSON.parse(localStorage.getItem('scoringData') || '{}');
    
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
async function copyAllData() {
    try {
        const scores = await fetchDataFromJsonBin() || {};
        const dataString = JSON.stringify(scores, null, 2);
        
        navigator.clipboard.writeText(dataString).then(() => {
            showAlert('所有数据已复制到剪贴板！', 'success');
        });
    } catch (error) {
        console.error('复制数据失败:', error);
        showAlert('复制数据失败，请重试！', 'error');
    }
}

// 清空当前用户的数据
async function clearCurrentUserData() {
    if (confirm('确定要清空当前用户的所有评分数据吗？此操作不可恢复！')) {
        try {
            // 获取云端数据
            const cloudData = await fetchDataFromJsonBin();
            const scores = cloudData || {};
            
            // 清空当前用户的所有评分
            Object.keys(scores).forEach(studentId => {
                if (scores[studentId][currentUser.username]) {
                    delete scores[studentId][currentUser.username];
                }
            });
            
            // 上传到云端
            await uploadDataToJsonBin(scores);
            showAlert('当前用户数据已清空！', 'success');
            
            // 重新渲染页面
            if (currentUser.role === 'admin') {
                await renderResultsTable();
            } else {
                await renderStudentList();
            }
        } catch (error) {
            console.error('清空用户数据失败:', error);
            showAlert('清空用户数据失败，请重试！', 'error');
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

// 清除所有评分数据（仅管理员可用）
async function clearAllScores() {
    // 检查是否为管理员
    if (!currentUser || currentUser.role !== 'admin') {
        showAlert('只有管理员可以执行此操作！', 'error');
        return;
    }
    
    // 确认对话框
    const confirmed = confirm('⚠️ 警告：此操作将清除所有评委的评分数据，且无法恢复！\n\n确定要继续吗？');
    if (!confirmed) {
        return;
    }
    
    // 二次确认
    const doubleConfirmed = confirm('请再次确认：这将删除所有评分数据，包括本地和云端数据！\n\n点击"确定"将立即执行清除操作。');
    if (!doubleConfirmed) {
        return;
    }
    
    try {
        // 清除云端数据
        await clearCloudData();
        console.log('云端数据清除完成');
        
        // 刷新页面显示
        await renderResultsTable();
        
        showAlert('✅ 所有评分数据已成功清除！', 'success');
        
        console.log('所有评分数据已清除');
        
    } catch (error) {
        console.error('清除数据时出错:', error);
        showAlert('清除数据时出错，请重试！', 'error');
    }
}

// 测试JSONBin.io连接
async function testConnection() {
    try {
        console.log('开始测试JSONBin.io连接...');
        const data = await fetchDataFromJsonBin();
        console.log('连接测试成功，获取到的数据:', data);
        showAlert('JSONBin.io连接测试成功！', 'success');
        return true;
    } catch (error) {
        console.error('连接测试失败:', error);
        showAlert(`JSONBin.io连接测试失败: ${error.message}`, 'error');
        return false;
    }
}

// 测试函数：创建测试数据
function createTestData() {
    const testData = {
        "001": {
            "wangxinyu": {
                score: {
                    ideology: 100,
                    behavior: 100,
                    attitude: 100,
                    health: 100,
                    academic: 100,
                    social: 100,
                    practice: 100
                },
                totalScore: 700,
                timestamp: new Date().toISOString()
            },
            "shaoyongxiang": {
                score: {
                    ideology: 90,
                    behavior: 95,
                    attitude: 85,
                    health: 90,
                    academic: 95,
                    social: 85,
                    practice: 90
                },
                totalScore: 630,
                timestamp: new Date().toISOString()
            }
        },
        "002": {
            "wangxinyu": {
                score: {
                    ideology: 95,
                    behavior: 90,
                    attitude: 95,
                    health: 85,
                    academic: 90,
                    social: 95,
                    practice: 85
                },
                totalScore: 635,
                timestamp: new Date().toISOString()
            }
        }
    };
    
    localStorage.setItem('scoringData', JSON.stringify(testData));
    console.log('测试数据已创建:', testData);
    
    // 刷新管理员界面
    if (currentUser && currentUser.role === 'admin') {
        renderResultsTable();
    }
}

// 清除云端数据
async function clearCloudData() {
    if (!checkJsonBinConfig()) {
        console.log('JSONBin.io配置错误，跳过云端清除');
        return;
    }
    
    try {
        console.log('开始完全清除云端数据...');
        
        // JSONBin.io不允许完全清空，所以使用一个标记对象表示已清空
        const clearedData = {
            _cleared: true,
            _clearedBy: currentUser.username,
            _clearedAt: new Date().toISOString(),
            _message: "所有评分数据已被管理员清除"
        };
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_CONFIG.masterKey,
                'X-Access-Key': JSONBIN_CONFIG.accessKey,
                'X-Bin-Name': 'scoring-system-data',
                'X-Bin-Private': 'true'
            },
            body: JSON.stringify(clearedData)
        });
        
        if (response.ok) {
            console.log('云端数据已完全清除');
            
            // 验证清除是否成功
            const verifyResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.binId}/latest`, {
                headers: {
                    'X-Master-Key': JSONBIN_CONFIG.masterKey,
                    'X-Access-Key': JSONBIN_CONFIG.accessKey,
                    'X-Bin-Private': 'true'
                }
            });
            
            if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                console.log('验证清除结果:', verifyData);
                
                if (verifyData.record && verifyData.record._cleared) {
                    console.log('✅ 云端数据已完全清空');
                } else {
                    console.warn('⚠️ 云端数据可能未完全清空');
                }
            }
            
        } else {
            const errorText = await response.text();
            console.error('云端数据清除失败:', response.status, response.statusText, errorText);
            throw new Error(`云端清除失败: ${response.status} ${response.statusText}`);
        }
        
    } catch (error) {
        console.error('清除云端数据时出错:', error);
        throw error;
    }
}

