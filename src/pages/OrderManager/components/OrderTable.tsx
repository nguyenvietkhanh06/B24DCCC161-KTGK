import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { updateOrder } from '@/services/OrderManager/api';

interface Props {
  dataSource: OrderManager.OrderItem[];
  loading: boolean;
  sortConfig: { key: string; order: any };
  onEdit: (order: OrderManager.OrderItem) => void;
  reload: () => void;
}
const OrderTable: React.FC<Props> = ({ dataSource, loading, sortConfig, onEdit, reload }) => {
  const handleCancel = async (id: string) => {
    try {
      await updateOrder(id, { status: 'canceled' as any });
      message.success('Đã hủy đơn hàng');
      reload();
    } catch (e) { message.error('Lỗi khi hủy'); }
  };
  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { 
      title: 'Ngày đặt', 
      dataIndex: 'orderDate', 
      key: 'orderDate',
      sortOrder: sortConfig.key === 'orderDate' ? sortConfig.order : null,
      sorter: (a: any, b: any) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (val: number) => `${val?.toLocaleString()} đ`,
      sortOrder: sortConfig.key === 'totalAmount' ? sortConfig.order : null,
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        const currentStatus = status?.toLowerCase();
        const colors = { pending: 'orange', shipping: 'blue', completed: 'green', canceled: 'red' };
        const labels = { 
          pending: 'Chờ xác nhận', 
          shipping: 'Đang giao', 
          completed: 'Hoàn thành', 
          canceled: 'Đã hủy'
        };
        return (
          <Tag color={colors[currentStatus] || 'default'}>
            {labels[currentStatus] || status}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      render: (_: any, record: OrderManager.OrderItem) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            disabled={record.status === 'canceled'} 
            onClick={() => onEdit(record)} 
          />
          <Popconfirm 
            title="Hủy đơn hàng?" 
            disabled={record.status !== 'pending'} 
            onConfirm={() => handleCancel(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} disabled={record.status !== 'pending'} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table dataSource={dataSource} columns={columns} rowKey="id" loading={loading} />;
};
export default OrderTable;