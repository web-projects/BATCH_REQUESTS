# Introduction

The BATCH_REQUESTS project allows the Client Solutions Team to quickly monitor, query and keep up to date on diagnostic coming from the system that is beyond the scope of various platform as a service monitorings. Some platforms such as AWS and Azure will allow you to capture the metrics on CPU, Memory and various dependency calls. However, our Dashboard system allows you to deep dive into network condition testing, capturing checkpoint data in code and visualizing that information.

At the time of writing, the planned feature add-on for Dashboards will allow our team the ability to query IPA installations in the field to grab near-realtime data on the health of the machine and also device information.

# Project Philosophy

Keeping up with the times, it is important for us to leverage relevant technologies to support company goals while providing long term value. JavaScript over the years has proven itself to be a formidable language with the largest pool of engineering popularity. Furthermore, it is a mature language and continues to evolve with the latest addition of ES 2015 usage made with babel transpiling.

To that end, we want to leverage more open source technologies that have a proven track record so NodeJS was an obvious choice for its performance, rock solid stability and reliability. The memory and CPU footprint is low, it utilizes an event-loop model on a single thread to achieve maximum performance and it can run for years undisturbed without a hiccup.

With the architecture changes proposed:

* This project can be supported by a large pool of qualified engineers.

* Provide longevity and relevancy for the next couple of years.

* Improve the skill and viability of our existing development staff while providing long term value to our company and clients.

* It's challenging, fun and an interesting technology stack to work on that offers a wide array of possibilities.

It is a multi-prong architectural design that is well thought out and achieves multiple goals in one swing. This project has strict code practices, fast iterations and will require some extensive research to become quickly productive. I encourage you to read through this guide and study all of the links in the **Mandatory Reading** section to get up to speed quickly.

# Design Document


# Tool Pre-requisites

Before you can begin working on the project you must install the following tools:

## NodeJS

* A powerful cross platform framework for developing client and server-side applications utilizing the latest JavaScript technologies.

* [NodeJS Download Link](https://nodejs.org/en/download/) Please download the 64-bit copy for your platform.

* The installation will ask you if you'd like to install chocolately and the answer is **YES**. Once complete you should be able to open up a command prompt and run the following commands:

* npm -v

* node -v

## Visual Studio Code

* A powerful cross platform IDE / Editor which allows you to build, test and debug a wide variety of languages and frameworks. It was designed originally to compete with other open source editors and primarily for NodeJS development and has become the defacto standard for Javascript / NodeJS development.

* [Visual Studio Code Download Link](https://code.visualstudio.com/Download) Please download the 64-bit copy for your platform. Select the **User Installer** and follow the instructions to completion.

# Extra Extensions

When you're done installing Visual Studio Code you'll have to install the following extensions to the IDE in order to become immediately productive.

* **ESLint** - Allows ESLint integration to be fully baked into Visual Studio Code providing you real time help.

* **Mocha Sidebar** - Allows you to run all of your unit tests from a simple sidebar extension panel.

# Getting Started

When you have everything setup you're going to need to install the node modules locally to your workspace. You **MUST** run the **npm install** command to install all packages before running the application.

* **npm install** - Installs all of the packages described in your **package.json** file.

* **npm run devRun** - Runs the application and launches the NodeJS Express Application.

* **npm run prodBuild** - Creates a production version of the application to test against.

* **npm test** - Runs all unit tests under Mocha utilizing the babel core register.

You can also utilize the Visual Studio Code built-in terminal in order to run commands by pressing CTRL + ~ from within the editor. Navigate to the Terminal and at the top right select the dropdown menu. Click on **"Select Default Shell"** and when the selection modal appears select Git Bash to have an interactive powershell integrated in. 

If you need help with this please feel free to reach out.

# Additional Package Dependencies

* Protocol Buffers (npm install -g protocol-buffers)

# Mandatory Reading for Contributors

In order to become a contributor on this fast iteration project you **MUST** read and study the following materials. This is designed to respect the time of our team members who are heads down and working hard, and also to give you a reliable roadmap to get up to speed with the rest of us. If you still have questions after reading the following guides then reach out to team members on the **batch-requests-team** slack channel.

* [NodeJS Tutorial](https://www.tutorialspoint.com/nodejs/index.htm) Read this in order to gain a basic fundamental understanding of what NodeJS is and why it's powerful.

* [NPM Tutorial](https://nodesource.com/blog/an-absolute-beginners-guide-to-using-npm/) Read this to get an intermediate and working understanding of NPM, the NodeJS package manager (equivalent to NuGet on .NET for you C# developers).

* [ES6 Tutorial](https://www.javascripttutorial.net/es6/) Read this to gain a working knowledge of the latest JavaScript enhancements known as ES6. It allows developers to write cleaner object oriented code and provides a lot of nifty updates in comparison to old school JS. It is leveraged with Babel so please be sure to read the tutorial for that as well.

* [Babel Tutorial](https://babeljs.io/docs/en/) Read this guide to get a working understanding of the popular JavaScript Transpiler known as Babel. This is a **MUST READ** because without understanding this piece you'll be very lost and unaware of how the code works on the server and client side so elegantly.

* [Webpack Tutorial](https://webpack.js.org/guides/getting-started/) Read this to gain a working understanding of what Webpack is. In short, it's a compilation tool to bundle JavaScript modules but it can do much more these days!

* [ReactJS Tutorial (Facebook)](https://reactjs.org/tutorial/tutorial.html) Read this to gain an advanced understanding of ReactJS which is a powerful and very popular JavaScript UI Library. The library has become extremely popular over the years and has since surpassed AngularJS popularity. It was developed by Facebook and used internally for their Facebook.com application and now is open sourced for the greater development community to leverage.

* [Redux Tutorial](https://redux.js.org/basics/basic-tutorial) Read this to gain an advanced understanding of Redux which is a popular state management library. It has become almost synonymous with ReactJS development but can be utilized on other libraries and frameworks. We utilize Redux in our application in order to manage state information. The short and sweet of it is that it's a glorified publisher/subscriber library that allows you to be notified of state changes so your components can be updated with new data and re-render the changes.

* [Chai Tutorial](https://www.chaijs.com/guide/) Read this to gain an advanced understanding of Chai, the popular JavaScript assertion library. It provides a very expressive declarative syntax that makes it clean and concise in meaning and intention. It is utilized in many other popular TDD and BDD Frameworks.

* [Mocha Tutorial](https://mochajs.org/#getting-started) Read this to gain a working understanding of Mocha, the popular test framework. It has a very cool syntax and nice output for running tests. It is simple to learn and easy to use.

* [Bootstrap Tutorial](https://www.w3schools.com/bootstrap4/) Read this to gain an in-depth understanding of Bootstrap 4 which is a nifty HTML, CSS and JavaScript framework for building responsive websites.

* [MDBootstrap Tutorial](https://mdbootstrap.com/education/bootstrap/) Read this to gain an understanding on our HTML5, CSS3 Framework. MD Bootstrap is based on Bootstrap.

# Additional Helpful Tips

* The project is already pre-configured to run as is and is dependent on you having both NodeJS and Visual Studio Code installed on your machine already. There should be no other further setup involved.

* Before making any global configuration changes in any of the config files please reach out to a more experienced team member and ask questions.

* Packages added to the **package.json** file should be announced in your pull request so that other team members are aware of it. 

* If you run into trouble or need help understanding something please do not spin on it. Reach out to your team members and ask questions because it's very likely you can be unblocked very quickly.