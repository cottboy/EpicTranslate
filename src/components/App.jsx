import React, { useState, useEffect } from 'react'
import { Settings } from './Settings'
const Store = require('electron-store')
const store = new Store()

function App() {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [apiUrl, setApiUrl] = useState(store.get('apiUrl') || '')
  const [showSettings, setShowSettings] = useState(false)

  const handleTranslate = async () => {
    if (!apiUrl || !sourceText) return

    try {
      const response = await fetch(`${apiUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          source_lang: 'auto',
          target_lang: 'ZH'
        })
      })
      
      const data = await response.json()
      setTranslatedText(data.data)
    } catch (error) {
      console.error('翻译失败:', error)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>EpicTranslate</h1>
        <button onClick={() => setShowSettings(true)}>设置</button>
      </div>
      
      <div className="translation-area">
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="请输入要翻译的文本"
        />
        <textarea
          value={translatedText}
          readOnly
          placeholder="翻译结果"
        />
      </div>

      <button onClick={handleTranslate}>翻译</button>

      {showSettings && (
        <Settings
          apiUrl={apiUrl}
          setApiUrl={setApiUrl}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App 