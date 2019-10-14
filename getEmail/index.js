/*----------------------------------------*\
  sketch_190923a - index.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2019-09-26 23:05:12
  @Last Modified time: 2019-09-26 23:45:41
\*----------------------------------------*/

function composeEmail(){
	rcmail.command('compose','',this,event);
}

function goFirstPage(){
	rcmail.command('firstpage','',this,event)	
}

function goPreviousPage(){
	rcmail.command('previouspage','',this,event)	
}

function goNextPage(){
	rcmail.command('nextpage','',this, event)	
}

function goLastPage(){
	rcmail.command('lastpage','',this,event)	
}

function goStudentList(){
	rcmail.command('list-addresses','Etudiants',this)
}

function goPersonnelList(){
	rcmail.command('list-addresses','membres-du-personnel',this)
}

function goAdministrationList(){
	rcmail.command('list-addresses','Administration',this)
}

function isLastPage(){
	return document.querySelector(".nextpage").classList.contains("buttonPas");
}

function getEmails(){
	let email = [];
	document.querySelectorAll(".contact [title],.contactgroup [title]")
	.forEach(e => email.push(e.title));
	return email;
}

let emails = [];

function update(){
	emails = emails.concat(getEmails());
	goNextPage();
	if(!isLastPage()){
		setTimeout(update,2000);
	}
}

//composeEmail();
goStudentList();



