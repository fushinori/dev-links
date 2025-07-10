import Image from "next/image";

export default function UserAuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col gap-4 items-center">
        <Image src="/logo-devlinks-large.svg" height={175} width={175} alt="" />
        {children}
      </div>
    </div>
  );
}
