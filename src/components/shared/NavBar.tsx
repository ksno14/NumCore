import Link from "next/link";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center h-16 sm:px-6 pt-12 gap-4">
      <div className="flex-1 flex justify-center ml-36">
        <Link href="/">
          <h1 className="cursor-pointer text-2xl">NumCore</h1>
        </Link>
      </div>
      <div className="sm:mr-8">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}


