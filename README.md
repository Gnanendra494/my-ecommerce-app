🥇 EverScale: A Serverless E-Commerce Product Catalog
Project Overview
🥇EverScale is a full-stack, serverless e-commerce product catalog application built to demonstrate modern cloud development principles. It features a responsive React front-end, a secure authentication system, and a robust REST API for managing product data.

This project showcases a comprehensive understanding of the full software development lifecycle on the AWS platform.

Key Features
Responsive & Dynamic Front-End: A modern, visually appealing front-end built with React and Tailwind CSS that looks great on any device.

Secure User Authentication: Implemented with Amazon Cognito to provide user sign-up, sign-in, and role-based access control. New users are automatically added to a Customer group using a Lambda trigger.

Serverless REST API: A clean, RESTful API built with Amazon API Gateway and AWS Lambda to handle product data operations (Create, Read, Update, Delete).

NoSQL Database: All product data is stored in a highly scalable and flexible Amazon DynamoDB table.

Automated CI/CD Pipeline: Deployed using AWS Amplify, which automatically builds and publishes the application every time changes are pushed to the main branch of the repository.

Architecture Diagram
The application is built on a serverless, event-driven architecture. The user interacts with the React front-end, which is hosted on AWS Amplify. When a user signs in, Amazon Cognito handles the authentication process. All API calls from the front-end go through Amazon API Gateway, which acts as a secure entry point. These API calls trigger AWS Lambda functions, where the core business logic is executed. The Lambda functions perform Create, Read, Update, and Delete (CRUD) operations on an Amazon DynamoDB table, which serves as the application's NoSQL database.

Technologies Used
Front-End: React, Tailwind CSS

Backend: AWS Lambda (Node.js/Express.js)

API: Amazon API Gateway

Database: Amazon DynamoDB

Authentication: Amazon Cognito

CI/CD & Hosting: AWS Amplify

How to Run Locally
Clone this repository: git clone https://github.com/Gnanendra494/my-ecommerce-app.git

Navigate to the project directory: cd my-ecommerce-app

Install dependencies: npm install

Launch the application: npm start
