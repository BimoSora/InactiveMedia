const db = require('../config/connection')
const collection = require('../config/collection')

module.exports={
    //Saving user details to db
    saveUser:(user)=>{
        db.get().collection(collection.USER_COLLECTION).createIndex({userId:"text"})
        db.get().collection(collection.USER_COLLECTION).insertOne(user).then((res)=>{
            console.log('User save');
        })
    },

    //Check user true and false
    checkUser:(query)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.USER_COLLECTION).findOne({chatId:query.chatId,userId:query.userId}).then((res)=>{
                //console.log(res);
                if(res){
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
        })
    },

    //Check user
    getUser:(query)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.USER_COLLECTION).findOne({chatId:query.chatId,userId:query.userId}).then((res1)=>{
                resolve(res1)
            })
        })
    },

    //Update user
    updateUser:(user)=>{
        db.get().collection(collection.USER_COLLECTION).replaceOne({chatId:user.chatId,userId:user.userId},user).then((res)=>{
            console.log('User update success');
        })
    },
    
    //Check user
    getUser2:(chatUser)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.USER_COLLECTION).find({chatId:chatUser.chatId}).toArray().then((res)=>{
                resolve(res);
                
            })
        })
    },

    //Update user media
    revokeUser:(chatRes)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({chatId:chatRes.chatId,userId:chatRes.userId},{$set: {post: 0, type: ""}}).then((res)=>{
            console.log('User update success');
        })
    },
    
    //Inactive
    delUser:(chatDel)=>{
        db.get().collection(collection.USER_COLLECTION).deleteOne({chatId:chatDel.chatId,userId:chatDel.userId}).then((res)=>{
            console.log('Inactive user done');
        })
    },

    //Logged out
    delUser2:(query)=>{
        db.get().collection(collection.USER_COLLECTION).deleteOne({chatId:query.chatId,userId:query.userId}).then((res)=>{
            console.log('User logged out');
        })
    },

    //Logged out
    delUser3:(chatDel2)=>{
        db.get().collection(collection.USER_COLLECTION).deleteMany({chatId:chatDel2.chatId}).then((res)=>{
            console.log('Bot logged out');
        })
    },

    //Count user all group
    getUser3:()=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).find().toArray().then((res)=>{
                resolve(res);
            })
        })
    },

}
