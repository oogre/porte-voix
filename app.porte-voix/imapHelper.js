
var Imap = require("imap");
var MailParser = require("mailparser").MailParser;

class ImapHelper{
	constructor(){
		this.imapConfig = {
    		user: process.env.USER_NAME,
    		password: process.env.USER_PWD,
    		host: process.env.HOST,
    		port: 993,
    		tls: true
		};
		this.imap = new Imap(this.imapConfig);
		
		this.once("error")
		.then(data=>console.log(data))
		.catch(err=>console.error(err));
		
		this.imap.connect();
	}

	async once(eventName){
		return new Promise((resolve, reject) => {
			this.imap.once(eventName, (err, data)=>{
				if (err) return reject(err);
				else return resolve(data);
			});
		});
	}
	
	async openInbox(){
		return new Promise((resolve, reject) => {
			this.imap.openBox("INBOX", false, function(err, mailBox) {
				if (err) return reject(err);
				else return resolve(mailBox);
			});	
		});
	}

	async getUnseenMail(readerId){
		let mailContents = [];
		let mailCounter = 0 ;
		return new Promise((resolve, reject) => {
			let self = this;
			this.imap.search([["X-GM-RAW", "is:unread -(label:"+readerId+")"]], function(err, mailIds) {
				if(err)return reject(err);
				if(!mailIds || !mailIds.length)return resolve([]);
				else {
					mailCounter = mailIds.length;
					var f = self.imap.fetch(mailIds, { bodies: "" });
					f.on("message", (msg, seqno)=>{
						var parser = new MailParser();

						parser.on('data', data => {
							if (data.type === 'text'){
								mailContents.push(data.text);
							}
							mailCounter --;
							if(mailCounter < 1){
								self.imap.addLabels(mailIds, [readerId]);
								return resolve(mailContents);	
							}
						});

						msg.on("body", function(stream) {
							stream.on("data", function(chunk) {
								parser.write(chunk.toString("utf8"));
							});
						});

						msg.once("end", function() {
							parser.end();
						});
					});
					f.once("error", function(err) {
					    return reject(err);
					});
				};
			});
		});
	}	
}

const imapHelper = new ImapHelper();

module.exports = imapHelper;