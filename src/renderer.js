const Store = require('electron-store')
const store = new Store()
const { ipcRenderer } = require('electron')

// DOM 元素
const settingsBtn = document.getElementById('settingsBtn')
const settingsModal = document.getElementById('settingsModal')
const apiUrlInput = document.getElementById('apiUrlInput')
const saveBtn = document.getElementById('saveBtn')
const cancelBtn = document.getElementById('cancelBtn')
const sourceText = document.getElementById('sourceText')
const translatedText = document.getElementById('translatedText')
const translateBtn = document.getElementById('translateBtn')
const sourceLang = document.getElementById('sourceLang')
const targetLang = document.getElementById('targetLang')
const appLang = document.getElementById('appLang')

// 初始化 API URL
apiUrlInput.value = store.get('apiUrl') || ''

// 设置按钮事件
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden')
})

// 保存设置
saveBtn.addEventListener('click', () => {
    // 确保 API URL 不以斜杠结尾
    let url = apiUrlInput.value.trim()
    if (url.endsWith('/')) {
        url = url.slice(0, -1)
    }
    store.set('apiUrl', url)
    settingsModal.classList.add('hidden')
})

// 取消设置
cancelBtn.addEventListener('click', () => {
    apiUrlInput.value = store.get('apiUrl') || ''
    settingsModal.classList.add('hidden')
})

// 翻译功能
translateBtn.addEventListener('click', async () => {
    const apiUrl = store.get('apiUrl')
    if (!apiUrl || !sourceText.value) return

    try {
        const response = await fetch(`${apiUrl}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: sourceText.value,
                source_lang: sourceLang.value,
                target_lang: targetLang.value,
                alternatives: 0
            })
        })
        
        const data = await response.json()
        console.log('API 返回数据:', data)
        
        if (data.code === 200) {
            translatedText.value = data.data || '翻译失败: 未获取到翻译结果'
        } else {
            translatedText.value = `翻译失败: ${data.message || '未知错误'}`
        }
    } catch (error) {
        console.error('翻译错误:', error)
        translatedText.value = '翻译失败: ' + error.message
    }
})

// 添加语言切换事件
appLang.addEventListener('change', (e) => {
    const lang = e.target.value
    store.set('appLanguage', lang)
    updateUILanguage(lang)
})

// 初始化时加载保存的语言设置
const savedLang = store.get('appLanguage') || 'ZH'
appLang.value = savedLang
updateUILanguage(savedLang)

// 更新界面语言的函数
function updateUILanguage(lang) {
    const translations = {
        AR: {
            title: 'EpicTranslate',
            settings: 'إعدادات',
            inputPlaceholder: 'أدخل النص للترجمة',
            outputPlaceholder: 'نتيجة الترجمة',
            translateBtn: 'ترجم',
            settingsTitle: 'إعدادات',
            apiLabel: 'عنوان API:',
            apiPlaceholder: 'مثال: http://localhost:1188',
            saveBtn: 'حفظ',
            cancelBtn: 'إلغاء'
        },
        EN: {
            title: 'EpicTranslate',
            settings: 'Settings',
            inputPlaceholder: 'Enter text to translate',
            outputPlaceholder: 'Translation result',
            translateBtn: 'Translate',
            settingsTitle: 'Settings',
            apiLabel: 'API Address:',
            apiPlaceholder: 'e.g. http://localhost:1188',
            saveBtn: 'Save',
            cancelBtn: 'Cancel'
        },
        ES: {
            title: 'EpicTranslate',
            settings: 'Configuración',
            inputPlaceholder: 'Introduzca el texto a traducir',
            outputPlaceholder: 'Resultado de la traducción',
            translateBtn: 'Traducir',
            settingsTitle: 'Configuración',
            apiLabel: 'Dirección API DeepLX:',
            apiPlaceholder: 'ej: http://localhost:1188',
            saveBtn: 'Guardar',
            cancelBtn: 'Cancelar'
        },
        FR: {
            title: 'EpicTranslate',
            settings: 'Paramètres',
            inputPlaceholder: 'Entrez le texte à traduire',
            outputPlaceholder: 'Résultat de la traduction',
            translateBtn: 'Traduire',
            settingsTitle: 'Paramètres',
            apiLabel: 'Adresse API DeepLX:',
            apiPlaceholder: 'ex: http://localhost:1188',
            saveBtn: 'Enregistrer',
            cancelBtn: 'Annuler'
        },
        RU: {
            title: 'EpicTranslate',
            settings: 'Настройки',
            inputPlaceholder: 'Введите текст для перевода',
            outputPlaceholder: 'Результат перевода',
            translateBtn: 'Перевести',
            settingsTitle: 'Настройки',
            apiLabel: 'Адрес API DeepLX:',
            apiPlaceholder: 'например: http://localhost:1188',
            saveBtn: 'Сохранить',
            cancelBtn: 'Отмена'
        },
        ZH: {
            title: 'EpicTranslate',
            settings: '设置',
            inputPlaceholder: '请输入要翻译的文本',
            outputPlaceholder: '翻译结果',
            translateBtn: '翻译',
            settingsTitle: '设置',
            apiLabel: 'DeepLX API 地址:',
            apiPlaceholder: '例如: http://localhost:1188',
            saveBtn: '保存',
            cancelBtn: '取消'
        }
    }

    // 添加语言名称翻译
    const languageNames = {
        AR: {
            auto: 'الكشف التلقائي',
            AR: 'العربية',
            BG: 'البلغارية',
            CS: 'التشيكية',
            DA: 'الدنماركية',
            DE: 'الألمانية',
            EL: 'اليونانية',
            EN: 'الإنجليزية',
            ES: 'الإسبانية',
            ET: 'الإستونية',
            FI: 'الفنلندية',
            FR: 'الفرنسية',
            HU: 'المجرية',
            ID: 'الإندونيسية',
            IT: 'الإيطالية',
            JA: 'اليابانية',
            KO: 'الكورية',
            LT: 'الليتوانية',
            LV: 'اللاتفية',
            NB: 'النرويجية',
            NL: 'الهولندية',
            PL: 'البولندية',
            PT: 'البرتغالية',
            RO: 'الرومانية',
            RU: 'الروسية',
            SK: 'السلوفاكية',
            SL: 'السلوفينية',
            SV: 'السويدية',
            TR: 'التركية',
            UK: 'الأوكرانية',
            ZH: 'الصينية'
        },
        EN: {
            auto: 'Auto detect',
            AR: 'Arabic',
            BG: 'Bulgarian',
            CS: 'Czech',
            DA: 'Danish',
            DE: 'German',
            EL: 'Greek',
            EN: 'English',
            ES: 'Spanish',
            ET: 'Estonian',
            FI: 'Finnish',
            FR: 'French',
            HU: 'Hungarian',
            ID: 'Indonesian',
            IT: 'Italian',
            JA: 'Japanese',
            KO: 'Korean',
            LT: 'Lithuanian',
            LV: 'Latvian',
            NB: 'Norwegian',
            NL: 'Dutch',
            PL: 'Polish',
            PT: 'Portuguese',
            RO: 'Romanian',
            RU: 'Russian',
            SK: 'Slovak',
            SL: 'Slovenian',
            SV: 'Swedish',
            TR: 'Turkish',
            UK: 'Ukrainian',
            ZH: 'Chinese'
        },
        ES: {
            auto: 'Detectar automáticamente',
            AR: 'Árabe',
            BG: 'Búlgaro',
            CS: 'Checo',
            DA: 'Danés',
            DE: 'Alemán',
            EL: 'Griego',
            EN: 'Inglés',
            ES: 'Español',
            ET: 'Estonio',
            FI: 'Finés',
            FR: 'Francés',
            HU: 'Húngaro',
            ID: 'Indonesio',
            IT: 'Italiano',
            JA: 'Japonés',
            KO: 'Coreano',
            LT: 'Lituano',
            LV: 'Letón',
            NB: 'Noruego',
            NL: 'Neerlandés',
            PL: 'Polaco',
            PT: 'Portugués',
            RO: 'Rumano',
            RU: 'Ruso',
            SK: 'Eslovaco',
            SL: 'Esloveno',
            SV: 'Sueco',
            TR: 'Turco',
            UK: 'Ucraniano',
            ZH: 'Chino'
        },
        FR: {
            auto: 'Détecter automatiquement',
            AR: 'Arabe',
            BG: 'Bulgare',
            CS: 'Tchèque',
            DA: 'Danois',
            DE: 'Allemand',
            EL: 'Grec',
            EN: 'Anglais',
            ES: 'Espagnol',
            ET: 'Estonien',
            FI: 'Finnois',
            FR: 'Français',
            HU: 'Hongrois',
            ID: 'Indonésien',
            IT: 'Italien',
            JA: 'Japonais',
            KO: 'Coréen',
            LT: 'Lituanien',
            LV: 'Letton',
            NB: 'Norvégien',
            NL: 'Néerlandais',
            PL: 'Polonais',
            PT: 'Portugais',
            RO: 'Roumain',
            RU: 'Russe',
            SK: 'Slovaque',
            SL: 'Slovène',
            SV: 'Suédois',
            TR: 'Turc',
            UK: 'Ukrainien',
            ZH: 'Chinois'
        },
        RU: {
            auto: 'Определить автоматически',
            AR: 'Арабский',
            BG: 'Болгарский',
            CS: 'Чешский',
            DA: 'Датский',
            DE: 'Немецкий',
            EL: 'Греческий',
            EN: 'Английский',
            ES: 'Испанский',
            ET: 'Эстонский',
            FI: 'Финский',
            FR: 'Французский',
            HU: 'Венгерский',
            ID: 'Индонезийский',
            IT: 'Итальянский',
            JA: 'Японский',
            KO: 'Корейский',
            LT: 'Литовский',
            LV: 'Латышский',
            NB: 'Норвежский',
            NL: 'Нидерландский',
            PL: 'Польский',
            PT: 'Португальский',
            RO: 'Румынский',
            RU: 'Русский',
            SK: 'Словацкий',
            SL: 'Словенский',
            SV: 'Шведский',
            TR: 'Турецкий',
            UK: 'Украинский',
            ZH: 'Китайский'
        },
        ZH: {
            auto: '自动检测',
            AR: '阿拉伯语',
            BG: '保加利亚语',
            CS: '捷克语',
            DA: '丹麦语',
            DE: '德语',
            EL: '希腊语',
            EN: '英语',
            ES: '西班牙语',
            ET: '爱沙尼亚语',
            FI: '芬兰语',
            FR: '法语',
            HU: '匈牙利语',
            ID: '印尼语',
            IT: '意大利语',
            JA: '日语',
            KO: '韩语',
            LT: '立陶宛语',
            LV: '拉脱维亚语',
            NB: '挪威语',
            NL: '荷兰语',
            PL: '波兰语',
            PT: '葡萄牙语',
            RO: '罗马尼亚语',
            RU: '俄语',
            SK: '斯洛伐克语',
            SL: '斯洛文尼亚语',
            SV: '瑞典语',
            TR: '土耳其语',
            UK: '乌克兰语',
            ZH: '中文'
        }
    }

    const t = translations[lang] || translations['EN']
    const names = languageNames[lang] || languageNames['EN']
    
    // 更新所有文本
    document.title = t.title
    document.getElementById('settingsBtn').textContent = t.settings
    document.getElementById('sourceText').placeholder = t.inputPlaceholder
    document.getElementById('translatedText').placeholder = t.outputPlaceholder
    document.getElementById('translateBtn').textContent = t.translateBtn
    document.querySelector('.settings-content h2').textContent = t.settingsTitle
    document.querySelector('.settings-content label').textContent = t.apiLabel
    document.getElementById('apiUrlInput').placeholder = t.apiPlaceholder
    document.getElementById('saveBtn').textContent = t.saveBtn
    document.getElementById('cancelBtn').textContent = t.cancelBtn

    // 更新语言选择框的选项文本
    const sourceLangOptions = document.getElementById('sourceLang').options
    const targetLangOptions = document.getElementById('targetLang').options

    // 保存当前选中的值
    const sourceValue = document.getElementById('sourceLang').value
    const targetValue = document.getElementById('targetLang').value

    // 更新源语言选项
    for (let option of sourceLangOptions) {
        option.text = names[option.value]
    }

    // 更新目标语言选项
    for (let option of targetLangOptions) {
        option.text = names[option.value]
    }

    // 恢复选中的值
    document.getElementById('sourceLang').value = sourceValue
    document.getElementById('targetLang').value = targetValue
}

// 添加窗口控制
document.getElementById('minBtn').addEventListener('click', () => {
    ipcRenderer.send('window-minimize')
})

const maxBtn = document.getElementById('maxBtn')
maxBtn.addEventListener('click', () => {
    ipcRenderer.send('window-maximize')
})

// 监听窗口最大化状态变化
ipcRenderer.on('window-maximized', (event, isMaximized) => {
    maxBtn.innerHTML = isMaximized ? '&#x2750;' : '&#x2610;'
})

document.getElementById('closeBtn').addEventListener('click', () => {
    ipcRenderer.send('window-close')
}) 