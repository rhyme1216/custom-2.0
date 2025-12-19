// 跨境商品评估页面 JavaScript

// 受限国家（中国、越南只有关务评估，没有认证评估）
const restrictedCountries = ['CN', 'VN'];

// 当前选中的视图TAB
let currentViewTab = 'all';
// 当前选中的国家
let currentCountry = 'CN';
// 选中的商品ID列表
let selectedItems = [];

// 枚举映射
const countryMap = {
    'CN': '中国', 'TH': '泰国', 'VN': '越南', 'ID': '印尼',
    'MY': '马来', 'HU': '匈牙利', 'BR': '巴西', 'SA': '沙特', 'AE': '阿联酋'
};

const customsStatusMap = { 1: '待评估', 2: '待确认', 3: '已评估' };
const certStatusMap = { 1: '待评估', 2: '待确认', 3: '已评估' };
const clarifyStatusMap = { 0: '无澄清', 10: '待采销回复', 20: '澄清已回复', 30: '澄清完毕' };
const vendorMap = { '': '未分配', '科橘': '科橘', '猎芯': '猎芯' };
const judgeTypeMap = { 0: '不可进出口', 1: '关务判断', 2: '采销判断', 3: '证书库判断' };

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

// 模拟商品评估数据
let assessmentData = [
    {
        id: 1,
        taskNo: 'TASK202512001',
        domSku: 'SKU001',
        intlSku: 'INTL-SKU-001',
        hsCode: '8471300000',
        cnName: '笔记本电脑',
        localName: 'Laptop Computer',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales01',
        deadline: '2025-12-31',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '13%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 2500,
        dimensions: '350/240/20',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'DELL',
        category: '电脑/笔记本',
        productStatus: '在售',
        enName: 'Laptop Computer',
        localDeclare: 'Laptop',
        creator: 'lizimeng16',
        createTime: '2025-12-01 10:00:00',
        updater: 'lizimeng16',
        updateTime: '2025-12-01 10:00:00',
        country: 'CN',
        clarifyStatus: 0
    },
    {
        id: 2,
        taskNo: 'TASK202512002',
        domSku: 'SKU002',
        intlSku: 'INTL-SKU-002',
        hsCode: '8517620000',
        cnName: '无线路由器',
        localName: 'Wireless Router',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales02',
        deadline: '2025-12-25',
        customsStatus: 2,
        certStatus: 1,
        taxRate: '10%',
        isControlled: true,
        controlCerts: [{ name: 'TISI认证', judge: 3, tag: '证书库判断' }],
        controlRemark: '需办理',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: false,
        weight: 350,
        dimensions: '200/150/40',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'TP-LINK',
        category: '网络设备',
        productStatus: '在售',
        enName: 'Wireless Router',
        localDeclare: 'Router',
        creator: 'zhangsan01',
        createTime: '2025-12-02 14:30:00',
        updater: 'lisi02',
        updateTime: '2025-12-05 09:15:00',
        country: 'TH',
        clarifyStatus: 0
    },
    {
        id: 3,
        taskNo: 'TASK202512003',
        domSku: 'SKU003',
        intlSku: 'INTL-SKU-003',
        hsCode: '8504400000',
        cnName: '电源适配器',
        localName: 'Power Adapter',
        image: 'https://via.placeholder.com/50',
        source: '灵犀',
        salesErp: 'sales03',
        deadline: '2025-12-20',
        customsStatus: 3,
        certStatus: 2,
        taxRate: '8%',
        isControlled: true,
        controlCerts: [{ name: 'CE认证', judge: 3, tag: '证书库判断', handleStatus: 1, handleDays: 15, handleCost: '500元' }],
        controlRemark: '已完成评估',
        isCertified: true,
        certCerts: [{ name: 'CE认证', judge: 3, tag: '证书库判断' }],
        certRemark: '需认证',
        inconsistentTips: '',
        assessRemark: '正常商品',
        vendor: '猎芯',
        hasOrder: true,
        weight: 150,
        dimensions: '80/50/30',
        weightSource: '申报',
        brandLimit: '是',
        brandName: 'Apple',
        category: '电源配件',
        productStatus: '在售',
        enName: 'Power Adapter',
        localDeclare: 'Adapter',
        creator: 'wangwu03',
        createTime: '2025-11-28 16:45:00',
        updater: 'wangwu03',
        updateTime: '2025-12-10 11:20:00',
        country: 'HU',
        clarifyStatus: 30,
        clarifyErp: 'lisi02'
    },
    {
        id: 4,
        taskNo: 'TASK202512004',
        domSku: 'SKU004',
        intlSku: 'INTL-SKU-004',
        hsCode: '8471700000',
        cnName: '移动硬盘',
        localName: 'Portable HDD',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales01',
        deadline: '2025-12-28',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '5%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: false,
        weight: 200,
        dimensions: '120/80/15',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'WD',
        category: '存储设备',
        productStatus: '在售',
        enName: 'Portable Hard Drive',
        localDeclare: 'HDD',
        creator: 'zhaoliu04',
        createTime: '2025-12-03 09:00:00',
        updater: 'zhaoliu04',
        updateTime: '2025-12-03 09:00:00',
        country: 'BR',
        clarifyStatus: 10,
        clarifyErp: 'lizimeng16'
    },
    {
        id: 5,
        taskNo: 'TASK202512005',
        domSku: 'SKU005',
        intlSku: 'INTL-SKU-005',
        hsCode: '8523510000',
        cnName: 'U盘',
        localName: 'USB Flash Drive',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales02',
        deadline: '2025-12-22',
        customsStatus: 2,
        certStatus: 2,
        taxRate: '3%',
        isControlled: false,
        controlCerts: [],
        controlRemark: '无需管制',
        isCertified: true,
        certCerts: [{ name: 'ESMA认证', judge: 3, tag: '证书库判断' }],
        certRemark: '认证中',
        inconsistentTips: 'ESMA认证: 关务评估【否】认证评估【是】',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 20,
        dimensions: '60/20/10',
        weightSource: '申报',
        brandLimit: '否',
        brandName: 'SanDisk',
        category: '存储设备',
        productStatus: '在售',
        enName: 'USB Flash Drive',
        localDeclare: 'USB Drive',
        creator: 'lisi02',
        createTime: '2025-12-04 11:30:00',
        updater: 'zhangsan01',
        updateTime: '2025-12-08 14:00:00',
        country: 'AE',
        clarifyStatus: 20,
        clarifyErp: 'zhangsan01'
    },
    // 新增更多模拟数据
    {
        id: 6,
        taskNo: 'TASK202512006',
        domSku: 'SKU006',
        intlSku: 'INTL-SKU-006',
        hsCode: '8518300000',
        cnName: '蓝牙耳机',
        localName: 'Bluetooth Headphones',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales01',
        deadline: '2025-12-30',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '8%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 250,
        dimensions: '180/150/80',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Sony',
        category: '音频设备',
        productStatus: '在售',
        enName: 'Bluetooth Headphones',
        localDeclare: 'Headphones',
        creator: 'chenqi05',
        createTime: '2025-12-05 10:00:00',
        updater: 'chenqi05',
        updateTime: '2025-12-05 10:00:00',
        country: 'CN',
        clarifyStatus: 0
    },
    {
        id: 7,
        taskNo: 'TASK202512007',
        domSku: 'SKU007',
        intlSku: 'INTL-SKU-007',
        hsCode: '8471500000',
        cnName: '台式电脑主机',
        localName: 'Desktop Computer',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales03',
        deadline: '2025-12-28',
        customsStatus: 2,
        certStatus: 1,
        taxRate: '13%',
        isControlled: true,
        controlCerts: [{ name: '进口许可证', judge: 1, tag: '关务判断', handleStatus: 1, handleDays: 10, handleCost: '800元' }],
        controlRemark: '需办理进口许可',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: true,
        weight: 8500,
        dimensions: '450/200/400',
        weightSource: '实测',
        brandLimit: '是',
        brandName: 'Lenovo',
        category: '电脑/台式机',
        productStatus: '在售',
        enName: 'Desktop Computer',
        localDeclare: 'PC',
        creator: 'wangba06',
        createTime: '2025-12-06 14:00:00',
        updater: 'wangba06',
        updateTime: '2025-12-10 16:30:00',
        country: 'CN',
        clarifyStatus: 0
    },
    {
        id: 8,
        taskNo: 'TASK202512008',
        domSku: 'SKU008',
        intlSku: 'INTL-SKU-008',
        hsCode: '8528720000',
        cnName: '液晶显示器',
        localName: 'LCD Monitor',
        image: 'https://via.placeholder.com/50',
        source: '灵犀',
        salesErp: 'sales02',
        deadline: '2025-12-25',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '10%',
        isControlled: true,
        controlCerts: [{ name: 'NBTC认证', judge: 2, tag: '采销判断' }],
        controlRemark: '需采销确认',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 5200,
        dimensions: '600/100/400',
        weightSource: '申报',
        brandLimit: '否',
        brandName: 'Samsung',
        category: '显示设备',
        productStatus: '在售',
        enName: 'LCD Monitor',
        localDeclare: 'Monitor',
        creator: 'zhoujiu07',
        createTime: '2025-12-07 09:30:00',
        updater: 'zhoujiu07',
        updateTime: '2025-12-07 09:30:00',
        country: 'TH',
        clarifyStatus: 10,
        clarifyErp: 'wangwu03'
    },
    {
        id: 9,
        taskNo: 'TASK202512009',
        domSku: 'SKU009',
        intlSku: 'INTL-SKU-009',
        hsCode: '8544421000',
        cnName: 'USB数据线',
        localName: 'USB Cable',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales01',
        deadline: '2025-12-20',
        customsStatus: 3,
        certStatus: 3,
        taxRate: '5%',
        isControlled: false,
        controlCerts: [],
        controlRemark: '无需管制',
        isCertified: false,
        certCerts: [],
        certRemark: '无需认证',
        inconsistentTips: '',
        assessRemark: '普通配件',
        vendor: '猎芯',
        hasOrder: true,
        weight: 50,
        dimensions: '120/30/20',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Anker',
        category: '数码配件',
        productStatus: '在售',
        enName: 'USB Cable',
        localDeclare: 'Cable',
        creator: 'sunshi08',
        createTime: '2025-12-08 11:00:00',
        updater: 'sunshi08',
        updateTime: '2025-12-12 15:00:00',
        country: 'ID',
        clarifyStatus: 30,
        clarifyErp: 'sunshi08'
    },
    {
        id: 10,
        taskNo: 'TASK202512010',
        domSku: 'SKU010',
        intlSku: 'INTL-SKU-010',
        hsCode: '8517120000',
        cnName: '智能手机',
        localName: 'Smartphone',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales03',
        deadline: '2025-12-18',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '13%',
        isControlled: true,
        controlCerts: [{ name: '进口管制许可', judge: 1, tag: '关务判断', handleStatus: 0 }],
        controlRemark: '需办理许可',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 200,
        dimensions: '150/70/8',
        weightSource: '实测',
        brandLimit: '是',
        brandName: 'Apple',
        category: '手机通讯',
        productStatus: '在售',
        enName: 'Smartphone',
        localDeclare: 'Phone',
        creator: 'qianyi09',
        createTime: '2025-12-09 08:30:00',
        updater: 'qianyi09',
        updateTime: '2025-12-09 08:30:00',
        country: 'VN',
        clarifyStatus: 0
    },
    {
        id: 11,
        taskNo: 'TASK202512011',
        domSku: 'SKU011',
        intlSku: 'INTL-SKU-011',
        hsCode: '8473300000',
        cnName: '键盘',
        localName: 'Keyboard',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales02',
        deadline: '2025-12-22',
        customsStatus: 2,
        certStatus: 2,
        taxRate: '5%',
        isControlled: true,
        controlCerts: [{ name: 'SIRIM认证', judge: 3, tag: '证书库判断' }],
        controlRemark: '需认证',
        isCertified: true,
        certCerts: [{ name: 'SIRIM认证', judge: 3, tag: '证书库判断' }],
        certRemark: '认证中',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: false,
        weight: 800,
        dimensions: '450/150/35',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Logitech',
        category: '电脑配件',
        productStatus: '在售',
        enName: 'Keyboard',
        localDeclare: 'Keyboard',
        creator: 'zhouer10',
        createTime: '2025-12-10 13:00:00',
        updater: 'zhouer10',
        updateTime: '2025-12-14 10:00:00',
        country: 'MY',
        clarifyStatus: 20,
        clarifyErp: 'chensi04'
    },
    {
        id: 12,
        taskNo: 'TASK202512012',
        domSku: 'SKU012',
        intlSku: 'INTL-SKU-012',
        hsCode: '8471600000',
        cnName: '鼠标',
        localName: 'Mouse',
        image: 'https://via.placeholder.com/50',
        source: '灵犀',
        salesErp: 'sales01',
        deadline: '2025-12-19',
        customsStatus: 3,
        certStatus: 3,
        taxRate: '5%',
        isControlled: true,
        controlCerts: [{ name: 'SNI认证', judge: 3, tag: '证书库判断' }],
        controlRemark: '已完成',
        isCertified: true,
        certCerts: [{ name: 'SNI认证', judge: 3, tag: '证书库判断' }],
        certRemark: '已认证',
        inconsistentTips: '',
        assessRemark: '正常',
        vendor: '猎芯',
        hasOrder: true,
        weight: 100,
        dimensions: '120/65/40',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Razer',
        category: '电脑配件',
        productStatus: '在售',
        enName: 'Mouse',
        localDeclare: 'Mouse',
        creator: 'wusan11',
        createTime: '2025-12-11 15:30:00',
        updater: 'wusan11',
        updateTime: '2025-12-15 09:00:00',
        country: 'ID',
        clarifyStatus: 30,
        clarifyErp: 'zhoujiu07'
    },
    // 新增更多测试数据 - 各国家各状态覆盖
    {
        id: 13,
        taskNo: 'TASK202512013',
        domSku: 'SKU013',
        intlSku: 'INTL-SKU-013',
        hsCode: '8542310000',
        cnName: '集成电路芯片',
        localName: 'IC Chip',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales01',
        deadline: '2025-12-25',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '0%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 5,
        dimensions: '20/15/5',
        weightSource: '实测',
        brandLimit: '是',
        brandName: 'Intel',
        category: '电子元器件',
        productStatus: '在售',
        enName: 'Integrated Circuit',
        localDeclare: 'IC',
        creator: 'lizimeng16',
        createTime: '2025-12-12 09:00:00',
        updater: 'lizimeng16',
        updateTime: '2025-12-12 09:00:00',
        country: 'CN',
        clarifyStatus: 0
    },
    {
        id: 14,
        taskNo: 'TASK202512014',
        domSku: 'SKU014',
        intlSku: 'INTL-SKU-014',
        hsCode: '8471900000',
        cnName: '平板电脑',
        localName: 'Tablet PC',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales02',
        deadline: '2025-12-28',
        customsStatus: 2,
        certStatus: 1,
        taxRate: '13%',
        isControlled: true,
        controlCerts: [{ name: '进口许可证', judge: 1, tag: '关务判断', handleStatus: 1, handleDays: 7, handleCost: '600元' }],
        controlRemark: '需办理',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: false,
        weight: 450,
        dimensions: '250/175/7',
        weightSource: '实测',
        brandLimit: '是',
        brandName: 'Apple',
        category: '电脑/平板',
        productStatus: '在售',
        enName: 'Tablet PC',
        localDeclare: 'Tablet',
        creator: 'zhangsan01',
        createTime: '2025-12-13 10:30:00',
        updater: 'zhangsan01',
        updateTime: '2025-12-16 14:00:00',
        country: 'CN',
        clarifyStatus: 10,
        clarifyErp: 'lizimeng16'
    },
    {
        id: 15,
        taskNo: 'TASK202512015',
        domSku: 'SKU015',
        intlSku: 'INTL-SKU-015',
        hsCode: '8525800000',
        cnName: '摄像头',
        localName: 'Webcam',
        image: 'https://via.placeholder.com/50',
        source: '灵犀',
        salesErp: 'sales03',
        deadline: '2025-12-20',
        customsStatus: 3,
        certStatus: 3,
        taxRate: '10%',
        isControlled: false,
        controlCerts: [],
        controlRemark: '无需管制',
        isCertified: false,
        certCerts: [],
        certRemark: '无需认证',
        inconsistentTips: '',
        assessRemark: '已完成全部评估',
        vendor: '猎芯',
        hasOrder: true,
        weight: 150,
        dimensions: '80/60/50',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Logitech',
        category: '电脑配件',
        productStatus: '在售',
        enName: 'Webcam',
        localDeclare: 'Camera',
        creator: 'wangwu03',
        createTime: '2025-12-10 08:00:00',
        updater: 'wangwu03',
        updateTime: '2025-12-18 09:00:00',
        country: 'CN',
        clarifyStatus: 30,
        clarifyErp: 'wangxiao05'
    },
    {
        id: 16,
        taskNo: 'TASK202512016',
        domSku: 'SKU016',
        intlSku: 'INTL-SKU-016',
        hsCode: '8536690000',
        cnName: '电源插座',
        localName: 'Power Socket',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales01',
        deadline: '2025-12-26',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '8%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: false,
        weight: 200,
        dimensions: '100/100/50',
        weightSource: '申报',
        brandLimit: '否',
        brandName: '公牛',
        category: '电源配件',
        productStatus: '在售',
        enName: 'Power Socket',
        localDeclare: 'Socket',
        creator: 'lisi02',
        createTime: '2025-12-14 11:00:00',
        updater: 'lisi02',
        updateTime: '2025-12-14 11:00:00',
        country: 'TH',
        clarifyStatus: 0
    },
    {
        id: 17,
        taskNo: 'TASK202512017',
        domSku: 'SKU017',
        intlSku: 'INTL-SKU-017',
        hsCode: '8518100000',
        cnName: '麦克风',
        localName: 'Microphone',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales02',
        deadline: '2025-12-24',
        customsStatus: 2,
        certStatus: 2,
        taxRate: '10%',
        isControlled: true,
        controlCerts: [{ name: 'TISI认证', judge: 3, tag: '证书库判断' }],
        controlRemark: '需认证',
        isCertified: true,
        certCerts: [{ name: 'TISI认证', judge: 3, tag: '证书库判断' }],
        certRemark: '认证中',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '猎芯',
        hasOrder: false,
        weight: 350,
        dimensions: '50/50/180',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Blue',
        category: '音频设备',
        productStatus: '在售',
        enName: 'Microphone',
        localDeclare: 'Mic',
        creator: 'zhaoliu04',
        createTime: '2025-12-15 14:30:00',
        updater: 'zhaoliu04',
        updateTime: '2025-12-17 10:00:00',
        country: 'TH',
        clarifyStatus: 20,
        clarifyErp: 'wangwu03'
    },
    {
        id: 18,
        taskNo: 'TASK202512018',
        domSku: 'SKU018',
        intlSku: 'INTL-SKU-018',
        hsCode: '8471800000',
        cnName: '扫描仪',
        localName: 'Scanner',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales03',
        deadline: '2025-12-22',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '10%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 2800,
        dimensions: '450/350/120',
        weightSource: '申报',
        brandLimit: '否',
        brandName: 'Canon',
        category: '办公设备',
        productStatus: '在售',
        enName: 'Scanner',
        localDeclare: 'Scanner',
        creator: 'chenqi05',
        createTime: '2025-12-16 09:00:00',
        updater: 'chenqi05',
        updateTime: '2025-12-16 09:00:00',
        country: 'VN',
        clarifyStatus: 0
    },
    {
        id: 19,
        taskNo: 'TASK202512019',
        domSku: 'SKU019',
        intlSku: 'INTL-SKU-019',
        hsCode: '8443320000',
        cnName: '打印机',
        localName: 'Printer',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales01',
        deadline: '2025-12-30',
        customsStatus: 2,
        certStatus: 1,
        taxRate: '10%',
        isControlled: true,
        controlCerts: [{ name: '进口管制许可', judge: 1, tag: '关务判断', handleStatus: 1, handleDays: 15 }],
        controlRemark: '需办理许可',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: true,
        weight: 6500,
        dimensions: '500/400/250',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'HP',
        category: '办公设备',
        productStatus: '在售',
        enName: 'Printer',
        localDeclare: 'Printer',
        creator: 'wangba06',
        createTime: '2025-12-17 10:30:00',
        updater: 'wangba06',
        updateTime: '2025-12-18 08:00:00',
        country: 'VN',
        clarifyStatus: 10,
        clarifyErp: 'chensi04'
    },
    {
        id: 20,
        taskNo: 'TASK202512020',
        domSku: 'SKU020',
        intlSku: 'INTL-SKU-020',
        hsCode: '8506500000',
        cnName: '锂电池',
        localName: 'Lithium Battery',
        image: 'https://via.placeholder.com/50',
        source: '灵犀',
        salesErp: 'sales02',
        deadline: '2025-12-29',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '5%',
        isControlled: true,
        controlCerts: [{ name: 'INMETRO认证', judge: 1, tag: '关务判断', handleStatus: 0 }],
        controlRemark: '危险品管制',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 300,
        dimensions: '100/70/25',
        weightSource: '实测',
        brandLimit: '是',
        brandName: 'Sony',
        category: '电池电源',
        productStatus: '在售',
        enName: 'Lithium Battery',
        localDeclare: 'Battery',
        creator: 'zhoujiu07',
        createTime: '2025-12-18 08:30:00',
        updater: 'zhoujiu07',
        updateTime: '2025-12-18 08:30:00',
        country: 'BR',
        clarifyStatus: 0
    },
    {
        id: 21,
        taskNo: 'TASK202512021',
        domSku: 'SKU021',
        intlSku: 'INTL-SKU-021',
        hsCode: '8529909000',
        cnName: '电视机配件',
        localName: 'TV Parts',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales03',
        deadline: '2025-12-27',
        customsStatus: 2,
        certStatus: 2,
        taxRate: '8%',
        isControlled: true,
        controlCerts: [{ name: 'INMETRO认证', judge: 3, tag: '证书库判断' }],
        controlRemark: '需认证',
        isCertified: true,
        certCerts: [{ name: 'INMETRO认证', judge: 3, tag: '证书库判断' }],
        certRemark: '认证中',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '猎芯',
        hasOrder: false,
        weight: 450,
        dimensions: '200/150/50',
        weightSource: '申报',
        brandLimit: '否',
        brandName: 'Samsung',
        category: '电视配件',
        productStatus: '在售',
        enName: 'TV Parts',
        localDeclare: 'Parts',
        creator: 'sunshi08',
        createTime: '2025-12-14 13:00:00',
        updater: 'sunshi08',
        updateTime: '2025-12-17 15:30:00',
        country: 'BR',
        clarifyStatus: 20,
        clarifyErp: 'lisi02'
    },
    {
        id: 22,
        taskNo: 'TASK202512022',
        domSku: 'SKU022',
        intlSku: 'INTL-SKU-022',
        hsCode: '8519810000',
        cnName: 'MP3播放器',
        localName: 'MP3 Player',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales01',
        deadline: '2025-12-23',
        customsStatus: 3,
        certStatus: 3,
        taxRate: '8%',
        isControlled: false,
        controlCerts: [],
        controlRemark: '无需管制',
        isCertified: false,
        certCerts: [],
        certRemark: '无需认证',
        inconsistentTips: '',
        assessRemark: '完成评估',
        vendor: '科橘',
        hasOrder: true,
        weight: 50,
        dimensions: '80/40/10',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Sony',
        category: '音频设备',
        productStatus: '在售',
        enName: 'MP3 Player',
        localDeclare: 'MP3',
        creator: 'qianyi09',
        createTime: '2025-12-11 11:00:00',
        updater: 'qianyi09',
        updateTime: '2025-12-18 10:00:00',
        country: 'MY',
        clarifyStatus: 30,
        clarifyErp: 'qianyi09'
    },
    {
        id: 23,
        taskNo: 'TASK202512023',
        domSku: 'SKU023',
        intlSku: 'INTL-SKU-023',
        hsCode: '8471700000',
        cnName: '固态硬盘',
        localName: 'SSD',
        image: 'https://via.placeholder.com/50',
        source: '灵犀',
        salesErp: 'sales02',
        deadline: '2025-12-26',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '5%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '猎芯',
        hasOrder: false,
        weight: 80,
        dimensions: '100/70/7',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Samsung',
        category: '存储设备',
        productStatus: '在售',
        enName: 'Solid State Drive',
        localDeclare: 'SSD',
        creator: 'zhouer10',
        createTime: '2025-12-15 09:30:00',
        updater: 'zhouer10',
        updateTime: '2025-12-15 09:30:00',
        country: 'HU',
        clarifyStatus: 0
    },
    {
        id: 24,
        taskNo: 'TASK202512024',
        domSku: 'SKU024',
        intlSku: 'INTL-SKU-024',
        hsCode: '8507600000',
        cnName: '充电宝',
        localName: 'Power Bank',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales03',
        deadline: '2025-12-25',
        customsStatus: 2,
        certStatus: 1,
        taxRate: '5%',
        isControlled: true,
        controlCerts: [{ name: 'CE认证', judge: 3, tag: '证书库判断' }],
        controlRemark: '需CE认证',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: false,
        weight: 250,
        dimensions: '120/65/25',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'Anker',
        category: '电池电源',
        productStatus: '在售',
        enName: 'Power Bank',
        localDeclare: 'Power Bank',
        creator: 'wusan11',
        createTime: '2025-12-16 14:00:00',
        updater: 'wusan11',
        updateTime: '2025-12-17 16:30:00',
        country: 'HU',
        clarifyStatus: 10,
        clarifyErp: 'wangba06'
    },
    {
        id: 25,
        taskNo: 'TASK202512025',
        domSku: 'SKU025',
        intlSku: 'INTL-SKU-025',
        hsCode: '8538900000',
        cnName: '开关面板',
        localName: 'Switch Panel',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales01',
        deadline: '2025-12-28',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '8%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '',
        hasOrder: false,
        weight: 120,
        dimensions: '86/86/35',
        weightSource: '申报',
        brandLimit: '否',
        brandName: 'Schneider',
        category: '电气配件',
        productStatus: '在售',
        enName: 'Switch Panel',
        localDeclare: 'Switch',
        creator: 'lizimeng16',
        createTime: '2025-12-17 08:00:00',
        updater: 'lizimeng16',
        updateTime: '2025-12-17 08:00:00',
        country: 'SA',
        clarifyStatus: 0
    },
    {
        id: 26,
        taskNo: 'TASK202512026',
        domSku: 'SKU026',
        intlSku: 'INTL-SKU-026',
        hsCode: '8504900000',
        cnName: '变压器',
        localName: 'Transformer',
        image: 'https://via.placeholder.com/50',
        source: '灵犀',
        salesErp: 'sales02',
        deadline: '2025-12-24',
        customsStatus: 2,
        certStatus: 2,
        taxRate: '8%',
        isControlled: true,
        controlCerts: [{ name: 'SASO认证', judge: 3, tag: '证书库判断' }],
        controlRemark: '需SASO认证',
        isCertified: true,
        certCerts: [{ name: 'SASO认证', judge: 3, tag: '证书库判断' }],
        certRemark: '认证中',
        inconsistentTips: 'SASO认证: 关务评估【是】认证评估【否】',
        assessRemark: '',
        vendor: '猎芯',
        hasOrder: false,
        weight: 1500,
        dimensions: '150/100/80',
        weightSource: '实测',
        brandLimit: '否',
        brandName: 'ABB',
        category: '电气设备',
        productStatus: '在售',
        enName: 'Transformer',
        localDeclare: 'Transformer',
        creator: 'zhangsan01',
        createTime: '2025-12-13 15:00:00',
        updater: 'zhangsan01',
        updateTime: '2025-12-16 11:30:00',
        country: 'SA',
        clarifyStatus: 20,
        clarifyErp: 'zhangsan01'
    },
    {
        id: 27,
        taskNo: 'TASK202512027',
        domSku: 'SKU027',
        intlSku: 'INTL-SKU-027',
        hsCode: '8528590000',
        cnName: '投影仪',
        localName: 'Projector',
        image: 'https://via.placeholder.com/50',
        source: 'Excel',
        salesErp: 'sales03',
        deadline: '2025-12-29',
        customsStatus: 1,
        certStatus: 1,
        taxRate: '10%',
        isControlled: null,
        controlCerts: [],
        controlRemark: '',
        isCertified: null,
        certCerts: [],
        certRemark: '',
        inconsistentTips: '',
        assessRemark: '',
        vendor: '科橘',
        hasOrder: false,
        weight: 3200,
        dimensions: '300/250/100',
        weightSource: '实测',
        brandLimit: '是',
        brandName: 'BenQ',
        category: '显示设备',
        productStatus: '在售',
        enName: 'Projector',
        localDeclare: 'Projector',
        creator: 'wangwu03',
        createTime: '2025-12-18 09:00:00',
        updater: 'wangwu03',
        updateTime: '2025-12-18 09:00:00',
        country: 'AE',
        clarifyStatus: 0
    },
    {
        id: 28,
        taskNo: 'TASK202512028',
        domSku: 'SKU028',
        intlSku: 'INTL-SKU-028',
        hsCode: '8471300000',
        cnName: '游戏笔记本',
        localName: 'Gaming Laptop',
        image: 'https://via.placeholder.com/50',
        source: '商品',
        salesErp: 'sales01',
        deadline: '2025-12-31',
        customsStatus: 3,
        certStatus: 3,
        taxRate: '13%',
        isControlled: true,
        controlCerts: [{ name: 'ESMA认证', judge: 3, tag: '证书库判断' }],
        controlRemark: '已完成',
        isCertified: true,
        certCerts: [{ name: 'ESMA认证', judge: 3, tag: '证书库判断' }],
        certRemark: '已认证',
        inconsistentTips: '',
        assessRemark: '高端游戏本',
        vendor: '猎芯',
        hasOrder: true,
        weight: 2800,
        dimensions: '360/260/25',
        weightSource: '实测',
        brandLimit: '是',
        brandName: 'ASUS',
        category: '电脑/笔记本',
        productStatus: '在售',
        enName: 'Gaming Laptop',
        localDeclare: 'Laptop',
        creator: 'zhaoliu04',
        createTime: '2025-12-10 10:00:00',
        updater: 'zhaoliu04',
        updateTime: '2025-12-17 14:00:00',
        country: 'AE',
        clarifyStatus: 30,
        clarifyErp: 'wusan11'
    }
];

// 视图TAB配置 - 根据需求表格配置
const viewTabConfig = {
    'all': {
        name: '全部',
        defaultFilters: {},
        hideSearchFields: [],
        hideBatchButtons: [],
        hideRowButtons: []
    },
    'pending-reply': {
        name: '待采销回复',
        defaultFilters: { clarifyStatus: [10] },
        hideSearchFields: [],
        hideBatchButtons: [],
        hideRowButtons: []
    },
    'replied': {
        name: '已回复',
        defaultFilters: { clarifyStatus: [20] },
        hideSearchFields: [],
        hideBatchButtons: [],
        hideRowButtons: []
    },
    'customs-unassigned': {
        name: '待分配',
        // 关务评估状态=待评估, 服务商=未分配, 澄清状态<>待采销回复
        defaultFilters: { customsStatus: 1, vendor: '未分配', clarifyStatusNot: 10 },
        hideSearchFields: ['certStatusField'],
        hideBatchButtons: ['btnApplyAssess', 'btnBatchCustomsConfirm', 'btnBatchCertAssess', 'btnBatchCertConfirm'],
        hideRowButtons: ['btnCustomsConfirm', 'btnCertAssess', 'btnCertConfirm']
    },
    'customs-vendor': {
        name: '服务商评估',
        // 关务评估状态=待评估, 服务商<>未分配, 澄清状态<>待采销回复
        defaultFilters: { customsStatus: 1, vendorNot: '未分配', clarifyStatusNot: 10 },
        hideSearchFields: ['certStatusField', 'vendorField'],
        hideBatchButtons: ['btnApplyAssess', 'btnAssignVendor', 'btnBatchCustomsConfirm', 'btnBatchCertAssess', 'btnBatchCertConfirm'],
        hideRowButtons: ['btnCustomsConfirm', 'btnAssignVendor', 'btnCertAssess', 'btnCertConfirm']
    },
    'customs-confirm': {
        name: '待确认',
        // 关务评估状态=待确认, 澄清状态<>待采销回复
        defaultFilters: { customsStatus: 2, clarifyStatusNot: 10 },
        hideSearchFields: ['certStatusField'],
        hideBatchButtons: ['btnApplyAssess', 'btnBatchCertAssess', 'btnBatchCertConfirm'],
        hideRowButtons: ['btnCertAssess']
    },
    'cert-pending': {
        name: '待评估',
        // 认证评估状态=待评估, 澄清状态<>待采销回复
        defaultFilters: { certStatus: 1, clarifyStatusNot: 10 },
        hideSearchFields: ['customsStatusField', 'vendorField'],
        hideBatchButtons: ['btnApplyAssess', 'btnAssignVendor', 'btnBatchCustomsAssess', 'btnBatchCustomsConfirm'],
        hideRowButtons: ['btnAssignVendor', 'btnCustomsAssess', 'btnCustomsConfirm', 'btnCertConfirm']
    },
    'cert-confirm': {
        name: '待确认',
        // 认证评估状态=待确认, 澄清状态<>待采销回复
        defaultFilters: { certStatus: 2, clarifyStatusNot: 10 },
        hideSearchFields: ['customsStatusField', 'vendorField'],
        hideBatchButtons: ['btnApplyAssess', 'btnAssignVendor', 'btnBatchCustomsAssess', 'btnBatchCustomsConfirm'],
        hideRowButtons: ['btnAssignVendor', 'btnCustomsAssess', 'btnCustomsConfirm']
    }
};

// 澄清进度选中值
let selectedClarifyStatus = [];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    bindEvents();
    updateButtonVisibility();
});

// 绑定事件
function bindEvents() {
    // 视图TAB点击 - 使用事件委托处理嵌套的tab-item
    document.querySelector('.tab-group').addEventListener('click', function(e) {
        const tabItem = e.target.closest('.tab-item');
        if (tabItem && tabItem.dataset.tab) {
            switchViewTab(tabItem.dataset.tab);
        }
    });

    // 国家TAB点击
    document.querySelectorAll('.country-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchCountry(this.dataset.country);
        });
    });
}

// 切换菜单
function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    submenu.classList.toggle('active');
    element.classList.toggle('collapsed');
}

// 切换TAB下拉（已弃用，TAB现在是平铺展示）
function toggleTabDropdown(e) {
    // 保留函数避免报错，但不再需要
}

// 切换视图TAB
function switchViewTab(tabId) {
    currentViewTab = tabId;
    
    // 更新TAB激活状态
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // 应用视图配置
    applyViewConfig(tabId);
    
    // 重新渲染表格
    renderTable();
}

// 应用视图配置
function applyViewConfig(tabId) {
    const config = viewTabConfig[tabId];
    if (!config) return;
    
    // 隐藏/显示搜索字段
    ['customsStatusField', 'certStatusField', 'vendorField'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.toggle('hidden', config.hideSearchFields.includes(fieldId));
        }
    });
    
    // 隐藏/显示批量按钮
    ['btnApplyAssess', 'btnAssignVendor', 'btnBatchCustomsAssess', 'btnBatchCustomsConfirm', 'btnBatchCertAssess', 'btnBatchCertConfirm'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.classList.toggle('hidden', config.hideBatchButtons.includes(btnId));
        }
    });
    
    // 设置默认查询条件
    if (config.defaultFilters.customsStatus) {
        document.getElementById('searchCustomsStatus').value = config.defaultFilters.customsStatus;
    } else {
        document.getElementById('searchCustomsStatus').value = '';
    }
    if (config.defaultFilters.certStatus) {
        document.getElementById('searchCertStatus').value = config.defaultFilters.certStatus;
    } else {
        document.getElementById('searchCertStatus').value = '';
    }
    if (config.defaultFilters.vendor !== undefined) {
        document.getElementById('searchVendor').value = config.defaultFilters.vendor;
    } else {
        document.getElementById('searchVendor').value = '';
    }
    
    // 设置澄清进度默认值
    if (config.defaultFilters.clarifyStatus) {
        setClarifySelection(config.defaultFilters.clarifyStatus);
    } else {
        setClarifySelection([]);
    }
}

// 澄清进度下拉相关函数
function toggleClarifyDropdown() {
    const menu = document.getElementById('clarifyMenu');
    menu.classList.toggle('show');
}

function updateClarifySelection() {
    const checkboxes = document.querySelectorAll('#clarifyMenu input[type="checkbox"]');
    selectedClarifyStatus = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedClarifyStatus.push(parseInt(cb.value));
        }
    });
    updateClarifyDisplayText();
}

function updateClarifyDisplayText() {
    const displayEl = document.getElementById('clarifyDisplayText');
    if (selectedClarifyStatus.length === 0) {
        displayEl.textContent = '请选择';
    } else {
        const names = selectedClarifyStatus.map(v => clarifyStatusMap[v]).join('、');
        displayEl.textContent = names.length > 12 ? names.substring(0, 12) + '...' : names;
    }
}

function setClarifySelection(values) {
    selectedClarifyStatus = values;
    const checkboxes = document.querySelectorAll('#clarifyMenu input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = values.includes(parseInt(cb.value));
    });
    updateClarifyDisplayText();
}

function confirmClarifySelection() {
    document.getElementById('clarifyMenu').classList.remove('show');
    // 可以在这里触发搜索
}

// 点击外部关闭下拉
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('clarifyDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        document.getElementById('clarifyMenu').classList.remove('show');
    }
});

// 切换国家
function switchCountry(country) {
    currentCountry = country;
    
    // 更新TAB激活状态
    document.querySelectorAll('.country-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.country === country);
    });
    
    // 更新按钮可见性（中国/越南没有认证评估）
    updateButtonVisibility();
    
    // 重新渲染表格
    renderTable();
}

// 更新按钮可见性
function updateButtonVisibility() {
    const isRestricted = restrictedCountries.includes(currentCountry);
    
    // 认证相关按钮
    const certButtons = ['btnBatchCertAssess', 'btnBatchCertConfirm'];
    certButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.classList.toggle('hidden', isRestricted);
        }
    });
    
    // 认证状态搜索字段
    const certStatusField = document.getElementById('certStatusField');
    if (certStatusField) {
        certStatusField.classList.toggle('hidden', isRestricted);
    }
    
    // 认证评估TAB（中国/越南隐藏）
    const certTabCategory = document.getElementById('certTabCategory');
    const certTabDivider = document.getElementById('certTabDivider');
    if (certTabCategory) {
        certTabCategory.classList.toggle('hidden', isRestricted);
    }
    if (certTabDivider) {
        certTabDivider.classList.toggle('hidden', isRestricted);
    }
    
    // 动态显示/隐藏表头的认证相关列
    updateTableHeaderVisibility(isRestricted);
}

// 更新表头认证列可见性
function updateTableHeaderVisibility(isRestricted) {
    const certCols = document.querySelectorAll('.cert-col');
    certCols.forEach(col => {
        col.classList.toggle('hidden', isRestricted);
    });
}

// 渲染表格
function renderTable() {
    const filteredData = filterData();
    const isRestricted = restrictedCountries.includes(currentCountry);
    
    const tbodyLeft = document.getElementById('tableBodyLeft');
    const tbodyMain = document.getElementById('tableBodyMain');
    const tbodyRight = document.getElementById('tableBodyRight');
    
    tbodyLeft.innerHTML = '';
    tbodyMain.innerHTML = '';
    tbodyRight.innerHTML = '';
    
    // 更新表头可见性
    updateTableHeaderVisibility(isRestricted);
    
    if (filteredData.length === 0) {
        const colSpan = isRestricted ? 28 : 33;
        tbodyLeft.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 40px; color: #999;">暂无数据</td></tr>';
        tbodyMain.innerHTML = `<tr><td colspan="${colSpan}" style="text-align: center; padding: 40px; color: #999;"></td></tr>`;
        tbodyRight.innerHTML = '<tr><td style="text-align: center; padding: 40px; color: #999;">-</td></tr>';
        return;
    }
    
    filteredData.forEach(item => {
        // 左侧固定列
        const trLeft = document.createElement('tr');
        trLeft.innerHTML = `
            <td><input type="checkbox" class="item-check" data-id="${item.id}" onchange="toggleItemCheck(${item.id})"></td>
            <td><a href="#" class="sku-link">${item.domSku}</a></td>
            <td>${item.taskNo || '-'}</td>
        `;
        tbodyLeft.appendChild(trLeft);
        
        // 主表格 - 根据是否为中国/越南决定显示的列
        const trMain = document.createElement('tr');
        
        // 基础列（所有国家都有）
        let rowHtml = `
            <td>${item.hsCode}</td>
            <td><a href="#" class="sku-link">${item.intlSku}</a></td>
            <td>${item.cnName}<br><span style="color:#999">${item.localName}</span></td>
            <td><img src="${item.image}" class="product-image" alt="商品图片"></td>
            <td>${item.source}</td>
            <td>${item.salesErp}</td>
            <td>${item.deadline}</td>
            <td><span class="status-tag ${getStatusClass(item.customsStatus)}">${customsStatusMap[item.customsStatus]}</span></td>
        `;
        
        // 认证状态（中国/越南隐藏）
        if (!isRestricted) {
            rowHtml += `<td class="cert-col"><span class="status-tag ${getStatusClass(item.certStatus)}">${certStatusMap[item.certStatus]}</span></td>`;
        }
        
        // 澄清进度列
        rowHtml += `<td><span class="status-tag ${getClarifyStatusClass(item.clarifyStatus)}">${clarifyStatusMap[item.clarifyStatus]}</span></td>`;
        
        // 税率和管制相关列
        rowHtml += `
            <td>${item.taxRate}</td>
            <td>${item.isControlled === null ? '-' : (item.isControlled ? '是' : '否')}</td>
            <td class="cert-cell">${renderCertCell(item.controlCerts)}</td>
            <td>${item.controlRemark || '-'}</td>
        `;
        
        // 认证相关列（中国/越南隐藏）
        if (!isRestricted) {
            rowHtml += `
                <td class="cert-col">${item.isCertified === null ? '-' : (item.isCertified ? '是' : '否')}</td>
                <td class="cert-col cert-cell">${renderCertCell(item.certCerts)}</td>
                <td class="cert-col">${item.certRemark || '-'}</td>
                <td class="cert-col inconsistent-cell">${renderInconsistentTips(item.inconsistentTips)}</td>
            `;
        }
        
        // 剩余列
        rowHtml += `
            <td>${item.assessRemark || '-'}</td>
            <td>${item.vendor || '未分配'}</td>
            <td>${item.hasOrder ? '是' : '否'}</td>
            <td>${item.weight}</td>
            <td>${item.dimensions}</td>
            <td>${item.weightSource}</td>
            <td>${item.brandLimit}</td>
            <td>${item.brandName}</td>
            <td>${item.category}</td>
            <td>${item.productStatus}</td>
            <td>${item.enName}</td>
            <td>${item.localDeclare}</td>
            <td>${item.creator}</td>
            <td>${item.createTime}</td>
            <td>${item.updater}</td>
            <td>${item.updateTime}</td>
        `;
        
        trMain.innerHTML = rowHtml;
        tbodyMain.appendChild(trMain);
        
        // 右侧操作列
        const trRight = document.createElement('tr');
        trRight.innerHTML = `<td class="action-buttons">${renderActionButtons(item)}</td>`;
        tbodyRight.appendChild(trRight);
    });
}

// 获取状态样式类
function getStatusClass(status) {
    switch(status) {
        case 1: return 'status-pending';
        case 2: return 'status-confirming';
        case 3: return 'status-done';
        default: return '';
    }
}

// 获取澄清状态样式类
function getClarifyStatusClass(status) {
    switch(status) {
        case 0: return 'clarify-none';
        case 10: return 'clarify-pending';
        case 20: return 'clarify-replied';
        case 30: return 'clarify-done';
        default: return '';
    }
}

// 渲染不一致提示 - 使用红色警告样式
function renderInconsistentTips(tips) {
    if (!tips) return '-';
    // 将多个提示分行显示
    const tipList = tips.split(';').filter(t => t.trim());
    if (tipList.length === 0) return '-';
    return tipList.map(tip => `<div class="inconsistent-tip-item">⚠ ${tip.trim()}</div>`).join('');
}

// 渲染证书单元格 - 根据判断方显示不同格式
function renderCertCell(certs) {
    if (!certs || certs.length === 0) return '-';
    return certs.map(cert => {
        const judgeClass = cert.judge === 1 ? 'judge-customs' : 
                          (cert.judge === 2 ? 'judge-sales' : 
                          (cert.judge === 3 ? 'judge-library' : 
                          (cert.judge === 0 ? 'judge-forbidden' : '')));
        
        // 根据判断方生成不同的标签文本
        let judgeLabel = '';
        let statusHtml = '';
        
        if (cert.judge === 1) {
            // 关务判断：需要显示办理状态
            judgeLabel = '关务判断';
            if (cert.handleStatus !== undefined) {
                statusHtml = cert.handleStatus === 1 
                    ? '<span class="handle-tag can-handle">可办理</span>' 
                    : '<span class="handle-tag cannot-handle">无法办理</span>';
            }
        } else if (cert.judge === 2) {
            // 采销判断：不需要显示办理状态
            judgeLabel = '采销判断';
        } else if (cert.judge === 3) {
            // 证书库判断：不需要显示办理状态
            judgeLabel = '证书库判断';
        } else if (cert.judge === 0) {
            judgeLabel = '不可进出口';
        }
        
        return `
            <div class="cert-tag-item">
                <span class="cert-name-tag">${cert.name}</span>
                <span class="cert-judge-label ${judgeClass}">${judgeLabel}</span>
                ${statusHtml}
            </div>
        `;
    }).join('');
}

// 渲染操作按钮 - 一行两个，超过4个(2x2)用...折叠
function renderActionButtons(item) {
    const isRestricted = restrictedCountries.includes(item.country);
    const config = viewTabConfig[currentViewTab];
    let buttons = [];
    
    // 取消评估按钮（待评估状态可用）
    if (item.customsStatus === 1 && item.certStatus === 1) {
        buttons.push({ text: '取消评估', action: `cancelAssess(${item.id})` });
    }
    
    // 分配服务商（关务待评估且未分配时可用，关务评估后消失）
    if (item.customsStatus === 1 && !config.hideRowButtons.includes('btnAssignVendor')) {
        buttons.push({ text: '分配服务商', action: `openAssignVendorSingle(${item.id})` });
    }
    
    // 关务评估（待评估状态）
    if (item.customsStatus === 1 && !config.hideRowButtons.includes('btnCustomsAssess')) {
        buttons.push({ text: '关务评估', action: `openCustomsAssess(${item.id})` });
    }
    
    // 关务确认（待确认状态）
    if (item.customsStatus === 2 && !config.hideRowButtons.includes('btnCustomsConfirm')) {
        buttons.push({ text: '关务确认', action: `customsConfirm(${item.id})` });
    }
    
    // 关务修改（已评估状态）
    if (item.customsStatus === 3) {
        buttons.push({ text: '关务修改', action: `openCustomsModify(${item.id})` });
    }
    
    // 认证相关按钮（非中国/越南）
    if (!isRestricted) {
        // 认证评估（待评估状态）
        if (item.certStatus === 1 && !config.hideRowButtons.includes('btnCertAssess')) {
            buttons.push({ text: '认证评估', action: `openCertAssess(${item.id})` });
        }
        
        // 认证确认（待确认状态）
        if (item.certStatus === 2 && !config.hideRowButtons.includes('btnCertConfirm')) {
            buttons.push({ text: '认证确认', action: `certConfirm(${item.id})` });
        }
        
        // 认证修改（已评估状态）
        if (item.certStatus === 3) {
            buttons.push({ text: '认证修改', action: `openCertModify(${item.id})` });
        }
    }
    
    // 详情按钮
    buttons.push({ text: '详情', action: `openDetail(${item.id})` });
    
    // 一行两个，最多显示4个按钮(2x2)，超过的用...折叠
    const maxVisible = 4;
    let html = '<div class="action-buttons-grid">';
    
    if (buttons.length <= maxVisible) {
        // 全部显示
        buttons.forEach(btn => {
            html += `<button class="btn btn-text" onclick="${btn.action}">${btn.text}</button>`;
        });
    } else {
        // 显示前3个 + ...按钮（占第4个位置）
        for (let i = 0; i < 3; i++) {
            html += `<button class="btn btn-text" onclick="${buttons[i].action}">${buttons[i].text}</button>`;
        }
        // ...按钮和下拉菜单
        const dropdownId = `dropdown_${item.id}`;
        html += `<div class="action-dropdown">
            <button class="action-more-btn" onclick="toggleActionDropdown('${dropdownId}')">...</button>
            <div class="action-dropdown-menu" id="${dropdownId}">`;
        for (let i = 3; i < buttons.length; i++) {
            html += `<button class="btn btn-text" onclick="${buttons[i].action}">${buttons[i].text}</button>`;
        }
        html += '</div></div>';
    }
    
    html += '</div>';
    return html;
}

// 切换操作按钮下拉菜单
function toggleActionDropdown(dropdownId) {
    event.stopPropagation();
    // 关闭其他下拉菜单
    document.querySelectorAll('.action-dropdown-menu.show').forEach(menu => {
        if (menu.id !== dropdownId) {
            menu.classList.remove('show');
        }
    });
    // 切换当前菜单
    const menu = document.getElementById(dropdownId);
    if (menu) {
        menu.classList.toggle('show');
    }
}

// 点击外部关闭操作下拉菜单
document.addEventListener('click', function(e) {
    if (!e.target.closest('.action-dropdown')) {
        document.querySelectorAll('.action-dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// 过滤数据 - 根据查询条件筛选
function filterData() {
    let data = assessmentData.filter(item => item.country === currentCountry);
    
    // 获取查询条件
    const intlSku = document.getElementById('searchIntlSku')?.value?.trim();
    const domSku = document.getElementById('searchDomSku')?.value?.trim();
    const hsCode = document.getElementById('searchHsCode')?.value?.trim();
    const source = document.getElementById('searchSource')?.value;
    const createTimeStart = document.getElementById('createTimeStart')?.value;
    const createTimeEnd = document.getElementById('createTimeEnd')?.value;
    const taskNo = document.getElementById('searchTaskNo')?.value?.trim();
    const deadlineStart = document.getElementById('deadlineStart')?.value;
    const deadlineEnd = document.getElementById('deadlineEnd')?.value;
    const customsStatus = document.getElementById('searchCustomsStatus')?.value;
    const certStatus = document.getElementById('searchCertStatus')?.value;
    const hasOrder = document.getElementById('searchHasOrder')?.value;
    const vendor = document.getElementById('searchVendor')?.value;
    const creator = document.getElementById('searchCreator')?.value?.trim();
    const clarifyErp = document.getElementById('searchClarifyErp')?.value?.trim();
    
    // 应用筛选条件
    if (intlSku) {
        const skus = intlSku.split(',').map(s => s.trim().toUpperCase());
        data = data.filter(item => skus.some(sku => item.intlSku.toUpperCase().includes(sku)));
    }
    
    if (domSku) {
        const skus = domSku.split(',').map(s => s.trim().toUpperCase());
        data = data.filter(item => skus.some(sku => item.domSku.toUpperCase().includes(sku)));
    }
    
    if (hsCode) {
        data = data.filter(item => item.hsCode.includes(hsCode));
    }
    
    if (source) {
        data = data.filter(item => item.source === source);
    }
    
    if (createTimeStart) {
        data = data.filter(item => item.createTime >= createTimeStart);
    }
    
    if (createTimeEnd) {
        data = data.filter(item => item.createTime <= createTimeEnd + ' 23:59:59');
    }
    
    if (taskNo) {
        data = data.filter(item => item.taskNo && item.taskNo.toUpperCase().includes(taskNo.toUpperCase()));
    }
    
    if (deadlineStart) {
        data = data.filter(item => item.deadline >= deadlineStart);
    }
    
    if (deadlineEnd) {
        data = data.filter(item => item.deadline <= deadlineEnd);
    }
    
    if (customsStatus) {
        data = data.filter(item => item.customsStatus === parseInt(customsStatus));
    }
    
    if (certStatus) {
        data = data.filter(item => item.certStatus === parseInt(certStatus));
    }
    
    if (hasOrder !== '') {
        data = data.filter(item => item.hasOrder === (hasOrder === '1'));
    }
    
    if (vendor) {
        if (vendor === '未分配') {
            data = data.filter(item => !item.vendor);
        } else {
            data = data.filter(item => item.vendor === vendor);
        }
    }
    
    if (creator) {
        data = data.filter(item => item.creator.includes(creator));
    }
    
    // 澄清人ERP筛选
    if (clarifyErp) {
        data = data.filter(item => item.clarifyErp && item.clarifyErp.toLowerCase().includes(clarifyErp.toLowerCase()));
    }
    
    // 澄清进度筛选
    if (selectedClarifyStatus.length > 0) {
        data = data.filter(item => selectedClarifyStatus.includes(item.clarifyStatus));
    }
    
    // 应用视图TAB的默认过滤器
    const config = viewTabConfig[currentViewTab];
    if (config && config.defaultFilters) {
        if (config.defaultFilters.clarifyStatusNot !== undefined) {
            data = data.filter(item => item.clarifyStatus !== config.defaultFilters.clarifyStatusNot);
        }
        if (config.defaultFilters.vendorNot !== undefined) {
            data = data.filter(item => item.vendor && item.vendor !== config.defaultFilters.vendorNot);
        }
    }
    
    // 排序逻辑
    const sortFieldValue = document.getElementById('searchSortField')?.value || 'createTime-asc';
    let [sortField, sortOrder] = sortFieldValue.split('-');
    // 字段映射
    const fieldMap = {
        createTime: 'createTime',
        deadline: 'deadline',
        updateTime: 'updateTime',
        hsCode: 'hsCode',
        title: 'cnName',
        localName: 'localName'
    };
    sortField = fieldMap[sortField] || 'createTime';
    sortOrder = sortOrder || 'asc';
    data = data.slice().sort((a, b) => {
        let va = a[sortField] || '';
        let vb = b[sortField] || '';
        // 日期字段特殊处理
        if (["createTime","deadline","updateTime"].includes(sortField)) {
            va = va.replace(/[- :]/g, '');
            vb = vb.replace(/[- :]/g, '');
        }
        if (va < vb) return sortOrder === 'asc' ? -1 : 1;
        if (va > vb) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    return data;
}

// 全选/取消全选
function toggleCheckAll() {
    const checkAll = document.getElementById('checkAll');
    const checkboxes = document.querySelectorAll('.item-check');
    
    checkboxes.forEach(cb => {
        cb.checked = checkAll.checked;
        const id = parseInt(cb.dataset.id);
        if (checkAll.checked) {
            if (!selectedItems.includes(id)) selectedItems.push(id);
        } else {
            selectedItems = [];
        }
    });
    
    updateBatchButtonsState();
}

// 切换单个选中
function toggleItemCheck(id) {
    const index = selectedItems.indexOf(id);
    if (index > -1) {
        selectedItems.splice(index, 1);
    } else {
        selectedItems.push(id);
    }
    updateBatchButtonsState();
}

// 更新批量按钮状态
function updateBatchButtonsState() {
    const countEl = document.getElementById('selectedCount');
    if (countEl) {
        countEl.textContent = selectedItems.length;
    }
    
    // 获取选中商品的数据
    const selectedData = mockData.filter(item => selectedItems.includes(item.id));
    
    // 按钮引用
    const btnCustomsAssess = document.getElementById('btnBatchCustomsAssess');
    const btnCustomsConfirm = document.getElementById('btnBatchCustomsConfirm');
    const btnCustomsModify = document.getElementById('btnBatchCustomsModify');
    const btnCertAssess = document.getElementById('btnBatchCertAssess');
    const btnCertConfirm = document.getElementById('btnBatchCertConfirm');
    const btnCertModify = document.getElementById('btnBatchCertModify');
    
    // 默认全部变白（未满足条件）
    const allBtns = [btnCustomsAssess, btnCustomsConfirm, btnCustomsModify, btnCertAssess, btnCertConfirm, btnCertModify];
    allBtns.forEach(btn => {
        if (btn) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        }
    });
    
    if (selectedData.length === 0) {
        return;
    }
    
    // 检查条件：所有选中项都满足某个条件时，对应按钮变蓝
    
    // 关务评估：关务评估状态=待评估(1)，澄清状态<>待采销回复(10)
    const canCustomsAssess = selectedData.every(item => 
        item.customsStatus === 1 && item.clarifyStatus !== 10
    );
    if (canCustomsAssess && btnCustomsAssess) {
        btnCustomsAssess.classList.remove('btn-secondary');
        btnCustomsAssess.classList.add('btn-primary');
    }
    
    // 关务确认：关务评估状态=待确认(2)，澄清状态<>待采销回复(10)
    const canCustomsConfirm = selectedData.every(item => 
        item.customsStatus === 2 && item.clarifyStatus !== 10
    );
    if (canCustomsConfirm && btnCustomsConfirm) {
        btnCustomsConfirm.classList.remove('btn-secondary');
        btnCustomsConfirm.classList.add('btn-primary');
    }
    
    // 关务修改：关务评估状态=已评估(3)
    const canCustomsModify = selectedData.every(item => 
        item.customsStatus === 3
    );
    if (canCustomsModify && btnCustomsModify) {
        btnCustomsModify.classList.remove('btn-secondary');
        btnCustomsModify.classList.add('btn-primary');
    }
    
    // 认证评估：认证评估状态=待评估(1)，澄清状态<>待采销回复(10)
    const canCertAssess = selectedData.every(item => 
        item.certStatus === 1 && item.clarifyStatus !== 10
    );
    if (canCertAssess && btnCertAssess) {
        btnCertAssess.classList.remove('btn-secondary');
        btnCertAssess.classList.add('btn-primary');
    }
    
    // 认证确认：认证评估状态=待确认(2)，澄清状态<>待采销回复(10)
    const canCertConfirm = selectedData.every(item => 
        item.certStatus === 2 && item.clarifyStatus !== 10
    );
    if (canCertConfirm && btnCertConfirm) {
        btnCertConfirm.classList.remove('btn-secondary');
        btnCertConfirm.classList.add('btn-primary');
    }
    
    // 认证修改：认证评估状态=已评估(3)
    const canCertModify = selectedData.every(item => 
        item.certStatus === 3
    );
    if (canCertModify && btnCertModify) {
        btnCertModify.classList.remove('btn-secondary');
        btnCertModify.classList.add('btn-primary');
    }
}

// 重置搜索
function resetSearch() {
    document.querySelectorAll('.search-panel input, .search-panel select').forEach(el => {
        if (el.type === 'date' || el.type === 'text') {
            el.value = '';
        } else if (el.tagName === 'SELECT') {
            el.selectedIndex = 0;
        }
    });
    renderTable();
    // 排序字段变化时自动查询
    const sortField = document.getElementById('searchSortField');
    if (sortField) {
        sortField.addEventListener('change', searchData);
    }
}

// 搜索
function searchData() {
    renderTable();
}

// 导出
function exportData() {
    alert('导出功能');
}

// 打开导入弹窗
function openImportModal() {
    document.getElementById('importModal').classList.add('show');
}

function closeImportModal() {
    document.getElementById('importModal').classList.remove('show');
}

function submitImport() {
    alert('导入成功！新增商品将进入待评估状态。');
    closeImportModal();
}

// 分配服务商
function openAssignVendorModal() {
    if (selectedItems.length === 0) {
        alert('请先选择商品');
        return;
    }
    document.getElementById('selectedCount').textContent = selectedItems.length;
    document.getElementById('assignVendorModal').classList.add('show');
}

function openAssignVendorSingle(id) {
    selectedItems = [id];
    document.getElementById('selectedCount').textContent = 1;
    document.getElementById('assignVendorModal').classList.add('show');
}

function closeAssignVendorModal() {
    document.getElementById('assignVendorModal').classList.remove('show');
}

function submitAssignVendor() {
    const vendor = document.getElementById('assignVendorSelect').value;
    if (!vendor) {
        alert('请选择服务商');
        return;
    }
    // 更新数据
    selectedItems.forEach(id => {
        const item = assessmentData.find(d => d.id === id);
        if (item) item.vendor = vendor;
    });
    alert('分配成功');
    closeAssignVendorModal();
    selectedItems = [];
    renderTable();
}

// 批量关务评估
function openBatchCustomsAssess() {
    if (selectedItems.length === 0) {
        alert('请先选择商品');
        return;
    }
    // 跳转到评估页面
    window.location.href = `assess-customs.html?ids=${selectedItems.join(',')}`;
}

// 批量关务确认
function batchCustomsConfirm() {
    if (selectedItems.length === 0) {
        alert('请先选择商品');
        return;
    }
    if (confirm('确认批量关务确认吗？')) {
        selectedItems.forEach(id => {
            const item = assessmentData.find(d => d.id === id);
            if (item && item.customsStatus === 2) {
                item.customsStatus = 3;
            }
        });
        alert('确认成功');
        selectedItems = [];
        renderTable();
    }
}

// 批量认证评估
function openBatchCertAssess() {
    if (selectedItems.length === 0) {
        alert('请先选择商品');
        return;
    }
    window.location.href = `assess-cert.html?ids=${selectedItems.join(',')}`;
}

// 批量认证确认
function batchCertConfirm() {
    if (selectedItems.length === 0) {
        alert('请先选择商品');
        return;
    }
    if (confirm('确认批量认证确认吗？')) {
        selectedItems.forEach(id => {
            const item = assessmentData.find(d => d.id === id);
            if (item && item.certStatus === 2) {
                item.certStatus = 3;
            }
        });
        alert('确认成功');
        selectedItems = [];
        renderTable();
    }
}

// 批量关务修改
function batchCustomsModify() {
    if (selectedItems.length === 0) {
        alert('请先选择商品');
        return;
    }
    window.location.href = `assess-customs.html?ids=${selectedItems.join(',')}&mode=modify`;
}

// 批量认证修改
function batchCertModify() {
    if (selectedItems.length === 0) {
        alert('请先选择商品');
        return;
    }
    window.location.href = `assess-cert.html?ids=${selectedItems.join(',')}&mode=modify`;
}

// 单个操作
function cancelAssess(id) {
    if (confirm('确认取消评估吗？')) {
        alert('已取消评估');
        renderTable();
    }
}

function openCustomsAssess(id) {
    window.location.href = `assess-customs.html?id=${id}`;
}

function openCustomsModify(id) {
    window.location.href = `assess-customs.html?id=${id}&mode=modify`;
}

function customsConfirm(id) {
    if (confirm('确认关务确认吗？')) {
        const item = assessmentData.find(d => d.id === id);
        if (item) {
            item.customsStatus = 3;
        }
        alert('确认成功');
        renderTable();
    }
}

function openCertAssess(id) {
    window.location.href = `assess-cert.html?id=${id}`;
}

function openCertModify(id) {
    window.location.href = `assess-cert.html?id=${id}&mode=modify`;
}

function certConfirm(id) {
    if (confirm('确认认证确认吗？')) {
        const item = assessmentData.find(d => d.id === id);
        if (item) {
            item.certStatus = 3;
        }
        alert('确认成功');
        renderTable();
    }
}

function openDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

// 关闭弹窗
function closeBatchAssessModal() {
    document.getElementById('batchAssessModal').classList.remove('show');
}

// 点击外部关闭弹窗
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
    // 点击外部关闭TAB下拉
    if (!event.target.closest('.view-tabs')) {
        document.getElementById('tabDropdown').classList.remove('show');
        document.querySelectorAll('.dropdown-arrow').forEach(a => a.classList.remove('open'));
    }
}
