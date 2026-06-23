export default function DeliveryTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main style={{ padding: '40px' }}>
      <h1>택배거래 페이지</h1>
      <p>상품 ID: {params.id}</p>
    </main>
  );
}
