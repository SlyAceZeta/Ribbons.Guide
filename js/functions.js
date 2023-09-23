var filterInReset = false;

function getData(dex, field, search = false){
	var thisPkmn = pokemon[dex];
	if(pokemon[dex]){
		var data = thisPkmn[field];
		if(typeof data === "undefined"){
			if(!search && thisPkmn["data-source"]){
				thisPkmn = pokemon[thisPkmn["data-source"]];
				data = thisPkmn[field];
			} else {
				data = false;
			}
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
	} else if(genderCheck === "female" || (genderCheck === "both" && $("#pokeform-gender-female").prop("checked"))){
		gender = "female";
	}
	var box = $("#pokeform-box").val();
	if(box == -1){
		box = null;
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
		shiny: $("input[name='pokeform-shiny']:checked").val(),
		gender: gender,
		ball: $("#pokeform-ball").val(),
		title: $("#pokeform-title").val(),
		level: $("#pokeform-level").val(),
		scale: $("#pokeform-scale").prop("checked"),
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
		box: box,
		ribbons: ribbons,
		notes: $("#pokeform-notes").val()
	};
	if(str.dex && str.ball && str.origin && str.title && str.level && str.lang){
		if(!str.id || str.id.match(/^[0-9]{1,6}$/)){
			if(parseInt(str.level) > 0 && parseInt(str.level) < 101){
				if(!str.metlevel || parseInt(str.metlevel) <= parseInt(str.level)){
					allpkmn = JSON.parse(localStorage.getItem("pokemon"));
					var n = (edit) ? $("#pokeform-edit").attr("data-editing") : allpkmn.entries.length;
					allpkmn.entries[n] = str;
					localStorage.setItem("pokemon", JSON.stringify(allpkmn));
					if(edit){
						clearTable(allpkmn);
					} else {
						addRow(str, n);
					}
					$.modal.close();
				} else {
					alert("The Pokémon's current level cannot be lower than the level you met it.");
				}
			} else {
				alert("The Pokémon's level must be a number from 1 to 100.");
			}
		} else {
			alert("The ID No. must be a number with one to six digits.");
		}
	} else {
		alert("One or more required fields in the Summary tab has not been filled.");
	}
}

function createBox(edit = false){
	var name = $("#boxform-name").val().trim();
	if(name){
		var allboxes = JSON.parse(localStorage.getItem("boxes"));
		var n = (edit) ? $("#boxform-edit").attr("data-editing") : allboxes.entries.length;
		allboxes.entries[n] = name;
		localStorage.setItem("boxes", JSON.stringify(allboxes));
		if(edit){
			clearBoxes(allboxes);
			boxSortDialog();
		} else {
			addBox(name, n);
			boxSortDialog();
		}
		$.modal.close();
	} else {
		alert("A name is required.");
	}
}

function saveBackup(){
	var data = localStorage.getItem("pokemon");
	var boxData = localStorage.getItem("boxes");
	if(boxData){
		data = data + "," + boxData;
	}
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
		var allboxes = JSON.parse(localStorage.getItem("boxes"));
		if((!allpkmn || allpkmn.entries.length === 0) && (!allboxes || allboxes.entries.length === 0)){
			proc = true;
		} else {
			if(confirm("Are you sure you want to replace all of the current data with " + filename + "? You can't reverse this decision!")){
				proc = true;
			}
		}
		if(proc){
			var pos = contents.indexOf(",{\"entries\":["), allpkmn, allboxes;
			if(pos > -1){
				allpkmn = JSON.parse(contents.substring(0, pos));
				allboxes = JSON.parse(contents.substring(pos+1));
				allboxes.entries = allboxes.entries.filter(Boolean);
			} else {
				allpkmn = JSON.parse(contents);
				allboxes = { "entries": [] };
			}
			allpkmn.entries = allpkmn.entries.filter(Boolean);
			localStorage.setItem("pokemon", JSON.stringify(allpkmn));
			localStorage.setItem("boxes", JSON.stringify(allboxes));
			clearTable(allpkmn);
			clearBoxes(allboxes);
		}
	}
	reader.readAsText(file);
}

function changeTheme(t){
	localStorage.setItem("theme", t);
	$("body").attr({ class: "theme-" + t, theme: t });
}

function changeLang(l, set = true){
	if(set) localStorage.setItem("language", l);
	$("html, body").attr("lang", languages[l].iso);
}

function resetForm(){
	$(".pokeform-tab1-ctrl").click();
	$("#pokeform input, #boxform input").each(function(){
		if($(this).attr("type") === "text" || $(this).attr("type") === "number" || $(this).attr("type") === "date"){
			$(this).val("");
		} else if($(this).attr("type") === "checkbox"){
			$(this).prop("checked", false);
		}
	});
	$("#pokeform select").each(function(){
		if($(this).attr("id") === "pokeform-mint" || $(this).attr("id") === "pokeform-title"){
			$(this).val("None").trigger("change");
		} else if($(this).attr("id") == "pokeform-box"){
			$(this).val(-1).trigger("change");
		} else {
			$(this).val(null).trigger("change");
		}
	});
	$("#pokeform-shiny-none").prop("checked", true).change();
	$("#pokeform-gender-male").prop("checked", true).change();
	$("#pokeform-notes").val("");
	$("#pokeform-add, #pokeform-header-add, #boxform-add, #boxform-header-add").show();
	$("#pokeform-edit, #boxform-edit").hide().removeAttr("data-editing");
	$("#pokeform-header-edit, #boxform-header-edit").hide();
	$("#pokeform-preview img").attr("src", "img/ui/1x1.svg");
}

function confirmFormClose(){
	if(confirm("Are you sure you wish to cancel? All of your changes will be lost!")) $.modal.close();
}

function editPkmn(id){
	allpkmn = JSON.parse(localStorage.getItem("pokemon"));
	var pkmn = allpkmn.entries[id];
	for(var r in pkmn.ribbons) $("#" + pkmn.ribbons[r]).prop("checked", "checked").change();
	$("#pokeform-add, #pokeform-header-add").hide();
	$("#pokeform-header-edit").show();
	$("#pokeform-edit").show().attr("data-editing", id);
	$("#pokeform-nickname").val(pkmn.name);
	$("#pokeform-species").val(pkmn.dex).change();
	if(pkmn.shiny){
		var shinyType = (pkmn.shiny === "square") ? "square" : "star";
		$("#pokeform-shiny-" + shinyType).prop("checked", true).change();
	}
	if(pkmn.gender === "female") $("#pokeform-gender-female").prop("checked", true).change();
	$("#pokeform-ball").val(pkmn.ball).change();
	if(pkmn.scale) $("#pokeform-scale").prop("checked", true).change();
	if(pkmn.title) $("#pokeform-title").val(pkmn.title).change();
	if(pkmn.ability) $("#pokeform-ability").val(pkmn.ability).change();
	if(pkmn.level) $("#pokeform-level").val(pkmn.level);
	if(pkmn.metlevel) $("#pokeform-metlevel").val(pkmn.metlevel);
	if(pkmn.metdate) $("#pokeform-metdate").val(pkmn.metdate);
	if(pkmn.characteristic) $("#pokeform-characteristic").val(pkmn.characteristic).change();
	if(pkmn.lang) $("#pokeform-lang").val(pkmn.lang).change();
	if(pkmn.box || pkmn.box == 0) $("#pokeform-box").val(pkmn.box).change();
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
	var name = $(".pokemon-list-entry[data-pokemon="+id+"]").find(".pokemon-list-name").text();
	if(confirm("Are you sure? All of " + name + "'s data will be permanently erased!")){
		allpkmn = JSON.parse(localStorage.getItem("pokemon"));
		delete allpkmn.entries[id];
		allpkmn.entries = allpkmn.entries.filter(Boolean);
		localStorage.setItem("pokemon", JSON.stringify(allpkmn));
		clearTable(allpkmn);
	}
}

function boxSortDialog(popup = false){
	var allboxes = JSON.parse(localStorage.getItem("boxes"));
	if(allboxes.entries.length){
		var html = "";
		for(let i in allboxes.entries){
			html = html + "<div data-sortnum='"+i+"'><span>" + allboxes.entries[i] + "</span><span><button onclick='editBox("+i+")'><img src='img/ui/edit.svg' alt='Edit'></button><button onclick='deleteBox("+i+")'><img src='img/ui/delete.svg' alt='Delete'></button></span></div>";
		}
		$("#boxsort-boxes").html(html);
	} else {
		$("#boxsort-boxes").html("You don't have any boxes!");
	}
	if(popup) showModal("boxsort");
}

function deleteBox(id){
	var allboxes = JSON.parse(localStorage.getItem("boxes"));
	var name = allboxes.entries[id];
	if(confirm("Are you sure? All of the Pokémon in " + name + " will become unsorted.")){
		delete allboxes.entries[id];
		allboxes.entries = allboxes.entries.filter(Boolean);
		localStorage.setItem("boxes", JSON.stringify(allboxes));
		var allpkmn = JSON.parse(localStorage.getItem("pokemon"));
		for(let i in allpkmn.entries){
			if(allpkmn.entries[i].box || allpkmn.entries[i].box == 0){
				if(allpkmn.entries[i].box == id){
					allpkmn.entries[i].box = null;
				} else if(allpkmn.entries[i].box > id){
					if(allpkmn.entries[i].box == (id+1)){
						allpkmn.entries[i].box = id;
					} else {
						allpkmn.entries[i].box = allpkmn.entries[i].box - 1;
					}
				}
			}
		}
		localStorage.setItem("pokemon", JSON.stringify(allpkmn));
		clearTable(allpkmn);
		clearBoxes(allboxes);
		boxSortDialog();
	}
}

function ribbonGuide(id){
	allpkmn = JSON.parse(localStorage.getItem("pokemon"));
	var pkmn = allpkmn.entries[id];
	var name = $(".pokemon-list-entry[data-pokemon="+id+"] .pokemon-list-name").text();
	var title = $(".pokemon-list-entry[data-pokemon="+id+"] .pokemon-list-entry-header-right").text();
	if(pkmn.currentgame){
		if(pkmn.level){
			// info header
			var img = $(".pokemon-list-entry[data-pokemon="+id+"] .pokemon-list-entry-center img").attr("src");
			$("#ribbonguide-info img").attr("src", img);
			$("#ribbonguide .name").text(name);
			$("#ribbonguide-info .name").text(name + " " + title);
			$("#ribbonguide .level").text(pkmn.level);
			if(pkmn.metlevel) $("#ribbonguide .metlevel").text(" (met at "+pkmn.metlevel+")");
			$("#ribbonguide .game").text(games[pkmn.currentgame].name);
			$("#ribbonguide .metgame").text(" (met in "+games[pkmn.origin].name+")");

			// get current and future gens
			var curGen = parseInt(games[pkmn.currentgame].gen);
			var gensLeft = [];
			var virtualConsole = false;
			if(curGen < 3){
				virtualConsole = true;
				curGen = 7;
			} else if(pkmn.currentgame == "go" || pkmn.currentgame == "scar" || pkmn.currentgame == "vio"){
				curGen = 8;
			}
			for(let g in terms.gens){
				var gen = parseInt(g);
				if(gen){
					if(gen >= curGen){
						gensLeft.push(gen);
					} else {
						// hide gens earlier than current
						$("#ribbonguide-transfer-" + g).hide();
					}
				}
			}
			// get compatible games and more info
			var pkmnGames = getData(pkmn.dex, "games");
			var isMythical = getData(pkmn.dex, "mythical");
			var evoWarnMon = getData(pkmn.dex, "evowarnmon", true);
			var evoWarnGen = getData(pkmn.dex, "evowarngen", true);
			var noWarnings = true;
			var noRibbons = true;

			if(pkmn.dex === "marowak-alola" || pkmn.dex === "ribombee" || pkmn.dex === "araquanid" || pkmn.dex === "togedemaru"){
				// Totem-sized versions of these four cannot leave USUM
				if((pkmn.origin === "usun" || pkmn.origin === "umoon") && (pkmn.currentgame === "usun" || pkmn.currentgame === "umoon")){
					noWarnings = false;
					$("#ribbonguide-totem").html("If " + name + " is a Totem-sized Pokémon, " + name + " cannot leave " + terms.gens[7] + ".");
				}
			}

			for(var ribbon in allRibbons){
				if(pkmn.ribbons.indexOf(ribbon) == -1){
					// Ribbon not earned
					// check for Legendary and Mythical restrictions
					if(!(allRibbons[ribbon].banned && allRibbons[ribbon].banned.indexOf(pkmn.dex) > -1) && !(allRibbons[ribbon].nomythical && isMythical)){
						// prepare to add to guide
						var ribbonAddToGens = [];

						// check for per-game availability
						for(var ribbonGameKey in allRibbons[ribbon].available){
							var ribbonGame = allRibbons[ribbon].available[ribbonGameKey];
							var gameGen = parseInt(games[ribbonGame]["gen"]);
							if(gameGen && ribbonAddToGens.indexOf(gameGen) == -1 && gensLeft.indexOf(gameGen) > -1){
								// Ribbon has not been added to this gen yet
								// and Pokemon is in this game's gen or will be later
								// check if Pokemon can be sent to this game
								if(pkmnGames.indexOf(ribbonGame) > -1 && !((pkmn.currentgame == "lgp" || pkmn.currentgame == "lge") && gameGen == 7)){
									// now check for special Ribbon restrictions
									var specialEarn = false;
									if(pkmn.dex === "nincada"){
										// Nincada from BDSP cannot earn SwSh Ribbons
										if(pkmn.origin === "bd" || pkmn.origin === "sp"){
											if(ribbonGame !== "sw" && ribbonGame !== "sh"){
												specialEarn = true;
											}
										// Nincada not from BDSP cannot earn BDSP Ribbons
										} else if(ribbonGame !== "bd" && ribbonGame !== "sp"){
											specialEarn = true;
										}
									} else if(pkmn.dex === "spinda"){
										// Spinda cannot enter or leave BDSP
										// the only Gen VIII/IX game Spinda can originate from is BDSP, so we can just check the generations of Spinda and the Ribbon
										if(games[pkmn.origin].gen == 8 && gameGen == 8){
											specialEarn = true;
										} else if(games[pkmn.origin].gen !== 8 && gameGen !== 8){
											specialEarn = true;
										}
									} else if(ribbon.indexOf("contest-memory-ribbon") == 0 || ribbon.indexOf("battle-memory-ribbon") == 0){
										// Pokemon originating in Gen V or Virtual Console cannot have these Ribbons
										if(games[pkmn.origin].gen < 5 && games[pkmn.origin].gen > 2){
											// only show blue if gold is not obtained, and vice versa
											if(ribbon == "contest-memory-ribbon" && pkmn.ribbons.indexOf("contest-memory-ribbon-gold") == -1){
												specialEarn = true;
											} else if(ribbon == "contest-memory-ribbon-gold" && pkmn.ribbons.indexOf("contest-memory-ribbon") == -1){
												specialEarn = true;
											} else if(ribbon == "battle-memory-ribbon" && pkmn.ribbons.indexOf("battle-memory-ribbon-gold") == -1){
												specialEarn = true;
											} else if(ribbon == "battle-memory-ribbon-gold" && pkmn.ribbons.indexOf("battle-memory-ribbon") == -1){
												specialEarn = true;
											}
										}
									} else if(ribbon == "winning-ribbon"){
										if(parseInt(pkmn.level) < 51){
											specialEarn = true;
											noWarnings = false;
											$("#ribbonguide-winning").html("Leveling " + name + " above Lv.50 will make the Winning Ribbon unavailable!");
										}
									} else if(ribbon == "national-ribbon"){
										if(pkmn.origin == "colosseum" || pkmn.origin == "xd"){
											specialEarn = true;
										}
									} else if(ribbon == "footprint-ribbon"){
										var metLevel = 0;
										if(pkmn.metlevel) metLevel = parseInt(pkmn.metlevel);
										var metNote = false;
										if(gameGen == 4){
											// all Gen IV Pokemon can earn this through friendship
											specialEarn = true;
											// if this block is running, this Pokemon is either in or before Gen IV
											// so check the later two conditions for potential failure
											if(!getData(pkmn.dex, "voiceless") && parseInt(pkmn.level) < 71){
												// add preliminary warning about leveling up and leaving Gen IV
												noWarnings = false;
												$("#ribbonguide-footprint").html("Leveling " + name + " above Lv.70 will make the Footprint Ribbon exclusive to "+terms.gens[4]+"!");
											}
										} else if(getData(pkmn.dex, "voiceless") && gameGen == 8){
											// voiceless Pokemon can still earn this in BDSP
											specialEarn = true;
										} else {
											// voiced Pokemon can earn this in all other games with a met level below 71
											// however, met level changes if transferred to Gen V
											if(curGen < 5){
												if(parseInt(pkmn.level) < 71){
													specialEarn = true;
												} // else it will appear exclusive to Gen IV as per above
											} else {
												// we're not in Gen IV anymore, Toto
												if(metLevel > 0 && metLevel < 71){
													// met level has changed (or Pokemon was caught in Gen V+), so let's check it
													specialEarn = true;
												} else if(virtualConsole && !getData(pkmn.dex, "voiceless")){
													// Met Level also changes if transferred out of Virtual Console
													// if it's a voiced Pokemon, warn the user like above
													specialEarn = true;
													noWarnings = false;
													$("#ribbonguide-footprint").html("Leveling " + name + " above Lv.70 will make the Footprint Ribbon unavailable!");
												} else if(metLevel == 0){
													// if the Pokemon is Lv70 or below in Gen V+, outside of Virtual Console, then its Met Level must be Lv70 or below
													// if the Pokemon came from GO, its Met Level must be Lv50 or below
													if(parseInt(pkmn.level) < 71 || pkmn.origin === "go"){
														specialEarn = true;
													} else {
														// otherwise, warn the user
														noWarnings = false;
														$("#ribbonguide-notice").html(name + "'s Met Level has not been set. The availability of the Footprint Ribbon after "+terms.gens[4]+" cannot be determined.");
													}
												}
											}
										}
									} else if(ribbon == "tower-master-ribbon"){
										if(isMythical || allRibbons["ability-ribbon"].banned.indexOf(pkmn.dex) > -1){
											if(ribbonGame == "sw" || ribbonGame == "sh"){
												specialEarn = true;
											}
										} else {
											specialEarn = true;
										}
									} else if(ribbon == "jumbo-mark"){
										if(pkmn.ribbons.indexOf("mini-mark") == -1 && !pkmn.scale){
											specialEarn = true;
										}
									} else if(ribbon == "mini-mark"){
										if(pkmn.ribbons.indexOf("jumbo-mark") == -1 && !pkmn.scale){
											specialEarn = true;
										}
									} else {
										specialEarn = true;
									}
									if(specialEarn){
										// all checks complete, add Ribbon to gen
										ribbonAddToGens.push(gameGen);
									}
								}
							}
						}
						if(ribbonAddToGens.length){
							noRibbons = false;
							// get remaining Ribbon data
							var rData = allRibbons[ribbon];
							var rFldr = "ribbons";
							if(rData["mark"]) rFldr = "marks";
							var rDesc = "";
							if(rData.descs) rDesc = rData.descs.eng;
							var optClass = "";
							if(allRibbons[ribbon].optional){
								if(ribbon == "jumbo-mark" || ribbon == "mini-mark"){
									if(!pkmn.scale){
										optClass = " ribbon-optional";
									}
								} else {
									optClass = " ribbon-optional";
								}
							}
							var rImage = "<span class='"+optClass+"'><img class='" + ribbon + "' src='img/" + rFldr + "/" + ribbon + ".png' alt=\"" + rData.names.eng + "\" title=\"" + rData.names.eng + " - " + rDesc + "\"></span>";
							// add Ribbon to each gen
							for(var i = 0; i < ribbonAddToGens.length; i++){
								var eleGen = "#ribbonguide-transfer-" + ribbonAddToGens[i];
								if(allRibbons[ribbon].optional) $(eleGen + " .ribbonguide-transfer-footer").addClass("ribbonguide-transfer-unsure");
								if(i == (ribbonAddToGens.length-1)){
									$(eleGen + " .ribbonguide-transfer-exclusive").show().append(rImage);
									if(!allRibbons[ribbon].optional) $(eleGen + " .ribbonguide-transfer-footer").addClass("ribbonguide-transfer-notready");
								} else {
									$(eleGen + " .ribbonguide-transfer-later").show().append(rImage);
								}
							}
						}
					}
				}
			}
			if(evoWarnMon && evoWarnGen){
				var testGen = curGen;
				if(pkmn.currentgame == "go") testGen = 7;
				if(testGen <= parseInt(evoWarnGen)){
					noWarnings = false;
					var evoWarnNames = getData(evoWarnMon, "names");
					var evoWarnName = evoWarnNames.eng;
					var evoWarnForms = getData(evoWarnMon, "forms");
					if(!evoWarnForms){
						evoWarnForms = getData(evoWarnMon, "forms-all");
						if(!evoWarnForms){
							var formsrc = getData(evoWarnMon, "form-source");
							if(formsrc){
								evoWarnForms = commonforms[formsrc];
							}
						}
					}
					if(evoWarnForms){
						evoWarnName = evoWarnName + " (" + evoWarnForms.eng + ")";
					}
					$("#ribbonguide-evolution").html("Evolving " + name + " into " + evoWarnName + " may change the availability of certain Ribbons!");
				}
			}
			if(noRibbons){
				$("#ribbonguide-transfer").html("<div class='ribbonguide-transfer-noneleft'>There are no more Ribbons for " + name + " to earn!</div>");
			}
			if(noWarnings){
				$("#ribbonguide-warnings").hide();
			} else {
				$("#ribbonguide-warnings").show().addClass("active");
			}
			showModal("ribbonguide");
		} else {
			alert("You need to set " + name + "'s current level to get Ribbon guidance!");
		}
	} else {
		alert("You need to set " + name + "'s current game to get Ribbon guidance!");
	}
}

function createTable(allpkmn){
	for(let i in allpkmn.entries){
		addRow(allpkmn.entries[i], i);
	}
}

function clearTable(allpkmn){
	$(".pokemon-list-entry").remove();
	createTable(allpkmn);
	filterReset();
}

function createBoxes(allboxes){
	for(let i in allboxes.entries){
		addBox(allboxes.entries[i], i);
	}
}

function clearBoxes(allboxes){
	$("#pokeform-box").empty().append(new Option("None", -1, true, true));
	$("#filterform-box").empty().append(new Option("—", -2, true, true)).append(new Option("None", -1));
	filterReset();
	createBoxes(allboxes);
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
	var pkmnGen = 100;
	if(pkmn.currentgame){
		pkmnGen = parseInt(games[pkmn.currentgame].gen);
	}
	if(pkmnGen < 3){
		pkmnGen = 7;
	} else if(pkmn.currentgame == "go"){
		pkmnGen = 8;
	}
	var compatGames = getData(pkmn.dex, "games");
	var stillCompat = [];
	if(pkmnGen < 100){
		for(var cg = 0; cg < compatGames.length; cg++){
			if(games[compatGames[cg]]){
				if(compatGames[cg] == "lgp" || compatGames[cg] == "lge"){
					if(pkmn.currentgame == "lgp" || pkmn.currentgame == "lge" || pkmn.currentgame == "go"){
						stillCompat.push(compatGames[cg]);
					}
				} else {
					var compatGen = parseInt(games[compatGames[cg]].gen);
					if(compatGen >= pkmnGen || (pkmnGen == 2 && compatGen == 1)){
						stillCompat.push(compatGames[cg]);
					}
				}
			}
		}
	}

	var shinyDir = pkmn.shiny ? "shiny/" : "regular/";
	var shinyMark = "";
	if(pkmn.shiny){
		var shinyType = (pkmn.shiny === "square") ? "square.svg" : "star.png";
		shinyMark = "<img src='img/ui/shiny-"+shinyType+"' class='shiny' alt='Shiny' title='Shiny'>";
	}

	var femaleDir = (getData(pkmn.dex, "femsprite") && pkmn.gender === "female") ? "female/" : "";

	var mint = pkmn.mint || "None";
	var mintImg = (mint !== "None") ? "<div class='mint " + natures[mint] + "'>" + mint + "</div>" : "";

	var timeLimited = ""; // data-timelimited='true'

	var ribbons = "<div class='ribbons-list-empty'>This Pokémon has no ribbons.</div>";
	var r;
	var mergeBattle = 0;
	var mergeContest = 0;
	for(r = 0; r < pkmn.ribbons.length; r++){
		var rCode = pkmn.ribbons[r];
		var rData = allRibbons[rCode];
		var rDesc = "";
		if(rData){
			var proceed = false;
			if(pkmnGen > 5 && !rData.merge){
				if(rCode == "battle-memory-ribbon"){
					if(pkmn.ribbons.indexOf("battle-memory-ribbon-gold") == -1){
						proceed = true;
						rDesc = " (" + mergeBattle + ")";
					}
				} else if(rCode == "battle-memory-ribbon-gold"){
					proceed = true;
					rDesc = " (" + mergeBattle + ")";
				} else if(rCode == "contest-memory-ribbon"){
					if(pkmn.ribbons.indexOf("contest-memory-ribbon-gold") == -1){
						proceed = true;
						rDesc = " (" + mergeContest + ")";
					}
				} else if(rCode == "contest-memory-ribbon-gold"){
					proceed = true;
					rDesc = " (" + mergeContest + ")";
				} else {
					proceed = true;
				}
			} else if(pkmnGen > 5 && rData.merge){
				if(rData.merge == "battle") mergeBattle++;
				if(rData.merge == "contest") mergeContest++;
			} else {
				proceed = true;
			}
			if(proceed){
				var rName = rData["names"]["eng"];
				if(rData["descs"]) rDesc = rDesc + " - " + rData["descs"]["eng"];
				var rFldr = "ribbons";
				if(rData["mark"]) rFldr = "marks";
				ribbons = ribbons + "<img class='" + rCode + "' src='img/" + rFldr + "/" + rCode + ".png' alt=\"" + rName + "\" title=\"" + rName + rDesc + "\">";
			}
		}
	}

	var gender = pkmn.gender, genderimg = "";
	if(gender !== "unknown"){
		gender = pkmn.gender.charAt(0).toUpperCase() + pkmn.gender.slice(1);
		genderimg = "<img src='img/gender/" + pkmn.gender + ".png' class='gender' alt=\"" + gender + "\" title=\"" + gender + "\">";
	}

	var origin = games[pkmn.origin]["mark"];
	if(origin){
		origin = "<img src='img/origins/" + origin + ".png' class='pokemon-list-origin' alt=\"" + games[pkmn.origin]["name"] + "\" title=\"" + games[pkmn.origin]["name"] + "\">";
	} else {
		origin = "<img src='img/ui/1x1.svg' class='pokemon-list-origin' alt='No Origin Mark'>";
	}

	var titleBon = pkmn.title || "None";
	var titleDir = "ribbons";
	var title = "";
	if(titleBon !== "None"){
		if(titleBon.indexOf("-mark") > 0) titleDir = "marks";

		title = "<img src='img/" + titleDir + "/" + titleBon + ".png' alt=\""+allRibbons[titleBon]["names"]["eng"]+"\"><span>" + allRibbons[titleBon]["titles"]["eng"] + "</span>";
	}

	var lang = pkmn.lang;
	if(!lang) lang = "???";
	if(lang === "SPA") lang = "SP-EU";
	var level = pkmn.level;
	if(!level) level = "???";

	var name = pkmn.name;
	if(name.length === 0){
		var namelang = pkmn.lang;
		if(!namelang) namelang = "ENG";
		namelang = namelang.toLowerCase();
		name = getData(pkmn.dex, "names")[namelang];
	}

	var ballName = balls[pkmn.ball];
	if(ballName){
		ballName = ballName["eng"];
	} else {
		ballName = hisuiballs[pkmn.ball]["eng"];
	}

	// TODO: make boxes a global variable to avoid having to pull them every time a Pokemon is generated
	var boxID = pkmn.box;
	var boxLabel = "";
	var allboxes = localStorage.getItem("boxes");
	if(!allboxes){
		allboxes = { "entries": [] }; // handle potential race condition
	}
	allboxes = JSON.parse(allboxes);
	if((boxID || boxID == 0) && allboxes.entries[boxID]){
		boxLabel = "<img class='pokemon-list-box-icon' src='img/ui/box-closed.png'><span class='pokemon-list-box-name'>" + allboxes.entries[boxID] + "</span>";
		boxID = " data-box='" + boxID + "'";
	} else {
		boxID = " data-box='-1'";
	}
	$("#pokemon-list").append("<div class='pokemon-list-entry' data-natdex='" + getData(pkmn.dex, "natdex") + "' data-ball='" + pkmn.ball + "' data-name='" + name + "' data-gender='" + gender + "' data-level='" + level + "' data-shiny='" + pkmn.shiny + "' data-lang='" + lang + "' data-origin='" + pkmn.origin + "' data-currentgame='" + pkmn.currentgame + "' data-compatgames='" + stillCompat.join(" ") + "' data-pokemon='" + i + "'" + boxID + timeLimited + "><div class='pokemon-list-entry-header'><div class='pokemon-list-entry-header-left'><img src='img/balls/" + pkmn.ball + ".png' alt=\"" + ballName + "\" title=\"" + ballName + "\"><span class='pokemon-list-name'>" + name + "</span>" + genderimg + shinyMark + "</div><div class='pokemon-list-entry-header-right'>"+title+"</div></div><div class='pokemon-list-entry-center'><img src='img/pkmn/" + shinyDir + femaleDir + pkmn.dex + ".png' alt=\"" + name + "\"><div class='ribbons-list'>" + ribbons + "</div></div><div class='pokemon-list-entry-footer'><div class='pokemon-list-entry-footer-left'><span class='pokemon-list-level'>Lv.&nbsp;"+level+"</span><span class='pokemon-list-lang-wrapper'><span class='pokemon-list-lang'>"+lang+"</span></span>" + origin + boxLabel + "</div><div class='pokemon-list-entry-footer-right'><button class='pokemon-list-move'><img src='img/ui/move.svg' alt=\"Reorder " + name + "\" title=\"Reorder " + name + "\"></button><button class='pokemon-list-guide' onclick='ribbonGuide("+i+")'><img src='img/ui/clipboard.png' alt='Ribbons' title=\"" + name + "'s Ribbon Guide\"></button><button class='pokemon-list-edit' onclick='editPkmn("+i+")'><img src='img/ui/edit.svg' alt=\"Edit " + name + "\" title=\"Edit " + name + "\"></button><button class='pokemon-list-delete' onclick='deletePkmn("+i+")'><img src='img/ui/delete.svg' alt=\"Delete " + name + "\" title=\"Delete " + name + "\"></button></div></div></div>");
}

function filterPkmn(filters){
	var filterTypes = Object.keys(filters), filterType = "", filterVal = 0;
	var toShow = $(".pokemon-list-entry");
	var filterNum = 0;
	var filterLevel = false;
	for(let ft = 0; ft < filterTypes.length; ft++){
		filterType = filterTypes[ft];
		filterVal = filters[filterType];
		if(filterVal && filterVal !== "-2"){
			if(filterType == "box"){
				filterNum++;
				toShow = toShow.filter(function(i, e){
					return e.dataset.box == filterVal;
				});
			} else if(filterType == "gender"){
				filterNum++;
				toShow = toShow.filter(function(i, e){
					return e.dataset.gender == filterVal;
				});
			} else if(filterType == "ball"){
				filterNum++;
				toShow = toShow.filter(function(i, e){
					return e.dataset.ball == filterVal;
				});
			} else if(filterType == "lang"){
				filterNum++;
				toShow = toShow.filter(function(i, e){
					return e.dataset.lang == filterVal;
				});
			} else if(filterType == "origin"){
				filterNum++;
				toShow = toShow.filter(function(i, e){
					return e.dataset.origin == filterVal;
				});
			} else if(filterType == "currentgame"){
				filterNum++;
				toShow = toShow.filter(function(i, e){
					return e.dataset.currentgame == filterVal;
				});
			} else if(filterType == "level-min"){
				if(!filterLevel){
					filterLevel = true;
					filterNum++;
				}
				toShow = toShow.filter(function(i, e){
					return Number(e.dataset.level) >= Number(filterVal);
				});
			} else if(filterType == "level-max"){
				if(!filterLevel){
					filterLevel = true;
					filterNum++;
				}
				toShow = toShow.filter(function(i, e){
					return Number(e.dataset.level) <= Number(filterVal);
				});
			} else if(filterType == "shiny"){
				filterNum++;
				toShow = toShow.filter(function(i, e){
					// backwards compatibility with old data where shiny="true" not "star"
					if(filterVal == "Star" && e.dataset.shiny.length && e.dataset.shiny !== "square"){
						return true;
					} else if(filterVal == "Square" && e.dataset.shiny == "square"){
						return true;
					} else if(filterVal == "Normal" && e.dataset.shiny == ""){
						return true;
					} else {
						return false;
					}
				});
			} else if(filterType == "games" && filterVal.length){
				filterNum++;
				var compatgames = [];
				toShow = toShow.filter(function(i, e){
					var compatible = true;
					compatgames = e.dataset.compatgames.split(" ");
					for(let fg = 0; fg < filterVal.length; fg++){
						if(compatgames.indexOf(filterVal[fg]) == -1){
							compatible = false;
							break;
						}
					}
					return compatible;
				});
			}
		}
	}
	filterBubble(filterNum);
	if(toShow.length){
		$("#pokemon-list-nomatch, .pokemon-list-entry").hide();
		toShow.show();
	} else {
		if($(".pokemon-list-entry").length){
			$(".pokemon-list-entry").hide();
			$("#pokemon-list-nomatch").show();
		}
	}
}

function filterReset(){
	filterInReset = true;
	$("#filterform select[id!='filterform-games'][id!='filterform-sort']").val(-2).change();
	$("#filterform-games, #filterform-level-min, #filterform-level-max").val("").change();
	if($("#filterform-sort").val() != "default"){
		$("#filterform-sort").val("default").change();
	}
	filterPkmn({});
	filterInReset = false;
}

function sortPkmn(type){
	if(type == "default"){
		$("#pokemon-list").sortable("enable");
		var allpkmn = JSON.parse(localStorage.getItem("pokemon"));
		clearTable(allpkmn);
	} else {
		$("#pokemon-list").sortable("disable");
		var pkmnlist = Array.from($(".pokemon-list-entry"));
		var comparison;
		if(type == "levelasc"){
			comparison = function(a, b){
				return a.dataset.level - b.dataset.level;
			}
		} else if(type == "leveldesc"){
			comparison = function(a, b){
				return b.dataset.level - a.dataset.level;
			}
		} else if(type == "nameasc"){
			comparison = function(a, b){
				return a.dataset.name.toLowerCase().localeCompare(b.dataset.name.toLowerCase());
			}
		} else if(type == "namedesc"){
			comparison = function(a, b){
				return b.dataset.name.toLowerCase().localeCompare(a.dataset.name.toLowerCase());
			}
		} else if(type == "dexasc"){
			comparison = function(a, b){
				return a.dataset.natdex - b.dataset.natdex;
			}
		} else if(type == "dexdesc"){
			comparison = function(a, b){
				return b.dataset.natdex - a.dataset.natdex;
			}
		}
		var sortedPkmn = pkmnlist.sort(comparison);
		sortedPkmn.forEach(e => $("#pokemon-list").append(e));
	}
	filterBubble($("#menu-filter-count").attr("data-filters"));
}

function filterBubble(n = ""){
	if(n == 0) n = "";
	var t = n;
	if($("#filterform-sort").val() != "default"){
		t = n + "⇵";
	}
	$("#menu-filter-count").text(t).attr("data-filters", n);
}

function addBox(box, i){
	$("#pokeform-box, #filterform-box").append(new Option(box, i));
}

function editBox(id){
	var allboxes = JSON.parse(localStorage.getItem("boxes"));
	var box = allboxes.entries[id];
	$("#boxform-name").val(box);
	$("#boxform-add, #boxform-header-add").hide();
	$("#boxform-header-edit").show();
	$("#boxform-edit").show().attr("data-editing", id);
	showModal("boxform", true);
}

function generateRibbons(){
	$("#add-ribbons").append("<div id='all-ribbons'></div>");
	for(var i in ribbonIDs){
		var showDefault = "";
		if(parseInt(ribbonIDs[i])) showDefault = " rg-active";
		$("#all-ribbons").append("<div class='ribbons-gen"+showDefault+"'><span>" + i + "</span></div><div id='ribbons-list-" + ribbonIDs[i] + "' class='ribbons-list'></div>");
		$("#pokeform-title").append("<optgroup id='pokeform-title-" + ribbonIDs[i] + "' label='" + i + "'></optgroup>");
	}
	for(let r in allRibbons){
		var rData = allRibbons[r];
		var rGen = "e";
		var rFldr = "ribbons";
		if(rData["mark"]){
			rGen = "m";
			rFldr = "marks";
		} else if(rData["available"]){
			rGen = rData["gen"];
		}
		var rDesc = "";
		if(rData["descs"]) rDesc = " - " + rData["descs"]["eng"];
		$("#ribbons-list-" + rGen).append("<input id='" + r + "' type='checkbox' form='newpkmnform' hidden><label for='"+r+"'><img class='" + r + "' src='img/" + rFldr + "/" + r + ".png' alt=\"" + rData["names"]["eng"] + "\" title=\"" + rData["names"]["eng"] + rDesc + "\"></label>");
		if(rData["titles"]) $("#pokeform-title-" + rGen).append(new Option(rData["titles"]["eng"], r));
	}
	resetRibbonGuide();
}

function resetRibbonGuide(){
	$("#ribbonguide-transfer, #ribbonguide-warnings li, #ribbonguide-info .metlevel").empty();
	for(var i in ribbonIDs){
		if(parseInt(ribbonIDs[i])){
			$("#ribbonguide-transfer").append("<div id='ribbonguide-transfer-"+ribbonIDs[i]+"'><div class='ribbonguide-transfer-exclusive' style='display:none'><div>Last chance in "+i+"</div></div><div class='ribbonguide-transfer-later' style='display:none'><div>Available later</div></div><div class='ribbonguide-transfer-footer'><span class='name'></span> is<span class='notready'> not</span> ready to leave "+i+"<span class='unsure'> after verifying special cases</span>.</div></div>");
		}
	}
}

function customMatcher(params, data){
	// fallback
	if($.trim(params.term) === ""){
		return data;
	}
    if(typeof data.text === "undefined"){
		return null;
    }

	// actual code
	var sID = data.element.parentNode.id;
	if(sID.indexOf("-mint") > 0 || sID.indexOf("-ability") > 0 || sID.indexOf("-nature") > 0 || sID.indexOf("-characteristic") > 0){
		for(var ded in data.element.dataset){
			if(data.element.dataset[ded].toUpperCase().indexOf(params.term.toUpperCase()) > -1){
				var modifiedData = $.extend({}, data, true);
				return modifiedData;
			}
		}
	} else {
		var filteredChildren = [];
		$.each(data.children, function(idx, child){
			for(var ced in child.element.dataset){
				if(child.element.dataset[ced].toUpperCase().indexOf(params.term.toUpperCase()) > -1){
					filteredChildren.push(child);
					break;
				}
			}
		});
		if(filteredChildren.length){
			var modifiedData = $.extend({}, data, true);
			modifiedData.children = filteredChildren;
			return modifiedData;
		}
	}

	// fallback
	return null;
}

function formatDropOption(o){
	var result = o._resultId || o.text;
	if(result.indexOf("pokeform-ball") > 0 || (result.indexOf("filterform-ball") > 0 && o.id != -2)){
		var $ball = $("<img src='img/balls/" + o.id + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		return $ball;
	} else if(result.indexOf("pokeform-box") > 0 || result.indexOf("filterform-box") > 0){
		var boxstate = "closed";
		if(o.id == -2) boxstate = "full";
		if(o.id == -1) boxstate = "ball";
		var $box = $("<img src='img/ui/box-" + boxstate + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		return $box;
	} else if(result.indexOf("filterform-gender") > 0 && o.id != -2 && o.id != "unknown"){
		var genderimg = "female";
		if(o.id == "Male") genderimg = "male";
		var $gender = $("<img src='img/gender/" + genderimg + ".png' class='pokedropimg'><span>" + o.text + "</span>");
		return $gender;
	} else if(result.indexOf("filterform-shiny") > 0 && o.id != -2){
		var shinyimg = "pokeball.png";
		if(o.id == "Star") shinyimg = "shiny-star.png";
		if(o.id == "Square") shinyimg = "shiny-square.svg";
		var $shiny = $("<img src='img/ui/" + shinyimg + "' class='pokedropimg origininvert'><span>" + o.text + "</span>");
		return $shiny;
	} else if(result.indexOf("pokeform-mint") > 0 || result.indexOf("pokeform-nature") > 0){
		var isMint = (o.id !== "None" && result.indexOf("pokeform-mint") > 0) ? true : false;
		var names = "", lang = "", mint = "";
		for(var oed in o.element.dataset){
			if(oed.indexOf("name") == 0){
				lang = oed.substring(4);
				if(isMint){
					mint = " " + terms["mint"][lang.toLowerCase()];
				}
				names = names + "<span class='lang " + lang.toLowerCase() + "'>" + o.element.dataset["name" + lang] + mint + "</span>";
			}
		}
		var img = "";
		if(isMint) img = "<img src='img/mints/" + natures[o.id]["img"] + ".png' class='pokedropimg'>";
		return $(img + names);
	} else if(result.indexOf("pokeform-origin") > 0 || (result.indexOf("filterform-origin") > 0 && o.id != -2)){
		var mark = games[o.id]["mark"];
		var $origin;
		if(mark){
			$origin = $("<img src='img/origins/" + mark + ".png' class='pokedropimg origininvert'><span>" + o.text + "</span>");
		} else {
			$origin = $("<img src='img/ui/1x1.svg' class='pokedropimg'><span>" + o.text + "</span>");
		}
		return $origin;
	} else if(result.indexOf("pokeform-title") > 0){
		if(o.id === "None") return $("<span>None</span>");
		var rDir = "ribbons";
		if(o.id.indexOf("-mark") > 0) rDir = "marks";
		return $("<img src='img/" + rDir + "/" + o.id + ".png' class='pokedropimg'><span>" + o.text + "</span>");
	} else if(result.indexOf("pokeform-species") > 0){
		if(o.id){
			var names = "", lang = "";
			for(var oed in o.element.dataset){
				if(oed.indexOf("name") == 0){
					lang = oed.substring(4);
					var form = "";
					if(o.element.dataset["form" + lang]){
						form = " (" + o.element.dataset["form" + lang] + ")";
					} else if(o.element.dataset["formAll"]){
						form = " (" + o.element.dataset["formAll"] + ")";
					}
					names = names + "<span class='lang " + lang.toLowerCase() + "'>" + o.element.dataset["name" + lang] + form + "</span>";
				}
			}
			return $("" + names);
		} else {
			return o.text;
		}
	} else {
		return o.text;
	}
}

function showPreview(){
	if($("#pokeform-species").val()){
		var poke = $("#pokeform-species").val();
		var shinyDir = $("input[name='pokeform-shiny']:checked").val() ? "shiny/" : "regular/";
		var femaleDir = (getData(poke, "femsprite") && $("#pokeform-gender-female").prop("checked")) ? "female/" : "";
		$("#pokeform-preview img").attr("src", "img/pkmn/" + shinyDir + femaleDir + poke + ".png");
	}
}

// On load
$(function(){
	// Set modal defaults
    $.modal.defaults.fadeDuration = 250;
	$.modal.defaults.fadeDelay = 0;
	$.modal.defaults.escapeClose = false;
	$.modal.defaults.showClose = false;

	// Reset form entries to prevent browser from storing them
	resetForm();

	// Initialize select dropdowns
	// TODO language support
	$("#pokeform-ball, #pokeform-origin, #pokeform-currentgame, #pokeform-ability, #pokeform-characteristic, #pokeform-title, #pokeform-box").select2({
		templateSelection: formatDropOption,
		templateResult: formatDropOption,
		dropdownParent: $("#pokeform"),
		width: "100%",
    	placeholder: "Select an option"
	});
	// DONE language support
	$("#pokeform-species, #pokeform-mint, #pokeform-nature").select2({
		matcher: customMatcher,
		templateSelection: formatDropOption,
		templateResult: formatDropOption,
		dropdownParent: $("#pokeform"),
		width: "100%",
    	placeholder: "Select an option"
	});
	$("#settings select, #filterform-sort").select2({
		width: "100%"
	});
	$("#filterform-games").select2({
		allowClear: true,
		placeholder: "—",
		templateSelection: formatDropOption,
		templateResult: formatDropOption,
		width: "100%"
	});
	$("#filterform-gender, #filterform-shiny").select2({
		templateSelection: formatDropOption,
		templateResult: formatDropOption,
		minimumResultsForSearch: Infinity,
		dropdownCssClass: "search-hidden",
		width: "100%"
	});
	$("#filterform-ball, #filterform-box, #filterform-lang, #filterform-origin, #filterform-currentgame").select2({
		templateSelection: formatDropOption,
		templateResult: formatDropOption,
		width: "100%"
	});

	// Load languages
	var setlang = localStorage.getItem("language");
	if(!setlang){
		setlang = "eng";
		//showModal("settings");
	}
	changeLang(setlang, false);
	$("#settings-language").change(function(){
		var curLang = $("body").attr("lang");
		var newLang = $(this).val();
		if(curLang !== languages[newLang].iso){
			changeLang(newLang);
		}
	});
	for(var l in languages){
		var lcap = l.toUpperCase();
		var curlang = (l == setlang) ? true : false;
		$("#pokeform-lang, #filterform-lang").append(new Option((lcap === "SPA" ? "SP-EU" : lcap) + " - " + languages[l].name, lcap));
		$("#settings-language").append(new Option((lcap === "SPA" ? "SP-EU" : lcap) + " - " + languages[l].name, l, curlang, curlang));
	}

	// Set footer state
	var footerState = localStorage.getItem("footerState");
	if(!footerState || footerState == "expanded"){
		$("body").removeAttr("data-footer");
	}

	// Load form data: mints and natures
	var noneNames = terms["none"];
	var noneData = "";
	for(var l in noneNames){
		noneData = noneData + " data-name-" + l + "='" + noneNames[l] + "'";
	}
	$("#pokeform-mint").append("<option value='None'" + noneData + ">None</option>").select();
	for(var n in natures){
		var names = natures[n]["names"];
		var namedata = "";
		for(var l in names){
			namedata = namedata + " data-name-" + l + "='" + names[l] + "'";
		}
		var sort = natures[n]["index"];
		sort = " data-sort='" + sort + "'";
		if(natures[n]["img"]){
			$("#pokeform-mint").append("<option value='" + n + "'" + sort + namedata + ">" + names["eng"] + " Mint</option>");
		}
		$("#pokeform-nature").append("<option value='" + n + "'" + sort + namedata + ">" + names["eng"] + "</option>");
		if(n === "Quirky"){
			var natureSort = function(a, b){
				return a.dataset.sort - b.dataset.sort;
			}
			var natureOpt = $("#pokeform-nature").find("option").get();
			natureOpt.sort(natureSort);
			for(var z = 0; z < natureOpt.length; z++){
				natureOpt[z].parentNode.appendChild(natureOpt[z]);
			}
		}
	}

	// Load form data: games
	for(var g in games){
		var newGame = new Option(games[g]["name"], g);
		if(g == "home" || g == "bank" || g == "bank7"){
			$("#pokeform-currentgame-storage, #filterform-currentgame-storage").append(newGame);
		} else {
			var gGen = games[g]["gen"];
			// GO: Pokemon cannot move there
			var destination = ", #filterform-games-" + gGen;
			if(g == "go"){
				destination = "";
			}
			$("#pokeform-origin-" + gGen + ", #pokeform-currentgame-" + gGen + ", #filterform-origin-" + gGen + ", #filterform-currentgame-" + gGen + destination).append(newGame);
		}
	}

	// Load form data: Poké Balls
	for(var b in balls){
		$("#pokeform-ball-standard, #filterform-ball-standard").append(new Option(balls[b]["eng"], b));
	}
	for(var hb in hisuiballs){
		$("#pokeform-ball-hisui, #filterform-ball-hisui").append(new Option(hisuiballs[hb]["eng"], hb));
	}

	// Load form data: Pokémon
	var pl = 0;
	var plmax = Object.keys(pokemon).length;
	for(var p in pokemon){
		pl++;
		var natdex = getData(p, "natdex");
		var natgen = "IX";
		if(natdex < 152){
			natgen = "I";
		} else if(natdex < 252){
			natgen = "II";
		} else if(natdex < 387){
			natgen = "III";
		} else if(natdex < 494){
			natgen = "IV";
		} else if(natdex < 650){
			natgen = "V";
		} else if(natdex < 722){
			natgen = "VI";
		} else if(natdex < 810){
			natgen = "VII";
		} else if(natdex < 906){
			natgen = "VIII";
		}
		var names = getData(p, "names");
		var namedata = "";
		for(var pn in names){
			namedata = namedata + " data-name-" + pn + "='" + names[pn] + "'";
		}
		var forms = getData(p, "forms");
		var formdata = "";
		var formdisp = "";
		if(!forms){
			forms = getData(p, "forms-all");
			if(!forms){
				var formsrc = getData(p, "form-source");
				if(formsrc){
					forms = commonforms[formsrc];
				}
			}
		}
		if(forms){
			if(typeof forms === 'string'){
				formdisp = " (" + forms + ")";
				formdata = formdata + " data-form-all='" + forms + "'";
			} else {
				for(var pf in forms){
					formdata = formdata + " data-form-" + pf + "='" + forms[pf] + "'";
				}
				formdisp = " (" + forms["eng"] + ")";
			}
		}
		var sort = getData(p, "sort", true);
		if(sort){
			sort = " data-sort='" + sort + "'";
		} else {
			sort = "";
		}
		$("#pokeform-species-" + natgen).append("<option value='" + p + "' data-natdex='" + natdex + "'" + sort + namedata + formdata + ">" + names["eng"] + formdisp + "</option>");
		if(pl === plmax){
			var dexSort = function(a, b){
				if(a.dataset.natdex === b.dataset.natdex){
					if(a.dataset.sort && b.dataset.sort){
						return a.dataset.sort - b.dataset.sort;
					} else {
						return a.innerHTML.toLowerCase().localeCompare(b.innerHTML.toLowerCase());
					}
				} else {
					return a.dataset.natdex - b.dataset.natdex;
				}
			}
			$("#pokeform-species optgroup").each(function(){
				var genpkmn = $(this).find("option").get();
				genpkmn.sort(dexSort);
				for(var z = 0; z < genpkmn.length; z++){
					genpkmn[z].parentNode.appendChild(genpkmn[z]);
				}
			});
		}
	}

	// Load form data: Ribbons
	generateRibbons();

	// Load form data: gender
	$("#pokeform-species").change(function(){
		var species = $("#pokeform-species").val();
		var gender = getData(species, "gender");
		if(gender === "unknown"){
			$("#pokeform-gender-toggle").hide();
			$("#pokeform-gender-unknown").show();
		} else {
			$("#pokeform-gender-toggle").show();
			$("#pokeform-gender-unknown").hide();
			if(gender === "female"){
				$("#pokeform-gender-toggle input").prop("disabled", true);
				$("#pokeform-gender-female").prop("checked", true).change();
			} else if(gender === "male"){
				$("#pokeform-gender-toggle input").prop("disabled", true);
				$("#pokeform-gender-male").prop("checked", true).change();
			} else {
				$("#pokeform-gender-toggle input").prop("disabled", false);
			}
		}
		showPreview();
	});

	// Display all boxes
	var allboxes = localStorage.getItem("boxes");
	if(!allboxes){
		allboxes = { "entries": [] };
		localStorage.setItem("boxes", JSON.stringify(allboxes));
	} else {
		allboxes = JSON.parse(allboxes);
		createBoxes(allboxes);
	}

	// Display all Pokémon
	var allpkmn = localStorage.getItem("pokemon");
	if(!allpkmn){
		allpkmn = { "entries": [] };
		localStorage.setItem("pokemon", JSON.stringify(allpkmn));
	} else {
		allpkmn = JSON.parse(allpkmn);
		createTable(allpkmn);
	}
	filterReset();

	// Populate changelog
	var changeDates = Object.keys(changelog);
	var lastChange = "";
	for(let cd = 0; cd < changeDates.length; cd++){
		var date = changeDates[cd];
		var current = "";
		if(cd == 0){
			current = " class='changelog-active'";
			lastChange = date;
		}
		var changeOut = "<tr"+current+"><td><div class='changelog-date'><span>" + date + "</span></div><ul>";
		for(var cl = 0; cl < changelog[date].length; cl++){
			changeOut = changeOut + "<li>" + changelog[date][cl] + "</li>";
		}
		changeOut = changeOut + "</ul></td></tr>";
		$("#changelog tr:last-child").before(changeOut);
		if(cd == 4) break;
	}

	// Display changelog
	var saveChange = localStorage.getItem("changelog");
	if(saveChange && saveChange !== lastChange){
		showModal("changelog");
	}
	if(!saveChange || saveChange !== lastChange){
		localStorage.setItem("changelog", lastChange);
	}

	// Set theme
	$("#settings-theme").change(function(){
		var curTheme = $("body").attr("theme");
		var newTheme = $(this).val();
		if(curTheme !== newTheme){
			changeTheme(newTheme);
		}
	});
	var theme = localStorage.getItem("theme");
	if(!theme){
		if(window.matchMedia("(prefers-color-scheme: light)").matches){
			theme = "shield";
		} else {
			theme = "start";
		}
	}
	$("#settings-theme").val(theme).change();

	// Form events
	$("#pokeform").on($.modal.BLOCK, function(event, modal){
		$(".jquery-modal.blocker.current").click(function(e){
			if(e.target === this)
				confirmFormClose();
		});
	});
	$("#boxform").on($.modal.OPEN, function(event, modal){
		$("#boxform-name").focus();
	});
	$("#pokeform, #boxform").on($.modal.AFTER_CLOSE, function(event, modal){
		resetForm();
	});
	$("#ribbonguide").on($.modal.AFTER_CLOSE, function(event, modal){
		resetRibbonGuide();
	});

	// Button click events
	$("#add-pokemon-button").click(function(){
		showModal();
	});
	$("#header-settings").click(function(){
		showModal("settings");
	});
	$("#view-changelog").click(function(){
		showModal("changelog", true);
	});
	$("#boxform-name").on("keydown", function(e){
		if(e.key === "Enter"){
			if($("#boxform-edit")[0].hasAttribute("data-editing")){
				createBox(true);
			} else {
				createBox();
			}
		}
	});
	$("#boxform-add").click(function(){
		createBox();
	});
	$("#boxform-edit").click(function(){
		createBox(true);
	});
	$("#pokeform-add").click(function(){
		createPokemon();
	});
	$("#pokeform-edit").click(function(){
		createPokemon(true);
	});
	$("#pokeform-cancel").click(function(){
		confirmFormClose();
	});
	$("input[name='pokeform-shiny'], input[name='pokeform-gender']").change(function(){
		showPreview();
	})
	$(".button.close").click(function(){
		$.modal.close();
	});
	$("#boxsort-add").click(function(){
		showModal("boxform", true);
	});
	$("#menu-boxes").click(function(){
		this.blur();
		boxSortDialog(true);
	});
	$("#menu-filter").click(function(){
		this.blur();
		showModal("filterform");
	});
	$("#filterform select, #filterform input").change(function(){
		if(filterInReset) return;
		if($(this).attr("id") == "filterform-sort"){
			sortPkmn($(this).val());
		} else {
			var allFilters = {};
			var curMin = Number($("#filterform-level-min").val());
			var curMax = Number($("#filterform-level-max").val());
			if(curMin > 100){
				curMin = 100;
				$("#filterform-level-min").val(100);
			} else if((curMin <= 1 && curMin != 0) || $("#filterform-level-min").val() == "0"){ // avoid messing with the field every time other filters are changed
				curMin = 0;
				$("#filterform-level-min").val("");
			}
			if(curMax < 1 && curMax != 0){ // avoid messing with the field every time other filters are changed
				curMax = 1;
				$("#filterform-level-max").val(1);
			} else if(curMax >= 100 || $("#ffilterform-level-max").val() == "0"){
				curMax = 0;
				$("#filterform-level-max").val("");
			}
			if(curMin && curMax && curMin > curMax){
				if($(this).attr("id") == "filterform-level-min"){
					$("#filterform-level-max").val(curMin);
				} else if($(this).attr("id") == "filterform-level-max"){
					$("#filterform-level-min").val(curMax);
				}
			}
			if(curMin){
				allFilters["level-min"] = curMin;
			}
			if(curMax){
				allFilters["level-max"] = curMax;
			}
			$("#filterform select").each(function(){
				var filterType = $(this).attr("id").replace("filterform-","");
				var filterVal = $(this).val();
				if(filterType != "sort"){
					allFilters[filterType] = filterVal;
				}
			});
			filterPkmn(allFilters);
		}
	});
	$("#filterform-reset").click(function(){
		filterReset();
		// also force default sort, filterReset() when called by this button doesn't seem to reset the sort
		sortPkmn("default");
	});
	$("#changelog tr:not(:last-child)").click(function(){
		$(this).toggleClass("changelog-active");
	});
	$("#ribbonguide-warnings").click(function(){
		$(this).toggleClass("active");
	});
	$(".ribbons-gen").click(function(){
		$(this).toggleClass("rg-active");
	});
	$("#footer-icon").click(function(){
		var footerState = localStorage.getItem("footerState");
		if(!footerState || footerState == "expanded"){
			localStorage.setItem("footerState", "collapsed");
			$("body").attr("data-footer", "collapsed");
		} else {
			localStorage.setItem("footerState", "expanded");
			$("body").removeAttr("data-footer");
		}
	});
	$("#pokeform-tabs img").click(function(){
		if(!$(this).hasClass("pokeform-tabs-active")){
			var targetTab = $(this).attr("class").replace("-ctrl", "");
			$(".pokeform-tabs-active").removeClass("pokeform-tabs-active");
			$(this).addClass("pokeform-tabs-active");
			$("#pokeform tr:not(#pokeform-tabs):not(." + targetTab + ")").hide();
			$("#pokeform tr." + targetTab).show();
		}
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
		$("#restore input").val(null);
	});
	$("#pokemon-list").sortable({
		containment: "document",
		opacity: 0.75,
		cancel: "#pokemon-list-empty, #pokemon-list-nomatch",
		handle: ".pokemon-list-move",
		cursor: "grabbing",
		stop: function(e, ui){
			var elem = ui.item[0];
			var elemID = parseInt(elem.dataset.pokemon);
			var prevID = parseInt($(elem).prev()[0].dataset.pokemon);
			if(!prevID && prevID !== 0) prevID = -1;
			if(elemID !== (prevID+1)){
				// moved Pokemon
				var allpkmn = JSON.parse(localStorage.getItem("pokemon"));
				var pokemon = allpkmn["entries"][elemID];
				allpkmn["entries"].splice(elemID, 1);
				if(prevID > elemID){
					allpkmn["entries"].splice(prevID, 0, pokemon);
				} else {
					allpkmn["entries"].splice(prevID+1, 0, pokemon);
				}
				localStorage.setItem("pokemon", JSON.stringify(allpkmn));
				clearTable(allpkmn);
			}
		}
	});
	$("#boxsort-boxes").sortable({
		containment: "#boxsort table",
		axis: "y",
		opacity: 0.75,
		cursor: "grabbing",
		stop: function(e, ui){
			var elem = ui.item[0];
			var elemID = parseInt(elem.dataset.sortnum);
			var prev = $(elem).prev();
			var prevID = "";
			if(prev.length){
				prevID = parseInt($(elem).prev()[0].dataset.sortnum);
			} else {
				prevID = -1;
			}
			if(!prevID && prevID !== 0) prevID = -1;
			if(elemID !== (prevID+1)){
				// moved boxes
				var allboxes = JSON.parse(localStorage.getItem("boxes"));
				var oldboxes = JSON.parse(JSON.stringify(allboxes));
				var box = allboxes["entries"][elemID];
				allboxes["entries"].splice(elemID, 1);
				if(prevID > elemID){
					allboxes["entries"].splice(prevID, 0, box);
				} else {
					allboxes["entries"].splice(prevID+1, 0, box);
				}
				localStorage.setItem("boxes", JSON.stringify(allboxes));

				var allpkmn = JSON.parse(localStorage.getItem("pokemon"));
				for(let p in allpkmn.entries){
					var pkmn = allpkmn.entries[p];
					if(pkmn.box || pkmn.box == 0){
						if(allboxes.entries[pkmn.box] !== oldboxes.entries[pkmn.box]){
							allpkmn.entries[p].box = allboxes.entries.indexOf(oldboxes.entries[pkmn.box]);
						}
					}
				}
				localStorage.setItem("pokemon", JSON.stringify(allpkmn));

				boxSortDialog();
				clearTable(allpkmn);
				clearBoxes(allboxes);
			}
		}
	});
});
