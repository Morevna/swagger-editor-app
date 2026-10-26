# Swagger Editor App

[Final group project](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md) for RS School's React course.

**Team**

- Aleksandr [@AlexLalalala](https://github.com/AlexLalalala)
- Maria [@Morevna](https://github.com/Orgris)
- Maxim [@Orgris](https://github.com/Morevna)

[Video](https://www.youtube.com/watch?v=g6Qe3HSWD0s)

[Pull request](https://github.com/AlexLalalala/swagger-editor-app/pull/24)

[Deployment](https://swagger-editor-app-psi.vercel.app/en)


# Swagger/OpenAPI UI & Editor App 🛠️

👥 **Team Final Project (RS School React Stage)**
A comprehensive web application based on Next.js for editing, validating, and testing APIs using OpenAPI specifications, combining Swagger Editor functionality with a custom REST client. The development was carried out by a 3-person team using the Agile/Scrum methodology, with GitHub Issues, Pull Requests, and code reviews. Automated CI/CD pipelines were set up on Vercel.

---

### 💻 My Technical Contributions

I was responsible for developing the application shell, key interactive UI panels (Editor & Viewer), the About page, and ensuring high code stability through extensive testing and component refinement.

#### 🔹 Core UI Features & Layout Architecture
* **Swagger Viewer Implementation:** Developed the `feat: add endpoint list and details panel` from scratch. Built the component tree to display complex API structures, including methods, paths, and parameter models.
* **Swagger Editor Component:** Built and integrated the core interactive code editor area (`feat: add editor component`) supporting real-time schema input.
* **App Shell Layout:** Formed the global layout skeleton (`feat: create app header, footer and connect layout`), managing routing integration and component connections.
* **About Page Development:** Fully implemented the public responsive About page (`feat: add about page`), maintaining design consistency across the application.

#### 🔹 Quality Assurance & Testing (QA)
* **Comprehensive Test Coverage:** Wrote unit tests and end-to-end (E2E) automation suites (`feat: add full test coverage`, `feat: add e2e tests`), debugging and fixing environment anomalies across iterations.
* **Localization Stability:** Fixed and stabilized testing workflows for the мультиязычность features (`fix: fix tests for LanguageSwitcher`), ensuring seamless language toggle behaviors.

#### 🔹 DX, Styling & Code Health
* **UI Kit Setup & Refactoring:** Initialized `shadcn/ui` integration configured with the *Nova* preset (`chore: initialize shadcn with Nova preset`). Handled global file naming conventions (PascalCase/lowercase migrations) for optimal import flows.
* **Linting & Code Style Automation:** Managed project maintainability by implementing automatic code formatting, applying linter error fixes (`style: automatic code formatting and lint fixes`), and updating ESLint workspace configurations.

---

### 🛠️ Tech Stack Used in the Project
* **Framework:** Next.js (App Router), TypeScript
* **State & Data Fetching:** Zustand, TanStack Query (React Query), Zod (Validation)
* **Authentication:** Supabase Auth Integration
* **Internationalization:** next-intl / i18n (RU/EN)
* **UI & Styles:** Tailwind CSS, Shadcn/ui (Nova preset)
* **Testing:** Vitest (Unit), Playwright (E2E)

