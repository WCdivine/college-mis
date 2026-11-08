import { Tag } from 'antd';
import type { Award, Student, Teacher } from '../../types';

// 样式常量
const styles = {
  idTag: {
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
    color: '#00897b',
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(0, 191, 165, 0.2)',
    transition: 'all 0.3s ease',
  },
  studentTag: {
    marginLeft: '12px',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    color: '#007AFF',
    borderRadius: '16px',
    fontSize: '12px',
    border: '1px solid rgba(0, 122, 255, 0.2)',
    transition: 'all 0.3s ease',
  },
  teacherTag: {
    marginLeft: '12px',
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
    color: '#00897b',
    borderRadius: '16px',
    fontSize: '12px',
    border: '1px solid rgba(0, 191, 165, 0.2)',
    transition: 'all 0.3s ease',
  },
  titleText: {
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  levelTag: {
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 16px',
    transition: 'all 0.3s ease',
  },
  dateText: {
    color: '#666',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  ownerName: {
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
};

interface AwardsTableColumnsProps {
  students: Student[];
  teachers: Teacher[];
  onEdit: (record: Award) => void;
  onDelete: (id: number) => void;
}

const getOwnerName = (ownerId: number, ownerType: 'student' | 'teacher', students: Student[], teachers: Teacher[]) => {
  const list = ownerType === 'student' ? students : teachers;
  const owner = list.find((o) => o.id === ownerId);
  return owner ? owner.name : '未知';
};

// 获取级别标签颜色
const getLevelColor = (level: string) => {
  if (level.includes('国家级')) {
    return { color: '#ff4d4f', bgColor: 'rgba(255, 77, 79, 0.1)' };
  } else if (level.includes('省级')) {
    return { color: '#fa8c16', bgColor: 'rgba(250, 140, 22, 0.1)' };
  } else if (level.includes('校级')) {
    return { color: '#52c41a', bgColor: 'rgba(82, 196, 26, 0.1)' };
  }
  return { color: '#007AFF', bgColor: 'rgba(0, 122, 255, 0.1)' };
};

export const AwardsTableColumns = ({
  students,
  teachers,
}: AwardsTableColumnsProps) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      render: (text: number) => (
        <span 
          style={styles.idTag}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 191, 165, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 191, 165, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '拥有者',
      dataIndex: 'owner_id',
      width: 200,
      render: (id: number, record: Award) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={styles.ownerName}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00bfa5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#333';
            }}
          >
            {getOwnerName(id, record.owner_type, students, teachers)}
          </span>
          <Tag 
            style={record.owner_type === 'student' ? styles.studentTag : styles.teacherTag}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {record.owner_type === 'student' ? '学生' : '教师'}
          </Tag>
        </div>
      ),
    },
    {
      title: '获奖名称',
      dataIndex: 'title',
      ellipsis: true,
      render: (text: string) => (
        <span 
          style={styles.titleText}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00bfa5';
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#333';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 120,
      render: (level: string) => {
        const { color, bgColor } = getLevelColor(level);
        return (
          <span 
            style={{
              ...styles.levelTag,
              backgroundColor: bgColor,
              color: color,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${bgColor.replace('0.1', '0.3')}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {level}
          </span>
        );
      },
    },
    {
      title: '获奖日期',
      dataIndex: 'date',
      width: 140,
      render: (text: string) => (
        <span 
          style={styles.dateText}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00bfa5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#666';
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, _record: Award) => (
        <>
          {/* 编辑和删除按钮会在主组件中实现 */}
        </>
      ),
    },
  ];
};
