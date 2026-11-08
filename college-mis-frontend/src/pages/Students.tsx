import { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Modal, Form, message, Popconfirm, Card, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { studentService } from '../services';
import type { Student } from '../types';

const { Title } = Typography;

// 样式常量
const styles = {
  // 页面容器样式
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '32px',
  },
  // 标题容器样式
  titleContainer: {
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  // 按钮样式
  primaryButton: {
    borderRadius: '16px',
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #00bfa5 0%, #00897b 100%)',
    border: '1px solid rgba(0, 191, 165, 0.3)',
    boxShadow: '0 6px 20px rgba(0, 191, 165, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(0)',
  },
  editButton: {
    color: '#00bfa5',
    fontWeight: '500',
    padding: '6px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 191, 165, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(0)',
  },
  deleteButton: {
    color: '#ff4d4f',
    fontWeight: '500',
    padding: '6px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 77, 79, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(0)',
  },
  // 输入框样式
  input: {
    borderRadius: '16px',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: '14px 20px',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
    backgroundColor: '#ffffff',
  },
  // 卡片样式
  card: {
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: '#ffffff',
  },
  // 表格样式
  table: {
    background: 'transparent',
  },
  // 模态框样式
  modal: {
    borderRadius: '24px',
  },
  modalButton: {
    padding: '12px 32px',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(0)',
  },
  cancelButton: {
    borderColor: 'rgba(0, 0, 0, 0.08)',
    color: '#666',
    padding: '12px 32px',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(0)',
    backgroundColor: '#f8f9fa',
  },
  // 标签样式
  idTag: {
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
    color: '#00897b',
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(0, 191, 165, 0.2)',
  },
  yearTag: {
    backgroundColor: 'rgba(0, 191, 165, 0.1)',
    color: '#00897b',
    padding: '6px 16px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(0, 191, 165, 0.2)',
    display: 'inline-block',
    transition: 'all 0.3s ease',
  },
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await studentService.getStudents(searchText || undefined);
      if (response.success) {
        setStudents(response.data || []);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [searchText]);

  // 添加页面进入动画
  useEffect(() => {
    const content = document.getElementById('students-content');
    if (content) {
      content.classList.add('page-enter');
      const handleAnimationEnd = () => {
        content.classList.remove('page-enter');
      };
      content.addEventListener('animationend', handleAnimationEnd);
      return () => content.removeEventListener('animationend', handleAnimationEnd);
    }
  }, []);

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Student) => {
    setEditingStudent(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await studentService.deleteStudent(id);
      message.success('删除成功');
      loadStudents();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, values);
        message.success('更新成功');
      } else {
        await studentService.createStudent(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadStudents();
    } catch (error: any) {
      if (error.message !== 'Validation failed') {
        message.error(error.message);
      }
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      render: (_text: number, _record: Student, index: number) => {
        const displayIndex = index + 1;
        return (
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
            {displayIndex}
          </span>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text: string) => (
        <span 
          style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00bfa5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#333';
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '学号',
      dataIndex: 'student_id',
      width: 150,
      render: (text: string) => (
        <span 
          style={{ color: '#666', fontSize: '14px' }}
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
      title: '院系',
      dataIndex: 'department',
      width: 180,
      render: (text: string) => (
        <span 
          style={{ color: '#666', fontSize: '14px' }}
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
      title: '专业',
      dataIndex: 'major',
      width: 180,
      render: (text: string) => (
        <span 
          style={{ color: '#666', fontSize: '14px' }}
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
      title: '入学年份',
      dataIndex: 'enrollment_year',
      width: 140,
      render: (text: number) => (
        <span 
          style={styles.yearTag}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 191, 165, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 191, 165, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 191, 165, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
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
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={styles.editButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 191, 165, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 191, 165, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 191, 165, 0.3)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 191, 165, 0.3)';
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{
              style: {
                backgroundColor: '#ff4d4f',
                borderColor: '#ff4d4f',
                borderRadius: '12px',
                padding: '8px 20px',
                fontWeight: '600',
              },
            }}
            cancelButtonProps={{
              style: {
                color: '#666',
                borderRadius: '12px',
                padding: '8px 20px',
                fontWeight: '500',
                borderColor: 'rgba(0, 0, 0, 0.1)',
              },
            }}
            className="custom-popconfirm"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              style={styles.deleteButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 77, 79, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 77, 79, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 77, 79, 0.3)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 77, 79, 0.3)';
              }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={styles.pageContainer}>
      <div id="students-content" style={{ animation: 'fadeIn 0.8s ease-out' }}>
        {/* 页面标题 */}
        <div style={styles.titleContainer}>
          <Title level={3} style={{ 
            margin: 0, 
            color: '#333',
            fontWeight: '800',
            fontSize: '32px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            学生管理
          </Title>
          <p style={{ 
            margin: '12px 0 0 0', 
            color: '#666',
            fontSize: '16px',
            lineHeight: '1.5',
          }}>
            管理学生信息，包括添加、编辑和删除学生
          </p>
        </div>
      
        {/* 搜索和添加区域 */}
        <Card 
          style={{
            ...styles.card,
            marginBottom: '32px',
            animation: 'slideIn 0.6s ease-out',
          }}
          styles={{
            body: {
              padding: '24px',
            },
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <Input
              placeholder="搜索姓名、学号、院系"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                ...styles.input,
                flex: 1,
                maxWidth: '500px',
              }}
              prefix={<SearchOutlined style={{ color: '#999' }} />}
              allowClear
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
              style={styles.primaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 191, 165, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 191, 165, 0.4)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 191, 165, 0.5)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 191, 165, 0.5)';
              }}
            >
              新增学生
            </Button>
          </div>
        </Card>

        {/* 学生表格 */}
        <Card 
          style={{
            ...styles.card,
            animation: 'slideIn 0.8s ease-out',
          }}
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={students}
            rowKey="id"
            loading={{
              spinning: loading,
              indicator: <div className="custom-loading" style={{ padding: '40px 0' }}>
                <div className="loading-spinner"></div>
                <p style={{ marginTop: '16px', color: '#00bfa5', fontWeight: '500' }}>加载中...</p>
              </div>,
            }}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              style: {
                padding: '20px',
                borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                backgroundColor: '#f8f9fa',
              },
              showTotal: (total) => <span style={{ color: '#666', fontWeight: '500' }}>共 {total} 条记录</span>,
            }}
            style={styles.table}
            scroll={{ x: 'max-content' }}
            rowClassName="student-row"
            onRow={() => ({
              style: {
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: 'translateX(0)',
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 191, 165, 0.05)';
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              },
            })}
            className="student-table"
          />
        </Card>

        {/* 新增/编辑模态框 */}
        <Modal
          title={editingStudent ? '编辑学生' : '新增学生'}
          open={modalVisible}
          onOk={handleSubmit}
          onCancel={() => setModalVisible(false)}
          width={800}
          centered
          style={styles.modal}
          okText="确定"
          cancelText="取消"
          transitionName="modal-fade"
          maskTransitionName="modal-mask-fade"
          okButtonProps={{
            style: {
              ...styles.modalButton,
              background: 'linear-gradient(135deg, #00bfa5 0%, #00897b 100%)',
              border: 'none',
            },
            onMouseEnter: (e: any) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 191, 165, 0.5)';
            },
            onMouseLeave: (e: any) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 191, 165, 0.4)';
            },
          }}
          cancelButtonProps={{
            style: styles.cancelButton,
            onMouseEnter: (e: any) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = '#00bfa5';
              e.currentTarget.style.color = '#00bfa5';
            },
            onMouseLeave: (e: any) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.color = '#666';
            },
          }}
          className="student-modal"
        >
          <div className="form-container">
            <Form
              form={form}
              layout="vertical"
              initialValues={{ enrollment_year: new Date().getFullYear() }}
              style={{
                marginTop: '24px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input 
                    placeholder="请输入姓名"
                    style={styles.input}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00bfa5';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 3px rgba(0, 191, 165, 0.1)';
                      e.currentTarget.style.backgroundColor = '#f8fff7';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="student_id"
                  label="学号"
                  rules={[{ required: true, message: '请输入学号' }]}
                >
                  <Input 
                    placeholder="请输入学号"
                    style={styles.input}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00bfa5';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 3px rgba(0, 191, 165, 0.1)';
                      e.currentTarget.style.backgroundColor = '#f8fff7';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="department"
                  label="院系"
                  rules={[{ required: true, message: '请输入院系' }]}
                >
                  <Input 
                    placeholder="请输入院系"
                    style={styles.input}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00bfa5';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 3px rgba(0, 191, 165, 0.1)';
                      e.currentTarget.style.backgroundColor = '#f8fff7';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="major"
                  label="专业"
                  rules={[{ required: true, message: '请输入专业' }]}
                >
                  <Input 
                    placeholder="请输入专业"
                    style={styles.input}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00bfa5';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 3px rgba(0, 191, 165, 0.1)';
                      e.currentTarget.style.backgroundColor = '#f8fff7';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="enrollment_year"
                  label="入学年份"
                  rules={[{ required: true, message: '请输入入学年份' }]}
                  style={{ gridColumn: '1 / -1' }}
                >
                  <Input 
                    type="number" 
                    placeholder="请输入入学年份"
                    style={styles.input}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00bfa5';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 3px rgba(0, 191, 165, 0.1)';
                      e.currentTarget.style.backgroundColor = '#f8fff7';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  />
                </Form.Item>
              </div>
            </Form>
          </div>
        </Modal>

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

          @keyframes loadingSpin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .custom-loading .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0, 191, 165, 0.2);
            border-top: 3px solid #00bfa5;
            border-radius: 50%;
            animation: loadingSpin 1s linear infinite;
            margin: 0 auto;
          }

          .student-table .ant-table-thead > tr > th {
            background-color: rgba(0, 191, 165, 0.05);
            font-weight: 600;
            color: #333;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            padding: 20px;
            transition: all 0.3s ease;
          }

          .student-table .ant-table-thead > tr > th:hover {
            background-color: rgba(0, 191, 165, 0.1);
            transform: translateY(-2px);
          }

          .student-table .ant-table-tbody > tr > td {
            padding: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.03);
            transition: all 0.3s ease;
          }

          .student-modal .ant-modal-content {
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(0, 0, 0, 0.05);
            overflow: hidden;
            animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

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

          .modal-fade-enter {
            opacity: 0;
          }

          .modal-fade-enter-active {
            opacity: 1;
            transition: opacity 0.3s ease;
          }

          .modal-fade-leave {
            opacity: 1;
          }

          .modal-fade-leave-active {
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .modal-mask-fade-enter {
            opacity: 0;
          }

          .modal-mask-fade-enter-active {
            opacity: 0.6;
            transition: opacity 0.3s ease;
          }

          .modal-mask-fade-leave {
            opacity: 0.6;
          }

          .modal-mask-fade-leave-active {
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .student-modal .ant-modal-header {
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            padding: 32px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          }

          .student-modal .ant-modal-title {
            font-size: 24px;
            font-weight: 800;
            color: #333;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .student-modal .ant-modal-title::before {
            content: '';
            width: 6px;
            height: 32px;
            background: linear-gradient(135deg, #00bfa5 0%, #00897b 100%);
            border-radius: 3px;
          }

          .student-modal .ant-modal-body {
            padding: 0 32px 32px;
          }

          .form-container {
            animation: formSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          @keyframes formSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .student-modal .ant-modal-footer {
            padding: 24px 32px;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            background: #f8f9fa;
            display: flex;
            gap: 16px;
            justify-content: flex-end;
          }

          .student-modal .ant-btn {
            min-width: 120px;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .student-modal .ant-form-item-label > label {
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
            font-size: 14px;
            display: block;
          }

          .custom-popconfirm .ant-popconfirm-content {
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(0, 0, 0, 0.05);
            padding: 24px;
            animation: popconfirmSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          @keyframes popconfirmSlideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .custom-popconfirm .ant-popconfirm-title {
            font-size: 18px;
            font-weight: 700;
            color: #333;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .custom-popconfirm .ant-popconfirm-title::before {
            content: '⚠️';
            font-size: 20px;
          }

          .custom-popconfirm .ant-popconfirm-buttons {
            display: flex;
            gap: 16px;
            justify-content: flex-end;
            margin-top: 20px;
          }

          .custom-popconfirm .ant-btn {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .custom-popconfirm .ant-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }

          .custom-popconfirm .ant-btn-primary:hover {
            background-color: #ff7875;
            border-color: #ff7875;
            transform: translateY(-2px);
          }

          .custom-popconfirm .ant-btn-default:hover {
            border-color: #00bfa5;
            color: #00bfa5;
            transform: translateY(-2px);
          }

          /* 响应式设计 */
          @media (max-width: 768px) {
            .page-container {
              padding: 16px !important;
            }

            .titleContainer {
              margin-bottom: 24px !important;
            }

            .titleContainer h3 {
              font-size: 24px !important;
            }

            .ant-table {
              font-size: 12px;
            }

            .ant-table-tbody > tr > td {
              padding: 12px !important;
            }

            .ant-table-thead > tr > th {
              padding: 12px !important;
            }

            .ant-modal {
              width: 90% !important;
              max-width: 90% !important;
            }

            .ant-modal-body {
              padding: 0 20px 20px !important;
            }

            .ant-modal-header {
              padding: 20px !important;
            }

            .ant-modal-footer {
              padding: 16px 20px !important;
            }
          }

          /* 滚动条样式 */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb {
            background: #00bfa5;
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #00897b;
          }
        `}</style>
      </div>
    </div>
  );
}
