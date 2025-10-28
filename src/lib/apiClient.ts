// 统一的API客户端模块
// 支持环境自动切换和集中配置

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname.includes("localhost")
    ? "" // 本地开发使用相对路径，通过Vite代理
    : window.location.hostname.includes("ahhh-yaotu.com")
    ? "https://ahhh-yaotu.onrender.com" // 如果域名是ahhh-yaotu.com，使用Render API
    : "https://ahhh-yaotu.onrender.com"); // 默认使用Render API

console.log("🌐 API Base URL:", API_BASE);

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE}${path}`;
  
  console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
  
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.error("❌ Invalid JSON response:", err);
    console.error("Response text:", await res.text());
    throw new Error(`Invalid JSON from ${path}`);
  }

  if (!res.ok) {
    console.error(`❌ API Error: ${res.status} ${res.statusText}`, data);
    throw new Error(data?.error || data?.message || `API ${res.status}`);
  }
  
  console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
  return data;
}

// 便捷方法
export const api = {
  get: (path: string, options?: RequestInit) => 
    apiFetch(path, { ...options, method: 'GET' }),
  
  post: (path: string, data?: any, options?: RequestInit) => 
    apiFetch(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: (path: string, data?: any, options?: RequestInit) => 
    apiFetch(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: (path: string, options?: RequestInit) => 
    apiFetch(path, { ...options, method: 'DELETE' }),
  
  patch: (path: string, data?: any, options?: RequestInit) => 
    apiFetch(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
};

// 带认证的API调用
export async function authenticatedApiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('yaotu_token');
  
  return apiFetch(path, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
}

// 带认证的便捷方法
export const authApi = {
  get: (path: string, options?: RequestInit) => 
    authenticatedApiFetch(path, { ...options, method: 'GET' }),
  
  post: (path: string, data?: any, options?: RequestInit) => 
    authenticatedApiFetch(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: (path: string, data?: any, options?: RequestInit) => 
    authenticatedApiFetch(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: (path: string, options?: RequestInit) => 
    authenticatedApiFetch(path, { ...options, method: 'DELETE' }),
  
  patch: (path: string, data?: any, options?: RequestInit) => 
    authenticatedApiFetch(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  // 文件上传方法
  upload: async (path: string, formData: FormData, options?: RequestInit) => {
    const token = localStorage.getItem('yaotu_token');
    const url = `${API_BASE}${path}`;
    
    console.log(`📤 File Upload: POST ${url}`);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options?.headers || {}),
      },
      body: formData,
      ...options,
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("❌ Invalid JSON response:", err);
      throw new Error(`Invalid JSON from ${path}`);
    }

    if (!res.ok) {
      console.error(`❌ Upload Error: ${res.status} ${res.statusText}`, data);
      throw new Error(data?.error || data?.message || `Upload failed: ${res.status}`);
    }
    
    console.log(`✅ Upload Success: POST ${url}`);
    return data;
  },
};
