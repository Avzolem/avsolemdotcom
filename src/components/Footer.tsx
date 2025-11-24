"use client";

import { Flex, IconButton, SmartLink, Text } from "@once-ui-system/core";
import { person, social } from "@/resources";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
      direction="column"
    >
      <Flex
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} /</Text>
          <Text paddingX="4">{person.name}</Text>
          <Text onBackground="neutral-weak">
            / Build with ☕ & 🩶
          </Text>
        </Text>
        <Flex gap="16">
          {social.map((item) => {
            if (!item.link) return null;

            const isSpecialRoute = item.link.includes('/yugioh') || item.link.includes('/roms');

            if (isSpecialRoute) {
              return (
                <a
                  key={item.name}
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = item.link;
                  }}
                  style={{
                    display: 'inline-flex',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  <IconButton
                    icon={item.icon}
                    tooltip={item.name}
                    size="s"
                    variant="ghost"
                  />
                </a>
              );
            }

            return (
              <IconButton
                key={item.name}
                href={item.link}
                icon={item.icon}
                tooltip={item.name}
                size="s"
                variant="ghost"
              />
            );
          })}
        </Flex>
      </Flex>
      <Flex height="80" className={styles.showOnMobile}></Flex>
    </Flex>
  );
};
