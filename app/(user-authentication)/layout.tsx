import Image from "next/image";

export default function UserAuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:grid md:min-h-screen md:place-items-center p-8">
      <main className="flex flex-col gap-16 md:items-center">
        <Image
          src="/logo-devlinks-large.svg"
          height={175}
          width={175}
          alt="Dev Links Logo"
        />
        {children}
      </main>
    </div>
  );
}
