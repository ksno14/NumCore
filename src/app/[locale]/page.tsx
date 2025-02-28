import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import LPFirst from "@/assets/images/home/LPFirst.webp";
import NavBar from "@/components/shared/NavBar";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  const t = useTranslations("Home");
  return (
    <div className="min-h-screen  bg-white text-black">
      <div className=" pr-9 pl-2 pb-9 ">
        <NavBar />
        <div className="flex flex-1 m-9 sm:m-10">
          <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-200 rounded-lg sm:w-3/4 border border-gray-300 shadow-xl">
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
        <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-200 rounded-lg w-fit border border-gray-300 shadow-xl">
          <div className="flex flex-col items-center">
            <h2 className=" text-2xl font-bold text-gray-800 mb-4">
            {t("contributeTitle")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
            {t("contributeDescription")}
            </p>
            <div className="mt-4">
              <Link
                href="https://github.com/your-repo"
                target="_blank"
                className="text-gray-800 hover:text-gray-600 flex justify-center items-center"
              >
                <FaGithub className="text-3xl" />
                <span className="ml-2">{t("github")}</span>
              </Link>
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
    </div>
  );
}
