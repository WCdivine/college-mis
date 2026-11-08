import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page" style={styles.pageContainer}>
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
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        .unauthorized-page {
          animation: fadeIn 0.6s ease-out;
        }

        .unauthorized-result {
          animation: slideIn 0.6s ease-out;
        }

        .unauthorized-result .ant-result-title {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }

        .unauthorized-result .ant-result-subtitle {
          font-size: 16px;
          color: #666;
        }

        .unauthorized-btn {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .unauthorized-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 191, 165, 0.4);
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00bfa5 0%, #00897b 100%);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #00897b 0%, #00796b 100%);
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 16px !important;
          }
        }
      `}</style>

      <Result
        className="unauthorized-result"
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面"
        extra={
          <Button 
            type="primary" 
            onClick={() => navigate('/')}
            icon={<HomeOutlined />}
            className="unauthorized-btn"
            style={{
              borderRadius: '16px',
              padding: '12px 32px',
              fontSize: '14px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #00bfa5 0%, #00897b 100%)',
              border: 'none',
              boxShadow: '0 6px 20px rgba(0, 191, 165, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 191, 165, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 191, 165, 0.4)';
            }}
          >
            返回首页
          </Button>
        }
        style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
