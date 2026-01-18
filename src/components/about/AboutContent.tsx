'use client';

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Calendar, ChevronRight, Grid3X3, Mail, Download } from 'lucide-react';

import { about, person, social } from "@/resources";
import { useLanguage } from '@/contexts/LanguageContext';
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";

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

// Work experiences with translation keys
const workExperiences = [
  { key: 'exp1', timeframe: 'Sept 2023 - Present', emoji: '🏛️' },
  { key: 'exp2', timeframe: 'Jul 2022 - Sept 2023', emoji: '🎓' },
  { key: 'etherfuse', timeframe: 'Nov 2022 - Jan 2023', emoji: '⛓️' },
  { key: 'exp3', timeframe: 'Jan 2019 - Jul 2022', emoji: '👥' },
  { key: 'exp4', timeframe: 'Jul 2017 - Jan 2019', emoji: '🚛' },
  { key: 'exp5', timeframe: 'Aug 2015 - Jun 2017', emoji: '💻' },
  { key: 'exp6', timeframe: 'Oct 2014 - Jul 2015', emoji: '🔧' },
];

// Education with translation keys
const educationItems = [
  { key: 'uag', emoji: '🏛️' },
  { key: 'itcc', emoji: '🎆' },
  { key: 'livinglab', emoji: '🚀' },
];

export function AboutContent() {
  const { t, language } = useLanguage();

  // Calculate years worked helper function
  const calculateYears = (timeframe: string) => {
    const parts = timeframe.split(" - ");
    const startDate = parts[0];
    const endDate = parts[1];

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

    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const yearLabel = years === 1 ? t('time.year') : t('time.years');
    const monthLabel = months === 1 ? t('time.month') : t('time.months');

    if (years === 0) {
      return `${months} ${monthLabel}`;
    } else if (months === 0) {
      return `${years} ${yearLabel}`;
    } else {
      return `${years} ${yearLabel}, ${months} ${monthLabel}`;
    }
  };

  const structure = [
    {
      title: `👋 ${t('about.intro.title')}`,
      display: about.intro.display,
      items: [],
    },
    {
      title: `💼 ${t('about.work.title')}`,
      display: about.work.display,
      items: workExperiences.map((exp) => `${exp.emoji} ${t(`work.${exp.key}.company`)}`),
    },
    {
      title: `🎓 ${t('about.studies.title')}`,
      display: about.studies.display,
      items: educationItems.map((edu) => `${edu.emoji} ${t(`edu.${edu.key}.name`)}`),
    },
    {
      title: `🛠️ ${t('about.technical.title')}`,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];

  return (
    <div className="flex flex-col max-w-3xl w-full">
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
                {person.languages.map((lang, index) => {
                  if (typeof lang === 'string') {
                    return (
                      <span
                        key={lang}
                        className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                      >
                        {lang}
                      </span>
                    );
                  }
                  const langName = lang.name.toLowerCase() === 'spanish'
                    ? t('language.spanish')
                    : lang.name.toLowerCase() === 'english'
                      ? t('language.english')
                      : lang.name;
                  const levelName = lang.level.toLowerCase() === 'native'
                    ? t('language.native')
                    : lang.level.toLowerCase() === 'professional'
                      ? t('language.professional')
                      : lang.level;
                  return (
                    <span
                      key={lang.name}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                    >
                      {langName} - {levelName}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className={`flex flex-col flex-1 max-w-xl ${styles.blockAlign}`}>
          <div
            id={`👋 ${t('about.intro.title')}`}
            className="flex flex-col w-full min-h-40 justify-center mb-8"
          >
            {about.calendar.display && (
              <div className="flex gap-3 flex-wrap mb-4 justify-center">
                <div
                  className={`flex items-center border border-cyan-500/30 bg-cyan-500/10 rounded-full p-1 gap-2 backdrop-blur ${styles.blockAlign}`}
                >
                  <Calendar className="w-4 h-4 ml-3 text-cyan-600 dark:text-cyan-400" />
                  <span className="px-2">{t('about.scheduleCall')}</span>
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
                  {t('about.viewWork')}
                </Link>
                <Link
                  href={`mailto:${person.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {t('about.contactMe')}
                </Link>
              </div>
            )}
            <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white ${styles.textAlign}`}>
              {person.name}
            </h1>
            <p className={`text-lg text-gray-600 dark:text-gray-400 mt-2 ${styles.textAlign}`}>
              {t('person.role')}
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
            {/* Download CV Button */}
            <div className="flex justify-center w-full mt-4">
              <Link
                href="/cv"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-base font-medium border-2 border-cyan-500 text-gray-900 dark:text-white rounded-full hover:bg-cyan-500 hover:text-white transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                {language === 'es' ? 'Descargar CV' : 'Download CV'}
              </Link>
            </div>
          </div>

          {about.intro.display && (
            <div className="flex flex-col w-full gap-4 mb-8 text-base leading-relaxed text-gray-900 dark:text-gray-300">
              <p>{t('about.intro.description.p1')}</p>
              <p>{t('about.intro.description.p2')}</p>
            </div>
          )}

          {about.work.display && (
            <>
              <h2
                id={`💼 ${t('about.work.title')}`}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
              >
                💼 {t('about.work.title')}
              </h2>
              <div className="flex flex-col w-full gap-6 mb-10">
                {workExperiences.map((exp, index) => {
                  const duration = calculateYears(exp.timeframe);
                  const company = `${exp.emoji} ${t(`work.${exp.key}.company`)}`;

                  return (
                    <div key={exp.key} className="flex flex-col w-full">
                      <div className="flex w-full justify-between items-end mb-1">
                        <h3
                          id={company}
                          className="text-lg font-semibold text-gray-900 dark:text-white"
                        >
                          {company}
                        </h3>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {exp.timeframe}
                          </span>
                          <span className="text-xs text-cyan-600 dark:text-cyan-400">
                            {duration}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-cyan-600 dark:text-cyan-400 mb-4">
                        {t(`work.${exp.key}.role`)}
                      </p>
                      <ul className="flex flex-col gap-4 list-disc pl-5">
                        <li className="text-base text-gray-900 dark:text-gray-300">
                          {t(`work.${exp.key}.achievement1`)}
                        </li>
                        <li className="text-base text-gray-900 dark:text-gray-300">
                          {t(`work.${exp.key}.achievement2`)}
                        </li>
                        <li className="text-base text-gray-900 dark:text-gray-300">
                          {t(`work.${exp.key}.achievement3`)}
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {about.studies.display && (
            <>
              <h2
                id={`🎓 ${t('about.studies.title')}`}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
              >
                🎓 {t('about.studies.title')}
              </h2>
              <div className="flex flex-col w-full gap-6 mb-10">
                {educationItems.map((edu, index) => (
                  <div key={edu.key} className="flex flex-col w-full gap-1">
                    <h3
                      id={`${edu.emoji} ${t(`edu.${edu.key}.name`)}`}
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {edu.emoji} {t(`edu.${edu.key}.name`)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t(`edu.${edu.key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {about.technical.display && (
            <>
              <h2
                id={`🛠️ ${t('about.technical.title')}`}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-10"
              >
                🛠️ {t('about.technical.title')}
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

export default AboutContent;
