# GEMINI.md

## Project Overview

This is a personal portfolio website for Andrés Aguilar, a Full Stack Developer specializing in React, Next.js, Solana, and Web3. The project is built with Next.js and TypeScript, and styled with Tailwind CSS and DaisyUI. It showcases his projects, skills, and provides a contact form.

The project is structured as a standard Next.js application with the new `app` directory structure. It uses server components and client components where appropriate. The main page is composed of several sections: Hero, About, Projects, Skills, and Contact.

## Building and Running

To get the project up and running, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

4.  **Start the production server:**
    ```bash
    npm run start
    ```

5.  **Lint the code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for utility-first styling and DaisyUI for pre-built components. Custom styles are defined in `tailwind.config.js` and `styles/globals.css`.
*   **Components:** Components are organized in the `components` directory, with subdirectories for different types of components (e.g., `ui`, `sections`, `layouts`).
*   **Linting:** The project uses ESLint for code linting, with the configuration defined in `.eslintrc.json`.
*   **TypeScript:** The project is written in TypeScript, and the configuration is in `tsconfig.json`.
*   **Deployment:** The project is intended to be deployed on Vercel.
