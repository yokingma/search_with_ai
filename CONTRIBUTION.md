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

### 5. Run Tests
- Make sure to run the tests to verify your changes didn’t break anything. Run:

```shell
yarn test
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

#### 2. Build the Project

- Build both the server and web components:

```shell
yarn run build
```

#### 3. Start the Project

- Run the project locally:

```shell
yarn run start
```

- The app should now be accessible at `http://localhost:3000`.

### Docker Deployment

For Docker users, you can easily deploy the project using Docker. Follow the steps in the [README.md](https://github.com/yokingma/search_with_ai#deploy-with-docker-recommended).

### Updating the Project

To pull the latest changes from the main repository, run:

```shell
git pull
yarn install
cd web && yarn install && yarn run build
```

### Writing Tests

Tests are essential for maintaining the quality and stability of the project. If you’re adding new functionality, ensure that your contribution includes appropriate test coverage. You can run the test suite with:

```shell
yarn test
```

---

## Code Style Guidelines

To maintain consistency across the project, please follow these coding conventions:

- Use **camelCase** for JavaScript variables and function names.
- Use **PascalCase** for component names in Vue3.
- Write **descriptive commit messages**.
- Keep your changes **concise and focused** on a single feature or fix.
- Add **comments** where necessary to explain complex code logic.

---

## Reporting Bugs & Suggesting Features

### 1. Reporting Bugs
If you encounter any bugs or issues with the project, please open an issue [here](https://github.com/yokingma/search_with_ai/issues/new). Provide as much detail as possible, including steps to reproduce the issue and any relevant screenshots.

### 2. Suggesting Features
We welcome new feature ideas! If you’d like to suggest a feature, feel free to start a discussion [here](https://github.com/yokingma/search_with_ai/discussions/new?category=q-a).

---

## License

By contributing to **Search with AI**, you agree that your contributions will be licensed under the [MIT License](https://github.com/yokingma/search_with_ai/blob/main/LICENSE).

---

Thank you again for your contribution! Let's build something great together! 💻✨
