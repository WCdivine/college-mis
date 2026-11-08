import { LinkOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { Paper, Student, Teacher } from '../../types';

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
  doiLink: {
    color: '#007AFF',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    padding: '4px 8px',
    borderRadius: '8px',
  },
  titleText: {
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  journalText: {
    color: '#666',
    fontSize: '14px',
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

interface PapersTableColumnsProps {
  students: Student[];
  teachers: Teacher[];
  onEdit: (record: Paper) => void;
  onDelete: (id: number) => void;
}

const getOwnerName = (ownerId: number, ownerType: 'student' | 'teacher', students: Student[], teachers: Teacher[]) => {
  const list = ownerType === 'student' ? students : teachers;
  const owner = list.find((o) => o.id === ownerId);
  return owner ? owner.name : '未知';
};

export const PapersTableColumns = ({
  students,
  teachers,
}: PapersTableColumnsProps) => {
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
      render: (id: number, record: Paper) => (
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
      title: '论文标题',
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
      title: '期刊/会议',
      dataIndex: 'journal',
      width: 200,
      render: (text: string) => (
        <span 
          style={styles.journalText}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00bfa5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#666';
          }}
        >
          {text || '-'}
        </span>
      ),
    },
    {
      title: '发表日期',
      dataIndex: 'publish_date',
      width: 160,
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
      title: 'DOI',
      dataIndex: 'doi',
      width: 200,
      ellipsis: true,
      render: (text: string) => {
        if (!text) return <span style={{ color: '#999' }}>-</span>;
        return (
          <a 
            href={`https://doi.org/${text}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.doiLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <LinkOutlined style={{ fontSize: '14px' }} />
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{text}</span>
          </a>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, _record: Paper) => (
        <>
          {/* 编辑和删除按钮会在主组件中实现 */}
        </>
      ),
    },
  ];
};
