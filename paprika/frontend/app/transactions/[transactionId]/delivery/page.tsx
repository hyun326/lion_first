import DeliveryTransactionFlow from '@/components/transaction/DeliveryTransactionFlow';

export default function DeliveryTransactionPage({
  params,
}: {
  params: { transactionId: string };
}) {
  return (
    <main>
      <DeliveryTransactionFlow transactionId={Number(params.transactionId)} />
    </main>
  );
}
