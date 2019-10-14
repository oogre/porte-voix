/*----------------------------------------*\
  Super Easy Terminal Chat Client - client.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2019-10-14 08:47:11
  @Last Modified time: 2019-10-14 10:33:15
  @Dependencie : https://github.com/danielstjules/wsc
\*----------------------------------------*/

process.title = 'chat.client.porte.voix';

const say = require('say')
const WebSocket = require('ws');
const readline  = require('readline');

if (!process.argv[2]) {
  console.error('Missing url');
  process.exit(1);
}

const ws = new WebSocket(process.argv[2]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('SIGINT', function(){
  console.log();
  process.exit();
});

rl.on('line', function(input){
    const message = input;
    ws.send(message);
    rl.prompt();
});

ws.on('open', function(){
	console.log('Salut - Échangez ici vos messages librement.');
	rl.prompt();
	ws.on('error', function(err){
		console.error("Connection error : ");
		console.error(err);
		process.exit(1);
	});

	ws.on('close', function(){
		console.log('Connection closed');
		process.exit(0);
	});

	ws.on('message', function(message, flags){
		console.log('< '+ message);
		rl.prompt();
		say.speak(message, 'Amelie', 1.0);
	});
});
