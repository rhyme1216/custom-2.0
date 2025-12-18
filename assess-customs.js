// 关务评估页面 JavaScript

// 模拟进出口管制认证库数据
const certLibrary = [
    { id: 1001, country: 'CN', type: 1, name: '进口许可证', judge: 1 },
    { id: 1002, country: 'TH', type: 2, name: 'TISI认证', judge: 3 },
    { id: 1003, country: 'VN', type: 1, name: '进口管制许可', judge: 1 },
    { id: 1004, country: 'ID', type: 2, name: 'SNI认证', judge: 3 },
    { id: 1005, country: 'MY', type: 2, name: 'SIRIM认证', judge: 3 },
    { id: 1006, country: 'HU', type: 3, name: 'CE认证', judge: 3 },
    { id: 1007, country: 'BR', type: 1, name: 'INMETRO认证', judge: 1 },
    { id: 1008, country: 'SA', type: 2, name: 'SASO认证', judge: 3 },
    { id: 1009, country: 'AE', type: 3, name: 'ESMA认证', judge: 3 },
    { id: 1010, country: 'TH', type: 3, name: 'NBTC认证', judge: 2 },
    { id: 1011, country: 'ID', type: 3, name: 'SDPPI认证', judge: 3 },
    { id: 1012, country: 'CN', type: 1, name: '出口许可证', judge: 1 },
    { id: 1013, country: 'CN', type: 1, name: '两用物项许可证', judge: 0 },
];

const countryMap = {
    'CN': '中国', 'TH': '泰国', 'VN': '越南', 'ID': '印尼',
    'MY': '马来', 'HU': '匈牙利', 'BR': '巴西', 'SA': '沙特', 'AE': '阿联酋'
};

const judgeTypeMap = {
    0: '不可进出口',
    1: '关务判断',
    2: '采销判断',
    3: '证书库判断'
};

// 当前商品信息 (改名避免与clarify-sidebar.js冲突)
let currentAssessProduct = null;
let currentCountry = 'CN';
let isModifyMode = false;
let isBatchMode = false;
let batchProducts = [];

// 已有的认证评估结论（用于不一致检测）
let existingCertConclusion = {};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    parseUrlParams();
    loadProductInfo();
    loadCertsList();
});

// 等待澄清侧边栏加载完成后初始化
window.addEventListener('load', function() {
    if (typeof initClarifySidebar === 'function') {
        initClarifySidebar({
            domSku: document.getElementById('infoSku')?.textContent || 'SKU001',
            country: currentCountry,
            countryName: countryMap[currentCountry] || currentCountry,
            salesErp: 'sales01'
        });
    }
});

// 解析URL参数
function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const ids = params.get('ids');
    const mode = params.get('mode');
    
    isModifyMode = mode === 'modify';
    
    if (ids) {
        // 批量模式
        isBatchMode = true;
        batchProducts = ids.split(',').map(id => parseInt(id));
        document.getElementById('batchListPanel').style.display = 'block';
        document.getElementById('pageTitle').textContent = isModifyMode ? '批量关务修改' : '批量关务评估';
    } else if (id) {
        // 单个模式
        currentAssessProduct = { id: parseInt(id) };
        document.getElementById('pageTitle').textContent = isModifyMode ? '关务修改' : '关务评估';
    }
}

// 加载商品信息
function loadProductInfo() {
    // 模拟数据
    if (isBatchMode) {
        // 批量模式，显示商品列表
        const tbody = document.getElementById('batchProductList');
        tbody.innerHTML = batchProducts.map(id => `
            <tr>
                <td>SKU00${id}</td>
                <td>INTL-SKU-00${id}</td>
                <td>商品名称${id}</td>
                <td>8471300000</td>
                <td>中国</td>
            </tr>
        `).join('');
        currentCountry = 'CN'; // 批量模式取第一个商品的国家
    } else {
        // 单个模式
        document.getElementById('infoSku').textContent = 'SKU001';
        document.getElementById('infoIntlSku').textContent = 'INTL-SKU-001';
        document.getElementById('infoName').textContent = '笔记本电脑';
        document.getElementById('infoCountry').textContent = '中国';
        currentCountry = 'CN';
        
        // 模拟已有认证结论（用于检测不一致）
        existingCertConclusion = {
            'CE认证': { selected: true, judge: 3 }
        };
    }
}

// 加载证书列表
function loadCertsList() {
    // 根据国家和许可类型(管制类型: 1-管制, 3-管制&认证)过滤证书
    const certs = certLibrary.filter(c => 
        c.country === currentCountry && (c.type === 1 || c.type === 3)
    );
    
    const container = document.getElementById('controlCertsList');
    container.innerHTML = certs.map(cert => renderCertItem(cert)).join('');
}

// 渲染证书选项
function renderCertItem(cert) {
    const judgeClass = getJudgeClass(cert.judge);
    const judgeText = judgeTypeMap[cert.judge];
    
    // 检查是否与认证结论不一致（但默认隐藏，勾选后才显示）
    const existingConclusion = existingCertConclusion[cert.name];
    const hasInconsistent = existingConclusion && existingConclusion.selected;
    
    // 判断方为关务判断时显示办理状态
    const showHandleStatus = cert.judge === 1;
    
    return `
        <div class="cert-checkbox-item" id="cert-item-${cert.id}">
            <div class="cert-header">
                <input type="checkbox" id="cert-${cert.id}" name="controlCerts" value="${cert.id}" 
                    onchange="toggleCertItem(${cert.id}, ${showHandleStatus}, ${hasInconsistent})">
                <div class="cert-info">
                    <span class="cert-name">${cert.name}</span>
                    <span class="cert-judge-tag ${judgeClass}">${judgeText}</span>
                    <span class="inconsistent-warning" id="inconsistent-${cert.id}" style="display:none;">与认证结论不一致</span>
                </div>
            </div>
            ${showHandleStatus ? renderHandleStatusArea(cert.id) : ''}
            ${cert.judge === 2 ? '<div class="cert-extra show" style="margin-top:8px;"><span class="cert-judge-tag sales">采销判断：配置后需要采销在商品维护</span></div>' : ''}
            ${cert.judge === 3 ? '<div class="cert-extra show" style="margin-top:8px;"><span class="cert-judge-tag library">证书库判断：配置后将在商品证书库上传维护</span></div>' : ''}
            ${cert.judge === 0 ? '<div class="cert-extra show" style="margin-top:8px;"><span class="cert-judge-tag" style="background:#fff1f0;color:#ff4d4f;">不可进出口：配置后直接限制对应商品进出口</span></div>' : ''}
        </div>
    `;
}

// 渲染办理状态区域（关务判断专用）
function renderHandleStatusArea(certId) {
    return `
        <div class="cert-extra" id="cert-extra-${certId}">
            <div class="handle-status-area">
                <div class="cert-extra-row">
                    <div class="cert-extra-item">
                        <label>办理状态</label>
                        <select id="handleStatus-${certId}" class="select-field" onchange="toggleHandleInfo(${certId})">
                            <option value="0" selected>无法办理</option>
                            <option value="1">可办理</option>
                        </select>
                    </div>
                    <div class="cert-extra-item">
                        <label>办理备注</label>
                        <input type="text" id="handleRemark-${certId}" class="input-field" placeholder="非必填">
                    </div>
                </div>
                <div class="handle-info-row" id="handleInfoRow-${certId}" style="display:none;">
                    <div class="cert-extra-item">
                        <label>预计办理天数</label>
                        <input type="number" id="handleDays-${certId}" class="input-field" placeholder="非必填" min="1">
                    </div>
                    <div class="cert-extra-item">
                        <label>预计办理成本</label>
                        <input type="text" id="handleCost-${certId}" class="input-field" placeholder="非必填">
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 获取判断方样式类
function getJudgeClass(judge) {
    switch(judge) {
        case 0: return '';
        case 1: return 'customs';
        case 2: return 'sales';
        case 3: return 'library';
        default: return '';
    }
}

// 切换管制证书显示
function toggleControlCerts(show) {
    const area = document.getElementById('controlCertsArea');
    area.style.display = show ? 'block' : 'none';
}

// 切换证书选中状态
function toggleCertItem(certId, showHandleStatus, hasInconsistent) {
    const checkbox = document.getElementById(`cert-${certId}`);
    const item = document.getElementById(`cert-item-${certId}`);
    const extra = document.getElementById(`cert-extra-${certId}`);
    const inconsistentEl = document.getElementById(`inconsistent-${certId}`);
    
    if (checkbox.checked) {
        item.classList.add('checked');
        if (extra && showHandleStatus) {
            extra.classList.add('show');
        }
        // 勾选后显示不一致提示
        if (inconsistentEl && hasInconsistent) {
            inconsistentEl.style.display = 'inline';
        }
    } else {
        item.classList.remove('checked');
        if (extra) {
            extra.classList.remove('show');
        }
        // 取消勾选后隐藏不一致提示
        if (inconsistentEl) {
            inconsistentEl.style.display = 'none';
        }
    }
}

// 切换办理信息显示
function toggleHandleInfo(certId) {
    const status = document.getElementById(`handleStatus-${certId}`).value;
    const infoRow = document.getElementById(`handleInfoRow-${certId}`);
    infoRow.style.display = status === '1' ? 'flex' : 'none';
}

// 切换菜单
function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    submenu.classList.toggle('active');
    element.classList.toggle('collapsed');
}

// 返回
function goBack() {
    window.location.href = 'assessment.html';
}

// 提交评估
function submitAssess() {
    const form = document.getElementById('customsAssessForm');
    
    // 验证海关编码
    const hsCode = document.getElementById('hsCode').value.trim();
    if (!hsCode) {
        alert('请输入海关编码');
        return;
    }
    
    // 验证是否管制
    const isControlled = document.querySelector('input[name="isControlled"]:checked');
    if (!isControlled) {
        alert('请选择是否管制');
        return;
    }
    
    // 如果选择管制，验证证书选择
    if (isControlled.value === '1') {
        const selectedCerts = document.querySelectorAll('input[name="controlCerts"]:checked');
        if (selectedCerts.length === 0) {
            alert('请至少选择一个管制证书');
            return;
        }
    }
    
    // 收集数据
    const formData = {
        hsCode,
        isControlled: isControlled.value === '1',
        controlCerts: [],
        controlRemark: document.getElementById('controlRemark').value,
        assessRemark: document.getElementById('assessRemark').value
    };
    
    // 收集证书信息
    document.querySelectorAll('input[name="controlCerts"]:checked').forEach(cb => {
        const certId = cb.value;
        const certData = {
            id: certId,
            handleStatus: document.getElementById(`handleStatus-${certId}`)?.value,
            handleRemark: document.getElementById(`handleRemark-${certId}`)?.value,
            handleDays: document.getElementById(`handleDays-${certId}`)?.value,
            handleCost: document.getElementById(`handleCost-${certId}`)?.value
        };
        formData.controlCerts.push(certData);
    });
    
    console.log('提交数据：', formData);
    
    alert(isModifyMode ? '修改成功！' : '评估提交成功！商品关务状态已更新为"待确认"');
    goBack();
}
