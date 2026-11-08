import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export default function EasterEggPage() {
  const navigate = useNavigate();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; duration: number }>>([]);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 生成彩色粒子 - 优化配色方案
  useEffect(() => {
    // 使用更加和谐的金黄色、粉色、青色系
    const colors = [
      'rgba(255, 215, 0, 0.6)',      // 金黄色
      'rgba(255, 105, 180, 0.6)',    // 粉红色
      'rgba(0, 255, 255, 0.6)',      // 青色
      'rgba(255, 165, 0, 0.6)',      // 橙色
      'rgba(147, 112, 219, 0.6)',    // 紫色
      'rgba(50, 205, 50, 0.6)',      // 绿色
    ];
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,  // 随机大小 4-12px
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 3 + 3, // 随机动画时间 3-6s
    }));
    setParticles(newParticles);
  }, []);

  // 自动播放视频
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('视频自动播放失败:', error);
      });
    }
  }, [videoLoaded]);

  return (
    <div style={styles.container}>
      {/* 粒子背景效果 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* 光效 */}
      <div style={styles.lightEffect} />

      {/* 额外的背景装饰光斑 */}
      <div style={styles.bgDecoration1} />
      <div style={styles.bgDecoration2} />
      <div style={styles.bgDecoration3} />

      {/* 主内容区域 */}
      <div style={styles.mainContent}>
        {/* 左侧装饰区域 */}
        <div style={styles.leftDecoration}>
          <div style={styles.decorationCard}>
            <div style={styles.decorationTitle}>彩蛋页面</div>
            <div style={styles.decorationSubtitle}>Easter Egg</div>
            <div style={styles.decorationLine} />
            <div style={styles.decorationText}>探索与发现的乐趣</div>
          </div>
        </div>

        {/* 中间主要内容 */}
        <div style={styles.centerContent}>
          {/* 视频卡片 */}
          <div style={styles.videoCard}>
            <div style={styles.videoWrapper}>
              <video
                ref={videoRef}
                src="/不要点开.mp4"
                style={styles.video}
                onLoadedData={() => setVideoLoaded(true)}
                playsInline
                controls
              >
                您的浏览器不支持视频标签
              </video>
            </div>
          </div>

          {/* Logo 和标语区域 */}
          <div style={styles.logoSection}>
            {/* 构石 Logo */}
            <div style={styles.logoWrapper}>
              <div style={styles.logoIcon}>
                <svg viewBox="0 0 100 100" style={{ width: '60px', height: '60px' }}>
                  <circle cx="50" cy="20" r="15" fill="#F4C430" />
                  <ellipse cx="50" cy="45" rx="25" ry="15" fill="#F4C430" />
                  <ellipse cx="50" cy="65" rx="30" ry="15" fill="#F4C430" />
                  <ellipse cx="50" cy="82" rx="35" ry="12" fill="#F4C430" />
                </svg>
              </div>
              <div style={styles.logoText}>构石</div>
            </div>

            {/* 分隔线 */}
            <div style={styles.sectionDivider} />

            {/* 返回按钮 - 移到中间 */}
            <div style={styles.buttonWrapper}>
              <Button
                type="primary"
                icon={<HomeOutlined />}
                onClick={() => navigate('/secret-easter-egg')}
                style={styles.backButton}
                size="large"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 215, 0, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.4)';
                }}
              >
                返回首页
              </Button>
            </div>

            {/* 英文标语 */}
            <div style={styles.quoteContainer}>
              <h1 style={styles.englishQuote}>"Truth Fades, S.H.I.T Lasts."</h1>
              
              {/* 中文标语 */}
              <p style={styles.chineseQuote}>"真理会过时，构石永恒。"</p>
            </div>
          </div>
        </div>

        {/* 右侧装饰区域 */}
        <div style={styles.rightDecoration}>
          <div style={styles.decorationCard}>
            <div style={styles.decorationIcon}>✨</div>
            <div style={styles.decorationSmallText}>连续点击</div>
            <div style={styles.decorationNumber}>5</div>
            <div style={styles.decorationSmallText}>次触发彩蛋</div>
          </div>
        </div>
      </div>

      {/* 全局样式 */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate(15px, -20px) scale(1.15);
            opacity: 0.7;
          }
          50% {
            transform: translate(-10px, 15px) scale(0.95);
            opacity: 0.5;
          }
          75% {
            transform: translate(12px, 18px) scale(1.08);
            opacity: 0.6;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
          }
        }

        @keyframes shimmer {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.3;
          }
        }

        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(30px, -30px);
          }
          50% {
            transform: translate(-20px, 20px);
          }
          75% {
            transform: translate(20px, 30px);
          }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    // 优化后的背景渐变 - 更加柔和优雅的紫粉渐变
    background: `linear-gradient(
      135deg,
      #1a1a2e 0%,
      #16213e 15%,
      #1a1a4e 30%,
      #3a1c71 50%,
      #d76d77 75%,
      #ffaf7b 100%
    )`,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 60px',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    animation: 'particleFloat 3s ease-in-out infinite',
    pointerEvents: 'none' as const,
    filter: 'blur(0.5px)',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
  },
  lightEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '800px',
    height: '800px',
    borderRadius: '50%',
    // 优化光效 - 多层渐变光晕
    background: `radial-gradient(
      circle,
      rgba(255, 215, 0, 0.15) 0%,
      rgba(255, 105, 180, 0.1) 30%,
      rgba(147, 112, 219, 0.08) 60%,
      transparent 70%
    )`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none' as const,
    animation: 'pulse 4s ease-in-out infinite',
    filter: 'blur(40px)',
  },
  mainContent: {
    position: 'relative' as const,
    zIndex: 10,
    display: 'grid',
    gridTemplateColumns: '280px 1fr 280px',
    gap: '40px',
    alignItems: 'center',
    maxWidth: '1400px',
    width: '100%',
  },
  // 左侧装饰区域
  leftDecoration: {
    animation: 'slideInLeft 0.8s ease-out',
  },
  decorationCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px 30px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    textAlign: 'center' as const,
    color: 'white',
  },
  decorationTitle: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '2px',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  decorationSubtitle: {
    fontSize: '14px',
    opacity: 0.9,
    marginBottom: '24px',
    fontWeight: '300',
    letterSpacing: '1px',
  },
  decorationLine: {
    width: '60px',
    height: '3px',
    background: 'linear-gradient(to right, transparent, white, transparent)',
    margin: '20px auto',
    borderRadius: '2px',
  },
  decorationText: {
    fontSize: '16px',
    opacity: 0.85,
    fontWeight: '400',
  },
  decorationIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
  },
  decorationSmallText: {
    fontSize: '14px',
    opacity: 0.85,
    marginBottom: '8px',
  },
  decorationNumber: {
    fontSize: '56px',
    fontWeight: '800',
    color: '#FFD93D',
    textShadow: '0 4px 12px rgba(255, 217, 61, 0.5)',
    lineHeight: 1,
    marginBottom: '8px',
  },
  // 中间内容区域
  centerContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '40px',
    animation: 'scaleIn 0.8s ease-out',
  },
  videoCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '8px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    animation: 'fadeInUp 0.8s ease-out 0.2s both',
  },
  videoWrapper: {
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#000',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  video: {
    width: '100%',
    height: 'auto',
    display: 'block',
    maxWidth: '720px',
    maxHeight: '400px',
  },
  // Logo 和标语区域
  logoSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '50px 60px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '32px',
    width: '100%',
    maxWidth: '720px',
    animation: 'fadeInUp 0.8s ease-out 0.4s both',
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(244, 196, 48, 0.2) 0%, rgba(244, 196, 48, 0.1) 100%)',
    borderRadius: '50%',
    padding: '16px',
    boxShadow: '0 8px 24px rgba(244, 196, 48, 0.3)',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#F4C430',
    letterSpacing: '4px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  sectionDivider: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.15) 20%, rgba(0, 0, 0, 0.15) 80%, transparent 100%)',
    margin: '8px 0',
  },
  quoteContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
    width: '100%',
  },
  englishQuote: {
    fontSize: '36px',
    fontWeight: '400',
    color: '#2c3e50',
    margin: '8px 0',
    fontFamily: 'Georgia, "Times New Roman", serif',
    letterSpacing: '3px',
    textAlign: 'center' as const,
    lineHeight: 1.4,
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  chineseQuote: {
    fontSize: '20px',
    color: '#7f8c8d',
    margin: '0',
    fontFamily: '"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif',
    letterSpacing: '6px',
    fontWeight: '300',
    textAlign: 'center' as const,
  },
  buttonWrapper: {
    marginTop: '24px',
    marginBottom: '24px',
    paddingTop: '0',
    borderTop: 'none',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    borderRadius: '20px',
    padding: '14px 48px',
    fontSize: '16px',
    fontWeight: '600',
    // 优化后的渐变色 - 金黄色主题
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: 'none',
    boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    letterSpacing: '2px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  // 右侧装饰区域
  rightDecoration: {
    animation: 'slideInRight 0.8s ease-out',
  },
  // 背景装饰光斑
  bgDecoration1: {
    position: 'absolute' as const,
    top: '10%',
    left: '5%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'drift 8s ease-in-out infinite',
    pointerEvents: 'none' as const,
  },
  bgDecoration2: {
    position: 'absolute' as const,
    bottom: '15%',
    right: '8%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 105, 180, 0.12) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'drift 10s ease-in-out infinite reverse',
    pointerEvents: 'none' as const,
  },
  bgDecoration3: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(147, 112, 219, 0.1) 0%, transparent 70%)',
    filter: 'blur(80px)',
    animation: 'pulse 6s ease-in-out infinite',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none' as const,
  },
};
