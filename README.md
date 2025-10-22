# Setting Up Cypress

![Cypress Automated Tests](https://github.com/mobarasa/roamtech-cypress/actions/workflows/cypress-tests.yml/badge.svg)

Follow these steps to configure your machine to run Cypress:

1. ## Install Node.js and npm
   - Make sure you have Node.js and npm installed on your machine. You can download and install them from [Node.js official website](https://nodejs.org/).

### (Optional) Interactive Script Execution with Node Task List

- You can optionally install the `Node Task List` (`ntl`) package, which provides an interactive interface that lists all the scripts defined in your `package.json` file. This tool can be helpful in executing Cypress commands more conveniently.

- To install `ntl` globally, run the following command:

```bash
npm install -g ntl
```

2. ## Clone the Repository
   - Clone the repository containing the Cypress tests to your local machine using Git:

     ```bash
     git clone https://github.com/mobarasa/roamtech-cypress.git
     ```

3. ## Navigate to the Project Directory
   - Open a terminal and navigate to the directory where you cloned the repository:

     ```bash
     cd roamtech-cypress
     ```

4. ## Install Dependencies
   - Install the project dependencies using npm:

     ```bash
     npm install
     ```

5. ## Verify Cypress Installation
   - Once the dependencies are installed, verify that Cypress is installed correctly by running:

     ```bash
     npx cypress --version
     ```

   - This should display the installed version of Cypress.

6. ## Configure Login Credentials
   - Once everything is set up, we need to configure our login credentials which are stored in `.env.example.json`:

     ```bash
     npm run setup
     ```

   - This command will copy `env.example.json` and create a `.env.json` file where you can input your own testing credentials.

7. ## Open Cypress Test Runner
   - To open the Cypress Test Runner, run on your CLI:

     ```bash
     npx cypress open
     ```

   - This command will open the Cypress Test Runner, where you can select and run your tests.

8. ## Run Cypress Tests
   - To run Cypress tests headlessly (in the background), you can use the following command:

     ```bash
     npx cypress run
     ```

9. ## Run Cypress with Node Task List
   - Instead of using the commands `npx cypress open` or `npx cypress run`, you can simply type `ntl` in the command line interface (CLI) within your project directory. This will launch an interactive interface where you can select any item to execute that task.

   - For example, you can select the `cy:run` or `test:api` tasks from the list to open the Cypress UI Test Runner or run your Cypress tests via CLI, respectively.

     ```bash
     Node Task List
        ? Select a task to run: (Use arrow keys)
        ❯ cy:run
        test:api
     ```

10. ## Run Specific Cypress Test

- If you need to run only a specific test or a subset of tests, you can use the `--spec` or `--spec-file` flag with the Cypress CLI command. This allows you to specify the path to the test file(s) you want to execute.

- To run a specific test, use the following command:

      ```bash
      npx cypress run --spec "cypress/e2e/api/jsonplaceholder.cy.js"
      ```

- Note: Replace `cypress/e2e/api/jsonplaceholder.cy.js` with the actual path to your test file or folder containing the tests you want to run.

- You can also run multiple test files by providing a comma-separated list of file paths:

      ```bash
      npx cypress run --spec "cypress/e2e/api/jsonplaceholder.cy.js,cypress/e2e/functional/academybugs.cy.js"
      ```

- Alternatively, you can use the `--spec-file` flag to provide a text file containing a list of test file paths:

      ```bash
      npx cypress run --spec-file cypress/e2e/myTestsToBeExecuted.txt
      ```

- Where `myTestsToBeExecuted.txt` contains one test file path per line, like:

      ```bash
      cypress/e2e/api/jsonplaceholder.cy.js
      cypress/e2e/functional/academybugs.cy.js
      ```

- By specifying the test files you want to run, you can save time and resources by executing only the relevant tests instead of running the entire test suite.
- Remember to adjust the paths according to your project's file structure and the location of your Cypress test files.

11. ## Configure Cypress

- If needed, configure Cypress by editing the `cypress.config.js` file located in the root of odoo project directory. You can customize various settings such as base URL, viewport size, and more.

## Additional Notes

- Make sure your development environment meets the [system requirements](https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements) specified by Cypress.
- Refer to the [Cypress documentation](https://docs.cypress.io/) for detailed information on writing and running tests using Cypress.
