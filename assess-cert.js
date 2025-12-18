// 认证评估页面 JavaScript

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

// 当前商品信息
let currentProduct = null;
let currentCountry = 'HU'; // 默认匈牙利（非受限国家）
let isModifyMode = false;
let isBatchMode = false;
let batchProducts = [];

// 已有的关务评估结论（用于不一致检测）
let existingCustomsConclusion = {};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    parseUrlParams();
    loadProductInfo();
    loadCertsList();
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
        document.getElementById('pageTitle').textContent = isModifyMode ? '批量认证修改' : '批量认证评估';
    } else if (id) {
        // 单个模式
        currentProduct = { id: parseInt(id) };
        document.getElementById('pageTitle').textContent = isModifyMode ? '认证修改' : '认证评估';
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
                <td>8504400000</td>
                <td>匈牙利</td>
            </tr>
        `).join('');
        currentCountry = 'HU';
    } else {
        // 单个模式
        document.getElementById('infoSku').textContent = 'SKU003';
        document.getElementById('infoIntlSku').textContent = 'INTL-SKU-003';
        document.getElementById('infoName').textContent = '电源适配器';
        document.getElementById('infoCountry').textContent = '匈牙利';
        currentCountry = 'HU';
        
        // 模拟已有关务评估结论（用于检测不一致）
        existingCustomsConclusion = {
            'CE认证': { selected: true, judge: 3 }
        };
    }
}

// 加载证书列表
function loadCertsList() {
    // 根据国家和许可类型(认证类型: 2-认证, 3-管制&认证)过滤证书
    // 所有认证证书的判断方均为证书库判断(3)
    const certs = certLibrary.filter(c => 
        c.country === currentCountry && (c.type === 2 || c.type === 3)
    );
    
    const container = document.getElementById('certCertsList');
    container.innerHTML = certs.map(cert => renderCertItem(cert)).join('');
}

// 渲染证书选项
function renderCertItem(cert) {
    // 认证评估的证书判断方均为证书库判断
    const judgeText = '证书库判断';
    
    // 检查是否与关务结论不一致（默认隐藏，勾选后才显示）
    const existingConclusion = existingCustomsConclusion[cert.name];
    const hasInconsistent = existingConclusion && existingConclusion.selected;
    
    return `
        <div class="cert-checkbox-item" id="cert-item-${cert.id}">
            <div class="cert-header">
                <input type="checkbox" id="cert-${cert.id}" name="certCerts" value="${cert.id}" 
                    onchange="toggleCertItem(${cert.id}, ${hasInconsistent})">
                <div class="cert-info">
                    <span class="cert-name">${cert.name}</span>
                    <span class="cert-judge-tag library">${judgeText}</span>
                    <span class="inconsistent-warning" id="inconsistent-${cert.id}" style="display:none;">与关务结论不一致</span>
                </div>
            </div>
            <div class="cert-extra show" style="margin-top:8px;">
                <span class="cert-judge-tag library">证书库判断：配置后将在商品证书库上传维护</span>
            </div>
        </div>
    `;
}

// 切换认证证书显示
function toggleCertCerts(show) {
    const area = document.getElementById('certCertsArea');
    area.style.display = show ? 'block' : 'none';
}

// 切换证书选中状态
function toggleCertItem(certId, hasInconsistent) {
    const checkbox = document.getElementById(`cert-${certId}`);
    const item = document.getElementById(`cert-item-${certId}`);
    const inconsistentEl = document.getElementById(`inconsistent-${certId}`);
    
    if (checkbox.checked) {
        item.classList.add('checked');
        // 勾选后显示不一致提示
        if (inconsistentEl && hasInconsistent) {
            inconsistentEl.style.display = 'inline';
        }
    } else {
        item.classList.remove('checked');
        // 取消勾选后隐藏不一致提示
        if (inconsistentEl) {
            inconsistentEl.style.display = 'none';
        }
    }
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
    const form = document.getElementById('certAssessForm');
    
    // 验证是否认证
    const isCertified = document.querySelector('input[name="isCertified"]:checked');
    if (!isCertified) {
        alert('请选择是否认证');
        return;
    }
    
    // 如果选择认证，验证证书选择
    if (isCertified.value === '1') {
        const selectedCerts = document.querySelectorAll('input[name="certCerts"]:checked');
        if (selectedCerts.length === 0) {
            alert('请至少选择一个认证证书');
            return;
        }
    }
    
    // 收集数据
    const formData = {
        isCertified: isCertified.value === '1',
        certCerts: [],
        certRemark: document.getElementById('certRemark').value,
        assessRemark: document.getElementById('assessRemark').value
    };
    
    // 收集证书信息
    document.querySelectorAll('input[name="certCerts"]:checked').forEach(cb => {
        formData.certCerts.push(cb.value);
    });
    
    console.log('提交数据：', formData);
    
    alert(isModifyMode ? '修改成功！' : '评估提交成功！商品认证状态已更新为"待确认"');
    goBack();
}
