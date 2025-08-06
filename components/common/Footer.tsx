import React from 'react';
import SocialIcon from '@/components/icons/Social';

interface SocialLinkItem {
    name: string;
    href: string;
    icon: 'instagram' | 'tiktok' | 'twitter' | 'discord';
}

// EDIT ME PLEASE
const copyrightLabel = `©${new Date().getFullYear()} Avsolem. A web made in the web.`;
const socialLink: SocialLinkItem[] = [
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/avsolem/',
        icon: 'instagram',
    },
    {
        name: 'TikTok',
        href: 'https://www.tiktok.com/@avsolem',
        icon: 'tiktok',
    },
    {
        name: 'Twitter',
        href: 'https://twitter.com/avsolem',
        icon: 'twitter',
    },
    {
        name: 'Discord',
        href: 'https://discord.gg/AhSERBy467',
        icon: 'discord',
    },
];

const Footer: React.FC = () => {
    return (
        <footer className="z-[100] mt-auto ">
            <div className="mx-auto max-w-7xl py-12 px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    {socialLink.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-primary "
                        >
                            <div className="iconcontainer h-6 w-6 cursor-pointer text-primary hover:text-accent">
                                <SocialIcon type={item.icon} />
                            </div>
                        </a>
                    ))}
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-primary hover:text-accent">
                        {copyrightLabel}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;