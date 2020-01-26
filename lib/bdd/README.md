# cruller BDD
Cruller now also support e2e tests written in [gherkin](https://cucumber.io/docs/gherkin/reference/) syntax using [cucumber-js](https://github.com/cucumber/cucumber-js).

## Installation
Navigate to the repo where you would like to run Cruller. And run the following command to install Cruller into your project.

```bash
npm i --save-dev cruller
```
Or if you are using yarn
```bash
yarn add --dev cruller
```

Make sure you have a valid `package.json` file in the root of your project.

## Initialization
`cruller` bdd uses a custom folder structure to organize, scale and run your e2e tests. This is based on the [cucumber-js example](https://github.com/cucumber/cucumber-js/blob/master/docs/nodejs_example.md). 

In order to use this folder structure in your project run the following command.

```bash
npx cruller-bdd init
```
This would create a folder named `bdd` in the root of your project relative to `package.json`.

```bash
bdd/
├── feature-files                   # Feature files for testing
│   └── examples                    # Set of example features and OOTB steps
│       ├── A11Y.feature
│       ├── Browser.feature
│       ├── Cookies.feature
│       ├── Element.feature
│       ├── Form.feature
│       ├── Keyboard.feature
│       ├── Page.feature
│       └── Utils.feature
├── reports                         # Placeholder folder for generated reports
├── step_definitions
│   └── common.js                   # Common step definitions for cucumber-js
└── support
    ├── hooks.js                    # Cucumber JS hooks
    ├── selectors                   # Selectors use for running the e2e tests
    │   ├── google.js
    │   └── quackit.js
    └── world.js                    # Cucumber JS world file
```

The `init` command also updates the `package.json` file with the following scripts.

```js
// package.json
{
    ...
    "scripts": {
        ...
        "cruller:run": "./node_modules/.bin/cruller-bdd run",
        "cruller:report": "./node_modules/.bin/cruller-bdd report",
        ...
    }
    ...
}
```
It also adds a `cruller` [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) settings variable to the `package.json` as shown below. Use this to configure the settings for running your e2e tests.

```js
// package.json
{
    ...
    // The cosmiconfig settings
    "cruller": {
        // The breakpoints use to set viewport size
        "breakpoints": {
            "mobile": {
                "width": 340,
                "height": 480
            },
            "tablet": {
                "width": 1024,
                "height": 768
            },
            "desktop": {
                "width": 1280,
                "height": 800
            }
        },
        // Puppeteer headless mode
        "headless": false,
        // axe-reports config
        "a11y": {
            // Default a11y report name
            "reportName": "a11y-temp-report",
            // Default a11y report type
            "reportType": "csv"
        },
        // Common selectors used for running e2e tests
        "selectors": {},
        // Selector files used for running e2e tests
        "selectorFiles": [
            "./bdd/support/selectors/**/*.js"
        ],
        // The source root for e2e testing
        "rootPath": "./bdd",
        // Report output path
        "reportsPath": "./bdd/reports",
        // Default report name
        "reportName": "cruller_report"
    }
    ...
}
```

## Running Tests
Out of the box, `cruller` bdd has a bunch of example test features under the `bdd/feature-files/examples` folder. These tests can be run using the following command.

```bash
npm run cruller:run
```
Or if you are using yarn

```bash
yarn cruller:run
```

This would open up the chrome and run the tests outlined in the example feature files and would generate a report with the name as per the `reportName` config in `package.json` under the `bdd/reports` folder.

### Specifying Report Name
In order to create reports with a custom name run
```bash
npm run cruller:run -- -name <reportName>
```
e.g.
```bash
npm run cruller:run -- -name Login
```

### Specifying Tags
Tags are a great way to organize your features and scenarios.

They can be used for two purposes:
* Running a subset of scenarios
* Restricting hooks to a subset of scenarios

[Click here](https://cucumber.io/docs/cucumber/api/#tags) for more info on tags. 

You can run tagged tests using the following command.
```bash
npm run cruller:run -- --tags <tag1> <tag2> <tag3> ...
```
e.g.
```bash
npm run cruller:run -- --tags @form @element @page
```

## Running Reports
In order to create a readable interactive report based on the `json` file created after running the tests, use thee following command.

```bash
npm run cruller:report
```
Or if you are using yarn

```bash
yarn cruller:report
```

### Specifying Report Name
In order to create readable reports based on a test name previously run, use the following command.
```bash
npm run cruller:report -- -name <reportName>
```
e.g.
```bash
npm run cruller:report -- -name Login
```

## Writing Your First Test
The following example shows how to write e2e tests using the cruller bdd framework using OOTB step definitions as well as custom ones. It also shows a basic example of organizing files and selector best practices.
1. Create a file named `'Hello World.feature'` under `bdd/feature-files` folder.
2. Add the following lines of code to the `'Hello World.feature'` file and save it.
    ```gherkin
    @my-test
    Feature: My first e2e feature using cruller-bdd

        This goes to google.com and searches for cucumber-js

        Scenario: Search for cucumber-js on google
            Given I go to url "Google Website"
            Then I focus on "Search Box"
            Then I fill field "Search Box" with "cucumber-js"
            And I press enter
            Then I wait for page navigation
            Then I log "Searched cucumber-js" to console
    ```
3. Next create a file named `my-test.js` under `bdd/support/selectors` folder.
4. Add the following lines of code to the file and save it.
    ```js
    module.exports = {
        'Google Website': 'https://www.google.com',
        'Search Box': '[name="q"]'
    };
    ```
5. Next create a file named `my-test.js` under `bdd/step_definitions` folder.
6. Add the following lines of code to the file and save it.
    ```js
    const { Then } = require('cucumber');

    Then('I log {string} to console', value => {
        console.log(value);
    });
    ```
7. Finally run the test feature using the following command
    ```bash
    npm run cruller:run -- -name MyTest --tags @my-test
    ```
    Creating a readable report 
    ```bash
    npm run cruller:report -- -name MyTest
    ```

For more examples on features files and the corresponding step definitions checkout [examples](../../bin/folderStructureBdd/feature-files/examples), [step_definitions](core/steps) and  [actions](core/actions) folders.
