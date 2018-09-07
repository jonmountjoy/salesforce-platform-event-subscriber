## Salesforce Platform Event Subscriber

A simple application that:

* Uses the Salesforce Metadata API to grab all Platform Event types,
* Subscribes to them all
* Presents a web page that dynamically updates with the content of each event as it's fired.
shows each event as it is fired.

### Running locally

1. Copy `.env.demo` to `.env`
2. Edit `.env` and set the following variables:
    - For **SF_CLIENT_ID**, enter the Consumer Key of your Salesforce Connected App
    - For **SF_CLIENT_SECRET**, enter the Consumer Secret of your Salesforce Connected App
    - For **SF_USER_NAME**, enter the the username of your Salesforce user
    - For **SF_USER_PASSWORD**, enter the the password of your Salesforce user
    - Set **REDIRECT_URL** to the URL of the app itself
3. Create a Connected App in Salesforce, with OAuth pointing to this app's URL like so     `http://localhost:7000/oauth/_callback`

Start the app:

    heroku local:start -p 7000

### Running on Heroku

    heroku create
    heroku labs:enable runtime-dyno-metadata
    git push heroku master
    heroku config:set SF_CLIENT_ID=foo SF_CLIENT_SECRET=bar SF_USER_NAME=foo@bar.com SF_USER_PASSWORD=xyz
    heroku open

## TODO

- [ ] Show the names of all the events we're actually subscribed to.
- [ ] Dynamically subscribe to new event types?

## Based on

This code comes mostly [from this repo](https://github.com/ccoenraets/northern-trail-manufacturing)
