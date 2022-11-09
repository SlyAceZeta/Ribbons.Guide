function showModal(id = "pokeform"){
	$("#" + id).modal({
		fadeDuration: 250,
		fadeDelay: 0,
		escapeClose: false,
		clickClose: false,
		showClose: false
	});
}

function saveBackup(){
	if($("#backup").hasClass("disabled")){
		alert("You can't save a backup while adding or editing a Pokémon!");
	} else {
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

function toggleCheck(id){
	$("#" + id).prop("checked", !$("#" + id).prop("checked"));
	addPreviews();
}

function resetForm(){
	$("#pokeform input").each(function(){
		if($(this).attr("type") === "text"){
			$(this).val("");
		} else if($(this).attr("type") === "checkbox"){
			$(this).prop("checked", false);
		}
	});
	$("#pokeform select").each(function(){
		$(this).val(null).trigger("change");
	});
	$("#pokeform-add").show();
	$("#pokeform-edit").hide().removeAttr("pokemon");
}

function editPkmn(id){
	allpkmn = JSON.parse(localStorage.getItem("pokemon"));
	var pkmn = allpkmn.entries[id];
	for(var r in pkmn.ribbons) $("#" + pkmn.ribbons[r]).prop("checked", "checked").change();
	$("#pokeform-add").hide();
	$("#pokeform-edit").show().attr("pokemon", id);
	$("#pokeform-nickname").val(pkmn.name);
	$("#pokeform-species").val(pkmn.dex).change();
	if(pkmn.shiny) $("#pokeform-shiny-checkbox").prop("checked", "checked").change();
	if(pkmn.gender === "female") $("#pokeform-gender-checkbox").prop("checked", "checked").change();
	$("#pokeform-ball").val(pkmn.ball).change();
	$("#pokeform-ot").val(pkmn.ot);
	$("#pokeform-idno").val(pkmn.id);
	$("#pokeform-nature").val(pkmn.nature).change();
	$("#pokeform-mint").val(pkmn.mint).change();
	$("#pokeform-origin").val(pkmn.origin).change();
	showModal();
}

function deletePkmn(id){
	var name = $("tr[pokemon="+id+"]").find("td:nth(0)").text();
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
	$(".tablelist tr:not(.protected)").each(function(){
		$(this).remove();
	});
	createTable(allpkmn);
}

function gameInfo(s, o = false){
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
	var shinyMark = pkmn.shiny ? "<img src='img/shiny.png' class='shiny'>" : "";

	var femaleDir = (spriteF.indexOf(pkmn.dex) > -1 && pkmn.gender === "female") ? "female/" : "";

	var mint = pkmn.mint || "None";
	var mintImg = (mint !== "None") ? "<div class='mint " + mints[mint] + "'>" + mint + "</div>" : "";

	var ribbons = "";
	var r;
	for(r = 0; r < pkmn.ribbons.length; r++){
		var rCode = pkmn.ribbons[r];
		var rData = allRibbons[rCode];
		var rName = rData["name"];
		var rDesc = "";
		if(rData["desc"]) rDesc = " - " + rData["desc"];
		ribbons = ribbons + "<img class='" + rCode + "' src='img/ribbons/" + rCode + ".png' alt=\"" + rName + rDesc + "\" title=\"" + rName + rDesc + "\">";
	}

	$(".tablelist").append("<tr pokemon='" + i + "'><td><b>" + pkmn.name + "</b></td><td>" + shinyMark + "<img src='img/pkmn/" + shinyDir + femaleDir + pkmn.dex + ".png' class='sprite-mon'><img src='img/gender/"+pkmn.gender+".png' class='gender'></td><td><img src='img/balls/" + pkmn.ball + ".png'></td><td>" + pkmn.ot + "</td><td>" + pkmn.id + "</td><td>" + pkmn.nature + mintImg + "</td><td class='"+gameInfo(pkmn.origin, true)+"'>" + gameInfo(pkmn.origin) + "</td><td class='ribbons'><div class='ribbons-list'>" + ribbons + "</div></td><td><div class='button edit' onclick='editPkmn("+i+")'>Edit</div> <div class='button delete' onclick='deletePkmn("+i+")'>Delete</div></td></tr>");
}

function generateRibbons(){
	$("#add-ribbons").append("<div id='all-ribbons'></div>");
	for(var i in ribbonIDs) $("#all-ribbons").append("<div class='ribbons-gen'>" + i + "</div><div id='ribbons-list-" + ribbonIDs[i] + "' class='ribbons-list'></div>");
	for(let r in allRibbons){
		var rData = allRibbons[r];
		var rGen = "e";
		if(rData["available"]){
			rGen = rData["gen"];
		}
		var rDesc = "";
		if(rData["desc"]) rDesc = " - " + rData["desc"];
		$("#ribbons-list-" + rGen).append("<input id='" + r + "' type='checkbox' form='newpkmnform' hidden><img class='" + r + "' src='img/ribbons/" + r + ".png' alt=\"" + rData["name"] + rDesc + "\" title=\"" + rData["name"] + rDesc + "\" onclick='toggleCheck(\"" + r + "\");'>");
	}
}

function formatDropOption(o){
	var result = o._resultId || o.text;
	if(result.indexOf("pokeform-ball") > 0){
		var $ball = $("<img src='img/balls/" + o.id + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		return $ball;
	} else if(result.indexOf("pokeform-mint") > 0){
		if(o.id === "None") return $("<img src='img/1x1.png' class='pokedropimg'><span>None</span>");
		var $mint = $("<img src='img/mints/" + mints[o.id] + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		return $mint;
	} else if(result.indexOf("pokeform-origin") > 0){
		var mark = games[o.id]["mark"];
		var $origin;
		if(mark){
			$origin = $("<img src='img/origins/dark/" + mark + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		} else {
			$origin = $("<img src='img/1x1.png' class='pokedropimg'><span>" + o.text + "</span>");
		}
		return $origin;
	} else {
		return o.text;
	}
}

// On load
$(function(){
	resetForm();
	generateRibbons();
	$("#pokeform select").select2({
		templateSelection: formatDropOption,
		templateResult: formatDropOption,
		dropdownParent: $("#pokeform"),
		width: "100%",
    	placeholder: "Select an option"
	});
	$("#addnewpokemon").click(function(){
		showModal();
	})
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
	$("#backup").click(function(){
		saveBackup();
	});
	const restoreBtn = document.getElementById("restoreinput");
	restoreBtn.addEventListener("change", (e) => {
		var file = event.target.files[0];
		if(file) loadBackup(file, restoreBtn.value);
	});
	$("#restore").click(function(){
		if($("#restore").hasClass("disabled")) alert("You can't restore a backup while adding or editing a Pokémon!");
		$("#restore input").val(null);
	});
	$("#pokeform-gender-img").click(function(){
		if($("#pokeform-gender-checkbox").attr("disabled") !== "disabled")
			toggleCheck("pokeform-gender-checkbox");
	});
	$("#pokeform-species").change(function(){
		var species = $("#pokeform-species").val();
		if(onlyU.includes(species)){
			$("#pokeform-gender-known").hide();
			$("#pokeform-gender-unknown").show();
		} else {
			$("#pokeform-gender-known").show();
			$("#pokeform-gender-unknown").hide();
			if(onlyF.includes(species)){
				$("#pokeform-gender-checkbox").attr("disabled", "disabled");
				$("#pokeform-gender-checkbox").prop("checked", "checked");
			} else if(onlyM.includes(species)){
				$("#pokeform-gender-checkbox").attr("disabled", "disabled");
				$("#pokeform-gender-checkbox").prop("checked", false);
			} else {
				$("#pokeform-gender-checkbox").removeAttr("disabled");
			}
		}
	});
	$("#pokeform-add").click(function(){
		var ribbons = [];
		$("#all-ribbons input:checked").each(function(){
			ribbons.push($(this).attr("id"));
		});
		var species = $("#pokeform-species").val();
		var gender = "male";
		if(onlyU.includes(species)){
			gender = "unknown";
		} else if(onlyF.includes(species) || $("#pokeform-gender-checkbox").prop("checked")){
			gender = "female";
		}
		var str = {
			name: $("#pokeform-nickname").val(),
			dex: species,
			shiny: $("#pokeform-shiny-checkbox").prop("checked"),
			gender: gender,
			ball: $("#pokeform-ball").val(),
			ot: $("#pokeform-ot").val(),
			id: $("#pokeform-idno").val(),
			nature: $("#pokeform-nature").val(),
			mint: $("#pokeform-mint").val(),
			origin: $("#pokeform-origin").val(),
			ribbons: ribbons
		};
		if(str.name && str.dex && str.ball && str.ot && str.nature && str.origin){
			if(str.id.match(/^[0-9]{5,6}$/)){
				allpkmn = JSON.parse(localStorage.getItem("pokemon"));
				var n = allpkmn.entries.length;
				allpkmn.entries[n] = str;
				localStorage.setItem("pokemon", JSON.stringify(allpkmn));
				addRow(str, n);
				$.modal.close();
				resetForm();
			} else {
				alert("The ID No. can only be five or six numbers.");
			}
		} else {
			alert("One or more fields has not been filled.");
		}
	});
	$("#pokeform-edit").click(function(){
		var ribbons = [];
		$("#all-ribbons input:checked").each(function(){
			ribbons.push($(this).attr("id"));
		});
		var species = $("#pokeform-species").val();
		var gender = "male";
		if(onlyU.includes(species)){
			gender = "unknown";
		} else if(onlyF.includes(species) || $("#pokeform-gender-checkbox").prop("checked")){
			gender = "female";
		}
		var str = {
			name: $("#pokeform-nickname").val(),
			dex: species,
			shiny: $("#pokeform-shiny-checkbox").prop("checked"),
			gender: gender,
			ball: $("#pokeform-ball").val(),
			ot: $("#pokeform-ot").val(),
			id: $("#pokeform-idno").val(),
			nature: $("#pokeform-nature").val(),
			mint: $("#pokeform-mint").val(),
			origin: $("#pokeform-origin").val(),
			ribbons: ribbons
		};
		if(str.name && str.dex && str.ball && str.ot && str.nature && str.origin){
			if(str.id.match(/^[0-9]{5,6}$/)){
				allpkmn = JSON.parse(localStorage.getItem("pokemon"));
				var n = $("#pokeform-edit").attr("pokemon");
				allpkmn.entries[n] = str;
				localStorage.setItem("pokemon", JSON.stringify(allpkmn));
				clearTable(allpkmn);
				$.modal.close();
				resetForm();
			} else {
				console.log(str.id);
				alert("The ID No. can only be five or six numbers.");
			}
		} else {
			alert("One or more fields has not been filled.");
		}
	});
	$("#pokeform-cancel").click(function(){
		if(confirm("Are you sure? All of the data you've entered will be lost!")){
			$.modal.close();
			resetForm();
		}
	});
});
