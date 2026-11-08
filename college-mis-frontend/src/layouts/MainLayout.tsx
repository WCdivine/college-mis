import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Avatar, Dropdown, Space } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedKey, setSelectedKey] = useState('');
  const [maskPosition, setMaskPosition] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // 当路径变化时更新选中的键
  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  // 更新遮罩层位置
  useEffect(() => {
    if (menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll('[data-menu-key]');
      menuItems.forEach((item) => {
        if (item.getAttribute('data-menu-key') === selectedKey) {
          const rect = item.getBoundingClientRect();
          const containerRect = menuRef.current!.getBoundingClientRect();
          setMaskPosition(rect.top - containerRect.top);
        }
      });
    }
  }, [selectedKey]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 重置点击计数的定时器
  useEffect(() => {
    if (clickCount > 0 && clickCount < 5) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  // 处理点击事件
  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      navigate('/easter-egg');
      setClickCount(0);
    }
  };

  const menuItems = [
    {
      key: '/',
      icon: <TeamOutlined />,
      label: '学生管理',
      roles: ['admin'],
    },
    {
      key: '/teachers',
      icon: <UserOutlined />,
      label: '教师管理',
      roles: ['admin'],
    },
    {
      key: '/awards',
      icon: <TrophyOutlined />,
      label: '获奖管理',
      roles: ['admin', 'teacher', 'student'],
    },
    {
      key: '/papers',
      icon: <FileTextOutlined />,
      label: '论文管理',
      roles: ['admin', 'teacher', 'student'],
    },
  ];

  // 根据角色过滤菜单
  const filteredMenuItems = menuItems.filter(
    (item) => item.roles.includes(user?.role || 'student')
  );

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      backgroundColor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰 */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(10, 186, 181, 0.1)',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'rgba(0, 122, 255, 0.1)',
          filter: 'blur(60px)',
          animation: 'float 12s ease-in-out infinite reverse',
        }}
      />
      
      {/* 动态光效 */}
      <div 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(10, 186, 181, 0.05), transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        theme="light"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <div style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #00bfa5 0%, #00897b 100%)',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: collapsed ? '100%' : 'auto',
            justifyContent: collapsed ? 'center' : 'flex-start',
            paddingLeft: collapsed ? 0 : '16px',
            cursor: 'pointer',
          }}
          onClick={handleTitleClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}>
            <DashboardOutlined style={{ 
              fontSize: 20, 
              color: 'white',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }} />
            <span style={{ 
              fontSize: 18, 
              fontWeight: '700', 
              color: 'white',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : '100%',
              overflow: 'hidden',
              transformOrigin: 'left center',
            }}>
              数学院管理系统
            </span>
          </div>
        </div>
        <div style={{ position: 'relative', padding: '8px' }}>
          {/* 背景装饰 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1))',
            borderRadius: '16px',
            zIndex: 0,
          }} />
          
          {/* 液态玻璃效果遮罩层 */}
          <div 
            style={{
              position: 'absolute',
              left: '8px',
              right: '8px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3))',
              backdropFilter: 'blur(48px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 2px 0 rgba(255, 255, 255, 0.95), inset 0 -2px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.6)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              zIndex: 1,
              // 根据选中的菜单项动态计算位置和高度
              transform: `translateY(${maskPosition}px)`,
              height: '48px',
              overflow: 'hidden',
            }}
          >
            {/* 泡泡水光影效果 */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              transform: 'rotate(45deg)',
              animation: 'bubbleShine 3s ease-in-out infinite',
            }} />
          </div>
          
          {/* 菜单容器 */}
          <div ref={menuRef} style={{ position: 'relative', zIndex: 2 }}>
            {filteredMenuItems.map((item) => (
              <div
                key={item.key}
                data-menu-key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  margin: '4px 0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  zIndex: 2,
                  color: selectedKey === item.key ? '#00897b' : '#333',
                  fontWeight: selectedKey === item.key ? '600' : '400',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 191, 165, 0.05)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ 
                  fontSize: '18px',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transform: selectedKey === item.key ? 'scale(1.1)' : 'scale(1)',
                }}>
                  {item.icon}
                </div>
                <span style={{
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  opacity: collapsed ? 0 : 1,
                  maxWidth: collapsed ? 0 : '100%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '16px',
          height: 'auto',
          minHeight: 64,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ 
              fontSize: 16, 
              width: 48, 
              height: 48,
              color: '#00bfa5',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 191, 165, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          />
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <Space 
              style={{ 
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
                <Avatar style={{ 
                  backgroundColor: 'linear-gradient(135deg, #00bfa5 0%, #00897b 100%)',
                  boxShadow: '0 4px 12px rgba(0, 191, 165, 0.4)',
                  width: 40,
                  height: 40,
                  fontSize: 16,
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              <span style={{ 
                color: '#333', 
                fontWeight: '600',
                fontSize: 14,
              }}>
                {user?.username} 
                <span style={{ 
                  color: '#00bfa5',
                  marginLeft: '8px',
                  fontSize: 12,
                }}>
                  ({user?.role === 'admin' ? '管理员' : user?.role === 'teacher' ? '教师' : '学生'})
                </span>
              </span>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '0 16px 16px',
            padding: '24px',
            borderRadius: '16px',
            minHeight: 280,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <div style={{
            animation: 'fadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      {/* 全局样式 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .page-enter {
          animation: fadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes bubbleShine {
          0%, 100% {
            transform: translateX(-100%) rotate(45deg);
            opacity: 0.3;
          }
          50% {
            transform: translateX(100%) rotate(45deg);
            opacity: 0.6;
          }
        }
      `}</style>
    </Layout>
  );
}