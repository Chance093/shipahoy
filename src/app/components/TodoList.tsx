'use client';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';

type Todo = {
  id: number;
  done: number | null;
  content: string | null;
};

export default function TodoList({ initTodos }: { initTodos: Todo[] }) {
  const todos = trpc.getTodos.useQuery(undefined, {
    initialData: initTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      todos.refetch();
    },
  });
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      todos.refetch();
    },
  });

  const [content, setContent] = useState('');

  async function submitTodo() {
    if (content.length) {
      addTodo.mutate(content);
      setContent('');
    }
  }

  async function checkTodo(todo: Todo) {
    setDone.mutate({
      id: todo.id,
      done: todo.done ? 0 : 1,
    });
  }

  return (
    <div>
      <div>
        {todos?.data?.map((todo) => (
          <div key={todo.id}>
            <input
              type='checkbox'
              id={`check-${todo.id}`}
              checked={!!todo.done}
              onChange={() => checkTodo(todo)}
            />
            <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
          </div>
        ))}
      </div>
      <div>
        <label htmlFor='content'>Content</label>
        <input
          type='text'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={submitTodo}>Add Todo</button>
      </div>
    </div>
  );
}
