// API请求函数
export async function apiRequest(method: string, url: string, data?: any) {
  const yaotuToken = localStorage.getItem('yaotu_token');
  
  // Use relative path - Vite proxy will forward to https://ahhh-yaotu.onrender.com
  const fullUrl = url.startsWith('http') ? url : url;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(yaotuToken && { 'Authorization': `Bearer ${yaotuToken}` })
    }
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(fullUrl, config);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
