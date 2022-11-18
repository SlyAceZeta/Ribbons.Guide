function getData(dex, field){
	var thisPkmn = pokemon[dex];
	if(pokemon[dex]){
		var data = thisPkmn[field];
		if(data === undefined){
			data = pokemon[thisPkmn["data-source"]][field];
		}
		return data;
	} else {
		return false;
	}
}

function showModal(id = "pokeform", ontop = false){
	var click = {};
	if(id === "pokeform"){
		click = { clickClose: false };
	} else if(ontop){
		click = { closeExisting: false, fadeDuration: 0 };
	}
	$("#" + id).modal(click);
}

function createPokemon(edit = false){
	var ribbons = [];
	$("#all-ribbons input:checked").each(function(){
		ribbons.push($(this).attr("id"));
	});
	var species = $("#pokeform-species").val();
	var genderCheck = getData(species, "gender");
	var gender = "male";
	if(genderCheck === "unknown"){
		gender = "unknown";
	} else if(genderCheck === "female" || (genderCheck === "both" && $("#pokeform-gender-checkbox").prop("checked"))){
		gender = "female";
	}
	var iv = {
		hp: $("#pokeform-iv-hp").val(),
		atk: $("#pokeform-iv-atk").val(),
		def: $("#pokeform-iv-def").val(),
		spa: $("#pokeform-iv-spa").val(),
		spd: $("#pokeform-iv-spd").val(),
		spe: $("#pokeform-iv-spe").val()
	}
	var ev = {
		hp: $("#pokeform-ev-hp").val(),
		atk: $("#pokeform-ev-atk").val(),
		def: $("#pokeform-ev-def").val(),
		spa: $("#pokeform-ev-spa").val(),
		spd: $("#pokeform-ev-spd").val(),
		spe: $("#pokeform-ev-spe").val()
	}
	var str = {
		name: $("#pokeform-nickname").val(),
		dex: species,
		shiny: $("#pokeform-shiny-checkbox").prop("checked"),
		gender: gender,
		ball: $("#pokeform-ball").val(),
		title: $("#pokeform-title").val(),
		level: $("#pokeform-level").val(),
		metlevel: $("#pokeform-metlevel").val(),
		metdate: $("#pokeform-metdate").val(),
		characteristic: $("#pokeform-characteristic").val(),
		lang: $("#pokeform-lang").val(),
		ot: $("#pokeform-ot").val(),
		id: $("#pokeform-idno").val(),
		nature: $("#pokeform-nature").val(),
		mint: $("#pokeform-mint").val(),
		iv: iv,
		ev: ev,
		ability: $("#pokeform-ability").val(),
		origin: $("#pokeform-origin").val(),
		currentgame: $("#pokeform-currentgame").val(),
		ribbons: ribbons,
		notes: $("#pokeform-notes").val()
	};
	if(str.dex && str.ball && str.origin && str.title && str.level && str.lang){
		if(!str.id || str.id.match(/^[0-9]{5,6}$/)){
			if(parseInt(str.level) > 0 && parseInt(str.level) < 101){
				if(!str.metlevel || parseInt(str.metlevel) <= parseInt(str.level)){
					allpkmn = JSON.parse(localStorage.getItem("pokemon"));
					var n = (edit) ? $("#pokeform-edit").attr("pokemon") : allpkmn.entries.length;
					allpkmn.entries[n] = str;
					localStorage.setItem("pokemon", JSON.stringify(allpkmn));
					if(edit){
						clearTable(allpkmn);
					} else {
						addRow(str, n);
					}
					resetForm();
				} else {
					alert("The Pokémon's current level cannot be lower than the level you met it.");
				}
			} else {
				alert("The Pokémon's level must be a number from 1 to 100.");
			}
		} else {
			alert("The ID No. can only be five or six numbers.");
		}
	} else {
		alert("One or more required fields in the Summary tab has not been filled.");
	}
}

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
		var proc = false;
		var allpkmn = JSON.parse(localStorage.getItem("pokemon"));
		if(!allpkmn || allpkmn.entries.length === 0){
			proc = true;
		} else {
			if(confirm("Are you sure you want to replace all of the current data with " + filename + "? You can't reverse this decision!")){
				proc = true;
			}
		}
		if(proc){
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
	$("body").attr({ class: "theme-" + t, theme: t });
}

function toggleCheck(id){
	$("#" + id).prop("checked", !$("#" + id).prop("checked"));
}

function resetForm(c = false){
	var reset = true;
	if(c){
		if(!confirm("Are you sure you wish to cancel? All of the data you've entered will be lost!"))
			reset = false;
	}
	if(reset){
		$.modal.close();
		$("#pokeform input").each(function(){
			if($(this).attr("type") === "text" || $(this).attr("type") === "number"){
				$(this).val("");
			} else if($(this).attr("type") === "checkbox"){
				$(this).prop("checked", false);
			}
		});
		$("#pokeform select").each(function(){
			if($(this).attr("id") === "pokeform-mint" || $(this).attr("id") === "pokeform-title"){
				$(this).val("None").trigger("change");
			} else {
				$(this).val(null).trigger("change");
			}
		});
		$("#pokeform-notes").val("");
		$("#pokeform-add, #pokeform-header-add").show();
		$("#pokeform-edit").hide().removeAttr("pokemon");
		$("#pokeform-header-edit").hide();
	}
}

function editPkmn(id){
	allpkmn = JSON.parse(localStorage.getItem("pokemon"));
	var pkmn = allpkmn.entries[id];
	for(var r in pkmn.ribbons) $("#" + pkmn.ribbons[r]).prop("checked", "checked").change();
	$("#pokeform-add, #pokeform-header-add").hide();
	$("#pokeform-header-edit").show();
	$("#pokeform-edit").show().attr("pokemon", id);
	$("#pokeform-nickname").val(pkmn.name);
	$("#pokeform-species").val(pkmn.dex).change();
	if(pkmn.shiny) $("#pokeform-shiny-checkbox").prop("checked", "checked").change();
	if(pkmn.gender === "female") $("#pokeform-gender-checkbox").prop("checked", "checked").change();
	$("#pokeform-ball").val(pkmn.ball).change();
	if(pkmn.title) $("#pokeform-title").val(pkmn.title).change();
	if(pkmn.ability) $("#pokeform-ability").val(pkmn.ability).change();
	if(pkmn.level) $("#pokeform-level").val(pkmn.level);
	if(pkmn.metlevel) $("#pokeform-metlevel").val(pkmn.metlevel);
	if(pkmn.metdate) $("#pokeform-metdate").val(pkmn.metdate);
	if(pkmn.characteristic) $("#pokeform-characteristic").val(pkmn.characteristic).change();
	if(pkmn.lang) $("#pokeform-lang").val(pkmn.lang).change();
	$("#pokeform-ot").val(pkmn.ot);
	$("#pokeform-idno").val(pkmn.id);
	$("#pokeform-nature").val(pkmn.nature).change();
	$("#pokeform-mint").val(pkmn.mint).change();
	if(pkmn.iv){
		for(var s in pkmn.iv){
			$("#pokeform-iv-" + s).val(pkmn.iv[s]);
		}
	}
	if(pkmn.ev){
		for(var s in pkmn.ev){
			$("#pokeform-ev-" + s).val(pkmn.ev[s]);
		}
	}
	$("#pokeform-origin").val(pkmn.origin).change();
	if(pkmn.currentgame) $("#pokeform-currentgame").val(pkmn.currentgame).change();
	$("#pokeform-notes").val(pkmn.notes);
	showModal();
}

function deletePkmn(id){
	var name = $(".pokemon-list-entry[pokemon="+id+"]").find(".pokemon-list-name").text();
	if(confirm("Are you sure? All of " + name + "'s data will be permanently erased!")){
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
	$("#pokemon-list").html('<div id="pokemon-list-empty"><div>You have no saved Pokémon. Click or tap the + button at the bottom-right to add one! If you have a backup file, click the ⛭ button at the top-right to restore the backup.</div></div>');
	createTable(allpkmn);
}

function gameInfo(s, o = false){
	if(o){
		if(games[s]["mark"]){
			return "originmark origin-" + games[s]["mark"];
		} else {
			return "";
		}
	} else {
		return games[s]["name"];
	}
}

function addRow(pkmn, i){
	var shinyDir = pkmn.shiny ? "shiny/" : "regular/";
	var shinyMark = pkmn.shiny ? "<img src='img/ui/shiny.png' class='shiny'>" : "";

	var femaleDir = (getData(pkmn.dex, "femsprite") && pkmn.gender === "female") ? "female/" : "";

	var mint = pkmn.mint || "None";
	var mintImg = (mint !== "None") ? "<div class='mint " + mints[mint] + "'>" + mint + "</div>" : "";

	var ribbons = "<div class='ribbons-list-empty'>This Pokémon has no ribbons.</div>";
	var r;
	for(r = 0; r < pkmn.ribbons.length; r++){
		var rCode = pkmn.ribbons[r];
		var rData = allRibbons[rCode];
		if(rData){
			var rName = rData["name"];
			var rDesc = "";
			if(rData["desc"]) rDesc = " - " + rData["desc"];
			var rFldr = "ribbons";
			if(rData["mark"]) rFldr = "marks";
			ribbons = ribbons + "<img class='" + rCode + "' src='img/" + rFldr + "/" + rCode + ".png' alt=\"" + rName + rDesc + "\" title=\"" + rName + rDesc + "\">";
		}
	}

	var gender = (pkmn.gender !== "unknown") ? "<img src='img/gender/"+pkmn.gender+".png' class='gender'>" : "";

	var origin = games[pkmn.origin]["mark"];
	if(origin){
		origin = "<img src='img/origins/light/" + origin + ".png' class='pokemon-list-origin' title='" + games[pkmn.origin]["name"] + "'>";
	} else {
		origin = "";
	}

	var titleBon = pkmn.title || "None";
	var titleDir = "ribbons";
	var title = "";
	if(titleBon !== "None"){
		if(titleBon.indexOf("-mark") > 0) titleDir = "marks";
		title = "<img src='img/" + titleDir + "/" + titleBon + ".png'><span>" + allRibbons[titleBon]["title"] + "</span>";
	}

	var lang = pkmn.lang;
	if(!lang) lang = "???";
	var level = pkmn.level;
	if(!level) level = "???";

	var name = pkmn.name;
	if(name.length === 0){
		name = $("#pokeform-species").find("option[value="+pkmn.dex+"]").text();
		name = name.replace(/( \(.*\))?/g, "");
	}

	$("#pokemon-list").append("<div class='pokemon-list-entry' pokemon='" + i + "'><div class='pokemon-list-entry-header'><div class='pokemon-list-entry-header-left'><img src='img/balls/" + pkmn.ball + ".png'><span class='pokemon-list-name'>" + name + "</span>" + gender + shinyMark + "</div><div class='pokemon-list-entry-header-right'>"+title+"</div></div><div class='pokemon-list-entry-center'><img src='img/pkmn/" + shinyDir + femaleDir + pkmn.dex + ".png'><div class='ribbons-list'>" + ribbons + "</div></div><div class='pokemon-list-entry-footer'><div class='pokemon-list-entry-footer-left'><span class='pokemon-list-level'>Lv.&nbsp;"+level+"</span><span><span class='pokemon-list-lang'>"+lang+"</span></span>" + origin + "</div><div class='pokemon-list-entry-footer-right'><img class='pokemon-list-edit' src='img/ui/edit.png' onclick='editPkmn("+i+")' title='Edit " + name + "'><img class='pokemon-list-delete' src='img/ui/delete.png' onclick='deletePkmn("+i+")' title='Delete " + name + "'></div></div></div>");
}

function generateRibbons(){
	$("#add-ribbons").append("<div id='all-ribbons'></div>");
	for(var i in ribbonIDs) $("#all-ribbons").append("<div class='ribbons-gen'>" + i + "</div><div id='ribbons-list-" + ribbonIDs[i] + "' class='ribbons-list'></div>");
	var folder = "ribbons";
	for(let r in allRibbons){
		var rData = allRibbons[r];
		var rGen = "e";
		var rFldr = "ribbons";
		if(rData["available"]){
			rGen = rData["gen"];
		} else if(rData["mark"]){
			rGen = "m";
			rFldr = "marks";
		}
		var rDesc = "";
		if(rData["desc"]) rDesc = " - " + rData["desc"];
		$("#ribbons-list-" + rGen).append("<input id='" + r + "' type='checkbox' form='newpkmnform' hidden><img class='" + r + "' src='img/" + rFldr + "/" + r + ".png' alt=\"" + rData["name"] + rDesc + "\" title=\"" + rData["name"] + rDesc + "\" onclick='toggleCheck(\"" + r + "\");'>");
	}
}

function formatDropOption(o){
	var result = o._resultId || o.text;
	if(result.indexOf("pokeform-ball") > 0){
		var $ball = $("<img src='img/balls/" + o.id + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		return $ball;
	} else if(result.indexOf("pokeform-mint") > 0){
		if(o.id === "None") return $("<span>None</span>");
		var $mint = $("<img src='img/mints/" + mints[o.id] + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		return $mint;
	} else if(result.indexOf("pokeform-origin") > 0){
		var mark = games[o.id]["mark"];
		var $origin;
		if(mark){
			$origin = $("<img src='img/origins/dark/" + mark + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		} else {
			$origin = $("<img src='img/ui/1x1.png' class='pokedropimg'><span>" + o.text + "</span>");
		}
		return $origin;
	} else if(result.indexOf("pokeform-title") > 0){
		if(o.id === "None") return $("<span>None</span>");
		var rDir = "ribbons";
		if(o.id.indexOf("-mark") > 0) rDir = "marks";
		return $("<img src='img/" + rDir + "/" + o.id + ".png' class='pokedropimg'><span>" + o.text + "</span>");
	} else {
		return o.text;
	}
}

// On load
$(function(){
    $.modal.defaults.fadeDuration = 250;
	$.modal.defaults.fadeDelay = 0;
	$.modal.defaults.escapeClose = false;
	$.modal.defaults.showClose = false;
	resetForm();
	generateRibbons();
	$("#pokeform select").select2({
		templateSelection: formatDropOption,
		templateResult: formatDropOption,
		dropdownParent: $("#pokeform"),
		width: "100%",
    	placeholder: "Select an option"
	});
	$("#settings select").select2({
		width: "100%"
	});
	$("#add-pokemon-button").click(function(){
		showModal();
	});
	$("#header-settings").click(function(){
		showModal("settings");
	});
	$("#view-changelog").click(function(){
		showModal("changelog", true);
	});
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

	var lastChange = localStorage.getItem("changelog");
	var numChanges = "" + $("#changelog tr").length;
	if(lastChange && lastChange !== numChanges){
		showModal("changelog");
	}
	if(!lastChange || lastChange !== numChanges){
		localStorage.setItem("changelog", numChanges);
	}

	$("#settings-theme").change(function(){
		var curTheme = $("body").attr("theme");
		var newTheme = $(this).val();
		if(curTheme !== newTheme){
			changeTheme(newTheme);
		}
	});
	var theme = localStorage.getItem("theme");
	if(!theme) theme = "naranja";
	$("#settings-theme").val(theme).change();
	$("#backup").click(function(){
		saveBackup();
	});
	const restoreBtn = document.getElementById("restoreinput");
	restoreBtn.addEventListener("change", (e) => {
		var file = event.target.files[0];
		if(file) loadBackup(file, restoreBtn.value);
	});
	$("#restore").click(function(){
		$("#restore input").val(null);
	});
	$("#pokeform-gender-img").click(function(){
		if($("#pokeform-gender-checkbox").attr("disabled") !== "disabled")
			toggleCheck("pokeform-gender-checkbox");
	});
	$("#pokeform-species").change(function(){
		var species = $("#pokeform-species").val();
		var gender = getData(species, "gender");
		if(gender === "unknown"){
			$("#pokeform-gender-known").hide();
			$("#pokeform-gender-unknown").show();
		} else {
			$("#pokeform-gender-known").show();
			$("#pokeform-gender-unknown").hide();
			if(gender === "female"){
				$("#pokeform-gender-checkbox").attr("disabled", "disabled");
				$("#pokeform-gender-checkbox").prop("checked", "checked");
			} else if(gender === "male"){
				$("#pokeform-gender-checkbox").attr("disabled", "disabled");
				$("#pokeform-gender-checkbox").prop("checked", false);
			} else {
				$("#pokeform-gender-checkbox").removeAttr("disabled");
			}
		}
	});
	$("#pokeform-add").click(function(){
		createPokemon();
	});
	$("#pokeform-edit").click(function(){
		createPokemon(true);
	});
	$("#pokeform-cancel").click(function(){
		resetForm(true);
	});
	$("#pokeform").on($.modal.BLOCK, function(event, modal){
		$(".jquery-modal.blocker.current").click(function(e){
			if(e.target === this)
				resetForm(true);
		});
	});
	$("#pokeform").on($.modal.AFTER_CLOSE, function(event, modal){
		$(".pokeform-tab1-ctrl").click();
	});
	$("#settings-close, #changelog-close").click(function(){
		$.modal.close();
	});
	$("#changelog tr").click(function(){
		if($(this).hasClass("changelog-active")){
			$(this).removeClass("changelog-active");
		} else {
			$(this).addClass("changelog-active");
		}
	});
	$("#pokeform-tabs span").click(function(){
		if(!$(this).hasClass("pokeform-tabs-active")){
			var targetTab = $(this).attr("class").replace("-ctrl", "");
			$(".pokeform-tabs-active").removeClass("pokeform-tabs-active");
			$(this).addClass("pokeform-tabs-active");
			$("#pokeform tr:not(#pokeform-tabs):not(." + targetTab + ")").hide();
			$("#pokeform tr." + targetTab).show();
		}
	});
});
