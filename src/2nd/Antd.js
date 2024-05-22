import axios from 'axios';
import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Upload, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import logmobile from '../media/logmobile.jpg';
import Antdfetch from '../2nd/Antdfetch';

const Antd = ({ onRegister }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  const onFinish = async (values) => {
    try {
      if (!values.image || values.image.length === 0) {
        throw new Error('Please select an image.');
      }
      const formData = new FormData();
      formData.append('file', values.image[0].originFileObj);
      const imageUrl = formData.imageUrl;
      const dataToInsert = { ...values, imageUrl };
      await axios.post('http://localhost:5000/submitForm', dataToInsert);
      form.resetFields();
      message.success('Registration successful.');

    } catch (error) {
      console.error('Error registering user:', error);
      message.error(error.message || 'Failed to register user. Please try again later.');
    }
  };

  return (
    <div className='container-fluid userlog'>
      <div className='row d-flex justify-content-center align-items-center vh-100'>
        <div className='col-md-2 p-5 bg-opacity-50 bg-warning rounded-start-4 position-relative' style={{ height: '520px' }}>
          <div className='position-absolute top-25' style={{ left: '-70px' }}>
            <img src={logmobile} className='rounded-4' style={{ width: '240px', height: '395px' }} alt='background' />
          </div>
        </div>
        <div className='col-md-6 p-4 bg-opacity-75 bg-light rounded-end-4' style={{ height: '520px' }}>
          <h5 className='text-center'>User Register</h5>
          <hr />
          <Form form={form} name="register" onFinish={onFinish} scrollToFirstError layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter your first name!' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Enter your first name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please enter your last name!' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Enter your last name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'The input is not a valid email address!' }, { required: true, message: 'Please enter your email address!' }]}>
                  <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter your city!' }]}>
                  <Input placeholder="Enter your city" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="state" label="State" rules={[{ required: true, message: 'Please enter your state!' }]}>
                  <Input placeholder="Enter your state" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={(e) => e.fileList} rules={[{ required: true, message: 'Please upload your image!' }]}>
                  <Upload name="image" listType="picture" maxCount={1} beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Select Image</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Register</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <Antdfetch updateTable={onRegister} />
    </div>
  );
};

export default Antd;
