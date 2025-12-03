"use client";

import React from "react";
import styles from "./about.module.scss";

interface TableOfContentsProps {
  structure: {
    title: string;
    display: boolean;
    items: string[];
  }[];
  about: {
    tableOfContent: {
      display: boolean;
      subItems: boolean;
    };
  };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
  const scrollTo = (id: string, offset: number) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (!about.tableOfContent.display) return null;

  return (
    <div
      className={`fixed left-0 pl-6 flex flex-col gap-8 ${styles.hideOnMedium}`}
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
      }}
    >
      {structure
        .filter((section) => section.display)
        .map((section, sectionIndex) => (
          <div key={sectionIndex} className="flex flex-col gap-3">
            <div
              className={`flex gap-2 items-center cursor-pointer ${styles.hover}`}
              onClick={() => scrollTo(section.title, 80)}
            >
              <div className="h-px min-w-4 bg-gray-900 dark:bg-white" />
              <span className="text-sm text-gray-900 dark:text-white">
                {section.title}
              </span>
            </div>
            {about.tableOfContent.subItems && (
              <>
                {section.items.map((item, itemIndex) => (
                  <div
                    className={`${styles.hideOnLarge} ${styles.hover} cursor-pointer flex gap-3 pl-6 items-center`}
                    key={itemIndex}
                    onClick={() => scrollTo(item, 80)}
                  >
                    <div className="h-px min-w-2 bg-gray-900 dark:bg-white" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {item}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default TableOfContents;
