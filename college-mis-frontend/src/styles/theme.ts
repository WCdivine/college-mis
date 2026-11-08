// 统一的主题样式配置

export const theme = {
  colors: {
    primary: '#00bfa5',
    primaryDark: '#00897b',
    secondary: '#007AFF',
    danger: '#ff4d4f',
    warning: '#fa8c16',
    success: '#52c41a',
    text: '#333',
    textSecondary: '#666',
    textLight: '#999',
    bg: '#f8f9fa',
    bgLight: '#ffffff',
  },
  shadows: {
    card: '0 8px 32px rgba(0, 0, 0, 0.1)',
    button: '0 6px 20px rgba(0, 191, 165, 0.4)',
    hover: '0 8px 24px rgba(0, 191, 165, 0.5)',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '20px',
    xxlarge: '24px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    ease: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
};

// 通用样式
export const commonStyles = {
  // 按钮样式
  primaryButton: {
    borderRadius: theme.borderRadius.large,
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: '600',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    border: `1px solid rgba(0, 191, 165, 0.3)`,
    boxShadow: theme.shadows.button,
    transition: theme.transitions.default,
    transform: 'translateY(0)',
  },
  editButton: {
    color: theme.colors.primary,
    fontWeight: '500',
    padding: '6px 16px',
    borderRadius: theme.borderRadius.medium,
    border: '1px solid rgba(0, 191, 165, 0.2)',
    transition: theme.transitions.default,
    transform: 'translateY(0)',
  },
  deleteButton: {
    color: theme.colors.danger,
    fontWeight: '500',
    padding: '6px 16px',
    borderRadius: theme.borderRadius.medium,
    border: '1px solid rgba(255, 77, 79, 0.2)',
    transition: theme.transitions.default,
    transform: 'translateY(0)',
  },
  // 输入框样式
  input: {
    borderRadius: theme.borderRadius.large,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: '14px 20px',
    fontSize: '14px',
    transition: theme.transitions.default,
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
    backgroundColor: theme.colors.bgLight,
  },
  // 标签样式
  idTag: {
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
    color: theme.colors.primaryDark,
    padding: '6px 16px',
    borderRadius: theme.borderRadius.large,
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(0, 191, 165, 0.2)',
    transition: theme.transitions.ease,
  },
  studentTag: {
    marginLeft: '12px',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    color: theme.colors.secondary,
    borderRadius: theme.borderRadius.large,
    fontSize: '12px',
    border: '1px solid rgba(0, 122, 255, 0.2)',
    transition: theme.transitions.ease,
  },
  teacherTag: {
    marginLeft: '12px',
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
    color: theme.colors.primaryDark,
    borderRadius: theme.borderRadius.large,
    fontSize: '12px',
    border: '1px solid rgba(0, 191, 165, 0.2)',
    transition: theme.transitions.ease,
  },
  // 模态框样式
  modal: {
    borderRadius: theme.borderRadius.xxlarge,
  },
  modalButton: {
    padding: '12px 32px',
    borderRadius: theme.borderRadius.large,
    fontSize: '15px',
    fontWeight: '600',
    transition: theme.transitions.default,
    transform: 'translateY(0)',
  },
  cancelButton: {
    borderColor: 'rgba(0, 0, 0, 0.08)',
    color: theme.colors.textSecondary,
    padding: '12px 32px',
    borderRadius: theme.borderRadius.large,
    fontSize: '15px',
    fontWeight: '500',
    transition: theme.transitions.default,
    transform: 'translateY(0)',
    backgroundColor: theme.colors.bg,
  },
};

// 动画样式
export const animations = {
  fadeIn: `
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
  `,
  slideIn: `
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
  `,
  modalSlideIn: `
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-50px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `,
  loadingSpin: `
    @keyframes loadingSpin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
};
