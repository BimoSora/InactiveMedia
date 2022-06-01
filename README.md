# InactiveMedia
If a new user logs in, the bot will save and save the user data. The bot also reads when the user sends media. You can kick inactive users at the same time with bot commands
<hr>
<a href="https://heroku.com/deploy?template=https://github.com/BimoSora/InactiveMedia">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
</br>
Replace the link with your github template.
</br></br>

Required details.</br>
<code>TOKEN</code> - Get bot Token from bot father.</br>
<code>DOMAIN</code> - Enter your app name in Heroku.</br>
<code>BOTUSERNAME</code> - Enter your bot username without @ and must be lowercase.</br>
<code>DB_URL</code> - Create an account at https://www.mongodb.com/cloud/atlas , database name - InactiveMedia, collection name - InactiveMedia. Click Connect and select 'Connect your app'. Copy the link and replace '<password>' with the password of the user who has access to the DB and replace 'myFirstDatabase' for 'InactiveMedia'. If you want to change the database name you want, it's in the config folder.</br>
<b>DB_URL link</b>

    mongodb+srv://login:password@bot.qnbbq.mongodb.net/database?retryWrites=true&w=majority

<hr>

<h2>Here are some admin commands and usage.</h2>
<b>COMMAND TO RUN BOT IN GROUP</b></br>
<code>/inactive</code> - Only remove users who are deemed not to have sent any media.</br>
<code>/inactive reset</code> - The default setting is blank when a new user logs in, if the user's media is still empty this command will remove the user from the group. If the media is above an empty value this command will return it to an empty value so that users can still contribute so they are not expelled.</br>
<code>/info userId</code> - To check the user information in the group.</br>
<code>/pin</code> - Reply to the message you want to pinned.</br>
<code>/unpin</code> - Reply to the message you want to unpinned.</br>
<code>/send message</code> - Send messages in groups.</br>

<h2>Information</h2>
If a new user logs in, the bot will save the user data. The bot also reads when the user sends media.</br></br>

<b>
- Bot must be admin with full access.</br>
- Admin with block access, admin with anonymous access, admin with group owner access. They can use bot.
</b>
