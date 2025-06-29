# Hired: AI-Powered Interview Coach

Hired is a sophisticated, AI-powered web application designed to help job seekers prepare for technical and behavioral interviews. By simulating a real interview experience and providing instant, intelligent feedback, Hired equips users with the confidence and skills needed to land their dream job.

## Core Features

-   **Dynamic Interview Generation:** Leverages generative AI to create relevant, role-specific interview questions based on the user's selected job category (e.g., Software Engineer, Product Manager).
-   **Interactive Voice Recording:** Users can answer questions by recording their voice directly in the browser, creating a realistic practice environment.
-   **Speech-to-Text Transcription:** Utilizes advanced speech recognition models (via Google's Gemini) to accurately transcribe spoken answers into text for analysis.
-   **AI-Powered Performance Analysis:** Employs Large Language Models (LLMs) to analyze the transcribed answers, providing users with:
    -   **Constructive Feedback:** Detailed critiques on the answer's clarity, coherence, and content.
    -   **Quantitative Scoring:** A score from 0-100 to help users benchmark their performance and track improvement over time.
    -   **Expert Answer Examples:** A well-structured, high-quality sample answer for each question to serve as a learning reference.
-   **Secure User Authentication:** Features a robust and secure user authentication system (sign-up & login) managed by Firebase Authentication.
-   **Personalized Interview History:** All interview sessions and results are saved to a persistent cloud database (Firestore), allowing users to review their past performance and track their progress.
-   **Customizable Experience:** Users can select from various interviewer voices, powered by the browser's native Speech Synthesis API, for a more personalized session.
-   **Modern, Responsive UI:** A sleek and intuitive user interface built with the latest web technologies, ensuring a seamless experience across all devices.

## Technologies & Resume Keywords

This project showcases expertise in a wide range of modern, in-demand technologies.

-   **AI / Machine Learning:**
    -   **Generative AI:** Core of the application, used for question generation and feedback analysis.
    -   **Large Language Models (LLMs):** Specifically Google's Gemini family of models.
    -   **Natural Language Processing (NLP):** For understanding and processing user answers.
    -   **Speech-to-Text (STT):** High-accuracy audio transcription.
    -   **AI-driven Feedback Systems:** Designing and implementing systems that provide intelligent, data-driven critiques.

-   **Frameworks & Libraries:**
    -   **Next.js:** Industry-standard React framework for full-stack, server-rendered applications.
    -   **React:** For building dynamic, component-based user interfaces.
    -   **Genkit (by Google):** A modern, open-source framework for building production-ready AI applications.
    -   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
    -   **ShadCN/UI:** A collection of beautifully designed, reusable UI components.

-   **Platform & Cloud Services:**
    -   **Firebase:**
        -   **Firebase Authentication:** For secure user management.
        -   **Firestore:** A scalable NoSQL database for storing user data and interview history.
    -   **Google Cloud:** Hosting the backend infrastructure and AI models.

-   **Software Architecture & Principles:**
    -   **Full-Stack Development**
    -   **Serverless Architecture**
    -   **Component-Based Design**
    -   **State Management (React Context)**
    -   **Asynchronous JavaScript (Promises, async/await)**
