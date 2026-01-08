// 模拟数据存储
let dataList = [
    {
        id: 1001,
        country: 'CN',
        type: 1,
        name: '进口许可证',
        judge: 1,
        status: 1,
        remark: '用于进口商品管制',
        creator: 'zhangsan01',
        createTime: '2025-01-15 10:30:00',
        updater: 'zhangsan01',
        updateTime: '2025-01-15 10:30:00'
    },
    {
        id: 1002,
        country: 'TH',
        type: 2,
        name: 'TISI认证',
        judge: 2,
        status: 1,
        remark: '泰国工业标准认证',
        creator: 'lisi02',
        createTime: '2025-02-10 14:20:00',
        updater: 'wangwu03',
        updateTime: '2025-03-05 09:15:00'
    },
    {
        id: 1003,
        country: 'VN',
        type: 1,
        name: '进口管制许可',
        judge: 3,
        status: 1,
        remark: '越南进口管制类许可',
        creator: 'wangwu03',
        createTime: '2025-02-20 16:45:00',
        updater: 'wangwu03',
        updateTime: '2025-02-20 16:45:00'
    },
    {
        id: 1004,
        country: 'ID',
        type: 2,
        name: 'SNI认证',
        judge: 1,
        status: 1,
        remark: '印尼国家标准认证',
        creator: 'zhaoliu04',
        createTime: '2025-03-01 11:00:00',
        updater: 'zhaoliu04',
        updateTime: '2025-03-01 11:00:00'
    },
    {
        id: 1005,
        country: 'CN',
        type: 1,
        name: '出口许可证',
        judge: 1,
        status: 1,
        remark: '用于出口商品管制',
        creator: 'zhangsan01',
        createTime: '2025-03-10 13:30:00',
        updater: 'lisi02',
        updateTime: '2025-04-01 10:20:00'
    },
    {
        id: 1006,
        country: 'MY',
        type: 2,
        name: 'SIRIM认证',
        judge: 2,
        status: 0,
        remark: '马来西亚标准认证',
        creator: 'lisi02',
        createTime: '2025-03-15 09:00:00',
        updater: 'zhangsan01',
        updateTime: '2025-05-20 15:45:00'
    },
    {
        id: 1007,
        country: 'HU',
        type: 3,
        name: 'CE认证',
        judge: 3,
        status: 1,
        remark: '欧盟CE认证',
        creator: 'wangwu03',
        createTime: '2025-04-05 14:30:00',
        updater: 'wangwu03',
        updateTime: '2025-04-05 14:30:00'
    },
    {
        id: 1008,
        country: 'BR',
        type: 1,
        name: 'INMETRO认证',
        judge: 1,
        status: 1,
        remark: '巴西强制性认证',
        creator: 'zhaoliu04',
        createTime: '2025-04-20 10:15:00',
        updater: 'zhaoliu04',
        updateTime: '2025-04-20 10:15:00'
    },
    {
        id: 1009,
        country: 'SA',
        type: 2,
        name: 'SASO认证',
        judge: 2,
        status: 1,
        remark: '沙特标准认证',
        creator: 'lisi02',
        createTime: '2025-05-01 11:20:00',
        updater: 'zhangsan01',
        updateTime: '2025-06-10 16:30:00'
    },
    {
        id: 1010,
        country: 'AE',
        type: 3,
        name: 'ESMA认证',
        judge: 3,
        status: 0,
        remark: '阿联酋标准认证',
        creator: 'wangwu03',
        createTime: '2025-05-15 15:00:00',
        updater: 'lisi02',
        updateTime: '2025-07-01 09:30:00'
    }
];

let filteredData = [...dataList];
let currentEditId = null;
let nextId = 1011;

// 枚举映射
const typeMap = {
    1: '管制',
    2: '认证',
    3: '管制&认证'
};

const judgeMap = {
    0: '不可进出口',
    1: '关务判断',
    2: '采销判断',
    3: '证书库判断'
};

const countryMap = {
    'CN': '中国',
    'TH': '泰国',
    'VN': '越南',
    'ID': '印尼',
    'MY': '马来',
    'HU': '匈牙利',
    'BR': '巴西',
    'SA': '沙特',
    'AE': '阿联酋'
};

// 受限制的国家（不能选择认证类型）
const restrictedCountries = ['CN', 'VN'];

const statusMap = {
    1: '有效',
    0: '失效'
};

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
});

// 切换子菜单
function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    submenu.classList.toggle('active');
    element.classList.toggle('collapsed');
}

// 切换三级菜单
function toggleSubSubmenu(element) {
    const subSubmenu = element.nextElementSibling;
    subSubmenu.classList.toggle('active');
    element.classList.toggle('collapsed');
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const tbodyFixed = document.getElementById('tableBodyFixed');
    tbody.innerHTML = '';
    tbodyFixed.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>';
        tbodyFixed.innerHTML = '<tr><td style="text-align: center; padding: 40px; color: #999;">-</td></tr>';
        return;
    }
    
    filteredData.forEach(item => {
        // 主表格行
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${countryMap[item.country]}</td>
            <td>${typeMap[item.type]}</td>
            <td>${item.name}</td>
            <td>${judgeMap[item.judge]}</td>
            <td><span class="status-tag ${item.status === 1 ? 'status-active' : 'status-inactive'}">${statusMap[item.status]}</span></td>
            <td>${item.remark || '-'}</td>
            <td>${item.creator}</td>
            <td>${item.createTime}</td>
            <td>${item.updater}</td>
            <td>${item.updateTime}</td>
        `;
        tbody.appendChild(tr);
        
        // 固定操作列
        const trFixed = document.createElement('tr');
        trFixed.innerHTML = `
            <td>
                <button class="btn btn-text" onclick="openEditModal(${item.id})">修改</button>
            </td>
        `;
        tbodyFixed.appendChild(trFixed);
    });
}

// 重置搜索
function resetSearch() {
    document.getElementById('searchId').value = '';
    document.getElementById('searchCountry').value = '';
    document.getElementById('searchType').value = '';
    document.getElementById('searchName').value = '';
    document.getElementById('searchStatus').value = '';
    filteredData = [...dataList];
    renderTable();
}

// 查询数据
function searchData() {
    const searchId = document.getElementById('searchId').value.trim();
    const searchCountry = document.getElementById('searchCountry').value;
    const searchType = document.getElementById('searchType').value;
    const searchName = document.getElementById('searchName').value.trim().toLowerCase();
    const searchStatus = document.getElementById('searchStatus').value;
    
    filteredData = dataList.filter(item => {
        // ID搜索支持多个ID，逗号分隔
        if (searchId) {
            const ids = searchId.split(',').map(id => id.trim());
            if (!ids.some(id => item.id.toString().includes(id))) {
                return false;
            }
        }
        
        if (searchCountry && item.country !== searchCountry) {
            return false;
        }
        
        if (searchType && item.type.toString() !== searchType) {
            return false;
        }
        
        if (searchName && !item.name.toLowerCase().includes(searchName)) {
            return false;
        }
        
        if (searchStatus && item.status.toString() !== searchStatus) {
            return false;
        }
        
        return true;
    });
    
    renderTable();
}

// 打开新增弹窗
function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = '新增';
    document.getElementById('dataForm').reset();
    document.getElementById('formId').value = '';
    // 重置选项显示
    resetFormOptions();
    document.getElementById('modal').classList.add('show');
}

// 打开编辑弹窗
function openEditModal(id) {
    currentEditId = id;
    const item = dataList.find(d => d.id === id);
    if (!item) return;
    
    document.getElementById('modalTitle').textContent = '修改';
    document.getElementById('formId').value = item.id;
    
    // 先重置选项
    resetFormOptions();
    
    // 设置值
    document.getElementById('formCountry').value = item.country;
    document.getElementById('formType').value = item.type;
    document.getElementById('formName').value = item.name;
    document.getElementById('formJudge').value = item.judge;
    document.getElementById('formStatus').value = item.status;
    document.getElementById('formRemark').value = item.remark || '';
    
    // 应用联动逻辑
    onCountryChange();
    onTypeChange();
    
    document.getElementById('modal').classList.add('show');
}

// 重置表单选项显示
function resetFormOptions() {
    const countrySelect = document.getElementById('formCountry');
    const typeSelect = document.getElementById('formType');
    
    // 显示所有国家选项
    Array.from(countrySelect.options).forEach(opt => {
        opt.style.display = '';
        opt.disabled = false;
    });
    
    // 显示所有许可类型选项
    Array.from(typeSelect.options).forEach(opt => {
        opt.style.display = '';
        opt.disabled = false;
    });
}

// 国家变更联动 - 中国、越南不能选择认证类型
function onCountryChange() {
    const country = document.getElementById('formCountry').value;
    const typeSelect = document.getElementById('formType');
    const currentType = typeSelect.value;
    
    // 如果选择了受限国家（中国、越南）
    if (restrictedCountries.includes(country)) {
        // 隐藏认证和管制&认证选项
        Array.from(typeSelect.options).forEach(opt => {
            if (opt.value === '2' || opt.value === '3') {
                opt.style.display = 'none';
                opt.disabled = true;
            }
        });
        // 如果当前选择的是被隐藏的选项，清空
        if (currentType === '2' || currentType === '3') {
            typeSelect.value = '';
        }
    } else {
        // 非受限国家，显示所有许可类型
        Array.from(typeSelect.options).forEach(opt => {
            opt.style.display = '';
            opt.disabled = false;
        });
    }
}

// 许可类型变更联动 - 选择认证或管制&认证时隐藏中国、越南
function onTypeChange() {
    const type = document.getElementById('formType').value;
    const countrySelect = document.getElementById('formCountry');
    const currentCountry = countrySelect.value;
    
    // 如果选择了认证或管制&认证
    if (type === '2' || type === '3') {
        // 隐藏中国、越南选项
        Array.from(countrySelect.options).forEach(opt => {
            if (restrictedCountries.includes(opt.value)) {
                opt.style.display = 'none';
                opt.disabled = true;
            }
        });
        // 如果当前选择的是被隐藏的国家，清空
        if (restrictedCountries.includes(currentCountry)) {
            countrySelect.value = '';
        }
    } else {
        // 非认证类型，显示所有国家
        Array.from(countrySelect.options).forEach(opt => {
            opt.style.display = '';
            opt.disabled = false;
        });
    }
}

// 关闭弹窗
function closeModal() {
    document.getElementById('modal').classList.remove('show');
    document.getElementById('dataForm').reset();
    currentEditId = null;
}

// 保存数据
function saveData() {
    const form = document.getElementById('dataForm');
    
    // 表单验证
    if (!form.checkValidity()) {
        alert('请填写所有必填项');
        return;
    }
    
    const country = document.getElementById('formCountry').value;
    const type = parseInt(document.getElementById('formType').value);
    const name = document.getElementById('formName').value.trim();
    const judge = parseInt(document.getElementById('formJudge').value);
    const status = parseInt(document.getElementById('formStatus').value);
    const remark = document.getElementById('formRemark').value.trim();
    
    // 证书名称唯一性校验（新增时）
    if (!currentEditId) {
        const exists = dataList.some(item => item.name === name);
        if (exists) {
            alert('证书名称已存在，请使用其他名称');
            return;
        }
    } else {
        // 编辑时，排除自己
        const exists = dataList.some(item => item.name === name && item.id !== currentEditId);
        if (exists) {
            alert('证书名称已存在，请使用其他名称');
            return;
        }
    }
    
    const now = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\//g, '-');
    
    if (currentEditId) {
        // 修改
        const index = dataList.findIndex(item => item.id === currentEditId);
        if (index !== -1) {
            dataList[index] = {
                ...dataList[index],
                country,
                type,
                name,
                judge,
                status,
                remark,
                updater: 'lizimeng16',
                updateTime: now
            };
        }
    } else {
        // 新增
        const newItem = {
            id: nextId++,
            country,
            type,
            name,
            judge,
            status,
            remark,
            creator: 'lizimeng16',
            createTime: now,
            updater: 'lizimeng16',
            updateTime: now
        };
        dataList.unshift(newItem);
    }
    
    // 重新应用搜索条件
    searchData();
    closeModal();
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
