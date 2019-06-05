# Cruller

A web crawler capable of traversing any site with custom environmental variables.

## Installation
Navigate to the repo where you would like to run Cruller. And run the following command to install Cruller into your project.

```bash
npm i cruller
```

Ensure you have a testing suite installed if you would like to use one, as Cruller is agnostic to how it is used and will not provide one. Be sure to run ```npm init``` and ensure that the test command matches your test suite of choice. No other fields are required.  

Run the following command to generate a template project structure, containing sample pages and tests in the root of where your automated test suite will be located.

```bash
npx gen-fs
```

## Configuration
A file called cruller.config.js will have been created. Within this file many parameters are set.

### Environment Variables 
Any number of environment variables can be set for your crawls. You are able to include as many instances of each variable as needed. By default Cruller will perform one crawl pass for each permutation if your environment variable combinations. By default Cruller includes two in every project:

 * ```baseurl```: the origin landing page of your project.
 * ```breakpoints```: size breakpoint between devices.  

### Stamp Directory {stampDirectory}
Location of all page stamps. Using the gen-fs command will point this to the default directory. However, if you prefer you can keep your stamps elsewhere.

### Browserless Url {browserlessUrl}
Location of your browserless installation. Leave blank if none is being used.

### Setup Function
Define any steps required to configure the startup state of your crawler.  
By default the configuration of ```baseurl``` and ```breakpoints``` will be defined here.  
Be sure to set up your custom environment variables.

### Env Exceptions
A function that contains custom instructions for specific permutations of environment variables which do not occur normally.

## Usage

### Configuring Stamps

### What Are Stamps?
[Stamps](https://stampit.js.org/) are how Cruller creates page objects and methods. Every page Cruller runs on will have stamps defining its props and methods.

### Creating Stamps
* Every page must export at least a Base Page. For example, the Home page export would look like this: ```module.exports = { homeBase };``` 

* The base stamp is the collection of props and methods that will be used on the given page by default, across all permutations of your enviornment variables, unless overwritten for specific environment variables with a seperate stamp.

* When naming Page Stamps, follow the naming convention for base stamps ```lowercase page name + Base```. For example, the Home Page base stamp would be named ```homeBase```. 

* If stamps for specific environment variables are needed follow the following naming convention ```lowercase page name + [environment variable name]```. For example, the Home Page Mobile stamp would be named ```homeMobile```. 

* Stamps for specific environment variables will overwrite any props or methods with the same name provided in the base stamp. This is especially useful if the same prop or method requires different inputs depending on the environment, as your crawl will pick the correct stamp depending on the permutation. 

* When exporting more than one page stamp per page, append any additional pages to the export statement, as follows: ```module.exports = { homeBase, homeMobile };```

* There is no need to include a separate Page Stamp for any environment variable that has the same properties and methods as your base stamp.

* To see example stamps see ```stamps/pages/home.js``` and ```stamps/shared/shared.js```.

#### Pages Folder
Contains page stamps for individual pages.

* Any stamps created must be included in the ```index.js``` file of that directory

#### Sections Folder
```WIP```: Contains stamps usable across several pages on the site. 

#### Shared Folder
Contains stamps usable on every page on the site.

### Page Objects

#### Props

Props are how [stampit](https://stampit.js.org/api/properties) adds properties to your Page Object. Every prop on a page will be a key value pair which can be used by the Page's methods. 

* To increase the readability of your methods it is recommended every CSS selector used for your methods is given a descriptive prop. Be sure to indicate the type of selector being used with the proper notation (```#``` for an ID, and ```.``` for a class). A prop called ```link``` for the class ```link_to_homepage``` would be set using:

```link : '.link_to_homepage'```

#### Methods

Methods are [stampit](https://stampit.js.org/api/methods) functions associated with your page object. Since this a web crawler, it is recommended that only asynchronous functions are used, with each step being preceded by an ```await``` to ensure your methods execute in the correct order. All [Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) functions are available. 

* Ensure that Puppeteer functions, and any props they use reference the Page Object. Therefore the proper syntax for a statement in which the ```link``` prop is clicked would be the following:

```await this.puppeteerPage.click(this.link);```

* However, you are able to create statements which use non-Puppeteer functions. Cruller includes 5 helper methods available within every stamp: 
     1) ```visit()```: visits the page of the ```baseUrl``` and appends a string of the prop ```pageUrl``` (which you must define on each page) to the end of the url.

     2) ```waitClick(prop)```: waits for prop and then clicks once the prop is visible.

     3) ```waitClickNavigate(prop)```: waits for prop, clicks once the prop is visible, and waits for navigation on the page to complete.
     
     4) ```emptyField(prop)```: deletes all text content of specified prop.

     5) ```clickByIndex(prop, index)```: clicks on particular instance or a given prop.

* For these, and any other non-Puppeteer functions, a different syntax is used. The following would click the same ```link``` prop used in prior examples using the ```waitClick()``` function:

```await this.waitClick('link');```

### Creating Tests in Jest
* Cruller can support any test suite, however it was created with running Jest in mind. Jest test files are required to have the structure ```testname.test.js```. Be sure to install Jest in your project if you decide to use it, as it is not included with Cruller.

* Every test should contain a beforeAll that launches a new instance of the crawler using [Chromium](https://www.chromium.org/Home) and runs the startUp command, which takes two objects as parameters.  
    1) perms: Permutations needed for the test. Baseurl and breakpoint are the two included with Cruller. 
    * Be sure to include any additional environment variables. 
    2) opts: [Puppeteer Connect Options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerconnectoptions) are not required to be included on any given test. If none are provided, Puppeteer's default connection settings will be used.

* Every test should contain an afterAll that closes the browser.

* Each test will be a series of steps under the following format until the crawl has completed all steps.  
```await [project name].[page name]Page.[method];```

* Any set of assertions can be implemented but are not necessary to run tests. Be sure to establish where assertions are kept in your ```package.json``` file.

* A sample test is provided in ```tests/sample.test.js```.

### Running Tests Locally
* Run ```npm test```  on the command line within the directory your tests are located in.

* You can specify in the command line to run only certain permutations of your tests. The following command would run all tests using only the permutation of Google as your ```baseurl``` running at a tablet sized ```breakpoint```.  
```BASEURL="google" BREAKPOINT="tablet" npm test```