class Trait{
	constructor(name){
		this.name = name;
		this.iconic = false;
		this.htmlelement = null;
		this.valueelement = null;
		this.iconicelement = null;
	}
	flip(){
		this.iconic = !this.iconic;
		this.iconicelement.style.visibility = this.iconic ? "visible" : "hidden";
		console.log(this.name + this.iconic);
		calculateall();
	}
}

let traits = 
[
	[
		[
			[new Trait("Aggression"), new Trait("Heft"), new Trait("Strength")],
			[new Trait("Dexterity"), new Trait("Reaction"), new Trait("Speed")]
		],
		[
			[new Trait("Stability"), new Trait("Toughness"), new Trait("Stamina")],
			[new Trait("Wisdom"), new Trait("Intuition"), new Trait("Willpower")]
		]
	],
	[
		[
			[new Trait("Presence"), new Trait("Guile"), new Trait("Charm")],
			[new Trait("Wits"), new Trait("Reason"), new Trait("Savvy")]
		],
		[
			[new Trait("Grace"), new Trait("Stealth"), new Trait("Agility")],
			[new Trait("Empathy"), new Trait("Scrutiny"), new Trait("Awareness")]
		]
	]
];

let traitcols = [];
let traitarea = document.getElementById("traitarea");
let trackarea = document.getElementById("trackarea");
let time;

class HarmTrack{
	constructor(name){
		this.name = name;
		this.tempmax = 3;
		this.max = 10;
		
		this.hold = false;
		this.thing = null;
		
		this.minorharm = 0;
		this.lingeringharm = 0;
		
		this.track = document.createElement("DIV");
		this.track.classList.add("trackrow");
		trackarea.appendChild(this.track);
		
		this.nameelement = document.createElement("DIV");
		this.nameelement.textContent = name;
		this.nameelement.classList.add("trackname");
		this.track.appendChild(this.nameelement);
		
		this.buttons = [];
		for (let i = 0; i < this.max; i++){
			this.buttons.push(document.createElement("BUTTON"));
			this.buttons[i].className = "trackbutton";
			this.track.appendChild(this.buttons[i]);
			this.buttons[i].addEventListener("mousedown",() => this.starthold(i));
			this.buttons[i].addEventListener("touchstart",() => this.starthold(i));
			this.buttons[i].addEventListener("click",() => this.push(i));
			this.buttons[i].addEventListener("touchend",() => this.push(i));
			this.buttons[i].addEventListener("mouseover",() => this.starthover(i));
			this.buttons[i].addEventListener("mouseout",() => this.updateButtons());
		}
	}
	
	starthold(n){
		console.log("push " + n);
		this.hold = false;
		clearTimeout(this.timeout);
		//set a timer for hold to be true
		this.timeout = setTimeout(() => this.holdevent(n), 400);
	}
	
	holdevent(n){
		this.hold = true;
		console.log("hold " + n);
		this.hover(n);
	}
	
	starthover(n){
		/*this.hold = false;*/
		console.log("hi");
		this.hover(n);
	}
	
	push(n){
		//this.hold = (Date.now() - time) > 400;/*make an event happen instead of here?*/
		console.log(this.hold);
		if (n +1 > this.minorharm + this.lingeringharm){
			if (this.hold){
				this.lingeringharm = n+1 - this.minorharm;
			} else if (n + 1 > this.tempmax){
				this.minorharm += n+1 - (this.minorharm + this.lingeringharm);
				this.minorharm = this.minorharm > this.tempmax ? this.tempmax : this.minorharm;
				this.lingeringharm = n+1 - this.minorharm;
			} else{
				this.minorharm = n+1;
			}
		} else if (n + 1 > this.minorharm){
			this.lingeringharm = n - this.minorharm;
		} else {
			if (this.hold){
				this.lingeringharm = 0;
			}
			this.minorharm = n;
		}
		clearTimeout(this.timeout);
		this.hold = false;
		this.updateButtons();
	}
	
	hover(n){/*the way this works is a bit wonky. Need to set it so that you use the hover CSS function, it seems like whenever updateButtons is called it can make buttons jump around a bit for maybe a frame or something*/
		console.log("hover " + n + this.hold);
		if (n + 1 > this.minorharm + this.lingeringharm){
			for (let i = this.minorharm + this.lingeringharm; i < n + 1; i++){
				if ((i + 1 - (this.minorharm + this.lingeringharm) > this.tempmax - this.minorharm) || this.hold){
					this.buttons[i].className = "lingeringharmadd";
				} else {
					this.buttons[i].className = "minorharmadd";
				}
			}
		} else {
			for (let i = n; i < this.minorharm + (this.hold || (n + 1 > this.minorharm) ? this.lingeringharm : 0); i++){
				this.buttons[i].className += "del";
			}
		}
	}
	
	updateButtons(){
		for (let i = 0; i < this.buttons.length; i++){
			if (i < this.minorharm){
				this.buttons[i].className = "minorharm";
			} else if (i < this.minorharm + this.lingeringharm){
				this.buttons[i].className = "lingeringharm";
			} else {
				this.buttons[i].className = "trackbutton";
			}
		}
		/*this.hold = false;*/
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
test = new HarmTrack("Woe");
test = new HarmTrack("Fatigue");
test = new HarmTrack("Wounds");

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
				}
				
			}
		}
	}
}