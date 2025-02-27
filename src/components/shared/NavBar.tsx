import Link from "next/link";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center h-16 px-6 pt-12">
      <div className="flex-1 flex justify-center ml-36">
        <Link href="/">
          <h1 className="cursor-pointer text-2xl">NumCore</h1>
        </Link>
      </div>
      <div className="mr-8">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
