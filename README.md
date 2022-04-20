# udacity-project5
# Serverless LEAVE

Implement a simple LEAVE application using AWS Lambda and Serverless framework. 
# Functionality of the application

This application will allow creating/removing/updating/fetching LEAVE items. Each LEAVE item can optionally have an attachment image. Each user only has access to LEAVE items that he/she has created.

# LEAVE items

The application should store LEAVE items, and each LEAVE item contains the following fields:

* `finishId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a LEAVE item (e.g. "Vacation, Sick, Short Term Disability, etc")
* `finishDate` (string) - date of leave
* `hours` (int) - hours of this leave
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a LEAVE item

You might also store an id of a user who created a LEAVE item.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   

