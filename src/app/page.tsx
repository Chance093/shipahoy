import SignInButtons from './components/SignInButtons';

export default async function Home() {
  return (
    <main className=''>
      <div className='bg-red-500'>Welcome to home page</div>
      <SignInButtons />
    </main>
  );
}
