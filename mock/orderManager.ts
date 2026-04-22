import { Request, Response } from 'express';


const customers = [
  { id: 'C001', name: 'Nguyễn Văn A', phone: '0901234567' },
  { id: 'C002', name: 'Trần Thị B', phone: '0907654321' },
  { id: 'C003', name: 'Lê Văn C', phone: '0911223344' },
];


const products = [
  { id: 'P001', name: 'iPhone 15 Pro Max', price: 35000000 },
  { id: 'P002', name: 'MacBook M3 Air', price: 28000000 },
  { id: 'P003', name: 'AirPods Pro 2', price: 5500000 },
  { id: 'P004', name: 'Apple Watch Series 9', price: 10500000 },
];


let orders = [
  {
    id: 'ORD-001',
    customerName: 'Nguyễn Văn A',
    orderDate: '2026-04-20 10:30',
    productIds: ['P001', 'P003'],
    totalAmount: 40500000,
    status: 'pending', 
  },
];

export default {
  
  'GET /api/order-manager/init-data': (req: Request, res: Response) => {
    res.send({ 
      success: true, 
      customers: customers,
      products: products
    });
  },

  
  'GET /api/order-manager/orders': (req: Request, res: Response) => {
    res.send({ success: true, data: orders });
  },

 
  'POST /api/order-manager/orders': (req: Request, res: Response) => {
    const newOrder = req.body;
    
    
    const isExist = orders.some(o => o.id === newOrder.id);
    if (isExist) {
      return res.status(400).send({ success: false, message: 'Mã đơn hàng đã tồn tại!' });
    }

    orders.push(newOrder);
    res.send({ success: true, message: 'Tạo đơn hàng thành công' });
  },

  
  'PUT /api/order-manager/orders/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = orders.findIndex(o => o.id === id);
    if (index > -1) {
      orders[index] = { ...orders[index], ...req.body };
      res.send({ success: true });
    } else {
      res.status(404).send({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
  },
};