require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);

process.env.TZ = "Asia/Jakarta";

//database
const db = require('./config/connection');
const collection = require('./config/collection');
const saver = require('./database/filesaver');
const helpcommand = require('./help.js');

//DATABASE CONNECTION 
db.connect((err) => {
    if(err) { console.log('error connection db' + err); }
    else { console.log('db connected'); }
})


function today(ctx){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    return today = mm + '/' + dd + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
}

//Function
function first_name(ctx){
    return `${ctx.from.first_name ? ctx.from.first_name : ""}`;
}
function last_name(ctx){
    return `${ctx.from.last_name ? ctx.from.last_name : ""}`;
}
function username(ctx){
    return ctx.from.username ? `@${ctx.from.username}` : "";
}

// inline keyboard
const inKey = [
    [{text:'⚒ HELP',callback_data:'HELP'}],
    [{text:'🗳 DONATION',callback_data:'DONATION'}]
];

bot.catch(e => console.error(e))

//BOT START
bot.start(async(ctx)=>{
    if(ctx.chat.type == 'private') {
        await ctx.deleteMessage(ctx.message.message_id)
        await ctx.reply(`Welcome <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\nWe are an inactive bot whose job is to detect members who send media.`,{
            parse_mode:'HTML',
            disable_web_page_preview: true,
            reply_markup:{
                inline_keyboard:inKey
            }
        })
    }
})

bot.action('HELP', async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`${helpcommand.bothelp}`,{
        parse_mode:'HTML',
        disable_web_page_preview: true,
        reply_markup:{
            inline_keyboard:[
                [{text:'🔙 BACK',callback_data:'STARTUP'}]
            ]
        }
    })
})

bot.action('DONATION', async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`${helpcommand.botdonation}`,{
        parse_mode:'HTML',
        disable_web_page_preview: true,
        reply_markup:{
            inline_keyboard:[
                [{text:'💰 DONATION',url:'https://www.paypal.me/BimoSora/5.00'}],
                [{text:'🔙 BACK',callback_data:'STARTUP'}]
            ]
        }
    })
})

bot.action('STARTUP', async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`Welcome <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\nWe are an inactive bot whose job is to detect members who send media.`,{
        parse_mode:'HTML',
        disable_web_page_preview: true,
        reply_markup:{
            inline_keyboard:inKey
        }
    })
})

//TEST BOT
bot.hears(/ping/i,async(ctx)=>{
    if(ctx.chat.type == 'private') {    
        await ctx.deleteMessage(ctx.message.message_id)
        let chatId = ctx.message.from.id;
        let opts = {
            reply_markup:{
                inline_keyboard: [[{text:'OK',callback_data:'PONG'}]]
            }
        }
        return await bot.telegram.sendMessage(chatId, 'pong' , opts);
    }
})

bot.action('PONG',async(ctx)=>{
    await ctx.deleteMessage(ctx.message.message_id)
})

//Info member
bot.command('info',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
        const memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)

        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')

        if(memberstatus.status == 'creator'){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    const query = {
                       chatId: ctx.chat.id,
                       userId: parseInt(text)
                    }
                    if(text == ''){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply('Wrong writing or not found, please check again!')
                    }else{
                        await saver.checkUser(query).then(async res => {
                            if(res == true) {
                                await ctx.deleteMessage(ctx.message.message_id)
                                const res1 = await saver.getUser(query)
                                const array1 = res1;
                                const name2 = array1.nameId ? `<a href="tg://user?id=${array1.userId}">${array1.nameId}</a>` : "-";
                                const username2 = array1.usenameId  ? array1.usenameId : "-";
                                const type = array1.type ? array1.type.slice(0,1).toUpperCase() + array1.type.substr(1) : "-";
                                await ctx.reply(`<b>User info</b> \n🆔 <b>ID:</b> <code>${array1.userId}</code> \n👱 <b>Name:</b> ${name2} \n🌐 <b>Username:</b> ${username2} \n💬 <b>Message:</b> ${array1.post} media \n💭 <b>Last message type:</b> ${type}`,{
                                    parse_mode:'HTML'
                                })
                            }else{
                                await ctx.deleteMessage(ctx.message.message_id)
                                await ctx.reply('User not found');
                            }
                        })
                    }
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
                }
            }
        }else if(memberstatus.status == 'administrator'){
            if(memberstatus.can_restrict_members == true){
                if(botStatus.status == 'administrator'){
                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                        const query = {
                            chatId: ctx.chat.id,
                            userId: parseInt(text)
                        }
                        if(text == ''){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await ctx.reply('Wrong writing or not found, please check again!')
                        }else{
                            await saver.checkUser(query).then(async res => {
                                if(res == true) {
                                    await ctx.deleteMessage(ctx.message.message_id)
                                    const res1 = await saver.getUser(query)
                                    const array1 = res1;
                                    const name2 = array1.nameId ? `<a href="tg://user?id=${array1.userId}">${array1.nameId}</a>` : "-";
                                    const username2 = array1.usenameId  ? array1.usenameId : "-";
                                    const type = array1.type ? array1.type.slice(0,1).toUpperCase() + array1.type.substr(1) : "-";
                                    await ctx.reply(`<b>User info</b> \n🆔 <b>ID:</b> <code>${array1.userId}</code> \n👱 <b>Name:</b> ${name2} \n🌐 <b>Username:</b> ${username2} \n💬 <b>Message:</b> ${array1.post} media \n💭 <b>Last message type:</b> ${type}`,{
                                        parse_mode:'HTML'
                                    })
                                }else{
                                    await ctx.deleteMessage(ctx.message.message_id)
                                    await ctx.reply('User not found');
                                }
                            })
                        }
                    }
                }else{
                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    
                    }
                }
            }
        }
        if(ctx.from.username == 'GroupAnonymousBot'){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    const query = {
                        chatId: ctx.chat.id,
                        userId: parseInt(text)
                    }
                    if(text == ''){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply('Wrong writing or not found, please check again!')
                    }else{
                        await saver.checkUser(query).then(async res => {
                            if(res == true) {
                                await ctx.deleteMessage(ctx.message.message_id)
                                const res1 = await saver.getUser(query)
                                const array1 = res1;
                                const name2 = array1.nameId ? `<a href="tg://user?id=${array1.userId}">${array1.nameId}</a>` : "-";
                                const username2 = array1.usenameId  ? array1.usenameId : "-";
                                const type = array1.type ? array1.type.slice(0,1).toUpperCase() + array1.type.substr(1) : "-";
                                await ctx.reply(`<b>User info</b> \n🆔 <b>ID:</b> <code>${array1.userId}</code> \n👱 <b>Name:</b> ${name2} \n🌐 <b>Username:</b> ${username2} \n💬 <b>Message:</b> ${array1.post} media \n💭 <b>Last message type:</b> ${type}`,{
                                    parse_mode:'HTML'
                                })
                            }else{
                                await ctx.deleteMessage(ctx.message.message_id)
                                await ctx.reply('User not found');
                            }
                        })
                    }
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
                }
            }
        }
    }
})

//New member
bot.on('new_chat_members', async(ctx) => {
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        console.log(ctx)
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)

        function first_name2(ctx){
            return `${ctx.message.new_chat_member.first_name ? ctx.message.new_chat_member.first_name : ""}`;
        }
        function last_name2(ctx){
            return `${ctx.message.new_chat_member.last_name ? ctx.message.new_chat_member.last_name : ""}`;
        }
        function username2(ctx){
            return ctx.message.new_chat_member.username ? `@${ctx.message.new_chat_member.username}` : "";
        }

        if(botStatus.status == 'administrator'){
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                const query = {
                    chatId: ctx.message.chat.id,
                    userId: ctx.message.new_chat_member.id
                }
                await ctx.deleteMessage(ctx.message.message_id)
                await saver.checkUser(query).then(async res => {
                    if(res == true) {
                        const res1 = await saver.getUser(query)
                        const array1 = res1;
                        const user = {
                            chatId: ctx.message.chat.id,
                            userId: ctx.message.new_chat_member.id,
                            nameId: `${first_name2(ctx)} ${last_name2(ctx)}`,
                            usenameId: `${username2(ctx)}`,
                            post: array1.post + 1,
                            type: ''
                        }
                        await saver.updateUser(user)
                    }else{
                        const user = {
                            chatId: ctx.message.chat.id,
                            userId: ctx.message.new_chat_member.id,
                            nameId: `${first_name2(ctx)} ${last_name2(ctx)}`,
                            usenameId: `${username2(ctx)}`,
                            post: 0,
                            type: ''
                        }
                        await saver.saveUser(user)
                    }
                })
            }
        }else{
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                
            }
        }
    }
})

//Inactive
bot.command('inactive',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
        const memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)

        const msg = ctx.message.text
        let text = msg.split(' ')
        text.shift()
        let text2 = text.join(' ')

        if(text2 == ''){
            const chatUser = {
                chatId: ctx.chat.id,
            }
            const userDetails = await saver.getUser2(chatUser).then(async res =>{
                const n = res.length
                const chatId = []
                for (let i = n-1; i >=0; i--) {
                    chatId.push({chatId: res[i].chatId, userId: res[i].userId, post: res[i].post});
                }
                
                async function inactive(text) {
                    for (const chat of chatId) {
                        try {
                            const posted = chat.post;
                            if(posted <= 0){
                                await bot.telegram.kickChatMember(ctx.chat.id, chat.userId).then(async result =>{
                                })
                                const chatDel = {
                                    chatId: chat.chatId,
                                    userId: chat.userId
                                }
                                await saver.delUser(chatDel)
                            }else if(posted => 0){

                            }
                        } catch (err) {

                        }
                    }
                    await ctx.reply(`✔️ Cleaning finished.`)
                }

                if(botStatus.status == 'administrator'){
                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                        if(memberstatus.status == 'creator'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            inactive(text)
                            await ctx.reply(`🪣 Bot start member cleanup.`)
                        }else if(memberstatus.status == 'administrator'){
                            if(memberstatus.can_restrict_members == true){
                                await ctx.deleteMessage(ctx.message.message_id)
                                inactive(text)
                                await ctx.reply(`🪣 Bot start member cleanup.`)
                            }
                        }else if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            inactive(text)
                            await ctx.reply(`🪣 Bot start member cleanup.`)
                        }
                    }
                }else{
                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                
                    }
                }
            })
        }else if(text2 == 'reset'){
            const chatUser = {
                chatId: ctx.chat.id,
            }
            const userDetails = await saver.getUser2(chatUser).then(async res =>{
                const n = res.length
                const chatId = []
                for (let i = n-1; i >=0; i--) {
                    chatId.push({chatId: res[i].chatId, userId: res[i].userId, post: res[i].post});
                }
                
                async function inactive(text) {
                    for (const chat of chatId) {
                        try {
                            const posted = chat.post;
                            if(posted <= 0){
                                await bot.telegram.kickChatMember(ctx.chat.id, chat.userId).then(async result =>{
                                })
                                const chatDel = {
                                    chatId: chat.chatId,
                                    userId: chat.userId
                                }
                                await saver.delUser(chatDel)
                            }else if(posted => 0){
                                const chatRes = {
                                    chatId: chat.chatId,
                                    userId: chat.userId
                                }
                                await saver.revokeUser(chatRes)
                            }
                        } catch (err) {

                        }
                    }
                    await ctx.reply(`✔️ Cleaning finished!`)
                }

                if(botStatus.status == 'administrator'){
                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                        if(memberstatus.status == 'creator'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            inactive(text)
                            await ctx.reply(`🪣 Bot start member cleanup.`)
                        }else if(memberstatus.status == 'administrator'){
                            if(memberstatus.can_restrict_members == true){
                                await ctx.deleteMessage(ctx.message.message_id)
                                inactive(text)
                                await ctx.reply(`🪣 Bot start member cleanup.`)
                            }
                        }else if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            inactive(text)
                            await ctx.reply(`🪣 Bot start member cleanup.`)
                        }
                    }
                }else{
                    if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                                
                    }
                }
            })
        }else{
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply('Double check the command to eject inactive members.')
                    }else if(memberstatus.status == 'administrator'){
                        if(memberstatus.can_restrict_members == true){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await ctx.reply('Double check the command to eject inactive members.')
                        }
                    }else if(ctx.from.username == 'GroupAnonymousBot'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply('Double check the command to eject inactive members.')
                    }
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                            
                }
            }
        }
    }
    
})

//My chat member
bot.on('my_chat_member',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        console.log(ctx)
        if(ctx.botInfo.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
            const chatDel2 = {
                chatId: ctx.update.my_chat_member.chat.id,
            }
            if(ctx.update.my_chat_member.new_chat_member.status == 'left'){
                await saver.delUser3(chatDel2)
            }
        }
    }
})

//Left chat member
bot.on('left_chat_member',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)

        await ctx.deleteMessage(ctx.message.message_id)

        if(ctx.from.username == 'GroupAnonymousBot'){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    try{
                        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
                        if(botStatus.status == 'administrator'){
                            const query = {
                                chatId: ctx.message.chat.id,
                                userId: ctx.message.left_chat_member.id
                            }
                            await saver.checkUser(query).then(async res => {
                                if(res == true) {
                                    await saver.delUser2(query)
                                }else{

                                }
                            })
                        }
                    }catch(error){

                    }
                }
            }
        }else{
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    try{
                        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
                        if(botStatus.status == 'administrator'){
                            const query = {
                                chatId: ctx.message.chat.id,
                                userId: ctx.message.left_chat_member.id
                            }
                            await saver.checkUser(query).then(async res => {
                                if(res == true) {
                                    await saver.delUser2(query)
                                }else{

                                }
                            })
                        }
                    }catch(error){

                    }
                }
            }
        }
    }
})

//Send message in group
bot.command('send',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
        const memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)

        const msg = ctx.message.text
        let text = msg.split(' ')
        text.shift()
        let text2 = text.join(' ')

        if(text2 == ''){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply('No message written.')
                    }
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply('No message written.')
                    }
                }
            }
        }else{
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");

                            return await bot.telegram.sendMessage(ctx.chat.id, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(ctx.chat.id, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");

                            return await bot.telegram.sendMessage(ctx.chat.id, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(ctx.chat.id, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                }
            }
        }
    }
})

//Pin in group
bot.command('pin',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
        const memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)

        if(botStatus.status == 'administrator'){
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                if(memberstatus.status == 'creator'){
                    if(ctx.message.reply_to_message == undefined){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply(`No messages are pinned.`)
                    }else{
                        await ctx.deleteMessage(ctx.message.message_id)
                        await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                            disable_notification: false,
                        }).then(async result =>{
                        })
                    }
                }else if(memberstatus.status == 'administrator'){
                    if(memberstatus.can_pin_messages == true){
                        if(ctx.message.reply_to_message == undefined){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await ctx.reply(`No messages are pinned.`)
                        }else{
                            await ctx.deleteMessage(ctx.message.message_id)
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                            })
                        }
                    }
                }else{
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        if(ctx.message.reply_to_message == undefined){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await ctx.reply(`No messages are pinned.`)
                        }else{
                            await ctx.deleteMessage(ctx.message.message_id)
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                            })
                        }
                    }
                }
            }
        }
    }
})

//Unpin in group
bot.command('unpin',async(ctx)=>{
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
        const memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)

        if(botStatus.status == 'administrator'){
            if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                if(memberstatus.status == 'creator'){
                    if(ctx.message.reply_to_message == undefined){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply(`No messages are unpinned.`)
                    }else{
                        await ctx.deleteMessage(ctx.message.message_id)
                        await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                        })
                    }
                }else if(memberstatus.status == 'administrator'){
                    if(memberstatus.can_pin_messages == true){
                        if(ctx.message.reply_to_message == undefined){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await ctx.reply(`No messages are unpinned.`)
                        }else{
                            await ctx.deleteMessage(ctx.message.message_id)
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                            })
                        }
                    }
                }else{
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        if(ctx.message.reply_to_message == undefined){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await ctx.reply(`No messages are unpinned.`)
                        }else{
                            await ctx.deleteMessage(ctx.message.message_id)
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                            })
                        }
                    }
                }
            }
        }
    }
})

//Document files
bot.on('document', async(ctx) => {
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
        const memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)

        if(ctx.from.username == 'GroupAnonymousBot'){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    const query = {
                        chatId: ctx.chat.id,
                        userId: ctx.from.id
                    }
                    await saver.checkUser(query).then(async res => {
                        if(res == true) {
                            const res1 = await saver.getUser(query)
                            const array1 = res1;
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: array1.post + 1,
                                type: 'document'
                            }
                            await saver.updateUser(user)
                        }else{
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: 1,
                                type: 'document'
                            }
                            await saver.saveUser(user)
                        }
                    })
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    
                }
            } 
        }else{
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    const query = {
                        chatId: ctx.chat.id,
                        userId: ctx.from.id
                    }
                    await saver.checkUser(query).then(async res => {
                        if(res == true) {
                            const res1 = await saver.getUser(query)
                            const array1 = res1;
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: array1.post + 1,
                                type: 'document'
                            }
                            await saver.updateUser(user)
                        }else{
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: 1,
                                type: 'document'
                            }
                            await saver.saveUser(user)
                        }
                    })
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    
                }
            }
        }
    }
})

//Video files
bot.on('video', async(ctx) => {
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)

        if(ctx.from.username == 'GroupAnonymousBot'){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    const query = {
                        chatId: ctx.chat.id,
                        userId: ctx.from.id
                    }            
                    await saver.checkUser(query).then(async res => {
                        if(res == true) {
                            const res1 = await saver.getUser(query)
                            const array1 = res1;
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: array1.post + 1,
                                type: 'video'
                            }
                            await saver.updateUser(user)
                        }else{
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: 1,
                                type: 'video'
                            }
                            await saver.saveUser(user)
                        }
                    })
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    
                }
            }
        }else{
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    const query = {
                        chatId: ctx.chat.id,
                        userId: ctx.from.id
                    }            
                    await saver.checkUser(query).then(async res => {
                        if(res == true) {
                            const res1 = await saver.getUser(query)
                            const array1 = res1;
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: array1.post + 1,
                                type: 'video'
                            }
                            await saver.updateUser(user)
                        }else{
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: 1,
                                type: 'video'
                            }
                            await saver.saveUser(user)
                        }
                    })
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    
                }
            }
        }
    }
})

//Photo files
bot.on('photo', async(ctx) => {
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        const botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)

        if(ctx.from.username == 'GroupAnonymousBot'){
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    const query = {
                        chatId: ctx.chat.id,
                        userId: ctx.from.id
                    }
                    await saver.checkUser(query).then(async res => {
                        if(res == true) {
                            const res1 = await saver.getUser(query)
                            const array1 = res1;
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: array1.post + 1,
                                type: 'photo'
                            }
                            await saver.updateUser(user)
                        }else{
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: 1,
                                type: 'photo'
                            }
                            await saver.saveUser(user)
                        }
                    })
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    
                }
            }
        }else{
            if(botStatus.status == 'administrator'){
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    const query = {
                        chatId: ctx.chat.id,
                        userId: ctx.from.id
                    }
                    await saver.checkUser(query).then(async res => {
                        if(res == true) {
                            const res1 = await saver.getUser(query)
                            const array1 = res1;
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: array1.post + 1,
                                type: 'photo'
                            }
                            await saver.updateUser(user)
                        }else{
                            const user = {
                                chatId: ctx.chat.id,
                                userId: ctx.from.id,
                                nameId: `${first_name(ctx)} ${last_name(ctx)}`,
                                usenameId: `${username(ctx)}`,
                                post: 1,
                                type: 'photo'
                            }
                            await saver.saveUser(user)
                        }
                    })
                }
            }else{
                if(botStatus.user.username.toLowerCase() == `${process.env.BOTUSERNAME}`){
                    
                }
            }
        }
    }
})

//Status database
bot.command('stats',async(ctx)=>{

    const msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')

    if(ctx.chat.type == 'private') {
        let str = process.env.ADMIN;
        let result = str.includes(ctx.from.id);

        if(result == true){
            if(text == ''){
                await ctx.deleteMessage(ctx.message.message_id)
                const stats1 = await saver.getUser3().then(async res=>{
                    await ctx.reply(`📊 Total users all group: <b>${res.length}</b>`,{parse_mode:'HTML'})
                })
            }else{
                await ctx.deleteMessage(ctx.message.message_id)
                await ctx.reply('Check the command again to see the status.')
            }
        }
    }
})
 
//Heroku config
domain = `${process.env.DOMAIN}.herokuapp.com`
bot.launch({
    webhook:{
       domain:domain,
        port:Number(process.env.PORT) 
    }
})
