import { Form, Input, Select } from 'antd';
import type { Student, Teacher } from '../../types';

// 样式常量
const styles = {
  input: {
    borderRadius: '16px',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    padding: '16px 20px',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
    backgroundColor: '#ffffff',
  },
  inputFocused: {
    borderColor: '#00bfa5',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04), 0 0 0 3px rgba(0, 191, 165, 0.1), 0 0 0 1px #00bfa5',
    backgroundColor: '#f8fff7',
    transform: 'translateY(-2px)',
  },
  formItem: {
    transition: 'all 0.3s ease',
  },
  formContainer: {
    animation: 'formSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
};

interface PaperFormProps {
  form: any;
  ownerType: 'student' | 'teacher';
  onOwnerTypeChange: (value: 'student' | 'teacher') => void;
  students: Student[];
  teachers: Teacher[];
}

export const PaperForm = ({
  form,
  ownerType,
  onOwnerTypeChange,
  students,
  teachers,
}: PaperFormProps) => {
  return (
    <Form
      form={form}
      layout="vertical"
      style={{
        marginTop: '24px',
      }}
    >
      <div className="form-container" style={styles.formContainer}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Form.Item
            name="owner_type"
            label="拥有者类型"
            rules={[{ required: true, message: '请选择拥有者类型' }]}
            style={styles.formItem}
          >
            <Select 
              onChange={onOwnerTypeChange}
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            >
              <Select.Option value="student">学生</Select.Option>
              <Select.Option value="teacher">教师</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="owner_id"
            label="拥有者"
            rules={[{ required: true, message: '请选择拥有者' }]}
            style={styles.formItem}
          >
            <Select
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            >
              {(ownerType === 'student' ? students : teachers).map((owner) => (
                <Select.Option key={owner.id} value={owner.id}>
                  {owner.name} ({ownerType === 'student' ? (owner as Student).student_id : (owner as Teacher).employee_id})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="论文标题"
            rules={[{ required: true, message: '请输入论文标题' }]}
            style={styles.formItem}
          >
            <Input 
              placeholder="请输入论文标题"
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            />
          </Form.Item>
          <Form.Item 
            name="journal" 
            label="期刊/会议"
            style={styles.formItem}
          >
            <Input 
              placeholder="请输入期刊或会议名称"
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            />
          </Form.Item>
          <Form.Item
            name="publish_date"
            label="发表日期"
            rules={[{ required: true, message: '请输入发表日期' }]}
            style={styles.formItem}
          >
            <Input 
              type="date" 
              placeholder="请输入发表日期"
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            />
          </Form.Item>
          <Form.Item
            name="authors"
            label="作者列表"
            rules={[{ required: true, message: '请输入作者列表' }]}
            style={styles.formItem}
          >
            <Input 
              placeholder="多个作者用逗号分隔" 
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            />
          </Form.Item>
          <Form.Item 
            name="doi" 
            label="DOI"
            style={{ gridColumn: '1 / -1', ...styles.formItem }}
          >
            <Input 
              placeholder="10.xxxx/xxxxx" 
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};
