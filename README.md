# 学院信息管理系统

<div align="center">

![Full Stack](https://img.shields.io/badge/Full_Stack-React%20%2B%20Rust-blue?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-React%2019.2.0-61dafb?style=flat-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-Rust%20%2B%20Actix-orange?style=flat-square&logo=rust)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=flat-square&logo=typescript)
![Database](https://img.shields.io/badge/Database-SQLite-003b57?style=flat-square&logo=sqlite)

**一个功能完整的现代化学院信息管理系统**

[项目架构](#-项目架构) • [快速开始](#-快速开始) • [功能特性](#-功能特性) • [技术栈](#-技术栈) • [API 文档](#-api-文档) • [部署指南](#-部署指南)

![系统架构图](https://img.shields.io/badge/状态-生产就绪-success)

</div>

---

## 📋 目录

- [项目简介](#-项目简介)
- [项目架构](#-项目架构)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [核心功能详解](#-核心功能详解)
- [API 文档](#-api-文档)
- [开发指南](#-开发指南)
- [部署指南](#-部署指南)
- [常见问题](#-常见问题)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

---

## 🚀 便携版下载

无需安装任何环境，双击即用的单文件 Windows 版：前往 [Releases](https://github.com/WCdivine/college-mis/releases) 下载 `CollegeMIS-portable-win64.zip`，解压后运行 `学院信息管理系统.exe` 即可（详见压缩包内「使用说明.txt」）。

---

## 📖 项目简介

**学院信息管理系统** 是一个全栈式、现代化的 Web 应用系统，专为高校学院的信息化管理设计。系统采用前后端分离架构，提供学生管理、教师管理、获奖管理、论文管理等核心功能，具有现代化的 UI 设计、完善的权限控制和优秀的用户体验。

### 系统特点

- ✨ **现代化 UI 设计** - 液态玻璃态设计语言，动态光效和流畅动画
- 🔒 **完善的权限控制** - 基于 JWT 的认证和 RBAC 权限管理
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 🚀 **高性能** - Rust 后端 + React 前端，极致性能体验
- 🎨 **优秀用户体验** - 精心设计的交互动画和视觉反馈
- 🗄️ **数据安全** - Bcrypt 密码加密，JWT Token 认证

---

## 🏗️ 项目架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                              │
│                    http://localhost:5173                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      前端应用 (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  登录页  │  │ 学生管理 │  │ 教师管理 │  │ 获奖管理 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 论文管理 │  │ 路由守卫 │  │ 状态管理 │  │ API 服务  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ Axios HTTP Client
                         │ JWT Token Authentication
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    后端服务 (Rust + Actix)                    │
│                  http://localhost:8081/api                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Auth API │  │Student API│ │Teacher API│ │ Award API │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Paper API│  │ JWT 中间件│ │ 错误处理 │ │ 日志系统 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ SQLx (Async)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据库 (SQLite)                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ students │  │ teachers │  │  awards  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐                                                  │
│  │  papers  │                                                  │
│  └──────────┘                                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ 功能特性

### 核心功能模块

#### 1. **用户认证系统** 🔐
- JWT Token 身份验证
- 自动登录状态保持
- Token 过期自动处理
- Bcrypt 密码加密
- 基于角色的访问控制（RBAC）

#### 2. **学生管理** (管理员专属) 📝
- 学生信息的增删改查
- 实时搜索（姓名、学号、院系）
- 分页展示，支持自定义每页数量
- 学号、院系、专业、入学年份管理

#### 3. **教师管理** (管理员专属) 👨‍🏫
- 教师信息的增删改查
- 实时搜索功能
- 工号、院系、职称、入职日期管理

#### 4. **获奖管理** (全员可访问) 🏆
- 获奖记录的增删改查
- 按角色过滤（学生/教师）
- 获奖级别、日期、描述管理
- 支持多种获奖类型

#### 5. **论文管理** (全员可访问) 📄
- 论文信息的增删改查
- 支持 DOI 标识符
- 多作者支持
- 期刊信息管理

### 特色功能

#### 🎨 视觉设计
- **动态粒子背景** - 登录页面多层粒子系统和数学符号装饰
- **液态玻璃态菜单** - 侧边栏菜单项带流动液态玻璃效果
- **动态光效追踪** - 背景光效随鼠标移动而变化
- **流畅页面动画** - 页面切换、元素加载精心设计的动画

#### 🎯 交互体验
- **智能菜单高亮** - 当前选中项自动高亮并平滑过渡
- **悬停反馈** - 所有可交互元素都有悬停状态反馈
- **加载状态提示** - 自定义加载动画
- **确认对话框** - 危险操作带美观确认提示

#### 🎪 彩蛋功能
- **隐藏彩蛋页面** - 连续点击 Logo 5 次触发
- **终极彩蛋页面** - 更多隐藏内容等待探索

---

## 🛠️ 技术栈

### 前端技术栈

#### 核心框架
- **[React 19.2.0](https://react.dev/)** - 用于构建用户界面的 JavaScript 库
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - 类型安全的 JavaScript 超集
- **[Vite 8.0.0](https://vitejs.dev/)** - 下一代前端构建工具

#### UI 组件与样式
- **[Ant Design 6.3.1](https://ant.design/)** - 企业级 UI 组件库
- **自定义 CSS 动画** - 精心设计的 CSS 动画和过渡效果

#### 状态管理
- **[Zustand 5.0.11](https://zustand-demo.pmnd.rs/)** - 轻量级状态管理库

#### 路由管理
- **[React Router DOM 7.13.1](https://reactrouter.com/)** - 声明式路由管理

#### HTTP 客户端
- **[Axios 1.13.6](https://axios-http.com/)** - 基于 Promise 的 HTTP 客户端

#### 其他工具库
- **[Day.js 1.11.19](https://day.js.org/)** - 轻量级日期处理库
- **[IDB 8.0.3](https://github.com/jakearchibald/idb)** - IndexedDB 封装
- **[React PDF 10.4.1](https://github.com/wojtekmaj/react-pdf)** - PDF 渲染组件

### 后端技术栈

#### 核心框架
- **[Rust](https://www.rust-lang.org/)** - 安全、快速的系统级编程语言
- **[Actix-web 4](https://actix.rs/)** - 高性能 Rust Web 框架
- **[Tokio](https://tokio.rs/)** - 异步运行时

#### 数据库
- **[SQLite](https://www.sqlite.org/)** - 轻量级嵌入式数据库
- **[SQLx 0.7](https://github.com/launchbadge/sqlx)** - 异步 SQL  crates

#### 认证与安全
- **[jsonwebtoken 9](https://github.com/Keats/jsonwebtoken)** - JWT 实现
- **[bcrypt 0.15](https://github.com/keeyipchan/bcrypt)** - 密码加密

#### 数据处理
- **[Serde 1.0](https://serde.rs/)** - 序列化/反序列化框架
- **[Chrono 0.4](https://github.com/chronotope/chrono)** - 日期时间库
- **[UUID 1.0](https://github.com/uuid-rs/uuid)** - UUID 生成

#### 日志与错误处理
- **[Tracing 0.1](https://github.com/tokio-rs/tracing)** - 异步日志和追踪
- **[Thiserror 1.0](https://github.com/dtolnay/thiserror)** - 错误处理

#### 中间件
- **[Actix-cors 0.7](https://github.com/actix/actix-extras)** - CORS 支持
- **[Dotenv 0.15](https://github.com/dotenv-rs/dotenv)** - 环境变量管理

---

## 🚀 快速开始

### 环境要求

#### 前端
- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0

#### 后端
- [Rust](https://www.rust-lang.org/tools/install) >= 1.70.0
- [Cargo](https://doc.rust-lang.org/cargo/) (随 Rust 一起安装)

### 安装步骤

#### 方式一：完整安装（推荐）

##### 1. 克隆项目

```bash
# 克隆整个项目
git clone <repository-url>
cd college-mis
```

##### 2. 启动后端服务

```bash
# 进入后端目录
cd college-mis-backend

# 复制环境变量配置
cp .env.example .env

# 编辑 .env 文件（可选）
# DATABASE_URL=sqlite:./college_mis.db
# PORT=8081
# JWT_SECRET=change-this-secret-in-production

# 运行后端服务
cargo run
```

后端服务将在 `http://localhost:8081` 启动

##### 3. 启动前端服务（新终端）

```bash
# 进入前端目录
cd college-mis-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

##### 4. 访问系统

打开浏览器访问 `http://localhost:5173`

**默认管理员账户：**
```
用户名：admin
密码：admin123
```

#### 方式二：仅后端

```bash
cd college-mis-backend
cp .env.example .env
cargo run
```

#### 方式三：仅前端（需要后端已运行）

```bash
cd college-mis-frontend
npm install
npm run dev
```

---

## 📁 项目结构

### 总体结构

```
college-mis/
├── college-mis-backend/          # 后端项目
│   ├── src/
│   │   ├── db/               # 数据库配置和迁移
│   │   │   ├── mod.rs
│   │   │   └── migrations.rs
│   │   ├── handlers/         # API 处理器
│   │   │   ├── mod.rs
│   │   │   ├── auth.rs       # 认证相关
│   │   │   ├── students.rs   # 学生管理
│   │   │   ├── teachers.rs   # 教师管理
│   │   │   ├── awards.rs     # 获奖管理
│   │   │   └── papers.rs     # 论文管理
│   │   ├── middleware/       # 中间件
│   │   │   ├── mod.rs
│   │   │   └── auth.rs       # JWT 认证
│   │   ├── models/           # 数据模型
│   │   │   └── mod.rs
│   │   └── main.rs           # 入口文件
│   ├── .env                  # 环境变量配置
│   ├── .env.example          # 环境变量示例
│   ├── Cargo.toml            # 项目配置
│   ├── college_mis.db           # SQLite 数据库
│   └── test-api.ps1          # API 测试脚本
│
└── college-mis-frontend/        # 前端项目
    ├── public/               # 静态资源
    ├── src/
    │   ├── assets/           # 静态资源
    │   ├── components/       # 公共组件
    │   │   ├── AuthGuard.tsx # 路由守卫
    │   │   └── Papers/       # 论文组件
    │   ├── layouts/          # 布局组件
    │   │   └── MainLayout.tsx
    │   ├── pages/            # 页面组件
    │   │   ├── Login.tsx     # 登录页
    │   │   ├── Students.tsx  # 学生管理
    │   │   ├── Teachers.tsx  # 教师管理
    │   │   ├── Awards.tsx    # 获奖管理
    │   │   ├── Papers.tsx    # 论文管理
    │   │   └── ...
    │   ├── services/         # API 服务层
    │   │   ├── api.ts        # Axios 配置
    │   │   ├── auth.ts       # 认证 API
    │   │   ├── student.ts    # 学生 API
    │   │   └── ...
    │   ├── store/            # 状态管理
    │   │   └── authStore.ts  # 认证状态
    │   ├── types/            # TypeScript 类型
    │   └── utils/            # 工具函数
    ├── package.json          # 项目配置
    ├── vite.config.ts        # Vite 配置
    └── tsconfig.json         # TypeScript 配置
```

---

## 🎯 核心功能详解

### 认证系统

#### 工作流程

```
1. 用户输入用户名和密码
   ↓
2. 前端发送 POST /api/auth/login
   ↓
3. 后端验证密码（bcrypt）
   ↓
4. 生成 JWT Token
   ↓
5. 返回 Token 和用户信息
   ↓
6. 前端存储 Token（localStorage）
   ↓
7. 后续请求自动携带 Token
   ↓
8. 后端中间件验证 Token
   ↓
9. 返回受保护的资源
```

#### 代码示例

**前端登录：**
```typescript
import { useAuthStore } from './store/authStore';

function LoginPage() {
  const login = useAuthStore((state) => state.login);
  
  const handleLogin = async (values) => {
    await login(values.username, values.password);
    // 自动跳转到首页
  };
}
```

**后端认证处理器：**
```rust
// src/handlers/auth.rs
pub async fn login(
    pool: web::Data<DbPool>,
    body: web::Json<LoginRequest>,
) -> Result<Json<ApiResponse<LoginResponse>>> {
    // 验证用户
    // 生成 JWT Token
    // 返回 Token 和用户信息
}
```

### 权限控制

#### 角色定义

| 角色 | 权限说明 |
|------|---------|
| **admin** | 管理员，拥有所有权限 |
| **teacher** | 教师，可查看学生信息，管理自己的获奖和论文 |
| **student** | 学生，仅可查看自己的信息 |

#### 路由守卫

前端使用 [AuthGuard](../college-mis-frontend/src/components/AuthGuard.tsx) 组件保护路由：

```tsx
<Route
  path="/students"
  element={
    <AuthGuard requiredRole="admin">
      <StudentsPage />
    </AuthGuard>
  }
/>
```

后端使用 JWT 中间件验证权限：

```rust
// src/middleware/auth.rs
pub fn validate_token(token: &str) -> Result<Claims> {
    // 验证 JWT Token
    // 提取用户信息和角色
}
```

### API 服务层

前端所有 API 请求通过服务层管理：

```typescript
// src/services/student.ts
export const studentService = {
  async getStudents(search?: string) {
    return apiClient.get('/students', { params: { search } });
  },
  
  async createStudent(data: Student) {
    return apiClient.post('/students', data);
  },
  
  async updateStudent(id: number, data: Student) {
    return apiClient.put(`/students/${id}`, data);
  },
  
  async deleteStudent(id: number) {
    return apiClient.delete(`/students/${id}`);
  },
};
```

---

## 📚 API 文档

### 基础信息

- **Base URL:** `http://localhost:8081/api`
- **认证方式:** JWT Bearer Token
- **请求格式:** JSON
- **响应格式:** JSON

### 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

错误响应：

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

### 认证接口

#### 1. 用户登录

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

#### 2. 用户注册

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "role": "student"
}
```

#### 3. 获取当前用户信息

```http
GET /api/auth/me
Authorization: Bearer <TOKEN>
```

### 学生管理接口

#### 1. 获取学生列表

```http
GET /api/students?search=张三
Authorization: Bearer <TOKEN>
```

**查询参数：**
- `search` (可选): 搜索关键词

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "name": "张三",
      "student_id": "2024001",
      "department": "数学系",
      "major": "数学与应用数学",
      "enrollment_year": 2024,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 2. 获取学生详情

```http
GET /api/students/:id
Authorization: Bearer <TOKEN>
```

#### 3. 创建学生

```http
POST /api/students
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "张三",
  "student_id": "2024001",
  "department": "数学系",
  "major": "数学与应用数学",
  "enrollment_year": 2024
}
```

#### 4. 更新学生

```http
PUT /api/students/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "张三",
  "student_id": "2024001",
  "department": "数学系",
  "major": "数学与应用数学",
  "enrollment_year": 2024
}
```

#### 5. 删除学生

```http
DELETE /api/students/:id
Authorization: Bearer <TOKEN>
```

### 教师管理接口

#### 1. 获取教师列表

```http
GET /api/teachers
Authorization: Bearer <TOKEN>
```

#### 2. 创建教师

```http
POST /api/teachers
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "李四",
  "employee_id": "T001",
  "department": "数学系",
  "title": "教授",
  "hire_date": "2020-01-01"
}
```

### 获奖管理接口

#### 1. 获取获奖列表

```http
GET /api/awards?owner_id=1&owner_type=student
Authorization: Bearer <TOKEN>
```

**查询参数：**
- `owner_id` (可选): 拥有者 ID
- `owner_type` (可选): 拥有者类型 (student/teacher)

#### 2. 创建获奖

```http
POST /api/awards
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "owner_id": 1,
  "owner_type": "student",
  "title": "数学建模竞赛一等奖",
  "level": "国家级",
  "date": "2024-06-01",
  "description": "全国大学生数学建模竞赛"
}
```

### 论文管理接口

#### 1. 获取论文列表

```http
GET /api/papers?owner_id=1&owner_type=student
Authorization: Bearer <TOKEN>
```

#### 2. 创建论文

```http
POST /api/papers
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "owner_id": 1,
  "owner_type": "student",
  "title": "关于微分方程的研究",
  "journal": "数学学报",
  "publish_date": "2024-03-01",
  "authors": "张三，李四",
  "doi": "10.1234/math.2024.001"
}
```

### 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 📚 开发指南

### 前端开发

#### 添加新页面

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/pages/index.tsx` 中导出新页面
3. 在 `src/App.tsx` 中添加路由配置

```tsx
// src/App.tsx
<Route
  path="/new-page"
  element={
    <AuthGuard>
      <NewPage />
    </AuthGuard>
  }
/>
```

#### 添加新的 API 服务

1. 在 `src/services/` 目录下创建新的服务文件
2. 定义 API 方法和类型
3. 在 `src/services/index.ts` 中导出服务

```typescript
// src/services/example.ts
import apiClient from './api';

export const exampleService = {
  async getExamples() {
    return apiClient.get('/examples');
  },
};
```

#### 状态管理

使用 Zustand 创建状态：

```typescript
// src/store/exampleStore.ts
import { create } from 'zustand';

interface ExampleState {
  items: any[];
  setItems: (items: any[]) => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
```

### 后端开发

#### 添加新的 API 处理器

1. 在 `src/handlers/` 目录下创建新的处理器文件
2. 在 `src/handlers/mod.rs` 中注册模块
3. 在 `src/main.rs` 中添加路由

```rust
// src/handlers/example.rs
use actix_web::{web, HttpResponse};

pub async fn get_examples(pool: web::Data<DbPool>) -> HttpResponse {
    // 实现逻辑
}
```

#### 添加数据模型

1. 在 `src/models/mod.rs` 中定义模型
2. 创建数据库迁移

```rust
// src/models/mod.rs
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Example {
    pub id: i32,
    pub name: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}
```

#### 数据库迁移

在 `src/db/migrations.rs` 中添加迁移：

```rust
pub async fn run_migrations(pool: &DbPool) -> Result<(), sqlx::Error> {
    // 创建表
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )"
    )
    .execute(pool)
    .await?;
    
    Ok(())
}
```

### 代码规范

#### 前端

```bash
# 运行代码检查
npm run lint

# 运行类型检查
npm run build
```

#### 后端

```bash
# 运行代码检查
cargo clippy

# 运行测试
cargo test

# 格式化代码
cargo fmt
```

---

## 🏗️ 部署指南

### 开发环境

#### 启动后端

```bash
cd college-mis-backend
cargo run
# 服务运行在 http://localhost:8081
```

#### 启动前端

```bash
cd college-mis-frontend
npm run dev
# 服务运行在 http://localhost:5173
```

### 生产环境

#### 1. 构建后端

```bash
cd college-mis-backend

# 编译 Release 版本
cargo build --release

# 复制 .env 文件到 release 目录
cp .env target/release/
```

#### 2. 构建前端

```bash
cd college-mis-frontend

# 构建生产版本
npm run build

# 构建产物在 dist/ 目录
```

#### 3. 部署到服务器

##### 方案一：使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/college-mis-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端 API 反向代理
    location /api {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

##### 方案二：使用 Docker 容器化部署

**Dockerfile (后端):**
```dockerfile
FROM rust:1.70 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y libssl3 ca-certificates
COPY --from=builder /app/target/release/college-mis-backend /usr/local/bin/
COPY --from=builder /app/.env /app/college_mis.db ./
EXPOSE 8081
CMD ["college-mis-backend"]
```

**Dockerfile (前端):**
```dockerfile
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./college-mis-backend
    ports:
      - "8081:8081"
    environment:
      - DATABASE_URL=sqlite:./college_mis.db
      - PORT=8081
      - JWT_SECRET=your_secret_key
    volumes:
      - ./data:/app/data

  frontend:
    build: ./college-mis-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend
```

### 性能优化建议

#### 前端优化
- ✅ 使用 CDN 加载第三方库
- ✅ 启用 Gzip/Brotli 压缩
- ✅ 配置浏览器缓存策略
- ✅ 使用懒加载和代码分割
- ✅ 优化图片资源

#### 后端优化
- ✅ 使用连接池管理数据库连接
- ✅ 启用异步 I/O
- ✅ 实现缓存策略（Redis）
- ✅ 使用日志轮转
- ✅ 配置合理的线程数

---

## ❓ 常见问题

### 1. 后端启动失败

**问题：** `error: failed to run custom build command`

**解决方案：**
```bash
# 确保 Rust 版本 >= 1.70
rustc --version

# 更新 Rust
rustup update

# 清理并重新构建
cargo clean
cargo build
```

### 2. 前端无法连接后端

**问题：** `Network Error` 或 `CORS error`

**解决方案：**
- 检查后端是否在 `http://localhost:8081` 运行
- 检查前端 `src/services/api.ts` 中的 API 地址配置
- 确保后端 CORS 配置正确

### 3. 数据库锁定

**问题：** `database is locked`

**解决方案：**
```bash
# 关闭所有访问数据库的程序
# 删除数据库文件（会丢失数据）
rm college_mis.db

# 重启后端，会自动创建新数据库
cargo run
```

### 4. JWT Token 过期

**问题：** `401 Unauthorized`

**解决方案：**
- 重新登录获取新 Token
- 检查 Token 过期时间配置
- 实现 Token 自动刷新机制

### 5. 端口被占用

**问题：** `Address already in use`

**解决方案：**
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8081
kill -9 <PID>
```

### 6. 前端构建失败

**问题：** `npm run build` 失败

**解决方案：**
```bash
# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install

# 重新构建
npm run build
```

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

### 贡献流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 开发规范

#### 代码风格
- 前端：遵循 ESLint 和 Prettier 规则
- 后端：遵循 Rust 官方代码风格，使用 `cargo fmt`

#### 提交信息
- 使用清晰的提交信息
- 遵循 [约定式提交](https://www.conventionalcommits.org/) 规范

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

#### 测试
- 前端：添加单元测试（如适用）
- 后端：使用 `cargo test` 运行测试

---

## 📄 许可证

本项目以 **CC BY-NC-SA 4.0**（知识共享 署名—非商业性使用—相同方式共享 4.0 国际）许可协议发布，完整法律文本见 [LICENSE](LICENSE) 文件。

简言之：

- ✅ **可以自由**：复制、分发、修改、在课堂/学院等**非商业场景**部署使用；
- 📌 **署名**：须注明原作者与出处，并标注是否作了修改；
- 🚫 **非商业**：不得用于商业目的。**确有商用需求的，请先联系作者取得单独的商业授权**；
- ♻️ **相同方式共享**：修改后的衍生作品必须以同一许可发布，**不得闭源**。

> 学校/学院信息化场景属于典型的非商业使用，直接按协议署名使用即可，无需额外联系。

---

## 👥 开发团队

**WCdivine**

---

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 🐛 Issues: [GitHub Issues](https://github.com/WCdivine/college-mis/issues)

---

## 🙏 致谢

感谢以下开源项目：

### 前端
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Ant Design](https://ant.design/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

### 后端
- [Rust](https://www.rust-lang.org/)
- [Actix-web](https://actix.rs/)
- [SQLx](https://github.com/launchbadge/sqlx)
- [jsonwebtoken](https://github.com/Keats/jsonwebtoken)
- [bcrypt](https://github.com/keeyipchan/bcrypt)
- [Serde](https://serde.rs/)
- [Tokio](https://tokio.rs/)

---

## 📊 项目统计

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/WCdivine/college-mis?style=social)
![GitHub forks](https://img.shields.io/github/forks/WCdivine/college-mis?style=social)
![GitHub issues](https://img.shields.io/github/issues/WCdivine/college-mis)
![GitHub pull requests](https://img.shields.io/github/issues-pr/WCdivine/college-mis)
![GitHub last commit](https://img.shields.io/github/last-commit/WCdivine/college-mis)

</div>

---

<div align="center">

**Made with ❤️ and ☕**

感谢所有为本项目做出贡献的开发者！

</div>
