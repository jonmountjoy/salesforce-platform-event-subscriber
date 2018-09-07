## Salesforce Platform Event Subscriber

A simple application that subscribes to all Salesforce Platform Events, and then
shows each event as it is fired.

Follow the instructions below to deploy your own instance of the application:

1. Fill in the config variables as follows:
    - For **SF_CLIENT_ID**, enter the Consumer Key of your Salesforce Connected App
    - For **SF_CLIENT_SECRET**, enter the Consumer Secret of your Salesforce Connected App
    - For **SF_USER_NAME**, enter the the username of your Salesforce user
    - For **SF_USER_PASSWORD**, enter the the password of your Salesforce user
    - Optionally set **REDIRECT_URL** to the URL of the app itself
2. Create a Connected App in Salesforce, with OAuth pointing to this app's URL like so `http://localhost:7000/oauth/_callback`

If you don't want to set the REDIRECT_URL, do this:

    heroku labs:enable runtime-dyno-metadata

## Local Development

For local development, set **REDIRECT_URL** to something like `http://localhost:7000/oauth/_callback` and then run the app with:

`heroku local:start -p 7000`

## TODO

- [ ] Show the names of all the events we're actually subscribed to.
- [ ] Dynamically subscribe to new event types?

## Based on

This code comes mostly [from this repo](https://github.com/ccoenraets/northern-trail-manufacturing)
