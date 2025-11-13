# Contribution Guidelines

Thank you for your interest in contributing to **Search with AI**! We appreciate your efforts in helping improve the project. To ensure a smooth contribution process, please follow these guidelines.

## How to Contribute

### 1. Fork the Repository
- Go to the [Search with AI GitHub repository](https://github.com/yokingma/search_with_ai) and click the **Fork** button to create your own copy of the repository.

### 2. Clone the Forked Repository
- After forking, clone the repository to your local machine:

```shell
git clone https://github.com/<your-username>/search_with_ai.git
```

- Navigate into the project directory:

```shell
cd search_with_ai
```

### 3. Create a Branch for Your Changes
- Create a new branch from the `main` branch for your changes:

```shell
git checkout -b feature/your-feature-name
```

- Ensure your branch name is descriptive (e.g., `feature/add-search-engine`, `fix/docker-deployment`).

### 4. Make Your Changes
- Make the necessary changes or improvements to the code, documentation, or tests.
- Ensure that your changes follow the existing code style.
- Write or update unit tests where applicable.

### 5. Verify Your Changes

- Make sure to check TypeScript types and lint your code:

```shell
# Check TypeScript types (server)
cd apps/server && yarn check-types

# Build the project to verify everything compiles
yarn build
```

### 6. Commit Your Changes
- After making your changes, add and commit your code:

```shell
git add .
git commit -m "Brief description of your changes"
```

### 7. Push to Your Fork
- Push your branch to your forked repository:

```shell
git push origin feature/your-feature-name
```

### 8. Create a Pull Request
- Go to the original repository on GitHub and click the **New Pull Request** button.
- Select your branch and submit the pull request.
- Provide a clear description of your changes and reference any related issues.

---

## Development Workflow

### Setting Up the Project Locally

Ensure that you have the following installed:
- **Node.js** >= 20
- **Yarn**

#### 1. Install Dependencies

- After cloning the repository, run:

```shell
yarn install
```

#### 2. Environment Setup

- Copy the environment file and configure your settings:

```shell
cp apps/server/.env apps/server/.env.local
```

- Edit `apps/server/.env.local` and add at least one LLM provider key:

```shell
# Required: At least one LLM provider
OPENAI_KEY=your_openai_key
# or
DEEPSEEK_KEY=your_deepseek_key
# or other supported providers

# Optional: Search engines (SearXNG works without API key)
SEARXNG_HOSTNAME=http://localhost:8080
BING_SEARCH_KEY=your_bing_key
```

#### 3. Development Mode

- Start both server and web in development mode:

```shell
yarn dev
```

- Or start individual applications:

```shell
# Server only (port 3000)
cd apps/server && yarn dev

# Web only (port 5173)
cd apps/web && yarn dev
```

#### 4. Production Build

- Build both applications:

```shell
yarn build
```

- Start in production mode:

```shell
cd apps/server && yarn start
```

- The app will be accessible at `http://localhost:3000`.

### Docker Deployment

For Docker users, you can easily deploy the project using Docker. Follow the steps in the [README.md](https://github.com/yokingma/search_with_ai#deploy-with-docker-recommended).

### Updating the Project

To pull the latest changes from the main repository, run:

```shell
git pull
yarn install
yarn build
```

### Monorepo Structure

This project uses Turborepo for monorepo management:

- **Root**: Contains Turborepo configuration and workspace setup
- **apps/server**: Node.js/Koa backend with TypeScript
- **apps/web**: Vue.js frontend with TypeScript and Vite

Key Turborepo commands:

- `yarn dev` - Start all apps in development mode
- `yarn build` - Build all applications
- Individual app commands work from their respective directories

---

## Code Style Guidelines

To maintain consistency across the project, please follow these coding conventions:

### Code Formatting

- **ESLint** and **Prettier** are configured for both server and web applications
- Run linting before committing:

```shell
# Server linting
cd apps/server && npx eslint src/

# Web linting
cd apps/web && npx eslint src/
```

### Naming Conventions

- Use **camelCase** for JavaScript variables and function names
- Use **PascalCase** for Vue component names
- Use **kebab-case** for file names and directories
- Write **descriptive commit messages** following conventional commits format

### Code Quality

- Keep your changes **concise and focused** on a single feature or fix
- Add **comments** where necessary to explain complex code logic
- Ensure TypeScript types are properly defined
- Follow existing patterns in the codebase

---

## Troubleshooting

### Common Issues

**Port conflicts:**

- Server runs on port 3000, web dev server on 5173
- Check if ports are already in use: `lsof -i :3000` or `lsof -i :5173`

**Environment variables:**

- Ensure `.env.local` file exists in `apps/server/`
- At least one LLM provider key must be configured
- Check the [model.json](apps/server/src/model.json) file for supported providers

**Build errors:**

- Run `yarn install` in root directory first
- Check TypeScript errors: `cd apps/server && yarn check-types`
- Clear node_modules and reinstall if needed

**Docker issues:**

- Ensure Docker and Docker Compose are installed
- Check the [deploy directory](deploy/) for Docker configuration

---

## Reporting Bugs & Suggesting Features

### 1. Reporting Bugs

If you encounter any bugs or issues with the project, please open an issue [here](https://github.com/yokingma/search_with_ai/issues/new). Provide as much detail as possible, including:

- Steps to reproduce the issue
- Expected vs actual behavior
- Environment details (OS, Node.js version, etc.)
- Relevant screenshots or error messages
- Configuration details (anonymized)

### 2. Suggesting Features

We welcome new feature ideas! If you'd like to suggest a feature, feel free to start a discussion [here](https://github.com/yokingma/search_with_ai/discussions/new?category=q-a).

---

## License

By contributing to **Search with AI**, you agree that your contributions will be licensed under the [MIT License](https://github.com/yokingma/search_with_ai/blob/main/LICENSE).

---

Thank you again for your contribution! Let's build something great together! 💻✨
