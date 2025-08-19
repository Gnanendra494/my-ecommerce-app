<h1> 🥇 EverScale: A Serverless E-Commerce Product Catalog </h1>
Live Demo URL: https://main.dd9wvmyu8537s.amplifyapp.com

<h1> 📝 Project Overview </h1>
🥇EverScale is a full-stack, serverless e-commerce product catalog application built to demonstrate modern cloud development principles. It features a responsive React front-end, a secure authentication system, and a robust REST API for managing product data. This project was designed to solve a common business problem: how to build a scalable, resilient, and cost-effective e-commerce platform without the overhead of managing traditional server infrastructure.

This project showcases a comprehensive understanding of the full software development lifecycle on the AWS platform, from initial setup and front-end hosting to backend API development, database management, and automated CI/CD pipelines.

<h1> 🚀 Key Features </h1>
<h4>Responsive & Dynamic Front-End:</h4> A modern, visually appealing front-end built with React and Tailwind CSS. The user interface is fully responsive and provides a seamless experience on any device, from mobile phones to desktops.

<h4>Secure User Authentication:</h4> Implemented with Amazon Cognito to provide secure user sign-up, sign-in, and management. The system is configured with user groups (Admin and Customer) to enable role-based access control. A Lambda trigger automatically assigns new users to the Customer group upon sign-up, demonstrating an event-driven approach to user management.

<h4> Serverless REST API: </h4> A clean, RESTful API built with Amazon API Gateway and an AWS Lambda function running an Express.js application. The API handles all product data operations (Create, Read, Update, Delete) and is secured to ensure that only authenticated users can access the endpoints.

<h4> NoSQL Database: </h4> All product data is stored in a highly scalable and flexible Amazon DynamoDB table. The database is designed with a simple but effective schema that allows for efficient querying and data retrieval.

<h4> Automated CI/CD Pipeline: </h4> Deployed using AWS Amplify, which automatically builds and publishes the application every time changes are pushed to the main branch of the repository. This demonstrates a modern, DevOps-centric approach to software delivery.

<h1> 🏗️ Architecture Diagram </h1>
The application is built on a serverless, event-driven architecture. The workflow is as follows:

<h4> User Interaction: </h4> The user accesses the React front-end, which is hosted on AWS Amplify.

<h4> Authentication: </h4> When a user signs up or logs in, Amazon Cognito handles the authentication process securely. Upon successful sign-up, a Lambda trigger is invoked to automatically add the user to the Customer group in the Cognito User Pool.

<h4> API Communication: </h4> The front-end communicates with the backend via a REST API managed by Amazon API Gateway. All API calls are secured and require a valid user token from Cognito.

<h4> Business Logic: </h4> API calls trigger an AWS Lambda function, which contains the core business logic for all CRUD (Create, Read, Update, Delete) operations.

<h4> Data Storage: </h4> The Lambda function interacts with an Amazon DynamoDB table to store and retrieve product data, ensuring a fast and scalable data layer.

<h1> Architectural Diagram: </h1>

<h2> 🛠️ Technologies Used </h2>
<h4> Front-End:</h4>React, Tailwind CSS

<h4> Backend:</h4>AWS Lambda (Node.js/Express.js)

<h4> API:</h4> Amazon API Gateway

<h4> Database:</h4> Amazon DynamoDB

<h4> Authentication:</h4> Amazon Cognito

<h4> CI/CD & Hosting:</h4> AWS Amplify

<h2> 💻 How to Run Locally </h2>
<h3> Prerequisites </h3>

1)Node.js and npm installed

2)An active AWS account

3)AWS Amplify CLI configured (npm install -g @aws-amplify/cli)

<h2> Steps </h2>
<h4>Clone this repository:</h4>

git clone https://github.com/Gnanendra494/my-ecommerce-app.git

<h4>Navigate to the project directory:</h4>

cd my-ecommerce-app

<h4> Install dependencies: </h4>

npm install

<h4> Launch the application: </h4>

npm start
