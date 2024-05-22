import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Modal, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Antd from './Antd';



const Antdfetch = ({ updateTable }) => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [updateTable, users]);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalVisible(true);
    setImageUrl(user.image.thumbUrl);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`http://localhost:5000/users/${currentUser._id}`, values);
      setIsModalVisible(false);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === currentUser._id ? { ...user, ...values } : user
        )
      );
      message.success('User updated successfully');
    } catch (error) {
      message.error('Failed to update user.');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user.');
    }
  };


  return (
    <>
      <div className="container mt-5">  
        <h2 className='text-center text-success'>USER DATAS</h2>
        <div className='row justify-content-center'>
          <div className='col-md-12'>
            <table className="table table-warning table-striped table-border">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.city}</td>
                    <td>{user.state}</td>
                    <td>
                      <img src={user.image[0].thumbUrl} className='rounded-5' style={{ height: "120px", width: "120px" }} alt="Mobile" />
                    </td>
                    <td>
                      <Button className='btn btn-success mx-2 rounded-0' onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                      <Button className='btn btn-danger rounded-0' onClick={() => handleDelete(user._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>






      <Modal title="Update User" open={isModalVisible} onCancel={handleCancel} footer={null}>
        {currentUser && (
          <Form onFinish={handleUpdate} initialValues={currentUser}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter your first name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter your last name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'The input is not a valid email address!' }, { required: true, message: 'Please enter your email address!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please enter your city!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="State" name="state" rules={[{ required: true, message: 'Please enter your state!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={(e) => e.fileList} rules={[{ required: true, message: 'Please upload your image!' }]}>
              <Upload name="image" listType="picture" maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

const App = () => {
  const [updateTable, setUpdateTable] = useState(false);

  const handleRegister = () => {
    setUpdateTable((prev) => !prev);
  };

  return (
    <div>
      <Antd onRegister={handleRegister} />
      <Antdfetch updateTable={updateTable} />
    </div>
  );
};

export default Antdfetch;
