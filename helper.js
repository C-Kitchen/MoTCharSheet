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

traitcols = [];

for (let i = 0; i < 4; i++){
	traitcols.push(document.createElement("DIV"));
	traitcols[i].classList.add("traitcolumn");
	document.getElementById("traitarea").appendChild(traitcols[i]);
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