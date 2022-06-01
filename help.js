module.exports.bothelp = `<b>COMMAND TO RUN BOT IN GROUP</b>
/inactive - Only remove users who are deemed not to have sent any media.
/inactive reset - The default setting is blank when a new user logs in, if the user's media is still empty this command will remove the user from the group. If the media is above an empty value this command will return it to an empty value so that users can still contribute so they are not expelled.
/info userId - To check the user information in the group.
/pin - Reply to the message you want to pinned.
/unpin - Reply to the message you want to unpinned.
/send message - Send messages in groups.

If a new user logs in, the bot will save the user data. The bot also reads when the user sends media.

<b>- Bot must be admin with full access.
- Admin with block access, admin with anonymous access, admin with group owner access. They can use bot.</b>`;

module.exports.botdonation = `You want to make a <b>donation</b> or want to buy the <b>source code</b> of our bot.

Contact <a href='tg://user?id=5386977273'>CiMol</a>.
#BimoSora #MRXenom #SoraHearts`;

module.exports.botsourcecode = `<a href="https://heroku.com/deploy?template=https://github.com/BimoSora/SisterActive">Deploy</a>
Replace the link with your github template.

Required details.
TOKEN - Get bot Token from bot father.
DOMAIN - Enter your app name in Heroku.
BOTUSERNAME - Enter your bot username without @ and must be lowercase.
DB_URL - Create an account at https://www.mongodb.com/cloud/atlas , database name - SisterActive, collection name - SisterActive. Click Connect and select <b>Connect your app</b>. Copy the link and replace <b>password</b> with the password of the user who has access to the DB and replace <b>myFirstDatabase</b> for <b>SisterActive</b>. If you want to change the database name you want, it's in the config folder.

<b>DB_URL link</b>
mongodb+srv://login:password@bot.qnbbq.mongodb.net/database?retryWrites=true&w=majority`;
