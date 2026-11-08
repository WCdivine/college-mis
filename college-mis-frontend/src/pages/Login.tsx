import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Title } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; duration: number }>>([]);
  const [mathSymbols, setMathSymbols] = useState<Array<{ id: number; x: number; y: number; symbol: string; size: number; rotation: number; opacity: number }>>([]);
  const [formulas, setFormulas] = useState<Array<{ id: number; x: number; y: number; formula: string; size: number; opacity: number }>>([]);
  const [gridLines, setGridLines] = useState<Array<{ id: number; x: number; y: number; type: 'horizontal' | 'vertical'; length: number; opacity: number; speed: number }>>([]);
  const [nebulae, setNebulae] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; opacity: number }>>([]);
  const [techLines, setTechLines] = useState<Array<{ id: number; startX: number; startY: number; endX: number; endY: number; color: string; width: number; opacity: number }>>([]);
  const [glowRings, setGlowRings] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; rotation: number }>>([]);

  // 生成彩色粒子
  useEffect(() => {
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
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 3 + 3,
    }));
    setParticles(newParticles);
  }, []);

  // 生成数学符号
  useEffect(() => {
    const symbols = ['∫', '∑', '∏', '√', '∞', '', '≈', '≤', '≥', '±', '÷', '×', '∂', '∇', '∈', '∉', '', '⊃', '∪', '∩', '∅', 'π', 'e', 'φ', 'θ', 'α', 'β', 'γ', 'δ', 'λ', 'μ', 'σ', 'ω', 'Δ', 'Σ', 'Π', 'Ω', '∂', '∮', '⊥', '∥', '∠', '⊙', '⊕', '⊗'];
    const newSymbols = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: Math.random() * 30 + 20,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setMathSymbols(newSymbols);
  }, []);

  // 生成数学公式
  useEffect(() => {
    const mathFormulas = [
      'E = mc²',
      'a² + b² = c²',
      'e^(iπ) + 1 = 0',
      '∫₀^∞ e^(-x²)dx',
      'lim(x→∞) 1/x = 0',
      '∑(n=1)^∞ 1/n²',
      'F = ma',
      '∂u/∂t = ∇²u',
      '∀x∈ℝ, x² ≥ 0',
      '∃!x: P(x)',
      '∫∫_V dV',
      '∮_C F·dr',
      '⟨ψ|H|ψ⟩ = E',
      'det(A) ≠ 0',
      'A⁻¹A = I',
      'ℜ(z) + iℑ(z)',
      '∑_{k=0}^n C(n,k)',
      '∫_a^b f(x)dx',
      '∂²u/∂x² + ∂²u/∂y² = 0',
      'x = (-b ± √(b²-4ac))/2a',
    ];
    const newFormulas = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      formula: mathFormulas[Math.floor(Math.random() * mathFormulas.length)],
      size: Math.random() * 14 + 12,
      opacity: Math.random() * 0.25 + 0.08,
    }));
    setFormulas(newFormulas);
  }, []);

  // 生成科技网格线
  useEffect(() => {
    const newGridLines = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: Math.random() > 0.5 ? 'horizontal' as const : 'vertical' as const,
      length: Math.random() * 300 + 200,
      opacity: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.5 + 0.2,
    }));
    setGridLines(newGridLines);
  }, []);

  // 生成星云效果
  useEffect(() => {
    const nebulaColors = [
      'rgba(138, 43, 226, 0.3)',    // 紫色星云
      'rgba(0, 191, 255, 0.25)',    // 蓝色星云
      'rgba(255, 20, 147, 0.2)',    // 粉色星云
      'rgba(124, 252, 0, 0.15)',    // 绿色星云
      'rgba(255, 69, 0, 0.2)',      // 橙色星云
    ];
    const newNebulae = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 400 + 300,
      color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setNebulae(newNebulae);
  }, []);

  // 生成科技线条
  useEffect(() => {
    const lineColors = [
      'rgba(0, 255, 255, 0.4)',     // 青色
      'rgba(0, 191, 255, 0.3)',     // 深青色
      'rgba(138, 43, 226, 0.35)',   // 紫色
      'rgba(255, 215, 0, 0.3)',     // 金色
    ];
    const newTechLines = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      endX: Math.random() * 100,
      endY: Math.random() * 100,
      color: lineColors[Math.floor(Math.random() * lineColors.length)],
      width: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.2,
    }));
    setTechLines(newTechLines);
  }, []);

  // 生成发光环
  useEffect(() => {
    const ringColors = [
      'rgba(0, 255, 255, 0.15)',
      'rgba(138, 43, 226, 0.12)',
      'rgba(0, 191, 255, 0.1)',
      'rgba(255, 215, 0, 0.1)',
    ];
    const newGlowRings = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
      color: ringColors[Math.floor(Math.random() * ringColors.length)],
      rotation: Math.random() * 360,
    }));
    setGlowRings(newGlowRings);
  }, []);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('登录成功');
      navigate('/');
    } catch (error: any) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

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

      {/* 数学符号背景 */}
      {mathSymbols.map((item) => (
        <div
          key={item.id}
          style={{
            ...styles.mathSymbol,
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            transform: `rotate(${item.rotation}deg)`,
            opacity: item.opacity,
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* 数学公式背景 */}
      {formulas.map((item) => (
        <div
          key={item.id}
          style={{
            ...styles.formula,
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
          }}
        >
          {item.formula}
        </div>
      ))}

      {/* 星云效果 */}
      {nebulae.map((nebula) => (
        <div
          key={nebula.id}
          style={{
            ...styles.nebula,
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            backgroundColor: nebula.color,
            opacity: nebula.opacity,
          }}
        />
      ))}

      {/* 科技网格线 */}
      {gridLines.map((line) => (
        <div
          key={line.id}
          style={{
            ...styles.gridLine,
            left: `${line.x}%`,
            top: `${line.y}%`,
            width: line.type === 'horizontal' ? `${line.length}px` : '1px',
            height: line.type === 'vertical' ? `${line.length}px` : '1px',
            opacity: line.opacity,
          }}
        />
      ))}

      {/* 科技线条 */}
      {techLines.map((techLine) => (
        <div
          key={techLine.id}
          style={{
            ...styles.techLine,
            left: `${techLine.startX}%`,
            top: `${techLine.startY}%`,
            width: `${Math.sqrt(Math.pow(techLine.endX - techLine.startX, 2) + Math.pow(techLine.endY - techLine.startY, 2)) * 10}px`,
            transform: `rotate(${Math.atan2(techLine.endY - techLine.startY, techLine.endX - techLine.startX) * 180 / Math.PI}deg)`,
            backgroundColor: techLine.color,
            opacity: techLine.opacity,
          }}
        />
      ))}

      {/* 发光环 */}
      {glowRings.map((ring) => (
        <div
          key={ring.id}
          style={{
            ...styles.glowRing,
            left: `${ring.x}%`,
            top: `${ring.y}%`,
            width: `${ring.size}px`,
            height: `${ring.size}px`,
            borderColor: ring.color,
            transform: `rotate(${ring.rotation}deg)`,
          }}
        />
      ))}

      {/* 中心光效 */}
      <div style={styles.lightEffect} />

      {/* 背景装饰光斑 */}
      <div style={styles.bgDecoration1} />
      <div style={styles.bgDecoration2} />
      <div style={styles.bgDecoration3} />

      {/* 登录卡片 */}
      <div style={styles.loginCard}>
        {/* 标题区域 */}
        <div style={styles.titleSection}>
          <Title level={2} style={styles.mainTitle}>数学院</Title>
          <Title level={4} style={styles.subTitle}>信息管理系统</Title>
          <div style={styles.titleDivider} />
        </div>
        
        {/* 登录表单 */}
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          style={styles.form}
        >
          {/* 用户名输入 */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
            style={{ marginBottom: '20px' }}
          >
            <Input 
              prefix={<UserOutlined style={styles.inputIcon} />} 
              placeholder="用户名"
              autoComplete="username"
              style={styles.input}
            />
          </Form.Item>

          {/* 密码输入 */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
            style={{ marginBottom: '28px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={styles.inputIcon} />}
              placeholder="密码"
              autoComplete="current-password"
              style={styles.input}
            />
          </Form.Item>

          {/* 登录按钮 */}
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={styles.loginButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
              }}
            >
              登 录
            </Button>
          </Form.Item>
          
          {/* 默认账户信息 */}
          <div style={styles.infoBox}>
            <div style={styles.infoIcon}>ℹ️</div>
            <span style={styles.infoText}>默认管理员账户：admin / admin123</span>
          </div>
        </Form>
      </div>

      {/* 全局样式 */}
      <style>{`
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

        @keyframes mathFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.3;
          }
        }

        @keyframes formulaGlow {
          0%, 100% {
            opacity: 0.08;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
          }
          50% {
            opacity: 0.25;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateX(0) translateY(0);
          }
          100% {
            transform: translateX(50px) translateY(50px);
          }
        }

        @keyframes nebulaPulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        @keyframes techLineFlow {
          0% {
            opacity: 0.2;
            filter: brightness(0.5);
          }
          50% {
            opacity: 0.6;
            filter: brightness(1.5);
          }
          100% {
            opacity: 0.2;
            filter: brightness(0.5);
          }
        }

        @keyframes ringRotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes deepSpace {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
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

        .login-input:focus {
          border-color: rgba(255, 215, 0, 0.6) !important;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3) !important;
        }

        .login-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    // 优化后的深邃未来感背景 - 多层渐变
    background: `linear-gradient(
      to bottom,
      #000428 0%,
      #000e5a 10%,
      #001a7a 20%,
      #002fa7 35%,
      #1a1a4e 50%,
      #3a1c71 65%,
      #4a0e4e 80%,
      #2c003e 100%
    )`,
    backgroundSize: '200% 200%',
    animation: 'deepSpace 20s ease-in-out infinite',
    position: 'relative' as const,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  particle: {
    position: 'absolute' as const,
    borderRadius: '50%',
    animation: 'particleFloat 3s ease-in-out infinite',
    pointerEvents: 'none' as const,
    filter: 'blur(0.5px)',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
  },
  mathSymbol: {
    position: 'absolute' as const,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: '"Times New Roman", "STIXGeneral", "Cambria Math", serif',
    fontWeight: 'bold' as const,
    animation: 'mathFloat 6s ease-in-out infinite',
    pointerEvents: 'none' as const,
    textShadow: '0 0 10px rgba(255, 215, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.3)',
    whiteSpace: 'nowrap' as const,
  },
  formula: {
    position: 'absolute' as const,
    color: 'rgba(255, 215, 0, 0.8)',
    fontFamily: '"Times New Roman", "STIXGeneral", "Cambria Math", serif',
    fontWeight: 'bold' as const,
    animation: 'formulaGlow 8s ease-in-out infinite',
    pointerEvents: 'none' as const,
    whiteSpace: 'nowrap' as const,
    letterSpacing: '1px',
  },
  nebula: {
    position: 'absolute' as const,
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'nebulaPulse 8s ease-in-out infinite',
    pointerEvents: 'none' as const,
    mixBlendMode: 'screen' as const,
  },
  gridLine: {
    position: 'absolute' as const,
    background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
    animation: 'gridMove 10s linear infinite',
    pointerEvents: 'none' as const,
  },
  techLine: {
    position: 'absolute' as const,
    height: '1px',
    animation: 'techLineFlow 5s ease-in-out infinite',
    pointerEvents: 'none' as const,
    transformOrigin: 'left center',
  },
  glowRing: {
    position: 'absolute' as const,
    borderRadius: '50%',
    borderWidth: '2px',
    borderStyle: 'solid',
    animation: 'ringRotate 15s linear infinite',
    pointerEvents: 'none' as const,
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)',
  },
  lightEffect: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    width: '800px',
    height: '800px',
    borderRadius: '50%',
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
  loginCard: {
    position: 'relative' as const,
    zIndex: 10,
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '32px',
    padding: '50px 48px',
    boxShadow: '0 30px 100px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(20px)',
    animation: 'scaleIn 0.8s ease-out',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  titleSection: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    animation: 'fadeInUp 0.8s ease-out 0.3s both',
  },
  mainTitle: {
    margin: '0 0 12px 0',
    color: '#2c3e50',
    fontWeight: '800',
    fontSize: '32px',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  subTitle: {
    margin: '0 0 20px 0',
    color: '#7f8c8d',
    fontWeight: '400',
    fontSize: '18px',
    letterSpacing: '2px',
  },
  titleDivider: {
    width: '80px',
    height: '3px',
    background: 'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.6), transparent)',
    margin: '0 auto',
    borderRadius: '2px',
  },
  form: {
    animation: 'fadeInUp 0.8s ease-out 0.4s both',
  },
  input: {
    borderRadius: '16px',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    fontSize: '16px',
    padding: '14px 20px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
  },
  inputIcon: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: '16px',
  },
  loginButton: {
    borderRadius: '16px',
    padding: '16px 0',
    fontSize: '18px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: 'none',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    letterSpacing: '4px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  infoBox: {
    marginTop: '24px',
    padding: '20px 24px',
    background: 'rgba(255, 215, 0, 0.08)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    animation: 'fadeInUp 0.8s ease-out 0.5s both',
  },
  infoIcon: {
    fontSize: '20px',
  },
  infoText: {
    fontSize: '14px',
    color: '#856404',
    fontWeight: '500',
  },
};
