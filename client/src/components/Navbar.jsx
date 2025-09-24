import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Grid, Space, Typography } from 'antd';
import { MenuOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import AuthContext from '../contexts/AuthContext';

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = isAuthenticated
    ? currentUser.role === 'admin'
      ? '/admin/dashboard'
      : currentUser.role === 'staff'
        ? '/staff/dashboard'
        : '/my-tickets'
    : '/';

  const menuItems = isAuthenticated && currentUser
    ? (currentUser.role === 'admin'
      ? [
          { key: 'dashboard', label: <Link to="/admin/dashboard">Admin Dashboard</Link> },
          { key: 'tickets', label: <Link to="/admin/tickets">All Tickets</Link> },
          { key: 'workload', label: <Link to="/admin/staff-workload">Staff Workload</Link> },
          { key: 'users', label: <Link to="/admin/users">User Management</Link> }
        ]
      : [
          { key: 'dashboard', label: <Link to="/staff/dashboard">Staff Dashboard</Link> },
          { key: 'mytickets', label: <Link to="/staff/my-tickets">My Tickets</Link> }
        ])
    : [];

  // รอให้ currentUser กับ isAuthenticated พร้อมก่อนใช้ screens
  const ready = typeof window !== 'undefined' && isAuthenticated && currentUser;

  useEffect(() => {}, [currentUser]); // บังคับ React re-render ตอน currentUser มา

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        overflowX: 'auto'
      }}
    >
      <Link to={dashboardLink}>
        <Text strong style={{ fontSize: 18 }}>MyHelpdesk</Text>
      </Link>

      {ready && screens.lg ? (
        <Space>
          {/* แก้ปัญหาเมนูหายบนจอเล็ก/กลาง โดยเพิ่ม minWidth และ overflowX */}
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{
              minWidth: 280,         // ให้มีความกว้างพอสำหรับแสดงเมนูทั้งหมด
              overflowX: 'visible'   // ป้องกันเมนูไม่ให้ collapse เป็น "..."
            }}
          />
          <Space>
            <UserOutlined />
            <Text>{currentUser.full_name || currentUser.username} ({currentUser.role})</Text>
            <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout} danger>
              Logout
            </Button>
          </Space>
        </Space>
      ) : (
        <>
          <Button icon={<MenuOutlined />} onClick={() => setOpen(true)} />
          <Drawer
            title={currentUser ? `${currentUser.full_name} (${currentUser.role})` : 'Menu'}
            placement="right"
            onClose={() => setOpen(false)}
            open={open}
            bodyStyle={{ padding: 0 }}
          >
            <Menu
              mode="vertical"
              items={[
                ...menuItems,
                isAuthenticated
                  ? {
                      key: 'logout',
                      label: (
                        <Button
                          block
                          type="link"
                          icon={<LogoutOutlined />}
                          onClick={handleLogout}
                          danger
                        >
                          Logout
                        </Button>
                      )
                    }
                  : {
                      key: 'login',
                      label: (
                        <Link to="/login">
                          <Button type="primary" block>Login</Button>
                        </Link>
                      )
                    }
              ]}
              onClick={() => setOpen(false)}
            />
          </Drawer>
        </>
      )}
    </Header>
  );
};

export default Navbar;
