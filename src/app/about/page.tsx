import { Metadata } from 'next';
import { baseURL, about, person, social } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Meta, SchemaScript } from '@/lib/seo';
import { Globe, Calendar, ChevronRight, Grid3X3, Mail } from 'lucide-react';

// Custom Dragon icon
const DragonIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2 0-4 1-5 3-1-1-3-1-4 0s-1 3 0 4c-2 1-3 3-3 5 0 3 2 5 5 6l2 2c1 1 2 2 5 2s4-1 5-2l2-2c3-1 5-3 5-6 0-2-1-4-3-5 1-1 1-3 0-4s-3-1-4 0c-1-2-3-3-5-3z"/>
    <circle cx="9" cy="10" r="1"/>
    <circle cx="15" cy="10" r="1"/>
    <path d="M9 14c.5.5 1.5 1 3 1s2.5-.5 3-1"/>
  </svg>
);

// Icon mapping for social links
const iconMap: Record<string, React.ReactNode> = {
  github: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
  linkedin: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
  x: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  email: <Mail className="w-4 h-4" />,
  grid: <Grid3X3 className="w-4 h-4" />,
  dragon: <DragonIcon />,
  save: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
};

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];

  // Calculate years worked helper function
  const calculateYears = (timeframe: string) => {
    const parts = timeframe.split(" - ");
    const startDate = parts[0];
    const endDate = parts[1];

    // Extract years
    const startYear = parseInt(startDate.match(/\d{4}/)?.[0] || "2020");
    const startMonth = startDate.toLowerCase().includes("jan") ? 0 :
      startDate.toLowerCase().includes("feb") ? 1 :
        startDate.toLowerCase().includes("mar") ? 2 :
          startDate.toLowerCase().includes("apr") ? 3 :
            startDate.toLowerCase().includes("may") ? 4 :
              startDate.toLowerCase().includes("jun") ? 5 :
                startDate.toLowerCase().includes("jul") ? 6 :
                  startDate.toLowerCase().includes("aug") ? 7 :
                    startDate.toLowerCase().includes("sep") ? 8 :
                      startDate.toLowerCase().includes("oct") ? 9 :
                        startDate.toLowerCase().includes("nov") ? 10 : 11;

    let endYear, endMonth;
    if (endDate === "Present") {
      const now = new Date();
      endYear = now.getFullYear();
      endMonth = now.getMonth();
    } else {
      endYear = parseInt(endDate.match(/\d{4}/)?.[0] || "2024");
      endMonth = endDate.toLowerCase().includes("jan") ? 0 :
        endDate.toLowerCase().includes("feb") ? 1 :
          endDate.toLowerCase().includes("mar") ? 2 :
            endDate.toLowerCase().includes("apr") ? 3 :
              endDate.toLowerCase().includes("may") ? 4 :
                endDate.toLowerCase().includes("jun") ? 5 :
                  endDate.toLowerCase().includes("jul") ? 6 :
                    endDate.toLowerCase().includes("aug") ? 7 :
                      endDate.toLowerCase().includes("sep") ? 8 :
                        endDate.toLowerCase().includes("oct") ? 9 :
                          endDate.toLowerCase().includes("nov") ? 10 : 11;
    }

    // Calculate difference
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else {
      return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
    }
  };

  return (
    <div className="flex flex-col max-w-3xl w-full">
      <SchemaScript
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {about.tableOfContent.display && (
        <div
          className={`fixed left-0 pl-6 flex flex-col gap-8 ${styles.hideOnMobile}`}
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <TableOfContents structure={structure} about={about} />
        </div>
      )}
      <div className="flex flex-col w-full items-center">
        {about.avatar.display && (
          <div
            className={`flex flex-col items-center min-w-40 px-6 pb-8 gap-4 ${styles.avatar}`}
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={person.avatar}
                alt={person.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2 items-center text-gray-600 dark:text-gray-400">
              <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              {person.location}
            </div>
            {person.languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {person.languages.map((language, index) => (
                  <span
                    key={typeof language === 'string' ? language : language.name}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                  >
                    {typeof language === 'string' ? language : `${language.name} - ${language.level}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        <div className={`flex flex-col flex-1 max-w-xl ${styles.blockAlign}`}>
          <div
            id={about.intro.title}
            className="flex flex-col w-full min-h-40 justify-center mb-8"
          >
            {about.calendar.display && (
              <div className="flex gap-3 flex-wrap mb-4 justify-center">
                <div
                  className={`flex items-center border border-cyan-500/30 bg-cyan-500/10 rounded-full p-1 gap-2 backdrop-blur ${styles.blockAlign}`}
                >
                  <Calendar className="w-4 h-4 ml-3 text-cyan-600 dark:text-cyan-400" />
                  <span className="px-2">Schedule a call</span>
                  <Link
                    href={about.calendar.link}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Grid3X3 className="w-4 h-4" />
                  View My Work
                </Link>
                <Link
                  href={`mailto:${person.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Me
                </Link>
              </div>
            )}
            <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white ${styles.textAlign}`}>
              {person.name}
            </h1>
            <p className={`text-lg text-gray-500 dark:text-gray-400 ${styles.textAlign}`}>
              {person.role}
            </p>
            {social.length > 0 && (
              <div className={`flex pt-5 pb-2 gap-2 flex-wrap justify-center ${styles.blockAlign}`}>
                <div className={`flex gap-2 flex-wrap ${styles.socialDesktop}`}>
                  {social.map(
                    (item) =>
                      item.link && (
                        <Link
                          key={item.name}
                          href={item.link}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {iconMap[item.icon] || <span>{item.icon}</span>}
                          {item.name}
                        </Link>
                      ),
                  )}
                </div>
                <div className={`flex gap-2 flex-wrap ${styles.socialMobile}`}>
                  {social.map(
                    (item) =>
                      item.link && (
                        <Link
                          key={`${item.name}-icon`}
                          href={item.link}
                          className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {iconMap[item.icon] || <span>{item.icon}</span>}
                        </Link>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>

          {about.intro.display && (
            <div className="flex flex-col w-full gap-4 mb-8 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {about.intro.description}
            </div>
          )}

          {about.work.display && (
            <>
              <h2
                id={about.work.title}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {about.work.title}
              </h2>
              <div className="flex flex-col w-full gap-6 mb-10">
                {about.work.experiences.map((experience, index) => {
                  const duration = calculateYears(experience.timeframe);

                  return (
                    <div key={`${experience.company}-${experience.role}-${index}`} className="flex flex-col w-full">
                      <div className="flex w-full justify-between items-end mb-1">
                        <h3
                          id={experience.company}
                          className="text-lg font-semibold text-gray-900 dark:text-white"
                        >
                          {experience.company}
                        </h3>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {experience.timeframe}
                          </span>
                          <span className="text-xs text-cyan-600 dark:text-cyan-400">
                            {duration}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-cyan-600 dark:text-cyan-400 mb-4">
                        {experience.role}
                      </p>
                      <ul className="flex flex-col gap-4 list-disc pl-5">
                        {experience.achievements.map((achievement: React.ReactNode, idx: number) => (
                          <li
                            key={`${experience.company}-${idx}`}
                            className="text-base text-gray-700 dark:text-gray-300"
                          >
                            {achievement}
                          </li>
                        ))}
                      </ul>
                      {experience.images.length > 0 && (
                        <div className="flex w-full pt-4 pl-10 gap-3 flex-wrap">
                          {experience.images.map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                              style={{
                                // @ts-ignore
                                minWidth: image.width,
                                // @ts-ignore
                                height: image.height,
                              }}
                            >
                              <Image
                                // @ts-ignore
                                src={image.src}
                                // @ts-ignore
                                alt={image.alt}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {about.studies.display && (
            <>
              <h2
                id={about.studies.title}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {about.studies.title}
              </h2>
              <div className="flex flex-col w-full gap-6 mb-10">
                {about.studies.institutions.map((institution, index) => (
                  <div key={`${institution.name}-${index}`} className="flex flex-col w-full gap-1">
                    <h3
                      id={institution.name}
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {institution.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {institution.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {about.technical.display && (
            <>
              <h2
                id={about.technical.title}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-10"
              >
                {about.technical.title}
              </h2>
              <div
                className="grid gap-4 w-full"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                }}
              >
                {about.technical.skills.map((skill, index) => (
                  <div
                    key={`${skill.title}-${index}`}
                    className={`flex gap-3 items-center p-3 border border-gray-200/50 dark:border-gray-700/50 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 ${styles.skillCard}`}
                  >
                    <span className="text-3xl">
                      {skill.icon}
                    </span>
                    <span
                      id={skill.title}
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      {skill.title}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
