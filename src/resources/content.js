import { Logo } from "@once-ui-system/core";

const person = {
  firstName: "Andrés",
  lastName: "Aguilar",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Web Developer",
  avatar: "/images/andres.jpeg",
  email: "andresaguilar.exe@gmail.com",
  location: "America/Chihuahua", // Chihuahua, México
  languages: ["Spanish", "English"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}&apos;s Newsletter</>,
  description: (
    <>
      I share my journey learning new technologies, Web3 experiments, VR projects,
      and thoughts on the evolving landscape of web development.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Avzolem",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/avsolem/",
  },
  {
    name: "Twitter",
    icon: "x",
    link: "https://twitter.com/avsolem",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}&apos;s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building the future with React & NextJS</>,  
  featured: {
    display: true,
    title: <>Recent project: <strong className="ml-4">CoinchaShop</strong></>,
    href: "/work/simple-portfolio-builder",
  },
  subline: (
    <>
      I&apos;m Andrés, a web developer from Chihuahua, México! I specialize in React & NextJS 🚀
      <br /> Currently exploring VR worlds and Web3 technologies 🦈
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Andrés is a passionate web developer from Chihuahua, México, specializing in React and NextJS.
        He&apos;s constantly learning new technologies and loves creating virtual worlds in VR
        and building innovative Web3 applications. A true &quot;web cowboy&quot; always exploring the frontier of technology.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Freelance Web Developer",
        timeframe: "2020 - Present",
        role: "Full Stack Developer",
        achievements: [
          <>
            Developed multiple web applications using React and NextJS, including e-commerce platforms
            and custom business solutions.
          </>,
          <>
            Built innovative Web3 applications and participated in hackathons, including
            the Solana Mini Hackathon with CoinchaShop.
          </>,
          <>
            Created VR experiences and interactive applications, combining traditional web development
            with emerging technologies.
          </>,
        ],
        images: [],
      },
      {
        company: "Open Source Contributor",
        timeframe: "2019 - Present",
        role: "JavaScript Developer",
        achievements: [
          <>
            Maintained 34+ repositories on GitHub with various web development projects
            and hardware programming experiments.
          </>,
          <>
            Developed projects ranging from web applications like Comimake and Calpic
            to hardware projects using ESP8266.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Self-Taught Developer",
        description: <>Continuously learning through online courses, documentation, and hands-on projects.</>,
      },
      {
        name: "LivingLab CUU",
        description: <>Part of the tech community in Chihuahua, collaborating on innovative projects.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "React & NextJS",
        description: <>Building modern web applications with React and NextJS. Always learning new patterns and best practices.</>,
        images: [],
      },
      {
        title: "Web3 Development",
        description: <>Exploring blockchain technologies and building decentralized applications. Participated in Solana hackathons.</>,
        images: [],
      },
      {
        title: "VR Development",
        description: <>Creating immersive virtual worlds and experiences, combining web technologies with VR platforms.</>,
        images: [],
      },
      {
        title: "JavaScript/TypeScript",
        description: <>Strong foundation in JavaScript and TypeScript, with experience in both frontend and backend development.</>,
        images: [],
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about web dev and emerging tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Web development and innovative tech projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
