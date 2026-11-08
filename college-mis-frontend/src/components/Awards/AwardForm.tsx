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

interface AwardFormProps {
  form: any;
  ownerType: 'student' | 'teacher';
  onOwnerTypeChange: (value: 'student' | 'teacher') => void;
  students: Student[];
  teachers: Teacher[];
}

export const AwardForm = ({
  form,
  ownerType,
  onOwnerTypeChange,
  students,
  teachers,
}: AwardFormProps) => {
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
          {/* 拥有者类型 */}
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

          {/* 拥有者 */}
          <Form.Item
            name="owner_id"
            label="拥有者"
            rules={[{ required: true, message: '请选择拥有者' }]}
            style={styles.formItem}
          >
            <Select
              style={styles.input}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            >
              {(ownerType === 'student' ? students : teachers).map((owner) => (
                <Select.Option 
                  key={owner.id} 
                  value={owner.id}
                  label={owner.name}
                >
                  {owner.name} ({ownerType === 'student' ? (owner as Student).student_id : (owner as Teacher).employee_id})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 获奖名称 */}
          <Form.Item
            name="title"
            label="获奖名称"
            rules={[{ required: true, message: '请输入获奖名称' }]}
            style={styles.formItem}
          >
            <Input 
              placeholder="请输入获奖名称"
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            />
          </Form.Item>

          {/* 级别 */}
          <Form.Item
            name="level"
            label="级别"
            rules={[{ required: true, message: '请选择获奖级别' }]}
            style={styles.formItem}
          >
            <Select
              style={styles.input}
              placeholder="请选择获奖级别"
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            >
              <Select.Option value="国家级">国家级</Select.Option>
              <Select.Option value="省级">省级</Select.Option>
              <Select.Option value="校级">校级</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          {/* 获奖日期 */}
          <Form.Item
            name="date"
            label="获奖日期"
            rules={[{ required: true, message: '请选择获奖日期' }]}
            style={styles.formItem}
          >
            <Input 
              type="date" 
              placeholder="请选择获奖日期"
              style={styles.input}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, styles.inputFocused);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, styles.input);
              }}
            />
          </Form.Item>

          {/* 描述 */}
          <Form.Item 
            name="description" 
            label="描述"
            style={{ gridColumn: '1 / -1', ...styles.formItem }}
          >
            <Input.TextArea 
              placeholder="请输入获奖描述（可选）"
              rows={4}
              style={{
                ...styles.input,
                resize: 'vertical' as const,
              }}
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
