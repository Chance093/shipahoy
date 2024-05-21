"use client";

export default function Pagination({ page, decrementPage, incrementPage }: { page: number; decrementPage: () => void; incrementPage: () => void }) {
  return (
    <div>
      <button onClick={decrementPage}>Back</button>
      <div>{page}</div>
      <button onClick={incrementPage}>Forward</button>
    </div>
  );
}
