import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message, InputNumber } from 'antd';
import { useModel } from 'umi';
import { addOrder, updateOrder } from '@/services/OrderManager/api';

interface Props {
  visible: boolean;
  setVisible: (v: boolean) => void;
  record: OrderManager.OrderItem | null;
  reload: () => void;
}

const OrderForm: React.FC<Props> = ({ visible, setVisible, record, reload }) => {
  const [form] = Form.useForm();
  
  
  const { customers = [], products = [], calculateTotal, isIdDuplicate } = useModel('useOrderStore');

  const productIds = Form.useWatch('productIds', form);

  useEffect(() => {
    if (visible) {
      if (record) {
        form.setFieldsValue({
          ...record,
          status: record.status?.toString() 
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ 
          status: 'pending', 
          orderDate: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
          productIds: [] 
        });
      }
    }
  }, [visible, record, form]);

  useEffect(() => {
    if (visible && calculateTotal) {
      const total = calculateTotal(productIds || []);
      form.setFieldsValue({ totalAmount: total });
    }
  }, [productIds, visible, calculateTotal, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (!record && isIdDuplicate?.(values.id)) {
        message.error('Mã đơn hàng này đã tồn tại!');
        return;
      }

      const payload = {
        ...values,
        totalAmount: values.totalAmount || 0
      };

      if (record) {
        await updateOrder(record.id, payload);
        message.success('Cập nhật thành công');
      } else {
        await addOrder(payload);
        message.success('Tạo đơn mới thành công');
      }
      
      setVisible(false);
      reload();
    } catch (error) {
      console.error('Validate failed:', error);
    }
  };

  return (
    <Modal
      title={record ? "Chỉnh sửa đơn hàng" : "Tạo đơn hàng mới"}
      visible={visible} 
      open={visible}    
      onOk={handleSave}
      onCancel={() => setVisible(false)}
      width={600}
      destroyOnClose
      okText="Lưu đơn hàng"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="id" 
          label="Mã đơn hàng" 
          rules={[{ required: true, message: 'Không được để trống mã đơn!' }]}
        >
          <Input placeholder="Ví dụ: ORD-123" disabled={!!record} />
        </Form.Item>

        <Form.Item 
          name="customerName" 
          label="Khách hàng" 
          rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
        >
          <Select placeholder="Chọn khách hàng">
            {customers?.map(c => (
              <Select.Option key={c.id} value={c.name}>{c.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="productIds" 
          label="Sản phẩm (Được chọn nhiều)" 
          rules={[{ required: true, message: 'Chọn ít nhất 1 sản phẩm!' }]}
        >
          <Select mode="multiple" placeholder="Chọn các sản phẩm" allowClear>
            {products?.map(p => (
              <Select.Option key={p.id} value={p.id}>
                {p.name} - {p.price?.toLocaleString()} đ
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="totalAmount" label="Tổng tiền tự động (VNĐ)">
          <InputNumber 
            readOnly 
            style={{ width: '100%', backgroundColor: '#f5f5f5', fontWeight: 'bold', color: '#000' }} 
            formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
          />
        </Form.Item>
        <Form.Item 
          name="orderDate" 
          label="Ngày đặt hàng"
        >
          <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái đơn hàng" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="pending">Chờ xác nhận</Select.Option>
            <Select.Option value="shipping">Đang giao</Select.Option>
            <Select.Option value="completed">Hoàn thành</Select.Option>
            <Select.Option value="canceled">Hủy</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderForm;