import { type ReactNode } from "react";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-600 flex flex-col">
      <Header />

      <main
        className=" mt-20
          flex-1 overflow-auto
           rounded-lg shadow-sm
          mx-auto
          w-full
          lg:w-[1800px]    
          px-2 sm:px-4 lg:px-8
        "
      >
        {children}
      </main>
    </div>
  );
}
