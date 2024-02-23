import OrderDetails from '@/components/pages/Account/OrderDetails';

const OrderDetailsPage = ({ params }: { params: { id: string } }) => (
  <OrderDetails orderId={params.id} />
);

export default OrderDetailsPage;
