/*----------------------------------------*\
  app.porte-voix - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2019-09-09 17:50:29
  @Last Modified time: 2019-09-27 18:32:31
\*----------------------------------------*/
const say = require('say')
const imapHelper = require('./imapHelper.js')

let mailsToRead = [];

function emailGrabber() {
    imapHelper.openInbox()
    .then(()=>imapHelper.getUnseenMail(require("os").hostname()))
    .then(mails=>{
        if(mails.length<1){
             console.log("Nothing new");
        }else{
            mailsToRead = mailsToRead.concat(mails);
            console.log(mailsToRead);    
        }
        setTimeout(emailGrabber, 5000);
    })
    .catch(err=>{
        setTimeout(emailGrabber, 5000);
        console.log("emailGrabber error", err);
    });
}

function emailReader(){
    if(mailsToRead.length<1){
        console.log("Nothing to read");
        return setTimeout(emailReader, 5000);
    }
    say.speak(mailsToRead.shift(), 'Amelie', 1.0, (err)=>{
        if (err) { console.log("speak error", err);}
        setTimeout(emailReader, 1000)
    });
}

imapHelper.once("ready")
.then(()=>emailGrabber())
.catch(err=>{
    console.log("error", err);
});

emailReader();
