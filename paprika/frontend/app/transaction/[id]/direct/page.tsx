export default function DirectTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main style={{ padding: '40px' }}>
      <h1>직거래 페이지</h1>
      <p>상품 ID: {params.id}</p>
    </main>
  );
}
