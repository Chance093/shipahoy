export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </main>
  );
}
