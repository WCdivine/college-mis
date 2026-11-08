import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export default function SecretEasterEggPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; duration: number; delay: number }>>([]);
  const [goldBars, setGoldBars] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);
  const [diamonds, setDiamonds] = useState<Array<{ id: number; left: number; top: number; delay: number; duration: number }>>([]);

  // 生成金色粒子
  useEffect(() => {
    const colors = [
      'rgba(255, 215, 0, 0.8)',      // 金色
      'rgba(255, 223, 0, 0.7)',      // 亮金色
      'rgba(255, 193, 7, 0.6)',      // 琥珀金
      'rgba(255, 255, 224, 0.5)',    // 浅金色
      'rgba(218, 165, 32, 0.7)',     // 暗金色
    ];
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  // 生成下落金币效果
  useEffect(() => {
    const newGoldBars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 4,
    }));
    setGoldBars(newGoldBars);
  }, []);

  // 生成钻石闪烁效果
  useEffect(() => {
    const newDiamonds = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
    }));
    setDiamonds(newDiamonds);
  }, []);

  // 自动播放视频
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('视频自动播放失败:', error);
      });
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* 动态渐变背景 */}
      <div style={styles.dynamicGradient} />

      {/* 金色粒子 */}
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
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* 下落金币效果 - 改为屎表情包 */}
      {goldBars.map((bar) => (
        <div
          key={bar.id}
          style={{
            ...styles.goldBar,
            left: `${bar.left}%`,
            animationDelay: `${bar.delay}s`,
            animationDuration: `${bar.duration}s`,
          }}
        >
          <div style={styles.coinIcon}>💩</div>
        </div>
      ))}

      {/* 钻石闪烁效果 - 改为屎表情包 */}
      {diamonds.map((diamond) => (
        <div
          key={diamond.id}
          style={{
            ...styles.diamond,
            left: `${diamond.left}%`,
            top: `${diamond.top}%`,
            animationDelay: `${diamond.delay}s`,
            animationDuration: `${diamond.duration}s`,
          }}
        >
          <div style={styles.diamondIcon}>💩</div>
        </div>
      ))}

      {/* 金色光晕层 */}
      <div style={styles.goldenGlow1} />
      <div style={styles.goldenGlow2} />
      <div style={styles.goldenGlow3} />

      {/* 主内容区域 */}
      <div style={styles.mainContent}>
        {/* 视频卡片 */}
        <div style={styles.videoCard}>
          <div style={styles.videoWrapper}>
            <video
              ref={videoRef}
              src="/可以点开.mp4"
              style={styles.video}
              playsInline
              controls
            >
              您的浏览器不支持视频标签
            </video>
          </div>
        </div>

        {/* 再看一集按钮 */}
        <div style={styles.buttonWrapper}>
          <Button
            type="primary"
            icon={<span style={{ fontSize: '20px' }}>🎬</span>}
            onClick={() => window.open('https://www.bilibili.com/bangumi/play/ss73077?spm_id_from=333.337.0.0', '_blank')}
            style={styles.watchButton}
            size="large"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(255, 215, 0, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 215, 0, 0.5)';
            }}
          >
            再看一集
          </Button>
          <Button
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            style={styles.backButton}
            size="large"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
          >
            返回首页
          </Button>
        </div>
      </div>

      {/* 全局样式 */}
      <style>{`
        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(20px, -30px) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translate(-15px, 25px) scale(0.9);
            opacity: 0.7;
          }
          75% {
            transform: translate(18px, 28px) scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes goldRain {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes diamondPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.6;
            filter: brightness(1);
          }
          50% {
            transform: scale(1.3) rotate(180deg);
            opacity: 1;
            filter: brightness(1.5);
          }
        }

        @keyframes dynamicGradient {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 100%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 0%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes goldenGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
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
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(-45deg, #1a0a2e, #16213e, #2d1b4e, #1a0a2e)',
    backgroundSize: '400% 400%',
    animation: 'dynamicGradient 15s ease infinite',
  },
  dynamicGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.05) 50%, rgba(218, 165, 32, 0.1) 100%)',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    animation: 'particleFloat 4s ease-in-out infinite',
    pointerEvents: 'none',
    filter: 'blur(0.5px)',
    boxShadow: '0 0 30px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 215, 0, 0.6)',
  },
  goldBar: {
    position: 'absolute',
    top: '-100px',
    animation: 'goldRain linear infinite',
    pointerEvents: 'none',
    zIndex: 1,
  },
  coinIcon: {
    fontSize: '50px',
    filter: 'drop-shadow(0 4px 8px rgba(139, 69, 19, 0.6))',
  },
  diamond: {
    position: 'absolute',
    animation: 'diamondPulse ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 2,
  },
  diamondIcon: {
    fontSize: '45px',
    filter: 'drop-shadow(0 0 20px rgba(139, 69, 19, 0.8))',
  },
  goldenGlow1: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
    filter: 'blur(80px)',
    animation: 'goldenGlow 4s ease-in-out infinite',
    pointerEvents: 'none',
  },
  goldenGlow2: {
    position: 'absolute',
    bottom: '15%',
    right: '15%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 193, 7, 0.25) 0%, transparent 70%)',
    filter: 'blur(100px)',
    animation: 'goldenGlow 5s ease-in-out infinite 1s',
    pointerEvents: 'none',
  },
  goldenGlow3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(218, 165, 32, 0.2) 0%, transparent 70%)',
    filter: 'blur(120px)',
    animation: 'goldenGlow 6s ease-in-out infinite 2s',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  mainContent: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
    maxWidth: '900px',
    width: '100%',
    padding: '40px',
  },
  videoCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '32px',
    padding: '12px',
    boxShadow: '0 30px 100px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.4)',
    border: '3px solid rgba(255, 215, 0, 0.6)',
    animation: 'float 3s ease-in-out infinite',
    backdropFilter: 'blur(20px)',
  },
  videoWrapper: {
    borderRadius: '24px',
    overflow: 'hidden',
    background: '#000',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },
  video: {
    width: '100%',
    height: 'auto',
    display: 'block',
    maxWidth: '800px',
    maxHeight: '500px',
  },
  sloganSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '40px 60px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.3)',
    border: '2px solid rgba(255, 215, 0, 0.4)',
    backdropFilter: 'blur(20px)',
    textAlign: 'center',
    width: '100%',
    animation: 'shimmer 3s linear infinite',
    backgroundSize: '200% 100%',
    backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 215, 0, 0.1) 50%, rgba(255, 255, 255, 0.95) 100%)',
  },
  sloganText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '16px',
    fontSize: '42px',
    fontWeight: '800',
    color: '#2c3e50',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 215, 0, 0.3)',
    letterSpacing: '2px',
  },
  sloganHighlight: {
    fontSize: '48px',
    filter: 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4))',
  },
  sloganMain: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
  },
  sloganSub: {
    fontSize: '20px',
    color: '#7f8c8d',
    fontWeight: '400',
    letterSpacing: '4px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  buttonWrapper: {
    marginTop: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '24px',
  },
  watchButton: {
    borderRadius: '24px',
    padding: '16px 56px',
    fontSize: '18px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 12px 32px rgba(255, 215, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    letterSpacing: '3px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  backButton: {
    borderRadius: '24px',
    padding: '16px 56px',
    fontSize: '18px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 12px 32px rgba(255, 215, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    letterSpacing: '3px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
};
