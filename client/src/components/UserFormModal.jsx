import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Spin } from 'antd';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import userService from '../services/userService';

const UserFormModal = ({ user, onClose, onSaveSuccess }) => {
  const [form] = Form.useForm();
  const [isNewUser, setIsNewUser] = useState(!user);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const isNew = !user;
    setIsNewUser(isNew);

    const initial = {
      username: user?.username || '',
      email: user?.email || '',
      full_name: user?.full_name || '',
      role: user?.role || 'staff',
      password: '',
      phone: user?.phone || '',
      line_user_id: user?.line_user_id || '',
    };

    form.setFieldsValue(initial);
    setInitialValues(initial);
    setIsChanged(false);
  }, [user, form]);

  const shallowCompare = (a, b) => {
    const normalize = (v) => (v == null ? '' : String(v).trim());
    return Object.keys({ ...a, ...b }).some((key) => normalize(a[key]) !== normalize(b[key]));
  };

  const onValuesChange = (_, values) => {
    setIsChanged(shallowCompare(initialValues, values));
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (!isNewUser) {
        const confirm = await Swal.fire({
          title: 'ยืนยันการแก้ไข?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'ใช่',
          cancelButtonText: 'ยกเลิก',
        });
        if (!confirm.isConfirmed) return;
      }

      const payload = {
        username: values.username.trim(),
        email: values.email.trim(),
        full_name: values.full_name?.trim() || null,
        role: values.role,
        phone: values.phone?.trim() || null,
        line_user_id: values.line_user_id?.trim() || null,
        ...(isNewUser || values.password ? { password: values.password } : {}),
      };

      const res = isNewUser
        ? await userService.createUserByAdmin(payload)
        : await userService.updateUserByAdmin(user.user_id, payload);

      if (res.success || res.user_id || res?.data?.user_id) {
        toast.success(isNewUser ? 'เพิ่มผู้ใช้สำเร็จ' : 'แก้ไขสำเร็จ');
        onSaveSuccess();
        setIsChanged(false);
      } else {
        throw new Error(res.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      toast.error(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open
      title={isNewUser ? 'เพิ่มผู้ใช้ใหม่' : `แก้ไขผู้ใช้: ${user?.username}`}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={onValuesChange}
        >
          <Form.Item label="Username" name="username" rules={[{ required: true, message: 'กรุณากรอก Username' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'กรุณากรอก Email' }]}>
            <Input type="email" />
          </Form.Item>

          <Form.Item label="Full Name" name="full_name">
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="staff">Staff</Select.Option>
              <Select.Option value="requester">Requester</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={`Password ${isNewUser ? '(จำเป็น)' : '(เว้นว่างหากไม่เปลี่ยน)'}`}
            name="password"
            rules={
              isNewUser
                ? [
                    { required: true, message: 'กรุณากรอกรหัสผ่าน' },
                    { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                  ]
                : []
            }
          >
            <Input.Password placeholder={isNewUser ? 'ขั้นต่ำ 6 ตัวอักษร' : 'เว้นว่างหากไม่เปลี่ยน'} />
          </Form.Item>

          <Form.Item
            label="เบอร์โทรศัพท์"
            name="phone"
            rules={[{ pattern: /^[0-9]{9,10}$/, message: 'กรอกเฉพาะตัวเลข 9-10 หลัก' }]}
          >
            <Input
              addonBefore="+66"
              placeholder="เช่น 812345678"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // ลบทุกอย่างที่ไม่ใช่เลข
                form.setFieldsValue({ phone: value });
              }}
            />
          </Form.Item>

          <Form.Item
            label="LINE User ID (Optional)"
            name="line_user_id"
            rules={[
              {
                validator: (_, value) =>
                  !value || /^U.{9,}$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error('ต้องขึ้นต้นด้วย U และมีความยาวอย่างน้อย 10 ตัวอักษร')),
              },
            ]}
          >
            <Input placeholder="เช่น Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading} disabled={!isNewUser && !isChanged}>
              {isNewUser ? 'เพิ่มผู้ใช้' : 'บันทึก'}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UserFormModal;
