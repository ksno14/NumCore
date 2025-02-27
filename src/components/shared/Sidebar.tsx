"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FaBars, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";

export default function Sidebar() {
  const t = useTranslations("Sidebar");
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const pathname = usePathname();

  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, "");

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    {
      title: t("findRoots"),
      submenu: [
        { name: "Newton-Raphson", path: "/calculator/roots/newton-raphson" },
        { name: t("bisection"), path: "/calculator/roots/biseccion" },
      ],
    },
    {
      title: t("interpolation"),
      submenu: [
        { name: "Newton", path: "/calculator/interpolate/newton" },
        { name: "Lagrange", path: "/calculator/interpolate/lagrange" },
      ],
    },
    {
      title: t("rooting"),
      submenu: [
        {
          name: t("iterativeRooting"),
          path: "/calculator/rooting/iterative-rooting",
        },
      ],
    },
  ];

  return (
    <div className="ml-6 text-black">
      <button
        className="sticky top-6 p-2 text-gray-500 hover:bg-gray-300 rounded-full mt-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={24} />
      </button>

      <div
        className={`fixed left-0 top-0 w-64 h-full bg-gray-100 p-4 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="text-xl font-bold block mb-4"
          onClick={() => setIsOpen(false)}
        >
          x
        </button>

        <ul>
          {menuItems.map((item, index) => {
            const isActive = item.submenu.some(
              (subItem) => subItem.path === cleanPathname
            );
            return (
              <li key={index} className="mb-2">
                <button
                  className={`flex justify-between w-full text-left p-2 rounded-md hover:bg-gray-300 ${
                    isActive ? "bg-gray-300" : ""
                  }`}
                  onClick={() =>
                    setOpenSubmenu(openSubmenu === index ? null : index)
                  }
                >
                  {item.title}{" "}
                  {item.submenu.length > 0 &&
                    (openSubmenu === index ? (
                      <FaChevronUp size={16} />
                    ) : (
                      <FaChevronDown size={16} />
                    ))}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openSubmenu === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="ml-4 mt-2 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className={`p-2 rounded-md cursor-pointer hover:bg-gray-300 ${
                          cleanPathname === subItem.path ? "bg-gray-300" : ""
                        }`}
                      >
                        <Link
                          href={subItem.path}
                          className="block w-full h-full"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
