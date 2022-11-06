// Gender restrictions
const onlyF = ["nidoran-f", "nidorina", "nidoqueen", "illumise", "latias", "froslass", "wormadam", "vespiquen", "salazzle", "happiny", "chansey", "blissey", "kangaskhan", "smoochum", "jynx", "miltank", "cresselia", "petilil", "lilligant", "vullaby", "mandibuzz", "flabebe", "floette", "florges", "bounsweet", "steenee", "tsareena", "hatenna", "hattrem", "hatterene", "milcery", "alcremie", "enamorus"];

const onlyM = ["nidoran-m", "nidorino", "nidoking", "volbeat", "latios", "gallade", "mothim", "tyrogue", "hitmonlee", "hitmonchan", "hitmontop", "tauros", "throh", "sawk", "rufflet", "braviary", "tornadus", "thundurus", "landorus", "impidimp", "morgrem", "grimmsnarl"];

const onlyU = ["magnemite", "magneton", "voltorb", "electrode", "staryu", "starmie", "porygon", "porygon2", "shedinja", "lunatone", "solrock", "baltoy", "claydol", "beldum", "metang", "metagross", "bronzor", "bronzong", "magnezone", "porygon-z", "rotom", "phione", "manaphy", "klink", "klang", "klinklang", "cryogonal", "golett", "golurk", "carbink", "minior", "dhelmise", "sinistea", "polteageist", "falinks", "ditto", "articuno", "zapdos", "moltres", "mewtwo", "mew", "unown", "raikou", "entei", "suicune", "lugia", "ho-oh", "celebi", "regirock", "regice", "registeel", "kyogre", "groudon", "rayquaza", "jirachi", "deoxys", "uxie", "mesprit", "azelf", "dialga", "palkia", "regigigas", "giratina", "darkrai", "shaymin", "arceus", "victini", "cobalion", "terrakion", "virizion", "reshiram", "zekrom", "kyurem", "keldeo", "meloetta", "genesect", "xerneas", "yveltal", "zygarde", "diancie", "hoopa", "volcanion", "type-null", "silvally", "tapu-koko", "tapu-lele", "tapu-bulu", "tapu-fini", "cosmog", "cosmoem", "solgaleo", "lunala", "nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana", "guzzlord", "necrozma", "magearna", "marshadow", "poipole", "naganadel", "stakataka", "blacephalon", "zeraora", "meltan", "melmetal", "dracozolt", "arctozolt", "dracovish", "arctovish", "zacian", "zamazenta", "eternatus", "zarude", "regieleki", "regidrago", "glastrier", "spectrier", "calyrex"];

// Gender-specific sprites
const spriteF = ["basculegion", "frillish", "hippopotas", "hippowdon", "indeedee", "jellicent", "meowstic", "pikachu", "pyroar", "unfezant", "wobbuffet"];

// Functions
function saveBackup(){
	var data = localStorage.getItem("pokemon");
	var blob = new Blob([data], {type: 'application/json'});

	var ele = document.createElement('a');
	ele.href = URL.createObjectURL(blob);
	ele.target = "_blank";
	ele.download = "RibbonBackup.json";

	document.body.appendChild(ele);
	ele.click();
	document.body.removeChild(ele);
}

function loadBackup(file, filename){
	var filename = filename.replace("C:\\fakepath\\", "");
	var reader = new FileReader();
	reader.onload = function(e){
		var contents = e.target.result;
		if(confirm("Are you sure you want to replace all of the current data with " + filename + "? You can't reverse this decision!")){
			var allpkmn = JSON.parse(contents);
			allpkmn.entries = allpkmn.entries.filter(Boolean);
			localStorage.setItem("pokemon", JSON.stringify(allpkmn));
			clearTable(allpkmn);
		}
	}
	reader.readAsText(file);
}

function changeTheme(t){
	localStorage.setItem("theme", t);
	$("body").attr("class", t);
}

function toggleNew(){
	$("#addnewpkmn-button, #addnewpkmn").toggle();
}

function toggleCheck(id){
	$("#" + id).prop("checked", !$("#" + id).prop("checked"));
	addPreviews();
}

function switchGender(){
	if($("#add-gender-toggle").attr("lock") === "none"){
		var newGender = "male";
		if($("#add-gender").val() === "male") newGender = "female";
		$("#add-gender").val(newGender);
		$("#add-gender-toggle").attr("src", "img/gender/"+newGender+".png");
	}
	addPreviews();
}

function lockGender(x = "unknown"){
	$("#add-gender").val(x);
	$("#add-gender-toggle").attr({ src: "img/gender/" + x + ".png", lock: x });
}

function unlockGender(){
	if($("#add-gender").val() === "unknown"){
		$("#add-gender").val("male");
		$("#add-gender-toggle").attr({ src: "img/gender/male.png", lock: "none" });
	} else {
		$("#add-gender-toggle").attr("lock", "none");
	}
}

function resetForm(){
	$("#addnewpkmn input").each(function(){
		if($(this).attr("type") === "text"){
			$(this).val("");
		} else if($(this).attr("type") === "checkbox"){
			$(this).prop("checked", false);
		}
	});
	$("#addnewpkmn select").each(function(){
		if($(this).attr("id") !== "add-gender") $(this).find("option:disabled").prop("selected", "selected").change();
	});
	$("#add-preview, #add-preball").attr("src", "img/1x1.png");
	$("#add-origin").parent().attr("class", "");
	lockGender();
}

function deletePkmn(t){
	var name = $(t).parents("tr").find("td:nth(0)").text();
	if(confirm("Are you sure? All of " + name + "'s data will be permanently erased!")){
		var id = $(t).parents("tr").attr("pokemon");
		allpkmn = JSON.parse(localStorage.getItem("pokemon"));
		delete allpkmn.entries[id];
		allpkmn.entries = allpkmn.entries.filter(Boolean);
		localStorage.setItem("pokemon", JSON.stringify(allpkmn));
		clearTable(allpkmn);
	}
}

function createTable(allpkmn){
	for(let i in allpkmn.entries){
		addRow(allpkmn.entries[i], i);
	}
}

function clearTable(allpkmn){
	$(".tablelist tr:not(.protected)").each(function(){
		$(this).remove();
	});
	createTable(allpkmn);
}

function gameInfo(s, o){
	const games = {
		"go": {"name": "GO", "mark": "go"},
		"scar": {"name": "Scarlet", "mark": "paldea"},
		"vio": {"name": "Violet", "mark": "paldea"},
		"sw": {"name": "Sword", "mark": "galar"},
		"sh": {"name": "Shield", "mark": "galar"},
		"bd": {"name": "Brilliant Diamond", "mark": "bdsp"},
		"sp": {"name": "Shining Pearl", "mark": "bdsp"},
		"pla": {"name": "Legends: Arceus", "mark": "hisui"},
		"sun": {"name": "Sun", "mark": "clover"},
		"moon": {"name": "Moon", "mark": "clover"},
		"usun": {"name": "Ultra Sun", "mark": "clover"},
		"umoon": {"name": "Ultra Moon", "mark": "clover"},
		"lgp": {"name": "Let's Go, Pikachu!", "mark": "lets-go"},
		"lge": {"name": "Let's Go, Eevee!", "mark": "lets-go"},
		"x": {"name": "X", "mark": "pentagon"},
		"y": {"name": "Y", "mark": "pentagon"},
		"or": {"name": "Omega Ruby", "mark": "pentagon"},
		"as": {"name": "Alpha Sapphire", "mark": "pentagon"},
		"black": {"name": "Black", "mark": null},
		"white": {"name": "White", "mark": null},
		"black2": {"name": "Black 2", "mark": null},
		"white2": {"name": "White 2", "mark": null},
		"diamond": {"name": "Diamond", "mark": null},
		"pearl": {"name": "Pearl", "mark": null},
		"platinum": {"name": "Platinum", "mark": null},
		"hg": {"name": "HeartGold", "mark": null},
		"ss": {"name": "SoulSilver", "mark": null},
		"ruby": {"name": "Ruby", "mark": null},
		"sapphire": {"name": "Sapphire", "mark": null},
		"emerald": {"name": "Emerald", "mark": null},
		"fr": {"name": "FireRed", "mark": null},
		"lg": {"name": "LeafGreen", "mark": null},
		"colosseum": {"name": "Colosseum", "mark": null},
		"xd": {"name": "XD: Gale of Darkness", "mark": null},
		"gold": {"name": "Gold", "mark": "game-boy"},
		"silver": {"name": "Silver", "mark": "game-boy"},
		"crystal": {"name": "Crystal", "mark": "game-boy"},
		"red-jpn": {"name": "Red (JPN)", "mark": "game-boy"},
		"green": {"name": "Green", "mark": "game-boy"},
		"blue-jpn": {"name": "Blue (JPN)", "mark": "game-boy"},
		"red-eng": {"name": "Red (ENG)", "mark": "game-boy"},
		"blue-eng": {"name": "Blue (ENG)", "mark": "game-boy"},
		"yellow": {"name": "Yellow", "mark": "game-boy"}
	};
	if(o){
		if(games[s]["mark"]){
			return "origin-" + games[s]["mark"];
		} else {
			return "";
		}
	} else {
		return games[s]["name"];
	}
}

function addPreviews(){
	var poke = $("#add-dex").val();
	if(poke){
		if(onlyF.indexOf(poke) > -1){
			lockGender("female");
		} else if(onlyM.indexOf(poke) > -1){
			lockGender("male");
		} else if(onlyU.indexOf(poke) > -1){
			lockGender();
		} else {
			unlockGender();
		}
		var shinyDir = $("#add-shiny").prop("checked") ? "shiny/" : "regular/";
		var femaleDir = (spriteF.indexOf(poke) > -1 && $("#add-gender").val() === "female") ? "female/" : "";
		$("#add-preview").attr("src", "img/pkmn/" + shinyDir + femaleDir + poke + ".png");
	}
	if($("#add-ball").val()) $("#add-preball").attr("src", "img/balls/" + $("#add-ball").val() + ".png");
	if($("#add-origin").val()) $("#add-origin").parent().attr("class", gameInfo($("#add-origin").val(), true));
}

function addRow(pkmn, i){
	var shinyDir = pkmn.shiny ? "shiny/" : "regular/";
	var femaleDir = (spriteF.indexOf(pkmn.dex) > -1 && pkmn.gender === "female") ? "female/" : "";
	var shinyMark = pkmn.shiny ? "<img src='img/shiny.png' class='shiny'>" : "";
	$("#addnewpkmn").before("<tr pokemon='" + i + "'><td><b>" + pkmn.name + "</b></td><td>" + shinyMark + "<img src='img/pkmn/" + shinyDir + femaleDir + pkmn.dex + ".png' class='sprite-mon'><img src='img/gender/"+pkmn.gender+".png' class='gender'></td><td><img src='img/balls/" + pkmn.ball + ".png'></td><td>" + pkmn.ot + "</td><td>" + pkmn.id + "</td><td>" + pkmn.nature + "</td><td class='"+gameInfo(pkmn.origin, true)+"'>" + gameInfo(pkmn.origin, false) + "</td><td class='ribbons'><span class='button disabled' onclick='alert(\"Not ready yet!\")'>Edit</span> <span class='button delete' onclick='deletePkmn(this)'>Delete</span></td></tr>");
}

// On load
$(function(){
	resetForm();
	var theme = localStorage.getItem("theme");
	if(!theme) theme = "dark";
	changeTheme(theme);
	var allpkmn = localStorage.getItem("pokemon");
	if(!allpkmn){
		allpkmn = { "entries": [] };
		localStorage.setItem("pokemon", JSON.stringify(allpkmn));
	} else {
		allpkmn = JSON.parse(allpkmn);
		for(let i in allpkmn.entries){
			addRow(allpkmn.entries[i], i);
		}
	}
	$("#themeswitch").click(function(){
		var current = $("body").attr("class");
		current === "dark" ? changeTheme("light") : changeTheme("dark");
	});
	$("#addnewpkmn-button .button").click(function(){
		toggleNew();
	});
	$("#addnewpkmn .button.cancel").click(function(){
		if(confirm("Are you sure? All of the data you've entered will be lost!")){
			toggleNew();
			resetForm();
		}
	});
	$("#add-dex, #add-ball, #add-origin").change(function(){
		addPreviews();
	});
	const restoreBtn = document.getElementById("restoreinput");
	restoreBtn.addEventListener("change", (e) => {
		var file = event.target.files[0];
		if(file) loadBackup(file, restoreBtn.value);
	});
	$("#restore").click(function(){
		$("#restore input").val(null);
	});
	$("#addnewpkmn .button.add").click(function(){
		var str = {
			name: $("#add-name").val(),
			dex: $("#add-dex").val(),
			shiny: $("#add-shiny").prop("checked"),
			gender: $("#add-gender").val(),
			ball: $("#add-ball").val(),
			ot: $("#add-trainer").val(),
			id: $("#add-id").val(),
			nature: $("#add-nature").val(),
			origin: $("#add-origin").val(),
			ribbons: []
		};
		if(str.name && str.dex && str.ball && str.ot && !isNaN(str.id) && str.nature && str.origin){
			allpkmn = JSON.parse(localStorage.getItem("pokemon"));
			var n = allpkmn.entries.length;
			allpkmn.entries[n] = str;
			localStorage.setItem("pokemon", JSON.stringify(allpkmn));
			addRow(str, n);
			toggleNew();
			resetForm();
		}
	});
});
