declare namespace OrderManager {
  export enum OrderStatus {
    PENDING = 'pending',     
    SHIPPING = 'shipping',  
    COMPLETED = 'completed', 
    CANCELED = 'canceled'    
  }

  export interface Product {
    id: string;
    name: string;
    price: number;
  }

  export interface Customer {
    id: string;
    name: string;
    phone: string;
  }


  export interface OrderItem {
    id: string;             
    customerName: string;   
    orderDate: string;      
    productIds: string[];   
    totalAmount: number;    
    status: OrderStatus;    
  }
}