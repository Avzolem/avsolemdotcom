import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  Icon,
  IconButton,
  Media,
  Tag,
  Text,
  Meta,
  Schema
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";

export async function generateMetadata() {
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
  return (
    <Column maxWidth="m">
      <Schema
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
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          className={styles.hideOnMobile}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <Flex fillWidth direction="column" horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />
            <Flex gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {person.location}
            </Flex>
            {person.languages.length > 0 && (
              <Flex wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={typeof language === 'string' ? language : language.name} size="l">
                    {typeof language === 'string' ? language : `${language.name} - ${language.level}`}
                  </Tag>
                ))}
              </Flex>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <Flex gap="12" wrap marginBottom="m" horizontal="center">
                <Flex
                  fitWidth
                  border="brand-alpha-medium"
                  className={styles.blockAlign}
                  style={{
                    backdropFilter: "blur(var(--static-space-1))",
                  }}
                  background="brand-alpha-weak"
                  radius="full"
                  padding="4"
                  gap="8"
                  vertical="center"
                >
                  <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                  <Flex paddingX="8">Schedule a call</Flex>
                  <IconButton
                    href={about.calendar.link}
                    data-border="rounded"
                    variant="secondary"
                    icon="chevronRight"
                  />
                </Flex>
                <Button
                  href="/work"
                  variant="secondary"
                  size="m"
                  prefixIcon="grid"
                >
                  View My Work
                </Button>
                <Button
                  href={`mailto:${person.email}`}
                  variant="secondary"
                  size="m"
                  prefixIcon="email"
                >
                  Contact Me
                </Button>
              </Flex>
            )}
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
            {social.length > 0 && (
              <Flex className={styles.blockAlign} paddingTop="20" paddingBottom="8" gap="8" wrap horizontal="center" fitWidth data-border="rounded">
                <Flex className={styles.socialDesktop} gap="8" wrap>
                  {social.map(
                    (item) =>
                      item.link && (
                        <Button
                          key={item.name}
                          href={item.link}
                          prefixIcon={item.icon}
                          label={item.name}
                          size="s"
                          weight="default"
                          variant="secondary"
                        />
                      ),
                  )}
                </Flex>
                <Flex className={styles.socialMobile} gap="8" wrap>
                  {social.map(
                    (item) =>
                      item.link && (
                        <IconButton
                          key={`${item.name}-icon`}
                          href={item.link}
                          icon={item.icon}
                          variant="secondary"
                          size="l"
                        />
                      ),
                  )}
                </Flex>
              </Flex>
            )}
          </Column>

          {about.intro.display && (
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              {about.intro.description}
            </Column>
          )}

          {about.work.display && (
            <>
              <Heading as="h2" id={about.work.title} variant="display-strong-s" marginBottom="m">
                {about.work.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {about.work.experiences.map((experience, index) => {
                  // Calculate years worked
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

                  const duration = calculateYears(experience.timeframe);

                  return (
                    <Column key={`${experience.company}-${experience.role}-${index}`} fillWidth>
                      <Flex fillWidth horizontal="between" vertical="end" marginBottom="4">
                        <Text id={experience.company} variant="heading-strong-l">
                          {experience.company}
                        </Text>
                        <Column horizontal="end">
                          <Text variant="heading-default-xs" onBackground="neutral-weak">
                            {experience.timeframe}
                          </Text>
                          <Text variant="body-default-xs" onBackground="brand-weak">
                            {duration}
                          </Text>
                        </Column>
                      </Flex>
                      <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                        {experience.role}
                      </Text>
                      <Column as="ul" gap="16">
                        {experience.achievements.map((achievement: React.ReactNode, idx: number) => (
                          <Text
                            as="li"
                            variant="body-default-m"
                            key={`${experience.company}-${idx}`}
                          >
                            {achievement}
                          </Text>
                        ))}
                      </Column>
                      {experience.images.length > 0 && (
                        <Flex fillWidth paddingTop="m" paddingLeft="40" gap="12" wrap>
                          {experience.images.map((image, imgIndex) => (
                            <Flex
                              key={imgIndex}
                              border="neutral-medium"
                              radius="m"
                              //@ts-ignore
                              minWidth={image.width}
                              //@ts-ignore
                              height={image.height}
                            >
                              <Media
                                enlarge
                                radius="m"
                                //@ts-ignore
                                sizes={image.width.toString()}
                                //@ts-ignore
                                alt={image.alt}
                                //@ts-ignore
                                src={image.src}
                              />
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </Column>
                  );
                })}
              </Column>
            </>
          )}

          {about.studies.display && (
            <>
              <Heading as="h2" id={about.studies.title} variant="display-strong-s" marginBottom="m">
                {about.studies.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {about.studies.institutions.map((institution, index) => (
                  <Column key={`${institution.name}-${index}`} fillWidth gap="4">
                    <Text id={institution.name} variant="heading-strong-l">
                      {institution.name}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.technical.display && (
            <>
              <Heading
                as="h2"
                id={about.technical.title}
                variant="display-strong-s"
                marginBottom="40"
              >
                {about.technical.title}
              </Heading>
              <Flex 
                fillWidth 
                gap="16" 
                wrap
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 'var(--static-space-16)'
                }}
              >
                {about.technical.skills.map((skill, index) => (
                  <Flex 
                    key={`${skill.title}-${index}`}
                    gap="12"
                    vertical="center"
                    padding="12"
                    border="neutral-alpha-weak"
                    radius="m"
                    background="neutral-alpha-weak"
                    className={styles.skillCard}
                  >
                    <Text 
                      variant="display-default-s"
                      style={{ fontSize: '28px' }}
                    >
                      {skill.icon}
                    </Text>
                    <Text 
                      variant="body-strong-m"
                      id={skill.title}
                    >
                      {skill.title}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </>
          )}
        </Column>
      </Flex>
    </Column>
  );
}
