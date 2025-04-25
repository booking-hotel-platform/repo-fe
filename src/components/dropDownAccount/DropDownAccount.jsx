import { Avatar, Dropdown, Space, Modal, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/authSlice';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const DropDownAccount = () => {
  const { user } = useSelector(state => state.auth);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      try {
        const decodedToken = jwtDecode(user); // Giải mã JWT
        form.setFieldsValue({
          name: decodedToken.username || '', // Gán username vào form
          email: decodedToken.email || '', // Gán email vào form nếu có
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [user, form]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleProfile = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        // Xử lý lưu thông tin người dùng ở đây
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const items = [
    {
      key: '1',
      label: 'My Account',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Profile',
      extra: '⌘P',
      onClick: handleProfile,
    },
    {
      key: '3',
      label: 'Logout',
      extra: '⌘L',
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{
          items,
          style: {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <a href="##" onClick={(e) => e.preventDefault()}>
          <Space>
            <Avatar
              icon={<UserOutlined />}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </Space>
        </a>
      </Dropdown>

      <Modal
        title="User Information"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
          >
            <Input />
          </Form.Item>
          {/* Thêm các trường thông tin khác nếu cần */}
        </Form>
      </Modal>
    </>
  );
};

export default DropDownAccount;
