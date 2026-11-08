// 统一的表格列样式配置
import { theme, commonStyles } from '../../styles/theme';

export const createTableStyles = () => ({
  idTag: {
    ...commonStyles.idTag,
    onMouseEnter: {
      backgroundColor: 'rgba(0, 191, 165, 0.2)',
      transform: 'scale(1.05)',
    },
    onMouseLeave: {
      backgroundColor: 'rgba(0, 191, 165, 0.1)',
      transform: 'scale(1)',
    },
  },
  ownerName: {
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: '14px',
    transition: theme.transitions.ease,
  },
  titleText: {
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: '14px',
    transition: theme.transitions.ease,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
    fontSize: '14px',
    transition: theme.transitions.ease,
  },
  levelTag: {
    borderRadius: theme.borderRadius.medium,
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 16px',
    transition: theme.transitions.ease,
  },
  yearTag: {
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
    color: theme.colors.primaryDark,
    padding: '6px 16px',
    borderRadius: theme.borderRadius.large,
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(0, 191, 165, 0.2)',
    display: 'inline-block',
    transition: theme.transitions.ease,
  },
});

// 获取级别颜色
export const getLevelColor = (level: string) => {
  if (level.includes('国家级')) {
    return { color: theme.colors.danger, bgColor: 'rgba(255, 77, 79, 0.1)' };
  } else if (level.includes('省级')) {
    return { color: theme.colors.warning, bgColor: 'rgba(250, 140, 22, 0.1)' };
  } else if (level.includes('校级')) {
    return { color: theme.colors.success, bgColor: 'rgba(82, 196, 26, 0.1)' };
  }
  return { color: theme.colors.secondary, bgColor: 'rgba(0, 122, 255, 0.1)' };
};

// 获取拥有者标签样式
export const getOwnerTagStyle = (ownerType: 'student' | 'teacher') => {
  return ownerType === 'student' ? commonStyles.studentTag : commonStyles.teacherTag;
};
