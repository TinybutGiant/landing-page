const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 模拟数据库存储（实际项目中应该连接真实数据库）
let applications = [];
let applicationIdCounter = 1;

// 兼容包内使用的 v2 路径
// 兼容任何动词保存草稿（PUT/POST from client libs）
app.all('/api/v2/guide-applications/draft', (req, res) => {
  try {
    console.log('[draft] method=%s body=%j', req.method, req.body);
    const payload = (req.body && Object.keys(req.body).length ? req.body : {}) || {};
    // 如果有 id 则更新，否则创建
    if (payload.id) {
      const idx = applications.findIndex(a => a.id === Number(payload.id));
      if (idx >= 0) {
        applications[idx] = { ...applications[idx], ...payload };
        return res.json({ application: applications[idx] });
      }
    }

    const application = {
      id: applicationIdCounter++,
      status: 'draft',
      savedAt: new Date().toISOString(),
      ...payload,
    };
    applications.push(application);
    return res.json({ application });
  } catch (e) {
    console.error('Draft save error', e);
    return res.status(500).json({ message: 'Draft save failed' });
  }
});

// v2 提交创建
app.post('/api/v2/guide-applications', (req, res) => {
  try {
    console.log('[submit:create] body=%j', req.body);
    const payload = req.body || {};
    const application = {
      id: applicationIdCounter++,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ...payload,
    };
    applications.push(application);
    return res.status(201).json({ success: true, application });
  } catch (e) {
    console.error('Submit v2 error', e);
    return res.status(500).json({ message: 'Submit failed' });
  }
});

// v2 更新提交
app.put('/api/v2/guide-applications/:id', (req, res) => {
  try {
    console.log('[submit:update] id=%s body=%j', req.params.id, req.body);
    const id = Number(req.params.id);
    const idx = applications.findIndex(a => a.id === id);
    if (idx < 0) return res.status(404).json({ message: 'Application not found' });
    applications[idx] = { ...applications[idx], ...req.body, status: 'pending' };
    return res.json({ success: true, application: applications[idx] });
  } catch (e) {
    console.error('Update v2 error', e);
    return res.status(500).json({ message: 'Update failed' });
  }
});

// 申请成为导游的 API 端点
app.post('/api/guide-applications', (req, res) => {
  try {
    const {
      name,
      age,
      email,
      phone,
      city,
      bio,
      experience,
      languages,
      availability,
      motivation
    } = req.body;

    // 基本验证
    if (!name || !age || !email || !phone || !city || !bio || !experience || !languages || !availability || !motivation) {
      return res.status(400).json({
        error: '请填写所有必填字段',
        message: '所有带 * 号的字段都是必填的'
      });
    }

    // 年龄验证
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      return res.status(400).json({
        error: '年龄必须在 18-120 岁之间'
      });
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: '邮箱格式不正确'
      });
    }

    // 创建申请记录
    const application = {
      id: applicationIdCounter++,
      name,
      age: ageNum,
      email,
      phone,
      city,
      bio,
      experience,
      languages,
      availability,
      motivation,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    // 存储到模拟数据库
    applications.push(application);

    console.log('新的导游申请:', {
      applicationId: application.applicationId,
      name: application.name,
      email: application.email,
      city: application.city,
      submittedAt: application.submittedAt
    });

    // 返回成功响应
    res.status(201).json({
      success: true,
      message: '申请提交成功！我们将在1-3个工作日内联系您。',
      applicationId: application.applicationId,
      application: {
        id: application.id,
        name: application.name,
        email: application.email,
        city: application.city,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });

  } catch (error) {
    console.error('处理申请时出错:', error);
    res.status(500).json({
      error: '服务器内部错误',
      message: '请稍后重试'
    });
  }
});

// 获取申请状态的 API 端点
app.get('/api/guide-applications/status/:applicationId', (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = applications.find(app => app.applicationId === applicationId);

    if (!application) {
      return res.status(404).json({
        error: '申请未找到',
        message: '请检查申请ID是否正确'
      });
    }

    res.json({
      applicationId: application.applicationId,
      status: application.status,
      name: application.name,
      submittedAt: application.submittedAt
    });

  } catch (error) {
    console.error('获取申请状态时出错:', error);
    res.status(500).json({
      error: '服务器内部错误'
    });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    applications: applications.length
  });
});

// 获取所有申请（管理员用）
app.get('/api/admin/applications', (req, res) => {
  try {
    // 简单的管理员验证（实际项目中应该有更安全的认证）
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'admin123') {
      return res.status(401).json({
        error: '需要管理员权限'
      });
    }

    res.json({
      applications: applications.map(app => ({
        id: app.id,
        applicationId: app.applicationId,
        name: app.name,
        email: app.email,
        city: app.city,
        status: app.status,
        submittedAt: app.submittedAt
      })),
      total: applications.length
    });

  } catch (error) {
    console.error('获取申请列表时出错:', error);
    res.status(500).json({
      error: '服务器内部错误'
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 导游申请 API 服务器运行在端口 ${PORT}`);
  console.log(`📋 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📝 申请端点: POST http://localhost:${PORT}/api/guide-applications`);
});

module.exports = app;
