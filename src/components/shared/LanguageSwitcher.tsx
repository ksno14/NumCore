"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("LanguageSwitcher");

  const initialLocale = locale === "es" ? "ES" : "US";

  const [selected, setSelected] = useState(initialLocale);

  const handleCountryChange = (code: string) => {
    setSelected(code);
    const nextLocale = code === "US" ? "en" : code.toLowerCase();

    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      //       // are used in combination with a given `pathname`. Since the two will
      //       // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: nextLocale as Locale }
    );
  };

  return (
    <ReactFlagsSelect
      countries={["US", "ES"]}
      customLabels={{ US: t("US"), ES: t("ES") }}
      selected={selected}
      onSelect={handleCountryChange}
      searchPlaceholder={t("placeholder")}
    />
  );
}
