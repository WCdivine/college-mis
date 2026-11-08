import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface PageLayoutProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  error?: string | null;
}

// 统一的页面布局样式
const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '32px',
  },
  titleContainer: {
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  title: {
    margin: 0,
    color: '#333',
    fontWeight: '800',
    fontSize: '32px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  description: {
    margin: '12px 0 0 0',
    color: '#666',
    fontSize: '16px',
    lineHeight: '1.5',
  },
  error: {
    marginTop: '20px',
    padding: '16px 20px',
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
    border: '1px solid rgba(255, 77, 79, 0.3)',
    borderRadius: '12px',
    color: '#ff4d4f',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(255, 77, 79, 0.15)',
    animation: 'slideIn 0.4s ease-out',
  },
  card: {
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: '#ffffff',
  },
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  icon,
  children,
  error,
}) => {
  return (
    <div style={styles.pageContainer}>
      <div id="page-content" style={{ animation: 'fadeIn 0.8s ease-out' }}>
        {/* 页面标题 */}
        <div style={styles.titleContainer}>
          <Title level={3} style={styles.title}>
            {icon && <span style={{ marginRight: '12px' }}>{icon}</span>}
            {title}
          </Title>
          <p style={styles.description}>{description}</p>
          {/* 错误提示 */}
          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* 内容区域 */}
        {children}
      </div>

      {/* 全局样式 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export const ContentCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, style, className }) => {
  return (
    <Card
      className={className}
      style={{
        ...styles.card,
        marginBottom: '32px',
        animation: 'slideIn 0.6s ease-out',
        ...style,
      }}
      styles={{
        body: {
          padding: '24px',
        },
      }}
    >
      {children}
    </Card>
  );
};

export const TableCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, style, className }) => {
  return (
    <Card
      className={className}
      style={{
        ...styles.card,
        animation: 'slideIn 0.8s ease-out',
        ...style,
      }}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      {children}
    </Card>
  );
};
