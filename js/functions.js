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
		if($(this).attr("id") !== "add-gender" && $(this).attr("id") !== "add-mint") $(this).find("option:disabled").prop("selected", "selected").change();
	});
	$("#add-mint").val("None");
	$("#add-preview, #add-preball").attr("src", "img/1x1.png");
	$("#add-origin").parent().attr("class", "");
	lockGender();
	$(".edit-btns").hide();
	$(".add-btns").show();
	$("#addnewpkmn .button.finishedit").removeAttr("pokemon");
	$(".editing").removeClass("editing");
	$("#backup, #restore").removeClass("disabled");
	$("#restore input").removeAttr("disabled");
}

function editPkmn(id){
	if($(".edit, .delete").hasClass("disabled")){
		alert("You can't edit a Pokémon while adding or editing another!");
	} else {
		$(".edit, .delete, #backup, #restore").addClass("disabled");
		$("#restore input").attr("disabled", "disabled");
		$(".edit-btns").show();
		$(".add-btns").hide();
		$("#addnewpkmn .button.finishedit").attr("pokemon", id);
		$("tr[pokemon="+id+"]").addClass("editing");
		allpkmn = JSON.parse(localStorage.getItem("pokemon"));
		var pkmn = allpkmn.entries[id];
		$("#add-name").val(pkmn.name);
		$("#add-dex").val(pkmn.dex).change();
		if(pkmn.shiny) $("#add-shiny").prop("checked", "checked").change();
		$("#add-gender").val(pkmn.gender).change();
		if(pkmn.gender === "female") $("#add-gender-toggle").attr("src", "img/gender/female.png");
		$("#add-ball").val(pkmn.ball);
		$("#add-trainer").val(pkmn.ot);
		$("#add-id").val(pkmn.id);
		$("#add-nature").val(pkmn.nature);
		$("#add-mint").val((pkmn.mint || "None"));
		$("#add-origin").val(pkmn.origin);
		addPreviews();
		toggleNew();
	}
}

function deletePkmn(id){
	if($(".ribbons .button").hasClass("disabled")){
		alert("You can't delete a Pokémon while adding or editing one!");
	} else {
		var name = $("tr[pokemon="+id+"]").find("td:nth(0)").text();
		if(confirm("Are you sure? All of " + name + "'s data will be permanently erased!")){
			allpkmn = JSON.parse(localStorage.getItem("pokemon"));
			delete allpkmn.entries[id];
			allpkmn.entries = allpkmn.entries.filter(Boolean);
			localStorage.setItem("pokemon", JSON.stringify(allpkmn));
			clearTable(allpkmn);
		}
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
		ribbons = ribbons + "<img class='" + rCode + "' src='img/ribbons/" + rCode + ".png' alt='" + rName + rDesc + "' title='" + rName + rDesc + "'>";
	}

	$("#addnewpkmn").before("<tr pokemon='" + i + "'><td><b>" + pkmn.name + "</b></td><td>" + shinyMark + "<img src='img/pkmn/" + shinyDir + femaleDir + pkmn.dex + ".png' class='sprite-mon'><img src='img/gender/"+pkmn.gender+".png' class='gender'></td><td><img src='img/balls/" + pkmn.ball + ".png'></td><td>" + pkmn.ot + "</td><td>" + pkmn.id + "</td><td>" + pkmn.nature + mintImg + "</td><td class='"+gameInfo(pkmn.origin, true)+"'>" + gameInfo(pkmn.origin, false) + "</td><td class='ribbons'><div class='ribbons-list'>" + ribbons + "</div></td><td><div class='button edit' onclick='editPkmn("+i+")'>Edit</div> <div class='button delete' onclick='deletePkmn("+i+")'>Delete</div></td></tr>");
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
		$(".edit, .delete, #backup, #restore").addClass("disabled");
		$("#restore input").attr("disabled", "disabled");
	});
	$("#addnewpkmn .button.canceladd").click(function(){
		if(confirm("Are you sure? All of the data you've entered will be lost!")){
			$(".edit, .delete").removeClass("disabled");
			toggleNew();
			resetForm();
		}
	});
	$("#addnewpkmn .button.canceledit").click(function(){
		if(confirm("Are you sure? All of your edits will be lost!")){
			$(".edit, .delete").removeClass("disabled");
			toggleNew();
			resetForm();
		}
	});
	$("#add-dex, #add-ball, #add-origin").change(function(){
		addPreviews();
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
	$("#add-gender-toggle").click(function(){
		switchGender();
	});
	$("#add-shiny-toggle").click(function(){
		toggleCheck("add-shiny");
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
			mint: $("#add-mint").val(),
			origin: $("#add-origin").val(),
			ribbons: []
		};
		if(str.name && str.dex && str.ball && str.ot && !isNaN(str.id) && str.nature && str.origin && str.id.match(/[0-9]{5,6}/)){
			allpkmn = JSON.parse(localStorage.getItem("pokemon"));
			var n = allpkmn.entries.length;
			allpkmn.entries[n] = str;
			localStorage.setItem("pokemon", JSON.stringify(allpkmn));
			addRow(str, n);
			$(".edit, .delete").removeClass("disabled");
			toggleNew();
			resetForm();
		}
	});
	$("#addnewpkmn .button.finishedit").click(function(){
		var str = {
			name: $("#add-name").val(),
			dex: $("#add-dex").val(),
			shiny: $("#add-shiny").prop("checked"),
			gender: $("#add-gender").val(),
			ball: $("#add-ball").val(),
			ot: $("#add-trainer").val(),
			id: $("#add-id").val(),
			nature: $("#add-nature").val(),
			mint: $("#add-mint").val(),
			origin: $("#add-origin").val(),
			ribbons: []
		};
		if(str.name && str.dex && str.ball && str.ot && !isNaN(str.id) && str.nature && str.origin && str.id.match(/[0-9]{5,6}/)){
			allpkmn = JSON.parse(localStorage.getItem("pokemon"));
			var n = $("#addnewpkmn .button.finishedit").attr("pokemon");
			allpkmn.entries[n] = str;
			localStorage.setItem("pokemon", JSON.stringify(allpkmn));
			clearTable(allpkmn);
			toggleNew();
			resetForm();
		}
	});
});
