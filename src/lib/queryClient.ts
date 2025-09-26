// API请求函数
export async function apiRequest(method: string, url: string, data?: any) {
  const yaotuToken = localStorage.getItem('yaotu_token');
  
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

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
