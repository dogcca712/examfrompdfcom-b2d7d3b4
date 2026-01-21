# 调试指南：Failed to fetch 错误

## 快速检查清单

### 1. 检查用户是否已登录
- 打开浏览器开发者工具 (F12)
- 进入 Application/Storage 标签
- 查看 Local Storage
- 确认是否有 `access_token` 键值对
- **如果没有 token，请先登录**

### 2. 检查网络请求
- 打开浏览器开发者工具 (F12)
- 进入 Network 标签
- 尝试上传 PDF
- 找到失败的请求（通常是 `/generate`）
- 检查：
  - **Request URL**: 是否正确（应该是 `https://api.examfrompdf.com/generate`）
  - **Request Headers**: 是否包含 `Authorization: Bearer <token>`
  - **Status Code**: 是什么状态码？
  - **Response**: 查看响应内容

### 3. 常见错误及解决方案

#### 错误：Network error: Unable to connect
**可能原因：**
- 后端服务未运行
- 网络连接问题
- API_BASE URL 配置错误

**解决方案：**
```bash
# 在服务器上检查服务状态
sudo systemctl status examgen

# 检查服务日志
journalctl -u examgen -n 50 --no-pager

# 重启服务
sudo systemctl restart examgen
```

#### 错误：CORS policy
**可能原因：**
- 前端域名不在后端允许列表中

**解决方案：**
- 检查前端域名是否在 `ALLOWED_ORIGINS` 中
- 联系后端开发者添加你的域名

#### 错误：401 Unauthorized
**可能原因：**
- Token 过期或无效
- 未发送 Authorization header

**解决方案：**
- 重新登录获取新 token
- 检查 localStorage 中的 token

#### 错误：404 Not Found
**可能原因：**
- API 端点路径错误
- 后端路由未配置

**解决方案：**
- 检查 `API_BASE` 环境变量
- 确认后端 `/generate` 端点存在

### 4. 环境变量检查

确认前端环境变量配置：
```bash
# 检查 .env 文件或环境变量
VITE_API_BASE_URL=https://api.examfrompdf.com
```

### 5. 浏览器控制台检查

打开浏览器控制台 (F12 > Console)，查看是否有：
- JavaScript 错误
- 网络错误信息
- CORS 错误

### 6. 测试后端连接

在浏览器控制台运行：
```javascript
// 测试后端健康检查
fetch('https://api.examfrompdf.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// 测试认证端点（需要先登录）
const token = localStorage.getItem('access_token');
fetch('https://api.examfrompdf.com/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## 获取帮助

如果以上步骤都无法解决问题，请提供以下信息：

1. **浏览器控制台错误**（截图或复制文本）
2. **Network 标签中的请求详情**（特别是失败的请求）
3. **后端日志**（如果可访问）
4. **前端域名和 API_BASE URL**

