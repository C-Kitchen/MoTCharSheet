svgx = "<svg viewBox=\"0 0 10 10\" fill=\"currentColor\" stroke=\"currentColor\" style=\"stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\"><line x1=1 y1=1 x2=9 y2=9></line><line x1=9 y1=1 x2=1 y2=9></line></svg>";
svgbox = "<svg viewBox=\"0 0 10 10\" fill=\"currentColor\" stroke=\"currentColor\" style=\"stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\"><rect width=8 height=8 x=1 y=1></rect></svg>";


let hold = false;
let holdtimer = null;
let trackpressed = null;
let trackn = null;
let mousein = false;
let url = window.location.href;

function mousedown(el, n){
	hold = false;
	trackpressed = el;
	trackn = n;
	clearTimeout(holdtimer);
	holdtimer = setTimeout(() => holdevent(el, n), 400);
}

function mouseup(el, n){
	if (el == trackpressed && n == trackn){
		el.click(n);
	}
}

function globalmouseup(){
	//console.log("mouseup");
	clearTimeout(holdtimer);
	hold = false;
	trackpressed = null;
	trackn = null;
}

function holdevent(el, n){
	//console.log("holdevent");
	hold = true;
	if (mousein){
		el.hover(n);
	}
}

function mouseover (el, n){
	//console.log("mouseover");
	if ((el == trackpressed && n == trackn) || trackpressed == null){
		el.hover(n);
		mousein = true;
	}
}

function mouseout (el){
	//console.log("mouseout");
	el.nomouse();
	mousein = false;
}

document.addEventListener("mouseup",() => globalmouseup());

class Trait{
	constructor(name){
		this.name = name;
		this.iconic = false;
		this.htmlelement = null;
		this.valueelement = null;
		this.iconicelement = null;
		this.relatedtrack = null;
	}
	flip(){
		this.iconic = !this.iconic;
		calculateall();
	}
	
	calculate(){
		this.iconicelement.style.visibility = this.iconic ? "visible" : "hidden";
		if (this.relatedtrack != null){
			this.relatedtrack.refresh();
		}
	}
	
}

let traits = 
[[[[new Trait("Aggression"), new Trait("Heft")     , new Trait("Strength") ],
   [new Trait("Dexterity") , new Trait("Reaction") , new Trait("Speed")    ]],
  [[new Trait("Stability") , new Trait("Toughness"), new Trait("Stamina")  ],
   [new Trait("Wisdom")    , new Trait("Intuition"), new Trait("Willpower")]]],
 [[[new Trait("Presence")  , new Trait("Guile")    , new Trait("Charm")    ],
   [new Trait("Wits")      , new Trait("Reason")   , new Trait("Savvy")    ]],
  [[new Trait("Grace")     , new Trait("Stealth")  , new Trait("Agility")  ],
   [new Trait("Empathy")   , new Trait("Scrutiny") , new Trait("Awareness")]]]];

let traitcols = [];
let traitarea = document.getElementById("traitarea");
let trackarea = document.getElementById("trackarea");
let time;

class HarmTrack{
	constructor(name, relatedtrait){
		this.name = name;
		this.tempmax = 3;
		this.defaultmax = 13;
		this.traitmaxadd = 1;
		
		this.minorharm = 0;
		this.lingeringharm = 0;
		this.relatedtrait = relatedtrait;
		if (this.relatedtrait != null){
			this.relatedtrait.relatedtrack = this;
		}
		
		this.track = document.createElement("DIV");
		this.track.classList.add("trackrow");
		trackarea.appendChild(this.track);
		
		this.nameelement = document.createElement("DIV");
		this.nameelement.textContent = name;
		this.nameelement.classList.add("trackname");
		this.track.appendChild(this.nameelement);
		
		this.buttons = [];
		for (let i = 0; i < this.defaultmax + this.traitmaxadd; i++){
			this.buttons.push(document.createElement("BUTTON"));
			this.buttons[i].className = "trackbutton";
			this.track.appendChild(this.buttons[i]);
			this.buttons[i].addEventListener("mousedown",() => mousedown(this,i));
			this.buttons[i].addEventListener("touchstart",() => mousedown(this,i));
			this.buttons[i].addEventListener("mouseup",() => mouseup(this,i));
			this.buttons[i].addEventListener("touchend",() => mouseup(this,i));
			this.buttons[i].addEventListener("mouseover",() => mouseover(this, i));
			this.buttons[i].addEventListener("mouseout",() => mouseout(this));
		}
		this.max = 0;
		this.refresh();
	}
	
	refresh(){
		if (this.relatedtrait != null){
			this.max = this.defaultmax + (this.relatedtrait.iconic ? this.traitmaxadd : 0);
		} else {
			this.max = this.defaultmax;
		}
		for (let i = this.defaultmax; i < this.buttons.length; i++){
			this.buttons[i].style.visibility = i < this.max ? "visible" : "collapse";
		}
	}
	
	click(n){
		//console.log(hold);
		if (n +1 > this.minorharm + this.lingeringharm){
			if (hold){
				this.lingeringharm = n+1 - this.minorharm;
			} else if (n + 1 > this.tempmax){
				this.minorharm = n+1 - this.lingeringharm;
				this.minorharm = this.minorharm > this.tempmax ? this.tempmax : this.minorharm;
				this.lingeringharm = n+1 - this.minorharm;
			} else{
				this.minorharm = n+1 - this.lingeringharm;
			}
		} else if (n + 1 > this.minorharm){
			this.lingeringharm = n - this.minorharm;
		} else {
			if (hold){
				this.lingeringharm = 0;
			}
			this.minorharm = n;
		}
		this.hover(n);
	}
	
	hover(n){
		this.nomouse();
		//console.log("hover " + n + hold);
		if (n + 1 > this.minorharm + this.lingeringharm){
			for (let i = this.minorharm + this.lingeringharm; i < n + 1; i++){
				if ((i + 1 - (this.minorharm + this.lingeringharm) > this.tempmax - this.minorharm) || hold){
					this.buttons[i].innerHTML = svgbox;
				} else {
					this.buttons[i].innerHTML = svgx;
				}
				this.buttons[i].style.color="#777";
			}
		} else {
			for (let i = n; i < this.minorharm + (hold || (n + 1 > this.minorharm) ? this.lingeringharm : 0); i++){
				this.buttons[i].style.color="#bbb";
			}
		}
	}
	
	nomouse(){
		for (let i = 0; i < this.buttons.length; i++){
			if (i < this.minorharm){
				this.buttons[i].innerHTML = svgx;
				this.buttons[i].style.color="#000";
			} else if (i < this.minorharm + this.lingeringharm){
				this.buttons[i].innerHTML = svgbox;
				this.buttons[i].style.color="#000";
			} else {
				this.buttons[i].innerHTML = "";
				this.buttons[i].style.color="#000";
			}
		}
	}
}

burdenvalues=["","≠","=","£"]

class BurdenTrack{
	constructor(strength, heft){
		this.defaultmax = 4;
		this.heftbonus = 2;
		this.strengthbonus = 1;
		this.strength = strength;
		if (this.strength != null){
			this.strength.relatedtrack = this;
		}
		
		this.heft = heft;
		if (this.heft != null){
			this.heft.relatedtrack = this;
		}
		
		this.track = document.createElement("DIV");
		this.track.classList.add("trackrow");
		trackarea.appendChild(this.track);
		
		this.nameelement = document.createElement("DIV");
		this.nameelement.textContent = "Burdens";
		this.nameelement.classList.add("trackname");
		this.track.appendChild(this.nameelement);
		
		this.buttons = [];
		this.burdens = [];
		for (let i = 0; i < this.defaultmax + this.heftbonus + this.strengthbonus; i++){
			this.buttons.push(document.createElement("BUTTON"));
			this.buttons[i].className = "trackbutton";
			this.track.appendChild(this.buttons[i]);
			this.burdens.push(0);
			
			this.thing1=document.createElement("DIV");
			this.thing1.className = "trackthing";
			this.thing2=document.createElement("DIV");
			this.thing2.className = "trackthing";
			this.buttons[i].appendChild(this.thing1);
			this.buttons[i].appendChild(this.thing2);
			this.buttons[i].addEventListener("mousedown",() => mousedown(this,i));
			this.buttons[i].addEventListener("touchstart",() => mousedown(this,i));
			this.buttons[i].addEventListener("mouseup",() => mouseup(this,i));
			this.buttons[i].addEventListener("touchend",() => mouseup(this,i));
			this.buttons[i].addEventListener("mouseover",() => mouseover(this, i));
			this.buttons[i].addEventListener("mouseout",() => mouseout(this));
		}
		this.max = 0;
		//console.log(this.burdens);
		this.refresh();
	}
	
	refresh(){
		this.max = this.defaultmax;
		if (this.strength != null && this.strength.iconic){
			this.max += this.strengthbonus;
		}
		if (this.heft != null && this.heft.iconic){
			this.max += this.heftbonus;
		}
		for (let i = this.defaultmax; i < this.buttons.length; i++){
			this.buttons[i].style.visibility = i < this.max ? "visible" : "collapse";
		}
	}
	
	nomouse(){
		for (let i = 0; i < this.buttons.length; i ++){
			this.buttons[i].style.color="#000";
			this.buttons[i].textContent = burdenvalues[this.burdens[i]];
			//console.log(this.burdens[i]);
		}
	}
	
	click(n){
		if (hold){
			if (this.burdens[n] > 1){
				this.burdens[n] = 0;
			} else if (this.burdens[n] == 1){
				this.burdens[n] = 2;
			} else {
				this.burdens[n] = 3;
			}
		} else{
			if (this.burdens[n] == 0){
				this.burdens[n] = 1;
			} else {
				this.burdens[n] = 0;
			}
		}
		code();
		hold = false;
		this.nomouse();
		this.hover(n);
	}
	
	hover(n){
		if (this.burdens[n] == 0){
			this.buttons[n].style.color="#777";
			if (hold){
				this.buttons[n].textContent = burdenvalues[3];
			} else {
				this.buttons[n].textContent = burdenvalues[1];
			}
		} else {
			if (this.burdens[n] == 1 && hold){
				this.buttons[n].style.color="#777";
				this.buttons[n].textContent = burdenvalues[2];
			} else {
				this.buttons[n].style.color="#bbb";
			}
		}
	}
}

for (let i = 0; i < 4; i++){
	traitcols.push(document.createElement("DIV"));
	traitcols[i].classList.add("traitcolumn");
	traitarea.appendChild(traitcols[i]);
}

for (let i = 0; i < traits.length; i++){
	for (let j = 0; j < traits[i].length; j++){
		for (let k = i; k < traits[i][j].length && k > -1; k+=1-2*(i%2)){
			for (let l = (traits[i][j][k].length-1)*((i+k)%2); l < traits[i][j][k].length && l > -1; l+=1-2*((i+k)%2)){
				var trait = document.createElement("DIV");
				traits[i][j][k][l].htmlelement = trait;
				
				var traitvalue = document.createTextNode("0");
				traits[i][j][k][l].valueelement = traitvalue;
				trait.classList.add("trait");
				
				var traitbutton = document.createElement("BUTTON");
				traitbutton.appendChild(traitvalue);
				traitbutton.classList.add("traitbutton");
				
				var traitname = document.createElement("DIV");
				traitname.classList.add("traitname");
				var traittext = document.createTextNode(traits[i][j][k][l].name);
				traitname.appendChild(traittext);
				
				var traiticonic = document.createElement("DIV");
				traiticonic.classList.add("traiticonic");
				traits[i][j][k][l].iconicelement = traiticonic;
				
				traiticonic.style.visibility = "hidden";
				
				trait.appendChild(traitbutton);
				trait.appendChild(traitname);
				trait.appendChild(traiticonic);
				
				traitbutton.addEventListener("click",function() {traits[i][j][k][l].flip()});
				traitcols[j*3+(l%2)*(1-2*j)].appendChild(trait);
				
				/*traiticonic.style.width = trait.offsetWidth-20;
				traiticonic.style.height = trait.offsetHeight-20;*/
			}
		}
	}
}

resizeButtons();
woe = new HarmTrack("Woe",traits[0][1][1][2]);
fatigue = new HarmTrack("Fatigue",traits[0][1][0][2]);
wounds = new HarmTrack("Wounds",traits[0][1][0][1]);
burdens = new BurdenTrack(traits[0][0][0][2],traits[0][0][0][1]);

function resizeButtons(){
	for (let i = 0; i < traits.length; i++){
		for (let j = 0; j < traits[i].length; j++){
			for (let k = 0; k < traits[i][j].length; k++){
				traits[i][j][k][1].htmlelement.style.marginTop = traits[i][j][k][1].htmlelement.offsetHeight/2 + "px";
				traits[i][j][k][1].htmlelement.style.marginBottom = traits[i][j][k][1].htmlelement.offsetHeight/2 + "px";
				for (let l = 0; l < traits[i][j][k].length; l++){
					traits[i][j][k][l].iconicelement.style.width = traits[i][j][k][1].htmlelement.offsetWidth-20 + "px"
					traits[i][j][k][l].iconicelement.style.height = traits[i][j][k][1].htmlelement.offsetHeight-20 + "px"
				}
				
			}
		}
	}
}

window.onresize = resizeButtons;

function calculatevalue(i, j, k, l){
	var value = 0;
	if (traits[i][j][k][l].iconic){
		value+=2;
	}
	if (traits[i][j][k][(l+1)%3].iconic){
		value+=1;
	}
	if (traits[i][j][k][(l+2)%3].iconic){
		value+=1;
	}
	if (traits[(i+(l==0?1:0))%2][(j+(l==1?1:0))%2][(k+(l==2?1:0))%2][l].iconic){
		value+=1;
	}
	traits[i][j][k][l].valueelement.textContent = value;
	return value;
}

function calculateall(){
	for (let i = 0; i < traits.length; i++){
		for (let j = 0; j < traits[i].length; j++){
			for (let k = 0; k < traits[i][j].length; k++){
				for (let l = 0; l < traits[i][j][k].length; l++){
					calculatevalue(i,j,k,l);
					traits[i][j][k][l].calculate();
				}
				
			}
		}
	}
	code();
}


locked = false;

bbb = document.createElement("BUTTON");
document.body.appendChild(bbb);
bbb.addEventListener("click", () => lock());
bbb.textContent = "Lock";
function lock(){
	locked = !locked;
	if (locked){
		traitarea.style.pointerEvents = "none";
		//bbb.textContent = "Locked";
		bbb.style.backgroundColor = "#000";
		bbb.style.color = "#fff";
	} else {
		traitarea.style.pointerEvents = "auto";
		//bbb.textContent = "Lock";
		bbb.style.backgroundColor = "#fff";
		bbb.style.color = "#000";
	}
	code()
}

bbb2 = document.createElement("BUTTON");
document.body.appendChild(bbb2);
//bbb2.addEventListener("click", () => code());
bbb2.textContent = "Save";

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$!';

var qloc = url.lastIndexOf('?@');
if (qloc > 0){
	var params = url.substr(qloc+2,url.length);
	console.log("hello");
	decode(params);
	calculateall();
	bbb2.style.backgroundColor = "#000";
	bbb2.style.color = "#fff";
}

function getBaseLog(x, y) {
	return Math.log(y) / Math.log(x);
}


function code(){
	var save = [0,0,0,0,0,0,0,0];
	for (let i = 0; i < traits.length; i++){
		for (let j = 0; j < traits[i].length; j++){
			n = j + i*traits[i].length;
			for (let k = 0; k < traits[i][j].length; k++){
				for (let l = 0; l < traits[i][j][k].length; l++){
					save[n] += traits[i][j][k][l].iconic ? 1 << l + k*traits[i][j][k].length : 0;
				}
			}
		}
	}
	let bperchar = Math.floor(getBaseLog(burdenvalues.length,chars.length));
	let bitsperburden = Math.floor(getBaseLog(2,burdenvalues.length));
	for (let i = 0; i < burdens.burdens.length; i++){
		n=4+Math.floor(i/bperchar);
		//console.log("" + i + "," + n + "," + burdens.burdens[i]);
		
		save[n] += burdens.burdens[i] << (i%bperchar) * bitsperburden;
	}
	if (locked){
		save[7] = 1;
	} else {
		save[7] = 0;
	}
	console.log(url);
	var code = '';
	for (let i = 0; i < save.length; i ++){
		code += chars[save[i]];
	}
	var qloc = url.lastIndexOf('?@');
	console.log(qloc);
	if (qloc > 0){
		url=url.substr(0,qloc);
		console.log("1");
	} else {
		console.log("2");
	}
	bbb2.setAttribute('onclick', "window.location.href='" + url + '?@' + code + "';");
	bbb2.style.backgroundColor = "#fff";
	bbb2.style.color = "#000";
}

function decode(code){
	var save = [0,0,0,0,0,0,0,0];
	for (let i = 0; i < code.length; i++){
		save[i] = chars.lastIndexOf(code[i]);
	}
	console.log(save);
	for (let i = 0; i < traits.length; i++){
		for (let j = 0; j < traits[i].length; j++){
			n = j + i*traits[i].length;
			for (let k = 0; k < traits[i][j].length; k++){
				for (let l = 0; l < traits[i][j][k].length; l++){
					traits[i][j][k][l].iconic = (save[n] & (1 << l + k*traits[i][j][k].length)) != 0;
				}
			}
		}
	}
	let bperchar = Math.floor(getBaseLog(burdenvalues.length,chars.length));
	let bitsperburden = Math.floor(getBaseLog(2,burdenvalues.length));
	for (let i = 0; i < burdens.burdens.length; i++){
		n=4+Math.floor(i/bperchar);
		//console.log("" + i + "," + n + "," + (3 & (save[n] >> (i%bperchar) * bitsperburden)));
		burdens.burdens	[i] = ((1 << bperchar - 1) - 1) & (save[n] >> (i%bperchar) * bitsperburden);
	}
	console.log("hi"+(save[7] & 1));
	locked = (save[7] & 1) != 1;
	lock();
	burdens.refresh();
	burdens.nomouse();
}