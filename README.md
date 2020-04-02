Recurse Center Zulip Checkin Exporter
==

Did you write a small novel in your checkin topic on Zulip during your time at the [Recurse Center](https://www.recurse.com/scout/click?t=151b3c977197fc57d3ab8ce968bce35e)? Do you kind of wish you could download it and have it all in one place?

Well, it's your lucky day! 

# How to Use

## Step 1: Download & Setup

Clone or download the project into a directory and run

```
npm install
```

There are just a couple packages. Hopefully that goes without incident.

## Step 2: Zulip API credentials

First you'll need to download your Zulip API credentials. There are instructions on how to do that here:

[https://zulipchat.com/api/api-keys](https://zulipchat.com/api/api-keys)

This should give you a file called `zuliprc` that you can place in this project directory alongside `app.js`.

## Step 3: Use!

Once you'ved done that you'll you can run it from the command line by providing your stream topic **exactly** it's written in the Zulip stream. For example:

```
node app.js "George Mandis"
```

That should do it! You'll see all of your checkins output to the terminal as HTML. If you'd like to output as markdown you can pass an optional markdown paramter after your stream topic:

```
node app.js "George Mandis" markdown
```

If you'd like to save the contents to a file you can do so like this:

```
node app.js "George Mandis" > george-mandis-checkins.html
node app.js "George Mandis" markdown < george-mandis-checkins.md
```


# Caveat Emptor

- Your name might be a little more descriptive than mine and look something like `Jane Doe (she/her) (W2'20)`. That should still work! Make sure you provide the correct number of spaces between your parentheticals. 
- If you wrote a truly <s>obscene</s> wonderful amount of content you can change the `num_before` property to something higher than 3000. In that case you should probably also find an agent and a publisher.

Want to become a better programmer? [Join the Recurse Center!](https://www.recurse.com/scout/click?t=151b3c977197fc57d3ab8ce968bce35e)
