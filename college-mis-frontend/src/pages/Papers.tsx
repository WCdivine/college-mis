import { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Modal, Form, message, Popconfirm, Card, Typography, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { paperService, studentService, teacherService } from '../services';
import type { Paper, Student, Teacher } from '../types';
import { PapersTableColumns } from '../components/Papers/PapersTableColumns';

const { Title } = Typography;

// 统一的页面样式
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
  searchCard: {
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: '#ffffff',
    marginBottom: '32px',
    animation: 'slideIn 0.6s ease-out',
  },
  tableCard: {
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: '#ffffff',
    animation: 'slideIn 0.8s ease-out',
  },
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
  input: {
    borderRadius: '16px',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: '14px 20px',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
    backgroundColor: '#ffffff',
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
  card: {
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: '#ffffff',
  },
  table: {
    background: 'transparent',
  },
};
import { PaperForm } from '../components/Papers/PaperForm';

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [ownerType, setOwnerType] = useState<'student' | 'teacher'>('student');
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'teacher'>('all');
  const [error, setError] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [form] = Form.useForm();

  const loadPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paperService.getPapers();
      if (response.success) {
        setPapers(response.data || []);
        filterPapers(response.data || []);
      } else {
        const errorMessage = '加载论文数据失败';
        setError(errorMessage);
        message.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = '加载论文数据失败';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadOwners = async () => {
    setLoadingOwners(true);
    setError(null);
    try {
      const [studentRes, teacherRes] = await Promise.all([
        studentService.getStudents(),
        teacherService.getTeachers(),
      ]);
      if (studentRes.success) setStudents(studentRes.data || []);
      if (teacherRes.success) setTeachers(teacherRes.data || []);
    } catch (error: any) {
      const errorMessage = '加载用户数据失败';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoadingOwners(false);
    }
  };

  useEffect(() => {
    loadPapers();
    loadOwners();
  }, []);

  // 当 papers 或 filterType 或 searchText 变化时，重新筛选
  useEffect(() => {
    filterPapers(papers);
  }, [papers, filterType, searchText]);

  // 添加页面进入动画
  useEffect(() => {
    const content = document.getElementById('papers-content');
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
    setEditingPaper(null);
    form.resetFields();
    form.setFieldsValue({ owner_type: 'student' });
    setModalVisible(true);
  };

  const handleEdit = (record: Paper) => {
    setEditingPaper(record);
    setOwnerType(record.owner_type);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await paperService.deletePaper(id);
      message.success('删除成功');
      loadPapers();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // 批量删除功能
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的论文');
      return;
    }

    try {
      setLoading(true);
      // 逐个删除选中的论文
      for (const id of selectedRowKeys) {
        await paperService.deletePaper(id);
      }
      message.success(`成功删除 ${selectedRowKeys.length} 篇论文`);
      setSelectedRowKeys([]);
      loadPapers();
    } catch (error: any) {
      message.error('批量删除失败');
    } finally {
      setLoading(false);
    }
  };

  const filterPapers = (papersList: Paper[]) => {
    let filtered = papersList;
    
    // 按拥有者类型筛选
    if (filterType !== 'all') {
      filtered = filtered.filter(paper => paper.owner_type === filterType);
    }
    
    // 按搜索文本筛选
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(lowerSearchText) ||
        paper.journal?.toLowerCase().includes(lowerSearchText) ||
        paper.authors.toLowerCase().includes(lowerSearchText) ||
        paper.doi?.toLowerCase().includes(lowerSearchText) ||
        getOwnerName(paper.owner_id, paper.owner_type).toLowerCase().includes(lowerSearchText)
      );
    }
    
    setFilteredPapers(filtered);
  };

  // 恢复 getOwnerName 函数，用于搜索筛选
  const getOwnerName = (ownerId: number, ownerType: 'student' | 'teacher') => {
    const list = ownerType === 'student' ? students : teachers;
    const owner = list.find((o) => o.id === ownerId);
    return owner ? owner.name : '未知';
  };

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    filterPapers(papers);
  };

  // 处理筛选类型变化
  const handleFilterChange = (value: 'all' | 'student' | 'teacher') => {
    setFilterType(value);
    filterPapers(papers);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingPaper) {
        await paperService.updatePaper(editingPaper.id, values);
        message.success('更新成功');
      } else {
        await paperService.createPaper(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadPapers();
    } catch (error: any) {
      if (error.message !== 'Validation failed') {
        message.error(error.message);
      }
    }
  };



  // 使用 PapersTableColumns 组件获取表格列定义
  const columns = PapersTableColumns({
    students,
    teachers,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  // 重写操作列，添加编辑和删除按钮
  columns[columns.length - 1] = {
    title: '操作',
    key: 'action',
    width: 180,
    render: (_: any, record: Paper) => (
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
              borderRadius: '8px',
              padding: '6px 16px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            },
          }}
          cancelButtonProps={{
            style: {
              color: '#666',
              borderRadius: '8px',
              padding: '6px 16px',
              fontWeight: '500',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
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
  };

  return (
    <div style={styles.pageContainer}>
      <div id="papers-content" style={{ animation: 'fadeIn 0.8s ease-out' }}>
        {/* 页面标题 */}
        <div style={styles.titleContainer}>
          <Title level={3} style={{ 
            margin: 0, 
            color: '#333',
            fontWeight: '800',
            fontSize: '32px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            论文管理
          </Title>
          <p style={{ 
            margin: '12px 0 0 0', 
            color: '#666',
            fontSize: '16px',
            lineHeight: '1.5',
          }}>
            管理论文信息，包括添加、编辑和删除论文记录
          </p>
          {/* 错误提示 */}
          {error && (
            <div style={{
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
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      
      {/* 添加按钮 */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '300px' }}>
            <Input
              placeholder="搜索论文标题、作者、期刊等"
              value={searchText}
              onChange={handleSearchChange}
              style={{
                ...styles.input,
                flex: 1,
                maxWidth: '500px',
              }}
              disabled={loadingOwners}
            />
            <Select
              value={filterType}
              onChange={handleFilterChange}
              style={{
                ...styles.input,
                width: '180px',
              }}
              disabled={loadingOwners}
            >
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="student">学生</Select.Option>
              <Select.Option value="teacher">教师</Select.Option>
            </Select>
            {loadingOwners && (
              <span style={{ color: '#00bfa5', fontSize: '14px', fontWeight: '500' }}>加载中...</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* 批量删除按钮 */}
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`确定删除选中的 ${selectedRowKeys.length} 篇论文吗？`}
                onConfirm={handleBatchDelete}
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
              >
                <Button
                  danger
                  style={{
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontWeight: '600',
                    border: '1px solid rgba(255, 77, 79, 0.3)',
                    boxShadow: '0 4px 12px rgba(255, 77, 79, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 77, 79, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 77, 79, 0.2)';
                  }}
                >
                  批量删除 ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
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
              新增论文
            </Button>
          </div>
        </div>
      </Card>

      {/* 论文表格 */}
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
          dataSource={filteredPapers}
          rowKey="id"
          loading={{
            spinning: loading,
            indicator: <div className="custom-loading" style={{ padding: '40px 0' }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '16px', color: '#00bfa5', fontWeight: '500' }}>加载中...</p>
            </div>,
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[]),
            selections: [
              {
                key: 'all-data',
                text: '全选',
                onSelect: () => setSelectedRowKeys(filteredPapers.map(paper => paper.id)),
              },
              {
                key: 'clear',
                text: '清空选择',
                onSelect: () => setSelectedRowKeys([]),
              },
            ],
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
          rowClassName="paper-row"
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
          className="paper-table"
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingPaper ? '编辑论文' : '新增论文'}
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
        className="paper-modal"
      >
        <div className="form-container">
          <PaperForm
            form={form}
            ownerType={ownerType}
            onOwnerTypeChange={setOwnerType}
            students={students}
            teachers={teachers}
          />
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

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
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

        .paper-table .ant-table-thead > tr > th {
          background-color: rgba(0, 191, 165, 0.05);
          font-weight: 600;
          color: #333;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding: 20px;
          transition: all 0.3s ease;
        }

        .paper-table .ant-table-thead > tr > th:hover {
          background-color: rgba(0, 191, 165, 0.1);
          transform: translateY(-2px);
        }

        .paper-table .ant-table-tbody > tr > td {
          padding: 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }

        .paper-modal .ant-modal-content {
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

        .paper-modal .ant-modal-header {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          padding: 32px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }

        .paper-modal .ant-modal-title {
          font-size: 24px;
          font-weight: 800;
          color: #333;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .paper-modal .ant-modal-title::before {
          content: '';
          width: 6px;
          height: 32px;
          background: linear-gradient(135deg, #00bfa5 0%, #00897b 100%);
          border-radius: 3px;
        }

        .paper-modal .ant-modal-body {
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

        .paper-modal .ant-modal-footer {
          padding: 24px 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          background: #f8f9fa;
          display: flex;
          gap: 16px;
          justify-content: flex-end;
        }

        .paper-modal .ant-btn {
          min-width: 120px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .paper-modal .ant-form-item-label > label {
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
