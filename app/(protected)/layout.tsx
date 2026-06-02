import {AuthButton, redirectByRole} from "@/features/auth";
import { Suspense } from "react";
import {Button} from "@/shared";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full flex flex-col  items-center flex-1">
        {/* Navbar */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Suspense>
                <div className="flex gap-5 items-center font-semibold">
                  <Button onClick={redirectByRole}>FindaDonor</Button>
                </div>

              </Suspense>
            </div>

            {/* Auth Button en el navbar */}
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>


        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
