import { serverClient } from '@/app/_trpc/server';
import TodoList from './_components/TodoList';

export default async function Home() {
  const todos = await serverClient.getTodos();

  return (
    <main>
      <div>
        <TodoList initTodos={todos} />
      </div>
    </main>
  );
}
