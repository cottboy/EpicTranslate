import React, { useState } from 'react'
const Store = require('electron-store')
const store = new Store()

export function Settings({ apiUrl, setApiUrl, onClose }) {
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl)

  const handleSave = () => {
    setApiUrl(tempApiUrl)
    store.set('apiUrl', tempApiUrl)
    onClose()
  }

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <h2>设置</h2>
        <div>
          <label>DeepLX API 地址:</label>
          <input
            type="text"
            value={tempApiUrl}
            onChange={(e) => setTempApiUrl(e.target.value)}
            placeholder="例如: http://localhost:1188"
          />
        </div>
        <div className="buttons">
          <button onClick={handleSave}>保存</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  )
} 