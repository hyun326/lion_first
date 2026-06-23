import TransactionDetail from '@/components/transaction/TransactionDetail';

export default function TransactionDetailPage({
  params,
}: {
  params: { transactionId: string };
}) {
  return (
    <main>
      <TransactionDetail transactionId={Number(params.transactionId)} />
    </main>
  );
}
