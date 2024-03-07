type Card = {
  title: string;
  body: string | number;
  children: React.ReactNode;
};

export default function Card({ title, body, children }: Card) {
  return (
    <section className="h-48 w-80 rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between rounded-2xl bg-radial-gradient p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-custom-gray/10">{children}</div>
          <p className="text-xl">{title}</p>
        </div>
        <p className="py-4 text-5xl">{body}</p>
      </div>
    </section>
  );
}
