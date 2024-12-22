import { PaymentMethod, SaleType } from "@prisma/client";

export interface SaleRequestBody {
  customerId: string;
  customerName: string;
  customerEmail: string;
  saleAmount: number;
  balanceAmount: number;
  paidAmount: number;
  saleType: SaleType;
  paymentMethod: PaymentMethod;
  transactionCode: string;
  saleItems: SaleItem[];
  shopId: string;
}

export interface SaleItem {
  saleId: string;
  productId: string;
  qty: number;
  productPrice: number;
  productName: string;
  productImage: string;
}
