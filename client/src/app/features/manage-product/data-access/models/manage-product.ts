
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
  }


export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    registrationDate: Date;
    active: boolean;
  }


export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Commande {
  id: number;
  clientId: number;
  orderDate: Date;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  paymentStatus: boolean;
  notes: string;
  lignesCMD?: LigneCMD[];
}

export interface LigneCMD {
    id: number;
    commandeId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }