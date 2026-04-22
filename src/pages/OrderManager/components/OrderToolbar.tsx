import React from 'react';
import { Space, Input, Select } from 'antd';

const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
  onFilter: (value: string | null) => void;
  onSort: (value: string) => void;
}

const OrderToolbar: React.FC<Props> = ({ onSearch, onFilter, onSort }) => {
  return (
    <Space style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
      <Search 
        placeholder="Tìm mã hoặc khách hàng" 
        onSearch={onSearch} 
        style={{ width: 220 }} 
        allowClear
      />
      
      <Select 
        placeholder="Lọc trạng thái" 
        style={{ width: 150 }} 
        allowClear 
        onChange={onFilter}
      >
        <Select.Option value="pending">Chờ xác nhận</Select.Option>
        <Select.Option value="shipping">Đang giao</Select.Option>
        <Select.Option value="completed">Hoàn thành</Select.Option>
        <Select.Option value="canceled">Đã hủy</Select.Option>
      </Select>

      <Select 
        placeholder="Sắp xếp theo..." 
        style={{ width: 180 }} 
        allowClear 
        onChange={onSort}
      >
        <Select.Option value="date">Ngày đặt hàng (Mới nhất)</Select.Option>
        <Select.Option value="amount">Tổng tiền (Cao nhất)</Select.Option>
      </Select>
    </Space>
  );
};

export default OrderToolbar;