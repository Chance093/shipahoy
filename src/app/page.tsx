import { serverClient } from '@/app/_trpc/server';

export default async function Home() {
  return (
    <main>
      <div>Hello World!</div>
    </main>
  );
}
