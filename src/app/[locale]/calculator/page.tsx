import { useTranslations } from "next-intl";
import Image from "next/image";
import Interpolation from "@/assets/images/calculator/interpolation.png";
import Graphs from "@/assets/images/calculator/Graphs.jpg";
import Roots from "@/assets/images/calculator/Roots.svg";
import NTHRoot from "@/assets/images/calculator/nth-root.svg";
import NavBar from "@/components/shared/NavBar";

export default function Calculator() {
  const t = useTranslations("Calculator");
  return (
    <div className="min-h-screen bg-white text-black ">
      <NavBar />
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-4xl font-bold mb-6 mt-10 text-center">
          {t("title")}
        </h1>
        <p className="text-lg text-center w-3/4 mb-4">{t("description")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mt-8">
          <div className="flex flex-col items-center h-full">
            <div className="flex-1 flex items-center">
              <Image
                src={Roots}
                alt="img roots"
                width={250}
                height={250}
                priority={true}
                className="max-w-sm rounded-lg shadow-lg"
              />
            </div>
            <p className="mt-2 text-center h-16 flex items-center justify-center">
              {t("roots")}
            </p>
          </div>
          <div className="flex flex-col items-center h-full">
            <div className="flex-1 flex items-center">
              <Image
                src={Interpolation}
                alt="img interpolation"
                width={180}
                height={180}
                priority={true}
                className="max-w-sm rounded-lg shadow-lg"
              />
            </div>
            <p className="mt-2 text-center h-16 flex items-center justify-center">
              {t("interpolate")}
            </p>
          </div>
          <div className="flex flex-col items-center h-full">
            <div className="flex-1 flex items-center">
              <Image
                src={NTHRoot}
                alt="img nth-root"
                width={200}
                height={200}
                priority={true}
                className="max-w-sm rounded-lg shadow-lg"
              />
            </div>
            <p className="mt-2 text-center h-16 flex items-center justify-center">
              {t("rooting")}
            </p>
          </div>
          <div className="flex flex-col items-center h-full">
            <div className="flex-1 flex items-center">
              <Image
                src={Graphs}
                alt="img graphs"
                width={300}
                height={300}
                priority={true}
                className="max-w-sm rounded-lg shadow-lg"
              />
            </div>
            <p className="mt-2 text-center h-16 flex items-center justify-center">
              {t("graphs")}
            </p>
          </div>
        </div>

        <p className="text-lg text-center max-w-2xl mt-6 mb-6">{t("footer")}</p>
      </div>
    </div>
  );
}
