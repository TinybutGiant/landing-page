// 调试代理连接的简单脚本
// 在浏览器控制台中运行此脚本来测试代理

async function testProxy() {
  console.log('🧪 开始测试代理连接...');
  
  try {
    // 测试1: 基本连接
    console.log('📡 测试1: 基本连接测试');
    const response1 = await fetch('/api/v2/guide-applications/test');
    console.log('响应状态:', response1.status);
    console.log('响应头:', Object.fromEntries(response1.headers.entries()));
    
    if (response1.ok) {
      const data = await response1.json();
      console.log('✅ 基本连接成功:', data);
    } else {
      console.log('❌ 基本连接失败:', response1.status, response1.statusText);
    }
  } catch (error) {
    console.error('❌ 基本连接测试失败:', error);
  }
  
  try {
    // 测试2: 认证端点
    console.log('📡 测试2: 认证端点测试');
    const token = localStorage.getItem('yaotu_token');
    if (!token) {
      console.log('⚠️ 没有找到认证token');
      return;
    }
    
    const response2 = await fetch('/api/v2/guide-applications/my-application', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('认证响应状态:', response2.status);
    console.log('认证响应头:', Object.fromEntries(response2.headers.entries()));
    
    if (response2.ok) {
      const data = await response2.json();
      console.log('✅ 认证连接成功:', data);
    } else if (response2.status === 404) {
      console.log('✅ 认证连接成功，用户没有申请');
    } else {
      console.log('❌ 认证连接失败:', response2.status, response2.statusText);
    }
  } catch (error) {
    console.error('❌ 认证连接测试失败:', error);
  }
  
  // 测试3: 检查请求URL
  console.log('📡 测试3: 检查请求URL');
  console.log('当前页面URL:', window.location.href);
  console.log('当前域名:', window.location.hostname);
  console.log('当前端口:', window.location.port);
  console.log('当前协议:', window.location.protocol);
}

// 运行测试
testProxy();
