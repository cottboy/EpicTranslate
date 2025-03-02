/**
 * 生成 NOTICE.md 文件的脚本
 * 自动检测项目依赖并生成第三方软件声明
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 执行 license-checker 命令获取依赖信息
exec('npx license-checker --json', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`命令错误: ${stderr}`);
    return;
  }
  
  try {
    // 解析 JSON 输出
    const data = JSON.parse(stdout);
    
    // 创建 NOTICE.md 内容
    let notice = '# 第三方软件声明\n\n';
    notice += '本项目使用了以下开源软件：\n\n';
    
    // 手动添加 Node.js
    notice += `## Node.js\n`;
    notice += `许可证: MIT\n`;
    notice += `网址: https://nodejs.org/\n\n`;
    notice += `### 许可证文本\n\n`;
    notice += '```\n';
    notice += `Copyright Node.js contributors. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
`;
    notice += '```\n\n';
    
    // 按名称排序依赖
    const sortedDeps = Object.entries(data).sort((a, b) => {
      const nameA = a[0].split('@')[0].toLowerCase();
      const nameB = b[0].split('@')[0].toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    // 遍历所有依赖
    for (const [pkg, info] of sortedDeps) {
      // 提取包名和版本
      const pkgParts = pkg.split('@');
      const name = pkgParts[0];
      
      // 跳过项目自身和重复的包
      if (name === 'nodejs' || name === 'epic-translate') continue;
      
      // 处理 @scope/package 格式的包名
      const version = name.startsWith('@') ? pkgParts[2] : pkgParts[1];
      
      notice += `## ${name}\n`;
      notice += `版本: ${version}\n`;
      notice += `许可证: ${info.licenses}\n`;
      
      if (info.repository) {
        // 确保仓库 URL 是完整的
        let repoUrl = info.repository;
        if (repoUrl.startsWith('git+')) {
          repoUrl = repoUrl.substring(4);
        }
        if (repoUrl.endsWith('.git')) {
          repoUrl = repoUrl.substring(0, repoUrl.length - 4);
        }
        notice += `网址: ${repoUrl}\n`;
      }
      
      // 添加许可证文本（如果有）
      if (info.licenseFile && fs.existsSync(info.licenseFile)) {
        notice += '\n### 许可证文本\n\n';
        notice += '```\n';
        const licenseText = fs.readFileSync(info.licenseFile, 'utf8');
        // 直接添加完整的许可证文本，不做长度限制
        notice += licenseText;
        notice += '```\n';
      }
      
      notice += '\n';
    }
    
    // 添加项目自身的许可证信息
    notice += '---\n\n';
    notice += '# 本项目许可证\n\n';
    notice += '本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。\n';
    
    // 写入文件
    fs.writeFileSync('NOTICE.md', notice);
    console.log('✅ NOTICE.md 文件已成功生成');
    
  } catch (parseError) {
    console.error('解析 JSON 出错:', parseError);
    console.error('原始输出:', stdout);
  }
});