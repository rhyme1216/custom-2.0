// 澄清侧边栏 JavaScript

// 当前SKU的澄清数据
let clarifyData = [];

// 当前筛选的澄清状态TAB
let currentClarifyTab = 'all';

// 当前用户信息（模拟）
const currentUser = {
    name: '李子梦',
    erp: 'lizimeng16'
};

// 当前商品信息（从页面获取）
let currentProduct = {
    domSku: 'SKU003',
    country: 'HU',
    countryName: '匈牙利',
    salesErp: 'sales03'
};

// 澄清状态枚举
const clarifyStatusEnum = {
    0: { text: '无澄清', class: '' },
    1: { text: '待采销回复', class: 'pending' },
    2: { text: '澄清已回复', class: 'replied' },
    3: { text: '澄清完毕', class: 'done' }
};

// 国家列表
const countryList = [
    { code: 'CN', name: '中国' },
    { code: 'TH', name: '泰国' },
    { code: 'VN', name: '越南' },
    { code: 'ID', name: '印尼' },
    { code: 'MY', name: '马来西亚' },
    { code: 'HU', name: '匈牙利' },
    { code: 'BR', name: '巴西' },
    { code: 'SA', name: '沙特' },
    { code: 'AE', name: '阿联酋' }
];

// 模拟澄清数据
function initClarifyData() {
    clarifyData = [
        {
            id: 1,
            domSku: 'SKU003',
            country: 'HU',
            countryName: '匈牙利',
            status: 2, // 澄清已回复
            initiator: { name: '张三', erp: 'zhangsan01' },
            initiateTime: '2025-12-15 14:30:00',
            content: '请确认该商品的品牌授权情况：\n1. 是否有Apple官方授权？\n2. 授权证书有效期？',
            attachments: [
                { name: '品牌授权说明.pdf', size: '1.2MB', type: 'pdf' }
            ],
            reply: {
                replier: { name: '王五', erp: 'sales03' },
                replyTime: '2025-12-16 10:20:00',
                content: '已确认：\n1. 有Apple官方授权\n2. 有效期至2026年12月',
                attachments: [
                    { name: '授权证书.pdf', size: '2.5MB', type: 'pdf' }
                ]
            }
        },
        {
            id: 2,
            domSku: 'SKU003',
            country: 'BR',
            countryName: '巴西',
            status: 1, // 待采销回复
            initiator: { name: '李四', erp: 'lisi02' },
            initiateTime: '2025-12-17 09:15:00',
            content: '请确认该商品在巴西市场的INMETRO认证要求',
            attachments: [],
            reply: null
        },
        {
            id: 3,
            domSku: 'SKU003',
            country: 'TH',
            countryName: '泰国',
            status: 3, // 澄清完毕
            initiator: { name: '张三', erp: 'zhangsan01' },
            initiateTime: '2025-12-10 11:00:00',
            content: '请确认TISI认证办理进度',
            attachments: [],
            reply: {
                replier: { name: '王五', erp: 'sales03' },
                replyTime: '2025-12-11 15:30:00',
                content: '已提交申请，预计15个工作日完成',
                attachments: []
            }
        }
    ];
}

// 切换侧边栏折叠状态
function toggleClarifySidebar() {
    const sidebar = document.getElementById('clarifySidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        // 同步更新主内容区的边距
        if (mainContent) {
            mainContent.classList.toggle('sidebar-collapsed');
        }
    }
}

// 打开侧边栏（展开状态）
function openClarifySidebar(skuId, country) {
    // 更新当前商品信息
    if (skuId) {
        currentProduct.domSku = skuId;
    }
    if (country) {
        currentProduct.country = country;
        const countryInfo = countryList.find(c => c.code === country);
        currentProduct.countryName = countryInfo ? countryInfo.name : country;
    }
    
    const sidebar = document.getElementById('clarifySidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar) {
        sidebar.classList.remove('collapsed');
    }
    if (mainContent) {
        mainContent.classList.remove('sidebar-collapsed');
    }
    
    initClarifyData();
    renderClarifyMessages();
    updateClarifyTabCounts();
}

// 关闭侧边栏（折叠状态）
function closeClarifySidebar() {
    const sidebar = document.getElementById('clarifySidebar');
    const mainContent = document.querySelector('.main-content');
    if (sidebar) {
        sidebar.classList.add('collapsed');
    }
    if (mainContent) {
        mainContent.classList.add('sidebar-collapsed');
    }
}

// 用于追踪重新发起澄清时的原记录ID
let reInitiatingFromId = null;

// 更新发起澄清按钮状态
function updateInitiateButtonState() {
    const btn = document.querySelector('.clarify-sidebar-header-left .btn-primary');
    if (!btn) return;
    
    // 检查是否有正在澄清中的记录（当前用户发起的待回复状态）
    const hasPending = clarifyData.some(c => 
        c.initiator.erp === currentUser.erp && c.status === 1
    );
    
    if (hasPending) {
        btn.disabled = true;
        btn.classList.add('disabled');
        btn.setAttribute('title', '您已提交了一条正在澄清中的记录，请勿重复多次提交，静待采销响应');
    } else {
        btn.disabled = false;
        btn.classList.remove('disabled');
        btn.removeAttribute('title');
    }
}

// 打开发起澄清弹窗
function openCreateClarify(fromRepliedId) {
    // 记录原记录ID，提交时再关闭
    reInitiatingFromId = fromRepliedId || null;
    
    // 显示当前国家信息
    const countryDisplay = document.getElementById('clarifyCountryDisplay');
    if (countryDisplay) {
        countryDisplay.textContent = currentProduct.countryName || currentProduct.country;
    }
    
    document.getElementById('clarifyCreateModal').classList.add('show');
    document.getElementById('clarifyContent').value = '';
    const fileList = document.getElementById('fileList');
    if (fileList) fileList.innerHTML = '';
}

// 关闭发起澄清弹窗
function closeCreateClarify() {
    reInitiatingFromId = null; // 取消时清除记录
    document.getElementById('clarifyCreateModal').classList.remove('show');
    document.getElementById('clarifyContent').value = '';
    const fileList = document.getElementById('fileList');
    if (fileList) fileList.innerHTML = '';
}

// 切换澄清TAB
function switchClarifyTab(tab) {
    currentClarifyTab = tab;
    document.querySelectorAll('.clarify-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    renderClarifyMessages();
}

// 更新TAB徽标数量
function updateClarifyTabCounts() {
    const counts = {
        all: clarifyData.length,
        pending: clarifyData.filter(c => c.status === 1).length,
        replied: clarifyData.filter(c => c.status === 2).length,
        resolved: clarifyData.filter(c => c.status === 3).length
    };
    
    document.querySelectorAll('.clarify-tab').forEach(tab => {
        const badge = tab.querySelector('.badge');
        if (badge) {
            badge.textContent = counts[tab.dataset.tab] || 0;
        }
    });
    
    // 更新悬浮按钮徽标
    const floatBadge = document.querySelector('.btn-open-clarify .clarify-count');
    if (floatBadge) {
        const pendingCount = counts.pending;
        floatBadge.textContent = pendingCount;
        floatBadge.style.display = pendingCount > 0 ? 'block' : 'none';
    }
}

// 渲染澄清消息列表
function renderClarifyMessages() {
    const container = document.getElementById('clarifyList');
    if (!container) return;
    
    let filtered = clarifyData;
    
    // 根据TAB筛选
    if (currentClarifyTab === 'pending') {
        filtered = clarifyData.filter(c => c.status === 1);
    } else if (currentClarifyTab === 'replied') {
        filtered = clarifyData.filter(c => c.status === 2);
    } else if (currentClarifyTab === 'done' || currentClarifyTab === 'resolved') {
        filtered = clarifyData.filter(c => c.status === 3);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="clarify-empty">
                <div class="clarify-empty-icon">💬</div>
                <div>暂无澄清记录</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(item => renderClarifyCard(item)).join('');
}

// 渲染单个澄清卡片
function renderClarifyCard(item) {
    const statusInfo = clarifyStatusEnum[item.status];
    const hasReply = item.reply !== null;
    
    // 附件HTML - 紧凑格式
    const attachmentsHtml = item.attachments.length > 0 ? 
        `<div class="clarify-attachments">${item.attachments.map(att => 
            `<div class="attachment-item" onclick="previewAttachment('${att.name}')"><span class="attachment-icon">${att.type === 'pdf' ? '📄' : '🖼️'}</span><span class="attachment-name">${att.name}</span></div>`
        ).join('')}</div>` : '';
    
    // 回复HTML - 紧凑格式
    let replyHtml = '';
    if (hasReply) {
        const replyAttachmentsHtml = item.reply.attachments.length > 0 ? 
            `<div class="clarify-attachments">${item.reply.attachments.map(att => 
                `<div class="attachment-item" onclick="previewAttachment('${att.name}')"><span class="attachment-icon">${att.type === 'pdf' ? '📄' : '🖼️'}</span><span class="attachment-name">${att.name}</span></div>`
            ).join('')}</div>` : '';
        
        replyHtml = `<div class="clarify-reply"><div class="reply-header"><span>采销回复：${item.reply.replier.name}(${item.reply.replier.erp})</span><span>${item.reply.replyTime}</span></div><div class="reply-content">${item.reply.content}</div>${replyAttachmentsHtml}</div>`;
    }
    
    // 回复输入区域
    const replyInputHtml = `<div class="reply-input-area" id="replyInput_${item.id}"><div class="clarify-form-item"><textarea class="clarify-textarea" id="replyContent_${item.id}" placeholder="请一次性分条目回复所有待澄清事项，点击回复后不可追加回复内容"></textarea></div><div class="clarify-form-item"><div class="upload-area" onclick="triggerUpload('replyUpload_${item.id}')"><div class="upload-icon">📎</div><div class="upload-text">点击上传附件</div><div class="upload-hint">最多5个，单个不超过10MB</div></div><input type="file" id="replyUpload_${item.id}" style="display:none" multiple accept=".pdf,.jpg,.jpeg,.png" onchange="handleFileUpload(this, 'replyFiles_${item.id}')"><div class="uploaded-files" id="replyFiles_${item.id}"></div></div><div class="clarify-form-actions"><button class="btn btn-secondary" onclick="hideReplyInput(${item.id})">取消</button><button class="btn btn-primary" onclick="submitReply(${item.id})">确认回复</button></div></div>`;
    
    // 操作按钮
    let actionsHtml = '';
    if (item.status === 1) {
        actionsHtml = `<div class="clarify-card-actions"><button class="btn btn-secondary" onclick="deleteClarify(${item.id})">删除</button><button class="btn btn-primary" onclick="showReplyInput(${item.id})">回复</button></div>`;
    } else if (item.status === 2) {
        actionsHtml = `<div class="clarify-card-actions"><button class="btn btn-secondary" onclick="reInitiateClarify(${item.id})">发起澄清</button><button class="btn btn-primary" onclick="resolveClarify(${item.id})">解决</button></div>`;
    }
    
    return `<div class="clarify-card" data-id="${item.id}"><div class="clarify-card-header"><span class="clarify-country">🌍 ${item.countryName}</span><span class="clarify-status ${statusInfo.class}">${statusInfo.text}</span></div><div class="clarify-card-body"><div class="clarify-meta"><span>发起人：${item.initiator.name}(${item.initiator.erp})</span><span>${item.initiateTime}</span></div><div class="clarify-text">${item.content}</div>${attachmentsHtml}${replyHtml}${replyInputHtml}</div>${actionsHtml}</div>`;
}

// 显示发起澄清表单
function showClarifyForm() {
    // 检查是否有正在澄清中的记录
    const hasPending = clarifyData.some(c => 
        c.initiator.erp === currentUser.erp && (c.status === 1 || c.status === 2)
    );
    
    if (hasPending) {
        alert('您已提交了一条正在澄清中的记录，请勿重复多次提交，静待采销响应');
        return;
    }
    
    document.getElementById('clarifyMessages').style.display = 'none';
    document.getElementById('clarifyForm').classList.add('show');
    
    // 设置默认国家
    document.getElementById('clarifyCountry').value = currentProduct.country;
}

// 隐藏发起澄清表单
function hideClarifyForm() {
    document.getElementById('clarifyMessages').style.display = 'block';
    document.getElementById('clarifyForm').classList.remove('show');
    // 清空表单
    document.getElementById('clarifyCountry').value = currentProduct.country;
    document.getElementById('clarifyContent').value = '';
    document.getElementById('uploadedFiles').innerHTML = '';
}

// 提交澄清
function submitClarify() {
    const content = document.getElementById('clarifyContent').value.trim();
    
    if (!content) {
        alert('请输入澄清内容');
        return;
    }
    
    const countryInfo = countryList.find(c => c.code === currentProduct.country);
    
    // 如果是重新发起澄清，先关闭原记录
    if (reInitiatingFromId) {
        const originalItem = clarifyData.find(c => c.id === reInitiatingFromId);
        if (originalItem) {
            originalItem.status = 3; // 设置为澄清完毕
        }
    }
    
    // 创建新澄清记录
    const newClarify = {
        id: Date.now(),
        domSku: currentProduct.domSku,
        country: currentProduct.country,
        countryName: countryInfo ? countryInfo.name : currentProduct.country,
        status: 1,
        initiator: { name: currentUser.name, erp: currentUser.erp },
        initiateTime: formatDateTime(new Date()),
        content: content,
        attachments: getUploadedFilesFromList(),
        reply: null
    };
    
    clarifyData.unshift(newClarify);
    
    // 重置标记
    reInitiatingFromId = null;
    
    // 模拟京ME机器人推送
    console.log(`[京ME机器人] 叮～您有新的关务评估商品需要进一步澄清，请及时登入WIMP系统补充信息`);
    console.log(`推送给：${currentProduct.salesErp}`);
    
    alert('澄清发起成功！京ME机器人已自动推送通知给采销。');
    
    closeCreateClarify();
    renderClarifyMessages();
    updateClarifyTabCounts();
    updateInitiateButtonState();
}

// 获取已上传的文件列表
function getUploadedFilesFromList() {
    const container = document.getElementById('fileList');
    const files = [];
    if (container) {
        container.querySelectorAll('.file-item').forEach(item => {
            const nameEl = item.querySelector('.file-item-info span:first-child');
            const sizeEl = item.querySelector('.file-item-size');
            if (nameEl) {
                files.push({
                    name: nameEl.textContent,
                    size: sizeEl ? sizeEl.textContent : '',
                    type: nameEl.textContent.endsWith('.pdf') ? 'pdf' : 'image'
                });
            }
        });
    }
    return files;
}

// 处理文件选择
function handleFileSelect(event) {
    const files = event.target.files;
    const container = document.getElementById('fileList');
    
    if (!container) return;
    
    // 验证文件数量和大小
    const existingCount = container.querySelectorAll('.file-item').length;
    if (existingCount + files.length > 5) {
        alert('最多只能上传5个附件');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`文件 ${file.name} 超过10MB限制`);
            return;
        }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-item-info">
                <span>${file.name}</span>
                <span class="file-item-size">${formatFileSize(file.size)}</span>
            </div>
            <button class="file-item-remove" onclick="this.parentElement.remove()">&times;</button>
        `;
        container.appendChild(fileItem);
    });
    
    event.target.value = '';
}

// 显示回复输入框
function showReplyInput(id) {
    document.getElementById(`replyInput_${id}`).classList.add('show');
}

// 隐藏回复输入框
function hideReplyInput(id) {
    document.getElementById(`replyInput_${id}`).classList.remove('show');
}

// 提交回复
function submitReply(id) {
    const content = document.getElementById(`replyContent_${id}`).value.trim();
    
    if (!content) {
        alert('请输入回复内容');
        return;
    }
    
    const item = clarifyData.find(c => c.id === id);
    if (item) {
        item.status = 2;
        item.reply = {
            replier: { name: '王五', erp: currentProduct.salesErp },
            replyTime: formatDateTime(new Date()),
            content: content,
            attachments: getUploadedFiles(`replyFiles_${id}`)
        };
        
        // 模拟京ME机器人推送
        console.log(`[京ME机器人] 叮～采销回复了您发起的关务评估澄清信息，请及时登入WIMP系统跟进确认`);
        console.log(`推送给：${item.initiator.erp}`);
        
        alert('回复成功！京ME机器人已自动推送通知给澄清发起人。');
        
        renderClarifyMessages();
        updateClarifyTabCounts();
    }
}

// 删除澄清
function deleteClarify(id) {
    if (!confirm('确定要删除这条澄清记录吗？')) return;
    
    const index = clarifyData.findIndex(c => c.id === id);
    if (index > -1) {
        clarifyData.splice(index, 1);
        renderClarifyMessages();
        updateClarifyTabCounts();
    }
}

// 解决澄清
function resolveClarify(id) {
    const item = clarifyData.find(c => c.id === id);
    if (item) {
        item.status = 3;
        renderClarifyMessages();
        updateClarifyTabCounts();
        alert('澄清已标记为完毕');
    }
}

// 重新发起澄清（从已回复状态）
function reInitiateClarify(id) {
    // 更新当前商品的国家信息
    const item = clarifyData.find(c => c.id === id);
    if (item) {
        currentProduct.country = item.country;
        currentProduct.countryName = item.countryName;
    }
    
    // 打开发起澄清弹窗，传入原记录ID
    openCreateClarify(id);
    
    // 重新渲染列表
    renderClarifyMessages();
    updateClarifyTabCounts();
}

// 检查是否可以发起澄清
function checkCanInitiate() {
    const hasPending = clarifyData.some(c => 
        c.initiator.erp === currentUser.erp && (c.status === 1 || c.status === 2)
    );
    
    const btn = document.getElementById('btnInitiateClarify');
    if (btn) {
        btn.disabled = hasPending;
        if (hasPending) {
            btn.classList.add('tooltip');
            btn.setAttribute('data-tooltip', '您已提交了一条正在澄清中的记录，请勿重复多次提交，静待采销响应');
        } else {
            btn.classList.remove('tooltip');
            btn.removeAttribute('data-tooltip');
        }
    }
}

// 触发文件上传
function triggerUpload(inputId) {
    document.getElementById(inputId).click();
}

// 处理文件上传
function handleFileUpload(input, containerId) {
    const container = document.getElementById(containerId);
    const files = Array.from(input.files);
    
    // 检查文件数量
    const existingCount = container.querySelectorAll('.uploaded-file').length;
    if (existingCount + files.length > 5) {
        alert('最多只能上传5个文件');
        return;
    }
    
    files.forEach(file => {
        // 检查文件大小
        if (file.size > 10 * 1024 * 1024) {
            alert(`文件 ${file.name} 超过10MB限制`);
            return;
        }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file';
        fileItem.innerHTML = `
            <div class="uploaded-file-info">
                <span>${file.type.includes('pdf') ? '📄' : '🖼️'}</span>
                <span>${file.name}</span>
                <span style="color:#999">(${formatFileSize(file.size)})</span>
            </div>
            <span class="uploaded-file-remove" onclick="removeUploadedFile(this)">✕</span>
        `;
        fileItem.dataset.fileName = file.name;
        fileItem.dataset.fileSize = formatFileSize(file.size);
        fileItem.dataset.fileType = file.type.includes('pdf') ? 'pdf' : 'image';
        container.appendChild(fileItem);
    });
    
    input.value = '';
}

// 移除已上传文件
function removeUploadedFile(element) {
    element.parentElement.remove();
}

// 获取已上传文件列表
function getUploadedFiles(containerId) {
    const container = document.getElementById(containerId);
    const files = [];
    container.querySelectorAll('.uploaded-file').forEach(item => {
        files.push({
            name: item.dataset.fileName,
            size: item.dataset.fileSize,
            type: item.dataset.fileType
        });
    });
    return files;
}

// 预览附件
function previewAttachment(fileName) {
    alert(`预览附件：${fileName}\n（此处为模拟，实际需要打开文件预览器）`);
}

// 格式化日期时间
function formatDateTime(date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
}

// 初始化侧边栏
function initClarifySidebar(productInfo) {
    if (productInfo) {
        currentProduct = productInfo;
    }
    initClarifyData();
    renderClarifyMessages();
    updateClarifyTabCounts();
    updateInitiateButtonState();
    
    // 绑定TAB点击事件
    const tabContainer = document.getElementById('clarifyTabs');
    if (tabContainer) {
        tabContainer.addEventListener('click', function(e) {
            const tab = e.target.closest('.clarify-tab');
            if (tab) {
                const tabName = tab.dataset.tab;
                switchClarifyTab(tabName);
            }
        });
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果页面有侧边栏，初始化数据
    if (document.getElementById('clarifySidebar')) {
        initClarifySidebar();
    }
});
