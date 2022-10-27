function changeTheme(t){
	localStorage.setItem("theme", t);
	$("body").attr("class", t);
}

function toggleNew(){
	$("#addnewpkmn-button, #addnewpkmn").toggle();
}

function toggleCheck(id){
	$("#" + id).prop("checked", !$("#" + id).prop("checked"));
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
		$(this).find("option:disabled").prop("selected", "selected").change();
	});
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
		"scar": {"name": "Scarlet", "mark": "unknown"},
		"vio": {"name": "Violet", "mark": "unknown"},
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

function addRow(pkmn, i){
	var shinyDir = pkmn.shiny ? "shiny/" : "regular/";
	$("#addnewpkmn").before("<tr pokemon='" + i + "'><td><b>" + pkmn.name + "</b></td><td><img src='sprites/pkmn/" + shinyDir + pkmn.dex + ".png' class='sprite-mon'></td><td><img src='sprites/balls/" + pkmn.ball + ".png'></td><td>" + pkmn.ot + "</td><td>" + pkmn.id + "</td><td>" + pkmn.nature + "</td><td class='"+gameInfo(pkmn.origin, true)+"'>" + gameInfo(pkmn.origin, false) + "</td><td class='ribbons'><span class='button disabled' onclick='alert(\"Not ready yet!\")'>Edit</span> <span class='button delete' onclick='deletePkmn(this)'>Delete</span></td></tr>");
}

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
	$("#addnewpkmn .button.add").click(function(){
		var str = {
			name: $("#add-name").val(),
			dex: $("#add-dex").val(),
			shiny: $("#add-shiny").prop("checked"),
			gender: "male",
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
