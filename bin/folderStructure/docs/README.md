[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Build Status](https://travis-ci.com/azohra/cruller.svg?branch=master)](https://travis-ci.com/azohra/cruller)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Cruller

* Cruller is an open source page object framework for Google’s [Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) created by your pals in Engineering Productivity.
* Cruller allows for easier creation and maintenance of page objects by leveraging [Stampit](https://stampit.js.org/).
* Run in your pipelines using [Browserless](https://docs.browserless.io/).

## Why Automate?

* Catch bugs before your users do!
* When integretaed with a pipeline, Cruller allows a full suite of tests to run on every push and merge request
* Speed up your release cycle


## Installation
Navigate to the repo where you would like to run Cruller. And run the following command to install Cruller into your project.

```bash
npm i cruller
```

Be sure to run ```npm init``` and ensure that the test command matches your test suite of choice (though Cruller was made with [Jest](https://jestjs.io/
) in mind). No other fields are required.  

Run the following command to generate a template project structure, containing sample pages and tests in the root of where your automated test suite will be located.

```bash
npx gen-fs
```

## Configuration
A file called cruller.config.js will have been created. Within this file many parameters are set.

### Environment Variables 
Any number of environment variables can be set for different permutations of your crawls. You are able to include as many instances of each variable as needed. By default Cruller will perform one crawl pass for each permutation if your environment variable combinations. Cruller includes two variables in every project. Both the default avlues as well as the variables can be changed or deletes if they are not necessary:

 * ```baseurl```: the origin landing page of your project.
```javascript
baseurl: {
    google:'http://www.google.com/',
    yahoo: 'https://www.yahoo.com/',
    bing: 'https://www.bing.com/'
}
```    
 * `breakpoints`: size breakpoint between devices.  
```javascript
breakpoint: {
        mobile: {width: 650, height: 2000},
        tablet: {width: 900, height: 2000},
        desktop: {width: 1200, height: 2000}
}
```

### Setup Function
Using any JS or Puppeteer methods, define any steps required to configure the startup state of your crawler, such as ensuring proper [authentication credentials](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageauthenticatecredentials) 

```javascript
await page.authenticate({username: 'YOUR_USERNAME', password:'YOUR_PASSWORD'})
```

or [cookies](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetcookiecookies) are set.

```javascript
await page.setCookie({ name: 'COOKIE_NAME', value: 'COOKIE_VALUE' });

```

By default the configuration of ```baseurl``` and ```breakpoints``` will be defined here.  
Be sure to set up your custom environment variables.

### Env Exceptions
A function that contains custom instructions for specific permutations of environment variables which do not occur normally. The example below assumes environment variables are set for ```baseurl``` and ```breakpoint``` and that the permutation of ```tablet``` && ```bing``` should override the ```breakpoint``` to display as ```mobile``` and not ```tablet```.
```javascript
if (envMap.breakpoint == 'tablet' && envMap.baseurl == 'bing') envMap.breakpoint = 'mobile';
return envMap;
```

## Example Page Stamp & Crawl

Before we dive into how to write stamps and tests let's take a look at an example of each. First, here's what a page stamp to execute a search on the home page of 3 popular search engines may look like.

```javascript
const stampit = require('@stamp/it');

// We are using Google as our base, this code will be run unless a later stamp overwrites it.
const homeBase = stampit({
    props: {
        // Defining a prop to select the search bar on Google
        searchBar: '[aria-label="Search"]'
    },

    methods: {
        // Use Puppeteer to fill in a search and execute the search
        async search() {
            await this.puppeteerPage.waitForSelector(this.searchBar, {visible: true});
            await this.puppeteerPage.type(this.searchBar, 'cruller npm', {delay: 20});
            await this.puppeteerPage.keyboard.press('Enter');
        }
    }
});

// This stamp will override props and methods with the same name in the base when Yahoo is set as the baseurl 
const homeYahoo = stampit({
    props: {
        searchBar: '#uh-search-form'
    }
});

// This stamp will override props and methods with the same name in the base when Bing is set as the baseurl
const homeBing = stampit({
    props: {
        searchBar: '#sb_form_q'
    }
});

module.exports = { homeBase, homeYahoo, homeBing };
```

Now let's see how we'd take these stamps and use them in a crawl. See `sample.test.js` to see the same crawl using Jest.

```javascript
const B = require('cruller'); // replace B with project-specific name
const permutations = require('cruller').cartesian;

        sample = new B;
        // Establish which variables will be used for different permutations
        await sample.startUp({baseurl: baseurl, breakpoint: breakpoint});
        // Call the 'search' function from our home page stamp
        await sample.homePage.search();
        // Be sure to close your crawls when they are done!
        await sample.browser.close();
```

## File Structure 

### Pages Folder
Each file in the ```pages``` directory contains all of the stamps used on that particular page. 

* Any stamps created must be added to the ```index.js``` file of the ```pages``` directory

### Sections Folder

* Currently `WIP`!

### Shared Folder
Each file in the ```shared``` directory contains stamps that are used across several pages. Every stamp created in the ```shared``` directory is available to be used on any page, as long as it is not overwritten by an identically named ```prop``` or ```method```.

* Any stamps created must be added to the ```index.js``` file of the ```shared``` directory

### Tests Folder
Each test crawl must be added to the ```tests``` folder with the syntax:  
```testname.test.js```  

## Puppeteer

[Puppeteer](https://developers.google.com/web/tools/puppeteer/) is a Node library created by Google to control Chrome or Chromium over the DevTools protocol and is the backbone of Cruller.  

Any action that can be taken using DevTools can be mimicked by Puppeteer. For testing purposes it works best to crawl through pages, by actions such as clicking buttons and filling in forms. The full list of available actions can be found [here](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md).

## Stamps

### What Are Stamps?
[Stamps](https://stampit.js.org/) are what Cruller uses to creates page objects and methods. Every page Cruller runs on will have stamps defining its props and methods.  

Each page's Stamps are JS objects created using the ```stampit``` method with up to two properties, ```props``` and ```methods```.

### Creating Stamps
* All stamp names within a page must match value exported in ```index.js``` followed by either ```Base``` as the default stamp, or the name of one of your permutations if it requires custom actions.  

* The base stamp is the collection of props and methods that will be used on the given page by default, across all permutations of your enviornment variables, unless overwritten for specific environment variables with a seperate stamp.

* If stamps for specific environment variables are needed create (and be sure to export!) a new stamp containing *only* the values of the Base stamp which must be overwritten. Name the stamp with the page title followed by the specific environment variable that is being used. For example, the Home Page stamp that only runs on the Google ```baseurl```  would be named ```homeGoogle```. 

* There is no need to include a separate Page Stamp for any environment variable that has the same properties and methods as your base stamp.

* Stamps for specific environment variables will overwrite any props or methods with the same name provided in the base stamp.  
This is especially useful if the same prop or method requires different inputs or selectors depending on the environment, as your crawl will pick the correct stamp depending on the permutation. 

* To see an example set of page stamps from your generated file structure see ```stamps/pages/home.js```.

### Props

Props are how [stampit](https://stampit.js.org/api/properties) adds properties to your Page Object. Every prop on a page will be a key value pair in the ```props``` object of your stamp. 

* To increase the readability of your methods it is recommended every CSS selector used for your methods is given a descriptive prop. Be sure to indicate the type of selector being used with the proper notation (```#``` for an ID, ```.``` for a class, or ```[title/label/etc="value"]```).  

* Props are also valuable for inputting data such as form data.

### Methods

The second half of a stamp are Methods. Methods are [stampit](https://stampit.js.org/api/methods) functions associated with your page object. Since this a web crawler, it is recommended that only asynchronous functions are used, with each step being preceded by an ```await``` to ensure your methods execute in the correct order. All [Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) functions are available. 

Ensure that whenever Puppeteer functions are called that they reference the Page Object. 

As an example, the proper syntax for a statement in which the ```link``` prop is clicked would be the following:

```javascript 
await this.puppeteerPage.click(this.link);
```

However, you are not limited to using Puppeteer functions to create your methods. All non-Puppeteer JS functions can be used as well. Just be sure to call them asynchronously if necessary using ```await```.

Cruller even includes 4 helper methods available within every stamp. In these methods the ```props``` are called by a string value of their key.  

1) ```waitClick(prop)```: waits for a prop and then clicks once the prop is visible.

```javascript
await this.waitClick('loginButton');
```

2) ```waitClickNavigate(prop)```: waits for a prop, clicks once the prop is visible, and waits for navigation on the page to complete.

```javascript
await this.waitClickNavigate('registerButton');
```

3) ```emptyField(prop)```: deletes all text content of specified prop.

```javascript
await this.emptyField('selectQuantity');

```

4) ```clickByIndex(prop, index)```: clicks on particular instance or a given prop using a zero based index of its incidence.

```javascript
await this.clickByIndex('productNameLink', '2');
```

## Creating Tests in Jest
* Cruller can support any test suite, however it was created with running Jest in mind. Be sure to install Jest in your project if you decide to use it, as it is not included with Cruller.

* Every test should contain a beforeAll that launches a new instance of the crawler using [Chromium](https://www.chromium.org/Home) and runs the startUp command, which takes two objects as parameters.  
    1) perms: Permutations needed for the test. Baseurl and breakpoint are the two included with Cruller. 
    * Be sure to include any additional environment variables. 
    2) opts: [Puppeteer Connect Options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerconnectoptions) are not required to be included on any given test. If none are provided, Puppeteer's default connection settings will be used. 
You can any other necessary set up steps to the function as well on a test-by-test basis. 

```javascript
beforeAll(async () => {
        sample = new B;
        await sample.startUp({banner: banner, breakpoint: breakpoint});
    }, 80000);
```

* Every test should contain an afterAll that closes the browser, as well as any teardown steps necessary on a test-by-test basis. 

```javascript
    afterAll(async () => {
        await sample.browser.close();
    });
```

* Each test will be a series of steps under the following format until the crawl has completed all steps.  
```await [project name].[page name]Page.[method];```

```javascript
await sample.homePage.search();
```

* Any set of assertions can be implemented but are not necessary to run tests. Be sure to establish where assertions are kept in your ```package.json``` file. The following example shows both the snippet to declare the location of your custom assertions in ```package.json``` as well as an example to create an assertion to check if an element is visible on the given page.

```json
"jest": {
    "setupFilesAfterEnv": [
      "./assertions.js"
    ]
  },
```

```javascript
expect.extend({
    async toHaveElement(puppeteerPage, expectedElement) {
        await puppeteerPage.waitForSelector(expectedElement, {visible: true}); 
        const pass = await puppeteerPage.$(expectedElement) !== null;
        if (pass) {
            return {
                message: () =>
                    `expected ${puppeteerPage.url()} not to contain the element ${expectedElement}`,
                pass: true,
            }; 
        } else {
            return {
                message: () =>
                    `expected ${puppeteerPage.url()} to contain the element ${expectedElement}`,                    
                pass: false,
            };
        }
    }
});
```

* A sample test is provided in ```tests/sample.test.js```.

## Running Tests Locally
* Run ```npm test```  on the command line within the directory your tests are located in.

* You can specify in the command line to run only certain permutations of your tests. The following command would run all tests using only the permutations of Google and Yahoo as your ```baseurl``` running at a tablet sized ```breakpoint```.  
```bash
BASEURL="google,yahoo" BREAKPOINT="tablet" npm test
```

* You can also run a subset of tests by passing in a string after ```npm test``` in your command line. As an example, if you had a whole test suite, but just wanted to run tests that have the string ```smoke``` in the title, you would run the following command.
```bash
npm test smoke
```

## Running Tests in the Pipeline
* The rules for which permutations and tests to run apply for the pipeline as well, as long as they are set up in your ```yaml``` or ```sh``` file.

* Ensure when running in the pipeline that the ```PIPELINE``` environment variavle is set to true. This allows the test to run using [Browserless](https://docs.browserless.io/). Please note that you need to provide a Browserless Key in your ```cruller.config.js```. The prior example would be called the following way in the pipeline.  
```bash
PIPELINE=true BASEURL="google,yahoo" BREAKPOINT="tablet" npm test
```

* Add a stage to you ```.yml``` file for your automated tests. An example based on a ```gitlab-ci.yml``` follows:
```yml
run_e2e_tests:
  image: mhart/alpine-node
  stage: e2e_test
  when: manual
  before_script:
   - cd test-automation
   - npm install
  script:
   - PIPELINE=true BASEURL="google,yahoo" BREAKPOINT="tablet" npm test
  only:
   - master
   - tags
```