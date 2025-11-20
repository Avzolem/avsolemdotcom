import { Logo } from "@once-ui-system/core";

const person = {
  firstName: "Andrés",
  lastName: "Aguilar",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Department Head & Web Developer",
  avatar: "/images/andres.jpeg",
  email: "andresaguilar.exe@gmail.com",
  location: "America/Chihuahua", // Chihuahua, México
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "Professional" }
  ], // optional: Leave the array empty if you don't want to display languages
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
  {
    name: "Yu-Gi-Oh! Manager",
    icon: "dragon",
    link: "/yugioh",
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `△VSOLEM.`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building the future with React & NextJS</>,  
  featured: {
    display: true,
    title: <>Recent project: <strong className="ml-4">Estampanda.com</strong></>,
    href: "https://estampanda.com",
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
  title: `About – △VSOLEM.`,
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
    link: "https://cal.com/avsolem",
  },
  intro: {
    display: true,
    title: "👋 Introduction",
    description: (
      <>
        I am a software developer and project manager with extensive experience in creating development and logistics departments, 
        as well as managing tasks and projects. I&apos;ve had the fortune to work with multinational companies such as 
        Daewoo, Pemex, GHMECC Logistics, Wialon, Industrias Fehr, and Intermetro, in addition to the Government of the 
        State of Chihuahua, Digital Policy, and municipal IT liaison offices.
        <br /><br />
        I&apos;m passionate about React+NextJS development 🚀, constantly learning new technologies, creating virtual worlds 
        in VR, and building innovative Web3 applications 🦈. My goal is to combine my extensive project management 
        experience with cutting-edge web development to deliver exceptional solutions.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "💼 Work Experience",
    experiences: [
      {
        company: "🏛️ Gobierno del Estado de Chihuahua",
        timeframe: "Sept 2023 - Present",
        role: "Department Head (Jefe de Departamento)",
        achievements: [
          <>
            Leading department operations and managing technology initiatives for the State Government of Chihuahua.
          </>,
          <>
            Overseeing digital transformation projects and implementing modern web solutions for government services.
          </>,
          <>
            Coordinating with Digital Policy teams and municipal IT liaison offices to ensure seamless technology integration.
          </>,
        ],
        images: [],
      },
      {
        company: "🎓 Universidad Autónoma de Chihuahua",
        timeframe: "Jul 2022 - Sept 2023",
        role: "Web Developer",
        achievements: [
          <>
            Developed web applications using Next.js, Unity, and Vercel for university projects and internal systems.
          </>,
          <>
            Implemented MongoDB databases and TailwindCSS for responsive, modern user interfaces.
          </>,
          <>
            Created interactive educational platforms and tools to enhance the learning experience for students.
          </>,
        ],
        images: [],
      },
      {
        company: "👥 Instituto Chihuahuense de la Juventud",
        timeframe: "Jan 2019 - Jul 2022",
        role: "Networks and Systems Area Coordinator",
        achievements: [
          <>
            Managed the entire IT infrastructure and network systems for the Youth Institute of Chihuahua.
          </>,
          <>
            Coordinated technology projects and implemented digital solutions to improve organizational efficiency.
          </>,
          <>
            Led a team responsible for maintaining and upgrading the institute&apos;s technological capabilities.
          </>,
        ],
        images: [],
      },
      {
        company: "🚛 Transportes Borunda",
        timeframe: "Jul 2017 - Jan 2019",
        role: "Logistics and Operations Coordinator",
        achievements: [
          <>
            Managed sales control, created commercial alliances, and handled departments of collection, administration, and human resources.
          </>,
          <>
            Controlled member management, handled tenders, and coordinated logistics for national and international projects.
          </>,
          <>
            Worked with multinational companies including Daewoo, Pemex, GHMECC Logistics, Wialon, Industrias Fehr, and Intermetro.
          </>,
        ],
        images: [],
      },
      {
        company: "💻 Corelion LLC",
        timeframe: "Aug 2015 - Jun 2017",
        role: "Web Design Assistant Developer",
        achievements: [
          <>
            Assisted in developing and designing web applications for various client projects.
          </>,
          <>
            Collaborated with senior developers to implement responsive designs and user-friendly interfaces.
          </>,
          <>
            Gained foundational experience in web development technologies and best practices.
          </>,
        ],
        images: [],
      },
      {
        company: "🔧 Black Shark",
        timeframe: "Oct 2014 - Jul 2015",
        role: "Computer Equipment Repair Technician",
        achievements: [
          <>
            Diagnosed and repaired computer hardware issues, providing technical support to clients.
          </>,
          <>
            Maintained and upgraded computer systems, ensuring optimal performance.
          </>,
          <>
            Developed problem-solving skills and technical expertise in hardware troubleshooting.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "🎓 Education",
    institutions: [
      {
        name: "🏛️ Universidad Autónoma de Guadalajara",
        description: <>Master of Architecture - MArch, CISCO Networks (2017 - 2018). Developed internal projects for the University Center of Exact Sciences.</>,
      },
      {
        name: "🎆 Instituto Tecnológico de Cd. Cuauhtémoc",
        description: <>Systems Engineering (2013 - 2017). Thesis: &ldquo;Cognitive Through Genetic Algorithms: The way to the new A.I.&rdquo; Activities: Chess Club, Music Group, Programming Club.</>,
      },
      {
        name: "🚀 LivingLab CUU",
        description: <>Active member of the tech community in Chihuahua, collaborating on innovative projects and continuous learning.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "🛠️ Technical Skills & Expertise",
    skills: [
      {
        icon: "⚛️",
        title: "React & Next.js",
      },
      {
        icon: "📱",
        title: "JavaScript TypeScript",
      },
      {
        icon: "🎨",
        title: "TailwindCSS",
      },
      {
        icon: "🚀",
        title: "Vercel",
      },
      {
        icon: "🗄️",
        title: "MongoDB",
      },
      {
        icon: "🔧",
        title: "Node.js",
      },
      {
        icon: "🔗",
        title: "Web3 & Blockchain",
      },
      {
        icon: "🥽",
        title: "VR/AR with Unity",
      },
      {
        icon: "📊",
        title: "Project Management",
      },
      {
        icon: "💼",
        title: "Business Strategy",
      },
      {
        icon: "🤝",
        title: "Team Leadership",
      },
      {
        icon: "🌐",
        title: "CISCO Networks",
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog – △VSOLEM.",
  description: `Hackathon wins, Web3 innovations, and metaverse projects by ${person.name}`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – △VSOLEM.`,
  description: `Web3 platforms, IoT hardware, marketplaces, and hackathon-winning projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/work/projects
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Gallery – △VSOLEM.`,
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
