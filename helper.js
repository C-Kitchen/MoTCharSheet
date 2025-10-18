class Trait{
	constructor(name){
		this.name = name;
		this.iconic = false;
		this.htmlelement = null;
		this.valueelement = null;
	}
	flip(){
		this.iconic = !this.iconic;
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

for (let i = 0; i < traits.length; i++){
	for (let j = 0; j < traits[i].length; j++){
		for (let k = 0; k < traits[i][j].length; k++){
			for (let l = 0; l < traits[i][j][k].length; l++){
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
				
				trait.appendChild(traitbutton);
				trait.appendChild(traitname);
				
				traitbutton.addEventListener("click",trait.flip);
				document.getElementById("traitcol" + (l)).appendChild(trait);
			}
		}
	}
}

/*	resizeButtons();

function resizeButtons(){
	for (let i = 0; i < 4; i++){
		if (i == 1 || i == 2){
			traits[i].style.top = traits[i].offsetHeight/2 + "px";
			traits[i].style.left = 0;
		} else {
			traits[i].style.top = 0;
			traits[i].style.left = 0;
		}
	}

}

window.onresize = resizeButtons;

*/