import SignInButtons from "./components/SignInButtons";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <section className="flex flex-1 flex-col items-center justify-center gap-12">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl">ProGlo Shipping</h1>
          <h2 className="text-3xl">Affordable Costs</h2>
        </div>

        <SignInButtons />
      </section>
      <section className="relative flex-1">
        <Image
          src="/jiawei-zhao-BsXeYX3efOI-unsplash.jpg"
          fill={true}
          alt="Picture of the author"
          className=""
        />
      </section>
    </main>
  );
}
