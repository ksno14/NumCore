import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import LPFirst from "@/assets/images/home/LPFirst.webp";
import NavBar from "@/components/shared/NavBar";

export default function Home() {
  const t = useTranslations("Home");
  return (
    <div className="min-h-screen bg-white text-black">
      <NavBar />
      <div className="flex flex-1 m-4 sm:m-10">
        <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-200 rounded-lg w-3/4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center ml-0 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                {t("title")}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                {t("description")}
              </p>
              <Link href="/calculator" className="lg:w-3/4 xl:w-3/6 w-full">
                <button className="bg-indigo-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full mt-5 w-full">
                  {t("button")}
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <Image
                src={LPFirst}
                alt="img chat"
                width={600}
                height={600}
                priority={true}
                className="rounded-lg shadow-lg max-w-full h-auto w-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} NumCore
          </p>
        </div>
      </footer>
    </div>
  );
}
