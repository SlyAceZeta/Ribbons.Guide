/* globals */
var balls, changelog, games, gameOrder = {}, origins, pokemon, ribbons, translations, forms, natures, modalSettings, modalRibbonChecklist, modalPokemonForm, modalPokemonState = "default", modalPokemonEditing = -1, activeFilters = {}, activeSort = "default", filterState = "default";
// TODO: add tutorials
/* get settings */
if(!localStorage.settings){
	localStorage.settings = "{}";
}
var settings = JSON.parse(localStorage.settings);
/* get pokemon */
if(!localStorage.pokemon){
	localStorage.pokemon = "[]";
}
var userPokemon = JSON.parse(localStorage.pokemon);
/* get boxes */
if(!localStorage.boxes){
	localStorage.boxes = "[]";
}
var userBoxes = JSON.parse(localStorage.boxes);
/* get last viewed changelog date */
var lastChangeDate;
if(localStorage.changelog){
	lastChangeDate = new Date(localStorage.changelog);
}
/* set sortable variables in advance */
var sortablePokemon, sortableBoxes;

/* set data modified date */
function updateModifiedDate(newDate = true){
	var modifiedDate = new Date();
	if(newDate){
		localStorage.lastModified = Number(modifiedDate);
		$("#modalDataLastModified").text(modifiedDate.toLocaleDateString() + ", " + modifiedDate.toLocaleTimeString());
	} else {
		modifiedDate.setTime(localStorage.lastModified);
		$("#modalDataLastModified").text(modifiedDate.toLocaleDateString() + ", " + modifiedDate.toLocaleTimeString());
	}
}

/* change setting */
function changeSetting(key, value){
	settings[key] = value;
	localStorage.settings = JSON.stringify(settings);
	if(modalSettings){
		if(modalSettings._isShown){
			updateModifiedDate();
		}
	}
}

/* change site theme */
function changeTheme(t){
	if(t == "auto"){
		changeSetting("theme", "auto");
		if(window.matchMedia("(prefers-color-scheme: dark)").matches){
			$("html").attr("data-bs-theme", "dark");
		} else {
			$("html").attr("data-bs-theme", "light");
		}
	} else {
		changeSetting("theme", t);
		$("html").attr("data-bs-theme", t);
	}
}
/* initial theme set */
if(settings.theme){
	changeTheme(settings.theme);
} else {
	// compatibility check for old setting
	if(localStorage.theme){
		changeTheme(localStorage.theme);
		localStorage.removeItem("theme");
	} else {
		changeTheme("auto");
	}
}

/* change site language */
var supportedLanguages = ["en"];
function changeLanguage(l){
	changeSetting("language", l)
	$("html").attr("lang", l);
}
/* initial language set */
if(settings.language){
	changeLanguage(settings.language);
} else {
	const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages;
	if(typeof browserLocales === "string"){
		if(supportedLanguages.includes(browserLocales)){
			changeLanguage(browserLocales);
		}
	} else if(typeof browserLocales === "object"){
		for(var i = 0; i < browserLocales.length; i++){
			var locale = browserLocales[i].split(/-|_/)[0];
			if(supportedLanguages.indexOf(locale) > -1){
				changeLanguage(locale);
				break;
			}
		}
	}
}

/* change Checklist Buttons */
function changeChecklistButtons(o){
	changeSetting("ChecklistButtons", o);
	$("html").attr("data-checklistbuttons", o);
}
/* initial Checklist Buttons set */
if(settings.ChecklistButtons){
	changeChecklistButtons(settings.ChecklistButtons);
} else {
	changeChecklistButtons("always");
}

/* change Title Ribbon */
function changeTitleRibbon(o){
	changeSetting("TitleRibbon", o);
	$("html").attr("data-titleribbon", o);
}
/* initial Checklist Buttons set */
if(settings.TitleRibbon){
	changeTitleRibbon(settings.TitleRibbon);
} else {
	changeTitleRibbon("always");
}

/* change Old Ribbons */
function changeOldRibbons(o){
	changeSetting("OldRibbons", o);
	$("html").attr("data-oldribbons", o);
}
/* initial Old Ribbons set */
if(settings.OldRibbons){
	changeOldRibbons(settings.OldRibbons);
} else {
	changeOldRibbons("unmerged");
}

/* change Gen III/IV/V origin marks */
function changeExtraOriginMarks(o){
	changeSetting("ExtraOriginMarks", o);
	$("html").attr("data-extraoriginmarks", o);
}
/* initial origin mark set */
if(settings.ExtraOriginMarks){
	changeExtraOriginMarks(settings.ExtraOriginMarks);
} else {
	changeExtraOriginMarks("none");
}

/* change card view */
function changeCardView(view){
	changeSetting("CardView", view);
	$(function(){
		$("html").attr("data-cardview", view);
		if(view == "condensed"){
			$("#tracker-grid").attr("class", "row g-3 mt-2 mb-4 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 row-cols-xxl-auto");
		} else if(view == "expanded"){
			$("#tracker-grid").attr("class", "row g-3 mt-2 mb-4 row-cols-1 row-cols-md-2 row-cols-xl-3");
		}
	});
}
/* initial card view set */
if(settings.CardView){
	changeCardView(settings.CardView);
} else {
	changeCardView("expanded");
}

/* change ribbon form view */
function changeRibbonFormView(view){
	changeSetting("RibbonFormView", view);
	$(function(){
		$("html").attr("data-ribbonformview", view);
	});
}
/* initial card view set */
if(settings.RibbonFormView){
	changeRibbonFormView(settings.RibbonFormView);
} else {
	changeRibbonFormView("list");
}

/* toggle settings list */
var toggles = { // default settings
	"ShowWorldAbility": false,
	"AutoMemoryRibbons": true,
	"AutoStrangeBall": true,
	"FooterExtraInfo": true,
	"CompleteColor": true,
	"Reordering": true,
	"AprilFools": true
};
/* change toggle settings */
function changeCheckToggle(name, value, reload = false){
	changeSetting(name, "" + value);
	if(name !== "AprilFools" && name !== "ShowWorldAbility") $("html").attr("data-" + name.toLowerCase(), "" + value);
	if(reload && name == "AprilFools"){
		modalSettings.toggle();
		new bootstrap.Modal("#modalReloading").toggle();
		setTimeout(function(){ location.reload() }, 500);
	}
}
/* initial toggle set */
for(let i in toggles){
	if(toggles[i]){
		// default is true
		if(settings[i] && settings[i] == "false"){
			changeCheckToggle(i, false);
		} else {
			changeCheckToggle(i, true);
		}
	} else {
		// default is false
		if(settings[i] && settings[i] == "true"){
			changeCheckToggle(i, true);
		} else {
			changeCheckToggle(i, false);
		}
	}
}

/* April Fools */
var aprilFools = false;
var todayDate = new Date();
if(todayDate.getMonth() == 3 && todayDate.getDate() == 1){
	$("#settingsAprilFoolsContainer").addClass("d-flex");
	if(settings["AprilFools"]){
		aprilFools = true;
		var wheelSpin = Math.floor(Math.random() * 100);
		if(wheelSpin === 42){
			var aprilFoolsStyleSheet = document.createElement("style");
			aprilFoolsStyleSheet.innerText = `
				@keyframes aprilfools {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
				.card-sprite {
					animation: aprilfools 5s linear infinite;
				}
				@media (prefers-reduced-motion) {
					.card-sprite {
						animation: none;
						transform: rotate(180deg);
					}
				}
	`
			document.head.appendChild(aprilFoolsStyleSheet);
		}
	}
}

/* Pokemon data update from old app */
function updateOldPokemon(p){
	var newP = {
		species: p.dex ? p.dex : "bulbasaur",
		gender: p.gender ? p.gender : "male",
		shiny: p.shiny ? p.shiny : "",
		nickname: p.name ? p.name : "",
		language: p.lang ? p.lang.toLowerCase() : "eng",
		ball: p.ball ? p.ball : "poke",
		strangeball: "",
		currentlevel: p.level ? Number(p.level) : 1,
		nature: p.nature ? p.nature.toLowerCase() : "",
		totem: false,
		gmax: false,
		shadow: false,
		trainername: p.ot ? p.ot : "",
		trainerid: p.id ? p.id : "",
		originmark: "",
		currentgame: p.currentgame ? p.currentgame : "",
		box: (p.box || p.box == 0) ? Number(p.box) : -1,
		title: p.title ? p.title : "None",
		scale: p.scale ? p.scale : false,
		ribbons: p.ribbons ? p.ribbons : [],
		metlevel: p.metlevel ? Number(p.metlevel) : null,
		metdate: p.metdate ? p.metdate : "",
		metlocation: "",
		pokerus: "",
		achievements: [],
		notes: p.notes ? p.notes : ""
	};
	if(p.origin){
		var newmark = "none";
		for(let o in origins){
			if(origins[o].games.includes(p.origin)){
				newmark = o;
				// old app only had one origin game per mark, so there will only be one result
				break;
			}
		}
		newP.originmark = newmark;
		newP.origingame = p.origin;
	}
	if(p.iv && Object.keys(p.iv).length){
		if(p.iv.hp) newP.notes = newP.notes + "\nHP IV: " + p.iv.hp;
		if(p.iv.atk) newP.notes = newP.notes + "\nAttack IV: " + p.iv.atk;
		if(p.iv.def) newP.notes = newP.notes + "\nDefense IV: " + p.iv.def;
		if(p.iv.spa) newP.notes = newP.notes + "\nSpecial Attack IV: " + p.iv.spa;
		if(p.iv.spd) newP.notes = newP.notes + "\nSpecial Defense IV: " + p.iv.spd;
		if(p.iv.spe) newP.notes = newP.notes + "\nSpeed IV: " + p.iv.spe;
	}
	if(p.ev && Object.keys(p.ev).length){
		if(p.ev.hp) newP.notes = newP.notes + "\nHP EV: " + p.ev.hp;
		if(p.ev.atk) newP.notes = newP.notes + "\nAttack EV: " + p.ev.atk;
		if(p.ev.def) newP.notes = newP.notes + "\nDefense EV: " + p.ev.def;
		if(p.ev.spa) newP.notes = newP.notes + "\nSpecial Attack EV: " + p.ev.spa;
		if(p.ev.spd) newP.notes = newP.notes + "\nSpecial Defense EV: " + p.ev.spd;
		if(p.ev.spe) newP.notes = newP.notes + "\nSpeed EV: " + p.ev.spe;
	}
	if(p.ability) newP.notes = newP.notes + "\nAbility: " + p.ability;
	if(p.mint){
		if(p.mint !== "None") newP.notes = newP.notes + "\nMint: " + p.mint;
	}
	if(p.characteristic) newP.notes = newP.notes + "\nCharacteristic: " + p.characteristic;
	return newP;
}

/* save backup */
function saveBackup(){
	var backupObj = {};
	backupObj.lastModified = localStorage.lastModified;
	backupObj.settings = JSON.parse(localStorage.settings);
	backupObj.pokemon = localStorage.pokemon ? JSON.parse(localStorage.pokemon) : {};
	backupObj.boxes = localStorage.boxes ? JSON.parse(localStorage.boxes) : {};
	var blob = new Blob([JSON.stringify(backupObj)], {type: 'application/json'});

	var ele = document.createElement('a');
	ele.href = URL.createObjectURL(blob);
	ele.target = "_blank";
	ele.download = "RibbonBackup.json";

	document.body.appendChild(ele);
	ele.click();
	document.body.removeChild(ele);
}

/* load backup */
function loadBackup(file, filename){
	var filename = filename.replace("C:\\fakepath\\", "");
	var reader = new FileReader();
	reader.onload = function(e){
		var contents = e.target.result;
		var proceed = false;
		if(localStorage.pokemon || localStorage.boxes){
			if(confirm("Are you sure you want to replace all of the current data with " + filename + "? You can't reverse this decision!")){
				proceed = true;
			}
		} else {
			proceed = true;
		}
		if(proceed){
			var fileVersion = 0;
			// check for the different backup file versions
			var oldBoxPosition = contents.indexOf(',{"entries":[');
			var backupPokemon = [], backupBoxes = [], backupLastModified = Number(new Date());
			if(oldBoxPosition > -1){
				fileVersion = 2;
				backupPokemon = JSON.parse(contents.substring(0, oldBoxPosition));
				backupBoxes = JSON.parse(contents.substring(oldBoxPosition+1));
				backupBoxes = Object.assign([], backupBoxes.entries.filter(Boolean));
			} else {
				if(contents.indexOf('{"entries"') == 0){
					fileVersion = 1;
					backupPokemon = JSON.parse(contents);
				} else {
					var backupObj = JSON.parse(contents);
					if(backupObj.settings && backupObj.pokemon && backupObj.boxes){
						fileVersion = 3;
						if(backupObj.lastModified){
							fileVersion = 4;
							backupLastModified = backupObj.lastModified;
						}
						backupPokemon = backupObj.pokemon;
						backupBoxes = backupObj.boxes;
						settings = backupObj.settings;
						localStorage.settings = JSON.stringify(backupObj.settings);
					}
				}
			}
			if(fileVersion){
				if(fileVersion < 3){
					backupPokemon = Object.assign([], backupPokemon.entries.filter(Boolean));
					for(let p in backupPokemon){
						backupPokemon[p] = updateOldPokemon(backupPokemon[p]);
					}
				}
				localStorage.pokemon = JSON.stringify(backupPokemon);
				localStorage.boxes = JSON.stringify(backupBoxes);
				localStorage.lastModified = backupLastModified;
				modalData.toggle();
				new bootstrap.Modal("#modalReloading").toggle();
				setTimeout(function(){ location.reload() }, 500);
			} else {
				alert("This is not a valid Ribbons.Guide backup. Your data has not changed.");
			}
		}
	}
	reader.readAsText(file);
}

function getGameData(game, field, doNotSearch = false){
	var thisGame = games[game];
	if(games[game]){
		var dataToReturn = thisGame[field];
		if(typeof dataToReturn === "undefined"){
			if(!doNotSearch && thisGame["partOf"]){
				dataToReturn = games[thisGame["partOf"]][field];
				if(typeof dataToReturn === "undefined"){
					dataToReturn = false;
				}
			} else {
				dataToReturn = false;
			}
		}
		return dataToReturn;
	} else {
		return false;
	}
}

function getPokemonData(dex, field, doNotSearch = false){
	var thisPkmn = pokemon[dex];
	if(pokemon[dex]){
		var data = thisPkmn[field];
		if(typeof data === "undefined"){
			if(!doNotSearch && thisPkmn["data-source"]){
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

function getEarnableRibbons(dex, currentLevel, metLevel, currentGame, originGame, currentRibbons, checkedScale, totem = false, gmax = false, shadow = false){
	// TODO: reduce duplication: createCard
	var earnableRibbons = {};
	var earnableWarnings = [];
	var evolutionWarning = {};
	var currentGameStatus = "no-ribbons-left";
	currentLevel = parseInt(currentLevel);

	// Pokemon info
	var currentGen = parseInt(getGameData(currentGame, "gen"));
	var virtualConsole = false;
	if(currentGen < 3){
		virtualConsole = true;
		currentGen = 7;
	} else if(currentGame == "go"){
		currentGen = 8;
	}
	var compatibleGames = getPokemonData(dex, "games");
	var mythical = getPokemonData(dex, "mythical");
	var evoWarnMon = getPokemonData(dex, "evowarnmon", true);
	var evoWarnGen = getPokemonData(dex, "evowarngen", true);

	for(let ribbon in ribbons){
		// skip if Ribbon is already earned
		if(currentRibbons.includes(ribbon)) continue;
		// skip if Ribbon cannot be earned
		if(!ribbons[ribbon].available) continue;
		// skip if Pokemon is on Ribbon's ban list
		if(ribbons[ribbon].banned && ribbons[ribbon].banned.includes(dex)) continue;
		// skip if Pokemon is Mythical and Ribbon is not allowed for Mythicals
		if(ribbons[ribbon].nomythical && mythical) continue;
		// skip if Ribbon is a Memory Ribbon
		if(ribbon.startsWith("contest-memory-ribbon") || ribbon.startsWith("battle-memory-ribbon")) continue;

		var ribbonGames = ribbons[ribbon].available;
		for(let g in ribbonGames){
			var ribbonGame = ribbonGames[g];
			// skip if this game is part of a combo that already has this Ribbon
			var ribbonGameCombo = getGameData(ribbonGame, "partOf", true);
			if(ribbonGameCombo){
				if(earnableRibbons[ribbonGameCombo] && earnableRibbons[ribbonGameCombo].includes(ribbon)) continue;
			}

			var ribbonGen = parseInt(getGameData(ribbonGame, "gen"));
			if(ribbonGen && (ribbonGen >= currentGen || (ribbonGen == 8 && currentGen == 9))){
				if(compatibleGames.includes(ribbonGame) && !((currentGame == "lgp" || currentGame == "lge") && ribbonGen == 7)){
					// Pokemon-specific restrictions
					if(dex == "nincada"){
						// Nincada originally from BDSP cannot enter SwSh
						if(originGame == "bd" || originGame == "sp"){
							if(ribbonGame == "sw" || ribbonGame == "sh"){
								continue;
							}
						// all other Nincada cannot enter BDSP
						} else {
							if(ribbonGame == "bd" || ribbonGame == "sp"){
								continue;
							}
						}
					} else if(dex == "spinda"){
						// Spinda in BDSP cannot leave BDSP
						if(currentGame == "bd" || currentGame == "sp"){
							if(ribbonGame !== "bd" && ribbonGame !== "sp"){
								continue;
							}
						// all other Spinda cannot enter BDSP
						} else {
							if(ribbonGame == "bd" || ribbonGame == "sp"){
								continue;
							}
						}
					} else if(dex === "marowak-alola" || dex === "ribombee" || dex === "araquanid" || dex === "togedemaru"){
						// Totem-sized versions of these Pokemon cannot leave USUM
						if(totem){
							if(ribbonGame !== "usun" && ribbonGame !== "umoon"){
								continue;
							}
						}
					} else if(dex === "pikachu" || dex === "eevee" || dex === "meowth" || dex == "duraludon"){
						// if these Pokemon have GMax, they cannot leave SwSh
						if(gmax){
							if(ribbonGame !== "sw" && ribbonGame !== "sh"){
								continue;
							}
						}
					}

					// Ribbon-specific restrictions
					if(ribbon == "winning-ribbon"){
						// can only be earned under Level 51
						if(currentLevel < 51){
							earnableWarnings.push("winning-ribbon");
						} else {
							continue;
						}
					} else if(ribbon == "national-ribbon"){
						// can only be earned by Shadow Pokemon in Colo/XD
						if(!shadow || (currentGame !== "colosseum" && currentGame !== "xd")){
							continue;
						}
					} else if(ribbon == "tower-master-ribbon"){
						// banlist and Mythicals cannot earn this, but only in BDSP
						if(ribbonGame == "bd" || ribbonGame == "sp"){
							if(mythical || ribbons[ribbon].bannedBDSP.includes(dex)){
								continue;
							}
						}
					} else if(ribbon == "jumbo-mark"){
						if((checkedScale || currentRibbons.includes("mini-mark")) && !currentRibbons.includes("titan-mark") && !currentRibbons.includes("alpha-mark")){
							continue;
						}
					} else if(ribbon == "mini-mark"){
						if(checkedScale || currentRibbons.includes("jumbo-mark") || currentRibbons.includes("titan-mark") || currentRibbons.includes("alpha-mark")){
							continue;
						}
					} else if(ribbon == "footprint-ribbon"){
						// if Pokemon can to go to Gen IV, it can always earn this
						if(ribbonGen !== 4){
							// if Pokemon is voiceless and can go to Gen VIII, it can always earn this
							var voiceless = getPokemonData(dex, "voiceless");
							if(!(ribbonGen == 8 && voiceless) || ((dex === "beldum" || dex === "metang") && (originGame === "scar" || originGame === "vio")) ){
								// otherwise, Footprint relies on Met Level < 71
								// Beldum and Metang are voiceless, but Metagross is not, and Beldum can be met as high as Lv.74 in SV DLC, so evolving to Metagross will also disqualify it
								var currentLevelBelow71 = currentLevel < 71;
								// Met Level changes upon entering Gen V or leaving Virtual Console
								if(currentGen < 5 || virtualConsole){
									if(currentLevelBelow71){
										// Pokemon's current level is < 71
										// if it transfers now, its Met Level will also be < 71
										// therefore it will always be able to earn Footprint
										// BUT if the player levels to 71+ before transferring, Footprint will be blocked
										if(currentGen < 5){
											earnableWarnings.push("footprint-gen4");
										} else if(virtualConsole){
											earnableWarnings.push("footprint-virtualconsole");
										}
									} else {
										// Pokemon has already leveled to 71+, Footprint is unavailable
										continue;
									}
								} else {
									// Pokemon has left Gen V and Virtual Console, so Met Level is now permanently set
									if(metLevel){
										// user has set Met Level
										if(metLevel > 70){
											// Pokemon was met at 71+, Footprint is unavailable
											// Beldum and Metang can still get it, but they need a warning
											if(dex === "beldum" || dex === "metang"){
												earnableWarnings.push("footprint-beldum");
											} else {
												continue;
											}
										}
									} else {
										// user has not set Met Level, let's try to determine it automatically
										// Pokemon from GO must have Met Level < 50 and can always earn Footprint
										if(originGame !== "go"){
											// Pokemon in Gen V+ with Current Level < 71 must also have Met Level < 71 and can always earn Footprint
											if(!currentLevelBelow71){
												// we cannot automatically determine Met Level, warn the user as such (including Beldum/Metang case)
												// before we warn the user as such, let's check if the ribbon will appear for the Pokemon in BDSP--if so, no warning is necessary
												if(!((compatibleGames.includes("bd") || compatibleGames.includes("sp")) && voiceless) || dex === "beldum" || dex === "metang"){
													earnableWarnings.push("footprint-met-level");
												}
											}
										}
									}
								}
							}
						}
					}

					// all checks passed
					var ribbonGameKey = ribbonGame;
					if(ribbonGameCombo){
						ribbonGameKey = ribbonGameCombo;
					}
					if(!earnableRibbons[ribbonGameKey]){
						earnableRibbons[ribbonGameKey] = [];
					}
					earnableRibbons[ribbonGameKey].push(ribbon);
				}
			}
		}
	}

	if(getGameData(currentGame, "storage")){
		currentGameStatus = "in-storage";
	} else {
		var currentGameKey = currentGame;
		var currentGameCombo = getGameData(currentGame, "partOf", true);
		if(currentGameCombo){
			currentGameKey = currentGameCombo;
		}
		if(Object.keys(earnableRibbons).includes(currentGameKey)){
			currentGameStatus = "safe-to-leave";
			var currentGameRibbons = earnableRibbons[currentGameKey];
			for(var r in currentGameRibbons){
				var thisRibbon = currentGameRibbons[r];
				var availableElsewhere = false;
				for(var g in earnableRibbons){
					if(g === currentGameKey) continue;
					if(earnableRibbons[g].includes(thisRibbon)){
						availableElsewhere = true;
					}
				}
				if(!availableElsewhere){
					currentGameStatus = "last-chance";
				}
			}
		}
	}

	// TODO: make this smarter: check for the game differences and report them, unless there are no applicable ribbons
	if(evoWarnMon && evoWarnGen){
		var testGen = currentGen;
		if(currentGame == "go") testGen = 7;
		if(testGen <= parseInt(evoWarnGen)){
			earnableWarnings.push("evolution-warning");
			evolutionWarning.pokemon = evoWarnMon;
		}
	}

	// remove duplicate warnings
	earnableWarnings = [...new Set(earnableWarnings)];

	// return
	return {"remaining": earnableRibbons, "warnings": earnableWarnings, "currentGameStatus": currentGameStatus, "evolutionWarning": evolutionWarning};
}

function setFormValidAll(){
	$("#modalPokemonForm .is-invalid").each(function(){
		$(this).removeClass("is-invalid");
	});
	$("#modalPokemonForm .invalid-feedback").each(function(){
		$(this).remove();
	});
}

function setFormValid(id){
	$("#pokemonForm" + id).removeClass("is-invalid");
	$("#pokemonForm" + id).parent().find(".invalid-feedback").remove();
}

function setFormInvalid(id, message){
	$("#pokemonForm" + id).addClass("is-invalid");
	var $existingElement = $("#pokemonForm" + id).parent().find(".invalid-feedback");
	if($existingElement.length){
		$($existingElement[0]).text(message);
	} else {
		$("#pokemonForm" + id).parent().append($("<span>", { "class": "invalid-feedback" }).text(message));
	}
}

function updatePopovers(){
	$("[data-bs-toggle='popover']").each(function(){
		var $this = $(this);
		$this.popover({
			trigger: "focus",
			html: true,
			container: $this,
			placement: "top"
		});
	})
}

function savePokemon(edit = false){
	modalPokemonState = "saving";
	var newRibbons = [];
	$("#pokemonFormRibbons input:checked").each(function(){
		newRibbons.push($(this).attr("id").replace("pokemonFormRibbon-", ""));
	});
	var newAchievements = [];
	$(".pokemonFormAchievements:checked").each(function(){
		newAchievements.push($(this).attr("id").replace("pokemonFormAchievements-", ""));
	});
	var newP = {
		species: $("#pokemonFormSpecies").val(),
		gender: $("#pokemonFormGenderGroup input:checked").val(),
		shiny: $("#pokemonFormShinyGroup input:checked").val(),
		nickname: $("#pokemonFormNickname").val(),
		language: $("#pokemonFormLanguage").val(),
		ball: $("#pokemonFormBall").val(),
		strangeball: $("#pokemonFormStrangeBallGroup input:checked").val(),
		currentlevel: $("#pokemonFormCurrentLevel").val(),
		nature: $("#pokemonFormNature").val(),
		totem: $("#pokemonFormTotem").prop("checked"),
		gmax: $("#pokemonFormGMax").prop("checked"),
		shadow: $("#pokemonFormShadow").prop("checked"),
		trainername: $("#pokemonFormTrainerName").val(),
		trainerid: $("#pokemonFormTrainerID").val(),
		originmark: $("#pokemonFormOriginMark").val(),
		origingame: $("#pokemonFormOriginGame").val(),
		currentgame: $("#pokemonFormCurrentGame").val(),
		box: Number($("#pokemonFormBox").val()),
		title: $("#pokemonFormTitle").val(),
		scale: $("#pokemonFormScale").prop("checked"),
		ribbons: newRibbons,
		metlevel: $("#pokemonFormMetLevel").val(),
		metdate: $("#pokemonFormMetDate").val(),
		metlocation: $("#pokemonFormMetLocation").val(),
		pokerus: $("#pokemonFormPokerusGroup input:checked").val(),
		achievements: newAchievements,
		notes: $("#pokemonFormNotes").val()
	};
	var continueForm = true;
	if(newP.species){
		setFormValid("Species");
	} else {
		continueForm = false;
		setFormInvalid("Species", "Please select a species.");
	}
	if(newP.ball){
		setFormValid("Ball");
	} else {
		continueForm = false;
		setFormInvalid("Ball", "Please select a Poké Ball.");
	}
	if(newP.currentlevel){
		var testNewLevel = parseInt(newP.currentlevel);
		if(testNewLevel > 0 && testNewLevel < 101){
			if(newP.metlevel){
				var testNewMetLevel = parseInt(newP.metlevel);
				if(testNewLevel >= testNewMetLevel){
					newP.currentlevel = testNewLevel;
					newP.metlevel = testNewMetLevel;
					setFormValid("CurrentLevel");
				} else {
					continueForm = false;
					setFormInvalid("CurrentLevel", "Current Level must be equal to or higher than Met Level.");
				}
			} else {
				newP.currentlevel = testNewLevel;
				newP.metlevel = null;
				setFormValid("CurrentLevel");
			}
		} else {
			continueForm = false;
			setFormInvalid("CurrentLevel", "Current Level must be a number from 1 to 100.");
		}
	} else {
		continueForm = false;
		setFormInvalid("CurrentLevel", "Please input a valid number.");
	}
	if(newP.trainerid){
		if(newP.trainerid.match(/^[0-9]{1,6}$/)){
			setFormValid("TrainerID");
		} else {
			continueForm = false;
			setFormInvalid("TrainerID", "ID No. must be a number with one to six digits.");
		}
	}
	if(newP.originmark){
		setFormValid("OriginMark");
	} else {
		continueForm = false;
		setFormInvalid("OriginMark", "Please select an Origin Mark.");
	}
	if((newP.ribbons.includes("partner-ribbon") || newP.title == "partner-ribbon") && !newP.trainername){
		continueForm = false;
		setFormInvalid("TrainerName", "The Partner Ribbon requires an OT.");
	}
	if(getPokemonData(newP.species, "cannotStore") && getGameData(newP.currentgame, "storage", true)){
		continueForm = false;
		setFormInvalid("CurrentGame", "This Pokémon cannot be stored in Bank or HOME.");
	}
	if(continueForm){
		if(edit){
			userPokemon[modalPokemonEditing] = newP;
			$("#tracker-grid .col[data-pokemon-id='" + modalPokemonEditing + "']").replaceWith(createCard(newP, modalPokemonEditing));
		} else {
			userPokemon.push(newP);
			$("#tracker-grid").append(createCard(newP, userPokemon.length-1));
		}
		sortPokemonList();
		filterPokemonList();
		localStorage.pokemon = JSON.stringify(userPokemon);
		updateModifiedDate();
		updatePopovers();
		modalPokemonForm.toggle();
	} else {
		$("#pokemonFormTabs-details").click();
	}
}

function editPokemon(){
	resetPokemonForm(true);
	var cardContainer = $(event.target).parents(".col");
	var pokemonID = cardContainer[0].dataset.pokemonId;
	modalPokemonState = "editing";
	modalPokemonEditing = pokemonID;
	var pokemonToEdit = userPokemon[pokemonID];
	$("#pokemonFormSpecies").val(pokemonToEdit.species).change();
	if(pokemonToEdit.gender === "female") $("#pokemonFormGender-female").prop("checked", true).change();
	if(pokemonToEdit.shiny.length){
		var shinyType = (pokemonToEdit.shiny === "square") ? "square" : "star";
		$("#pokemonFormShiny-" + shinyType).prop("checked", true).change();
	}
	$("#pokemonFormNickname").val(pokemonToEdit.nickname);
	$("#pokemonFormLanguage").val(pokemonToEdit.language).change();
	$("#pokemonFormBall").val(pokemonToEdit.ball).change();
	if(pokemonToEdit.strangeball.length) $("#pokemonFormStrangeBall-" + pokemonToEdit.strangeball).prop("checked", true).change();
	$("#pokemonFormCurrentLevel").val(pokemonToEdit.currentlevel);
	$("#pokemonFormNature").val(pokemonToEdit.nature).change();
	if(pokemonToEdit.totem) $("#pokemonFormTotem").prop("checked", true).change();
	if(pokemonToEdit.gmax) $("#pokemonFormGMax").prop("checked", true).change();
	if(pokemonToEdit.shadow) $("#pokemonFormShadow").prop("checked", true).change();
	$("#pokemonFormTrainerName").val(pokemonToEdit.trainername);
	$("#pokemonFormTrainerID").val(pokemonToEdit.trainerid);
	$("#pokemonFormOriginMark").val(pokemonToEdit.originmark).change();
	$("#pokemonFormOriginGame").val(pokemonToEdit.origingame).change();
	$("#pokemonFormCurrentGame").val(pokemonToEdit.currentgame).change();
	if(pokemonToEdit.box || pokemonToEdit.box == 0) $("#pokemonFormBox").val(pokemonToEdit.box).change();
	$("#pokemonFormTitle").val(pokemonToEdit.title).change();
	if(pokemonToEdit.scale) $("#pokemonFormScale").prop("checked", true).change();
	for(var r in pokemonToEdit.ribbons){
		$("#pokemonFormRibbon-" + pokemonToEdit.ribbons[r]).prop("checked", true).change();
	}
	if(pokemonToEdit.metlevel) $("#pokemonFormMetLevel").val(pokemonToEdit.metlevel);
	$("#pokemonFormMetDate").val(pokemonToEdit.metdate).change();
	$("#pokemonFormMetLocation").val(pokemonToEdit.metlocation);
	if(pokemonToEdit.pokerus.length) $("#pokemonFormPokerus-" + pokemonToEdit.pokerus).prop("checked", true).change();
	for(var a in pokemonToEdit.achievements){
		$("#pokemonFormAchievements-" + pokemonToEdit.achievements[a]).prop("checked", true).change();
	}
	$("#pokemonFormNotes").val(pokemonToEdit.notes);
	modalPokemonForm.toggle();
}

function copyPokemon(){
	var cardContainer = $(event.target).parents(".col");
	var pokemonID = Number(cardContainer[0].dataset.pokemonId);
	var pokemonName = cardContainer.find(".card-header-name").text();
	if(confirm("Are you sure you want to create a copy of " + pokemonName + "?")){
		var pokemonToCopy = userPokemon[pokemonID];
		userPokemon.splice(pokemonID, 0, pokemonToCopy);
		localStorage.pokemon = JSON.stringify(userPokemon);
		updateModifiedDate();
		$("#tracker-grid .col").each(function(){
			if(Number(this.dataset.pokemonId) > pokemonID){
				$(this).attr("data-pokemon-id", Number(this.dataset.pokemonId)+1);
			}
		});
		cardContainer.after(createCard(pokemonToCopy, pokemonID+1));
		updatePopovers();
	}
}

function deletePokemon(){
	var cardContainer = $(event.target).parents(".col");
	var pokemonID = Number(cardContainer[0].dataset.pokemonId);
	var pokemonName = cardContainer[0].dataset.name;
	if(confirm("Are you sure you want to delete " + pokemonName + "? This is permanent!")){
		cardContainer.fadeOut(250, function(){
			$(this).remove();
		});
		userPokemon.splice(pokemonID, 1);
		localStorage.pokemon = JSON.stringify(userPokemon);
		updateModifiedDate();
		$("#tracker-grid .col").each(function(){
			if(Number(this.dataset.pokemonId) > pokemonID){
				$(this).attr("data-pokemon-id", Number(this.dataset.pokemonId)-1);
			}
		});
	}
}

function ribbonChecklist(){
	var $cardContainer = $(event.target).parents(".col");
	var cardData = $cardContainer[0].dataset;

	// top info - sprite
	var cardSprite = $cardContainer.find(".card-sprite").attr("src");
	$("#modalRibbonChecklistInfo-sprite img").attr("src", cardSprite);

	// top info - name
	var $cardName = $("<div>").html($cardContainer.find(".card-header-fullname").html());
	$cardName.find("img").remove();
	$("#modalRibbonChecklistInfo-name").html($cardName.html());

	// for alerts
	var pronounSubject = "it";
	var pronounObject = "it";
	if(cardData.gender == "male"){
		pronounSubject = "he";
		pronounObject = "him";
	}
	if(cardData.gender == "female"){
		pronounSubject = "she";
		pronounObject = "her";
	}
	var currentGame;
	if(cardData.currentGame){
		currentGame = cardData.currentGame;
		$("#modalRibbonChecklistInfo-currentgame").text("Currently in " + getGameData(currentGame, "name", false));
	}
	var ribbonDisplay = "Ribbons";
	if(currentGame === "scar" || currentGame === "vio"){
		ribbonDisplay = "Ribbons or Marks";
	}

	// reset
	$("#modalRibbonChecklistRows").html("");
	$("#modalRibbonChecklistStatus").html("").append($("<div>", { "id": "modalRibbonChecklistStatus-text", "class": "col-12 p-2 px-3 text-center" }));

	// handle warnings
	if(cardData.ribbonWarnings){
		var ribbonWarnings = JSON.parse(cardData.ribbonWarnings);
		$("#modalRibbonChecklistStatus").prepend($("<div>", { "id": "modalRibbonChecklistStatus-warnings", "class": "col-12 p-0 text-center bg-danger" }));
		for(var w in ribbonWarnings){
			var warningText = "unknown warning";
			if(ribbonWarnings[w] == "winning-ribbon") warningText = "If " + cardData.name + " reaches Lv.51, the Winning Ribbon will become unavailable!";
			if(ribbonWarnings[w] == "footprint-gen4") warningText = "If " + cardData.name + " reaches Lv.71 before transferring to Gen&nbsp;V, the Footprint Ribbon will only be available in Gen&nbsp;IV!";
			if(ribbonWarnings[w] == "footprint-virtualconsole") warningText = "If " + cardData.name + " reaches Lv.71 before transferring to Gen&nbsp;VII, the Footprint Ribbon will become unavailable!";
			if(ribbonWarnings[w] == "footprint-met-level") warningText = cardData.name + "'s Met Level has not been set. The availability of the Footprint Ribbon cannot be determined.";
			if(ribbonWarnings[w] == "footprint-beldum") warningText = "Evolving " + cardData.name + " into Metagross will make the Footprint Ribbon unavailable!";
			if(ribbonWarnings[w] == "evolution-warning"){
				var evoWarnName = getPokemonData(cardData.evolutionWarning, "names")["eng"];
				var evoWarnForms = getPokemonData(cardData.evolutionWarning, "forms");
				if(!evoWarnForms){
					evoWarnForms = getPokemonData(cardData.evolutionWarning, "forms-all");
					if(!evoWarnForms){
						var pokemonFormSource = getPokemonData(cardData.evolutionWarning, "form-source");
						if(pokemonFormSource){
							evoWarnForms = translations.forms[pokemonFormSource];
						}
					}
				}
				if(evoWarnForms){
					if(typeof evoWarnForms === "string"){
						evoWarnName = evoWarnName + " (" + evoWarnForms + ")";
					} else {
						evoWarnName = evoWarnName + " (" + evoWarnForms["eng"] + ")";
					}
				}
				warningText = "Evolving " + cardData.name + " into " + evoWarnName + " may change the availability of certain Ribbons!";
			}
			$("#modalRibbonChecklistStatus-warnings").append($("<div>", { "class": "p-2 px-3 border-bottom border-2" }).html(warningText));
		}
		$("#modalRibbonChecklistStatus-warnings > div:last-child").removeClass("border-bottom border-2");
	}

	if(currentGame){
		if(cardData.originGame || (cardData.species !== "nincada" && cardData.originMark !== "none")){
			if(cardData.remainingRibbons){
				var remainingRibbons = JSON.parse(cardData.remainingRibbons);
				var compatibleGames = JSON.parse(cardData.compatibleGames);
				var currentGameStatus = "";
				var lastChanceGen = 1000;
				/* initial game push */
				for(var game in remainingRibbons){
					var gameRemainingRibbons = remainingRibbons[game];
					if(gameRemainingRibbons.includes("world-ability-ribbon") && settings.ShowWorldAbility == "false"){
						if(gameRemainingRibbons.length == 1){
							continue;
						} else {
							gameRemainingRibbons = gameRemainingRibbons.filter(item => item !== "world-ability-ribbon");
						}
					}
					$checklistRow = $("<div>", { "class": "col-12 border-bottom border-2 pb-2", "data-gen": getGameData(game, "gen"), "data-ribbons": JSON.stringify(gameRemainingRibbons) });
					var plainGameName = games[game].name;
					if(game == "sm" || game == "usum"){
						if($("#modalRibbonChecklistRows .alola").length){
							continue;
						} else {
							$checklistRow.addClass("alola");
							if((game == "sm" && Object.keys(remainingRibbons).includes("usum")) || (game == "usum" && Object.keys(remainingRibbons).includes("sm"))){
								plainGameName = games["sm"].name + "/" + games["usum"].name;
							}
						}
					}
					var formattedGameName = "<span class='text-nowrap'>" + plainGameName.replaceAll("/", "/</span><span class='text-nowrap'>") + "</span>";
					$checklistRowTitle = $("<div>", { "class": "modalRibbonChecklistRows-gamename fw-bold mb-2" }).html(formattedGameName);
					if(game == currentGame || game == getGameData(currentGame, "partOf", false) || (game == "sm" && getGameData(currentGame, "partOf", false) == "usum")){
						$checklistRow.attr("data-order", "0");
					} else {
						$checklistRow.attr("data-order", gameOrder[game]);
					}
					$checklistRow.append($checklistRowTitle);
					$("#modalRibbonChecklistRows").append($checklistRow);
				}
				/* sort games in order */
				var checklistGameList = document.querySelector("#modalRibbonChecklistRows");
				var comparison = function(a, b){
					return a.dataset.order - b.dataset.order;
				};
				[...checklistGameList.children].sort(comparison).forEach(node => checklistGameList.appendChild(node));
				$("#modalRibbonChecklistRows > .col-12:last-child").removeClass("border-bottom border-2 pb-2");
				$("#modalRibbonChecklistRows > .col-12").each(function(i, g){
					var allGameRibbons = JSON.parse(g.dataset.ribbons);
					var thisGameOrder = Number(g.dataset.order);
					for(var r in allGameRibbons){
						var availableElsewhere = false;
						$("#modalRibbonChecklistRows > .col-12[data-ribbons*='\"" + allGameRibbons[r] + "\"']").each(function(ii, gi){
							if(Number(gi.dataset.order) > thisGameOrder){
								availableElsewhere = true;
							}
						});
						var addToList = ".last-chance-list";
						if(availableElsewhere){
							if(thisGameOrder === 0 && currentGameStatus !== "last-chance"){
								currentGameStatus = "available-elsewhere";
							}
							if(!$(g).find(".available-elsewhere").length){
								$sectionLabel = $("<div>").text("Available in other games");
								$sectionRibbons = $("<div>", { "class": "available-elsewhere-list" });
								$(g).append($("<div>", { "class": "available-elsewhere px-3" }).append($sectionLabel, $sectionRibbons));
							}
							addToList = ".available-elsewhere-list";
						} else {
							if(thisGameOrder === 0){
								currentGameStatus = "last-chance";
							}
							if(Number(g.dataset.gen) < lastChanceGen){
								lastChanceGen = Number(g.dataset.gen);
							}
							if((allGameRibbons[r] == "mini-mark" || allGameRibbons[r] == "jumbo-mark") && cardData.scaleChecked == "false"){
								if(!$(g).find(".scale-marks").length){
									$sectionLabel = $("<div>", { "class": "fw-bold" }).text("Check scale in Mesagoza");
									$sectionRibbons = $("<div>", { "class": "scale-marks-list" });
									$(g).append($("<div>", { "class": "scale-marks px-3" }).append($sectionLabel, $sectionRibbons));
								}
								addToList = ".scale-marks";
							} else if(!$(g).find(".last-chance").length){
								$sectionLabel = $("<div>", { "class": "fw-bold" }).text("Last chance");
								$sectionRibbons = $("<div>", { "class": "last-chance-list" });
								$(g).find(".modalRibbonChecklistRows-gamename").after($("<div>", { "class": "last-chance px-3 mb-2" }).append($sectionLabel, $sectionRibbons));
							}
						}
						var $ribbonBtn = $("<a>", { "class": "d-inline-block p-0 mt-1 modalRibbonChecklistRows-ribbon ribbonsprite " + allGameRibbons[r], "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": ribbons[allGameRibbons[r]].names[translations.ietfToPokemon[settings.language]], "data-bs-content": ribbons[allGameRibbons[r]].descs[translations.ietfToPokemon[settings.language]] });
						if(ribbons[allGameRibbons[r]].titles){
							$ribbonBtn.attr("title", "<div>" + $ribbonBtn.attr("title") + "</div><div class='popover-ribbon-title'>(" + ribbons[allGameRibbons[r]].titles[translations.ietfToPokemon[settings.language]] + ")</div>");
						}
						$(g).find(addToList).append($ribbonBtn);
					}
				});
				if(currentGameStatus === "last-chance"){
					$("#modalRibbonChecklistStatus-text").addClass("bg-danger-subtle").html(cardData.name + " still has " + ribbonDisplay + " to earn in <span class='text-nowrap'>" + games[currentGame].name + "</span>.");
				} else {
					var moveTo = $(".last-chance").first().prev().html().toString();
					if(lastChanceGen == Number(getGameData(currentGame, "gen")) && lastChanceGen < 8){
						$("#modalRibbonChecklistStatus-text").addClass("bg-warning-subtle").html(cardData.name + " can safely move to " + moveTo + " but " + pronounSubject + " cannot leave Gen " + translations.arabicToRoman[lastChanceGen-1] + " yet.");
					} else {
						$("#modalRibbonChecklistStatus-text").addClass("bg-success-subtle").html(cardData.name + " can safely move to " + moveTo + ".");
					}
				}
			} else {
				ribbonDisplay = "Ribbons or Marks";
				$("#modalRibbonChecklistStatus-text").addClass("bg-success-subtle").text("There are no more " + ribbonDisplay + " for " + cardData.name + " to earn!");
			}
		} else {
			ribbonDisplay = "Ribbons or Marks";
			$("#modalRibbonChecklistStatus-text").addClass("bg-warning-subtle").text("You must set " + cardData.name + "'s Origin Game to determine which " + ribbonDisplay + " " + pronounSubject + " can earn.");
		}
	} else {
		ribbonDisplay = "Ribbons or Marks";
		$("#modalRibbonChecklistStatus-text").addClass("bg-warning-subtle").text("You must set " + cardData.name + "'s Current Game to determine which " + ribbonDisplay + " " + pronounSubject + " can earn.");
	}
	updatePopovers();
	modalRibbonChecklist.toggle();
}

function createCard(p, id){
	/* information */
	// TODO: reduce duplication: getEarnableRibbons -- merge some of this logic into a new function that returns earnable ribbons *and* compatible games
	var ribbonLists;
	var currentGen = 1000;
	var virtualConsole = false;
	if(p.currentgame){
		if(p.currentgame == "go"){
			currentGen = 8;
		} else {
			currentGen = parseInt(getGameData(p.currentgame, "gen"));
		}
		if(currentGen < 3){
			virtualConsole = true;
			currentGen = 7;
		}
	}
	if(p.currentgame){
		// origin game is only needed for Gen III and Nincada
		var canGetRibbonLists = false;
		if(p.origingame){
			canGetRibbonLists = true;
		} else if(p.species !== "nincada" && currentGen !== 3){
			canGetRibbonLists = true;
		}
		ribbonLists = getEarnableRibbons(p.species, p.currentlevel, p.metlevel, p.currentgame, p.origingame, p.ribbons, p.scale, p.totem, p.gmax, p.shadow);
	}
	var displayName = p.nickname;
	if(displayName.length === 0){
		var displayNameLang = p.language;
		if(!displayNameLang) displayNameLang = "eng";
		displayName = getPokemonData(p.species, "names")[displayNameLang];
	}
	var compatibleGames = getPokemonData(p.species, "games");
	var compatibleFiltered = [];
	if(currentGen < 1000){
		for(var cg in compatibleGames){
			var compatibleTest = false;
			if(games[compatibleGames[cg]]){
				if(compatibleGames[cg] == "lgp" || compatibleGames[cg] == "lge"){
					if(p.currentgame == "lgp" || p.currentgame == "lge" || p.currentgame == "go"){
						compatibleTest = true;
					}
				} else {
					var targetGen = parseInt(getGameData(compatibleGames[cg], "gen"));
					if(targetGen >= currentGen || (virtualConsole && targetGen < 3) || (currentGen == 9 && targetGen == 8)){
						compatibleTest = true;
					}
				}
				if(compatibleTest){
					compatibleFiltered.push(compatibleGames[cg]);
					var comboToAdd = getGameData(compatibleGames[cg], "partOf", true);
					if(comboToAdd && !compatibleFiltered.includes(comboToAdd)){
						compatibleFiltered.push(comboToAdd);
					}
				}
			}
		}
	}

	/* containers and filters */
	var $cardCol = $("<div>", { "class": "col", "data-name": displayName, "data-national-dex": getPokemonData(p.species, "natdex"), "data-level": p.currentlevel, "data-origin-mark": p.originmark, "data-origin-game": p.origingame, "data-current-game": p.currentgame, "data-compatible-games": JSON.stringify(compatibleFiltered), "data-earned-ribbons": JSON.stringify(p.ribbons), "data-pokemon-id": id, "data-gender": p.gender, "data-species": p.species, "data-current-gen": currentGen, "data-scale-checked": p.scale ? p.scale : false });
	if(ribbonLists){
		if(Object.keys(ribbonLists.remaining).length == 0){
			$cardCol.addClass("ribbons-done");
		} else {
			$cardCol.attr({ "data-remaining-ribbons": JSON.stringify(ribbonLists.remaining) });
		}
		if(ribbonLists.warnings.length !== 0){
			$cardCol.attr({ "data-ribbon-warnings": JSON.stringify(ribbonLists.warnings) });
		}
		if(ribbonLists.evolutionWarning.pokemon){
			$cardCol.attr({ "data-evolution-warning": ribbonLists.evolutionWarning.pokemon });
		}
	}
	var $cardContainer = $("<div>", { "class": "card border-0" });

	/* sections */
	var $cardHeader = $("<div>", { "class": "card-header d-flex justify-content-between" });
	var $cardBody = $("<div>", { "class": "card-body d-flex align-items-center p-0" });
	var $cardFooter = $("<div>", { "class": "card-footer" });

	/* header */
	var $cardHeaderLeft = $("<div>", { "class": "card-header-fullname" });
	var $cardHeaderBallMain = $("<span>", { "class": "align-text-top me-2 ball ball-" + p.ball, "title": balls[p.ball]["eng"] });
	var $cardHeaderBallStrange = "";
	if(p.currentgame && ((p.currentgame !== "pla" && p.currentgame !== "home" && balls[p.ball].hisui) || (p.currentgame == "pla" && !balls[p.ball].hisui))){
		if(p.strangeball !== "disabled"){
			$cardHeaderBallStrange = $("<span>", { "class": "align-text-top me-2 ball ball-strange", "title": "Strange Ball" });
			if(p.strangeball == ""){
				$cardHeaderBallMain.addClass("card-header-ball-selected");
				$cardHeaderBallStrange.addClass("card-header-ball-strange");
			} else if(p.strangeball == "enabled"){
				$cardHeaderBallMain = $cardHeaderBallStrange;
			}
		}
	}
	$cardHeaderLeft.append($cardHeaderBallMain, $cardHeaderBallStrange);
	var $cardHeaderLeftName = $("<span>", { "class": "align-baseline" });
	var titleRibbon;
	var titlePositions = {
		"ger": "prefix",
		"eng": "suffix",
		"spa": "suffix",
		"fre": "suffix",
		"ita": "suffix",
		"jpn": "prefix",
		"kor": "prefix",
		"cht": "prefix",
		"chs": "prefix"
	}
	if(p.title && p.title !== "None"){
		titleRibbon = ribbons[p.title];
		if(titleRibbon.titlePosition){
			for(let tp in titleRibbon.titlePosition){
				titlePositions[tp] = titleRibbon.titlePosition[tp];
			}
		}
		for(let tp in titlePositions){
			if(titlePositions[tp] == "prefix"){
				var titleText = titleRibbon.titles[tp];
				if(p.title == "partner-ribbon"){
					titleText = titleText.replace(/\[.*?\]/, p.trainername);
				}
				$cardHeaderLeftName.append($("<span>", { "class": "me-1 card-header-title translation translation-" + tp, text: titleText }));
			}
		}
	}
	$cardHeaderLeftName.append($("<span>", { "class": "fw-bold d-inline-block card-header-name", text: displayName }));
	if(p.title && p.title !== "None"){
		for(let tp in titlePositions){
			if(titlePositions[tp] == "suffix"){
				var titleText = titleRibbon.titles[tp];
				if(p.title == "partner-ribbon"){
					titleText = titleText.replace(/\[.*?\]/, p.trainername);
				}
				$cardHeaderLeftName.append($("<span>", { "class": "ms-1 card-header-title translation translation-" + tp, text: titleText }));
			}
		}
	}
	$cardHeaderLeft.append($cardHeaderLeftName);
	if(p.gender && p.gender !== "unknown"){
		var genderText = p.gender.charAt(0).toUpperCase() + p.gender.slice(1);
		$cardHeaderLeft.append($("<img>", { "class": "align-text-top card-header-gender ms-2", "src": "img/ui/gender-" + p.gender + ".png", "alt": genderText, "title": genderText }));
	}
	if(p.shiny){
		var shinyIcon = "shiny-star.png";
		if(p.shiny == "square"){
			shinyIcon = "shiny-square.svg";
		}
		$cardHeaderLeft.append($("<img>", { "class": "align-text-top ms-2 card-header-shiny", "src": "img/ui/" + shinyIcon, "alt": "Shiny", "title": "Shiny" }));
	}
	$cardHeader.append($cardHeaderLeft);
	
	var $cardHeaderRight = $("<div>", { "class": "card-header-right d-flex" });
	var $cardHeaderTitle = "";
	if(p.title && p.title !== "None"){
		$cardHeaderTitle = $("<a>", { "class": "ms-2 card-header-title-ribbon ribbonsprite " + p.title, "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": ribbons[p.title].names[translations.ietfToPokemon[settings.language]], "data-bs-content": ribbons[p.title].descs[translations.ietfToPokemon[settings.language]] });
		if(ribbons[p.title].titles){
			$cardHeaderTitle.attr("title", "<div>" + $cardHeaderTitle.attr("title") + "</div><div class='popover-ribbon-title'>(" + ribbons[p.title].titles[translations.ietfToPokemon[settings.language]] + ")</div>");
		}
	}
	var $cardHeaderButton = $("<button>", { "type": "button", "class": "btn btn-link p-0 ms-1 position-relative", "onclick": "ribbonChecklist()", "aria-label": "Ribbon Checklist", "title": "Ribbon Checklist" })
		.append($("<span>", { "class": "ribbon-checklist-warning-badge position-absolute translate-middle bg-danger rounded-circle" }).html($("<span>", {"class": "visually-hidden"}).text("Warnings")));
	$cardHeaderRight.append($cardHeaderTitle, $cardHeaderButton);

	$cardHeader.append($cardHeaderRight);

	/* body */
	var speciesSprite = p.species;
	if(aprilFools && settings["AprilFools"]){
		speciesSprite = "ditto";
		if(p.species == "ditto"){
			speciesSprite = "mew";
		}
	}
	var genderDirectory = ((!aprilFools || !settings["AprilFools"]) && getPokemonData(speciesSprite, "femsprite") && p.gender === "female") ? "female/" : "";
	if(speciesSprite.startsWith("alcremie-") && p.shiny){
		var alcremieRegex = /caramel|lemon|matcha|mint|rainbow|rubycream|rubyswirl|salted|vanilla/;
		speciesSprite = speciesSprite.replace(alcremieRegex, "").replace("--", "-").replace("-strawberry", "");
	}
	$cardBody.append($("<img>", { "class": "card-sprite p-1 flex-shrink-0", "src": "img/pkmn/" + (p.shiny ? "shiny" : "regular") + "/" + genderDirectory + speciesSprite + ".png", "alt": getPokemonData(p.species, "names")["eng"], "title": getPokemonData(p.species, "names")["eng"] }));
	var $cardRibbons = $("<div>", { "class": "card-ribbons flex-grow-1 d-flex flex-wrap p-1" });
	var ribbonCount = 0, ribbonCountGen7Check = 0, markCount = 0, battleMemory = "", contestMemory = "", battleMemories = [], contestMemories = [];
	for(let r in p.ribbons){
		var cardRibbonClass = p.ribbons[r] + " ribbonsprite";
		if(ribbons[p.ribbons[r]].mark){
			markCount++;
		} else {
			if(ribbons[p.ribbons[r]].merge){
				cardRibbonClass = cardRibbonClass + " old-ribbon-to-merge";
			}
			if(!p.ribbons[r].startsWith("battle-memory-ribbon") && !p.ribbons[r].startsWith("contest-memory-ribbon")){
				ribbonCount++;
				if(ribbons[p.ribbons[r]].merge == "battle"){
					if(!battleMemories.length) ribbonCountGen7Check++;
					battleMemories.push(p.ribbons[r]);
				} else if(ribbons[p.ribbons[r]].merge == "contest"){
					if(!contestMemories.length) ribbonCountGen7Check++;
					contestMemories.push(p.ribbons[r]);
				} else {
					ribbonCountGen7Check++;
				}
			}
		}
		var $ribbonBtn = $("<a>", { "class": cardRibbonClass, "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": ribbons[p.ribbons[r]].names[translations.ietfToPokemon[settings.language]], "data-bs-content": ribbons[p.ribbons[r]].descs[translations.ietfToPokemon[settings.language]] });
		if(ribbons[p.ribbons[r]].titles){
			$ribbonBtn.attr("title", "<div>" + $ribbonBtn.attr("title") + "</div><div class='popover-ribbon-title'>(" + ribbons[p.ribbons[r]].titles[translations.ietfToPokemon[settings.language]] + ")</div>");
		}
		$cardRibbons.append($ribbonBtn);
	}
	if(ribbonCount == 0 && markCount == 0){
		$cardRibbons.append($("<div>", { "class": "ms-2" }).text("This Pokémon has no ribbons."));
	}
	if(!p.ribbons.includes("battle-memory-ribbon") && !p.ribbons.includes("battle-memory-ribbon-gold") && battleMemories.length && currentGen >= 6){
		if(p.currentgame === "scar" || p.currentgame === "vio" || p.currentgame === "home"){
			if(battleMemories.length >= 7){
				battleMemory = "-gold";
			}
		} else if(currentGen === 7){
			if(ribbonCountGen7Check >= 8){
				battleMemory = "-gold";
			}
		} else {
			if(battleMemories.length == 8){
				battleMemory = "-gold";
			}
		}
		var $ribbonBtn = $("<a>", { "class": "auto-memory-ribbon battle-memory-ribbon" + battleMemory + " ribbonsprite", "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": "<div>" + ribbons["battle-memory-ribbon" + battleMemory].names[translations.ietfToPokemon[settings.language]] + " (" + battleMemories.length + ")</div><div class='popover-ribbon-title'>(" + ribbons["battle-memory-ribbon" + battleMemory].titles[translations.ietfToPokemon[settings.language]] + ")</div>", "data-bs-content": ribbons["battle-memory-ribbon" + battleMemory].descs[translations.ietfToPokemon[settings.language]] + "<div class='card-ribbons-memories d-flex flex-wrap mt-2'>" });
		for(let m in battleMemories){
			$ribbonBtn.attr("data-bs-content", $ribbonBtn.attr("data-bs-content") + "<span class='" + battleMemories[m] + " ribbonsprite' role='img' aria-label='" + ribbons[battleMemories[m]].names[translations.ietfToPokemon[settings.language]] + "'></span>");
		}
		$ribbonBtn.attr("data-bs-content", $ribbonBtn.attr("data-bs-content") + "</div>");
		$cardRibbons.append($ribbonBtn);
	}
	if(!p.ribbons.includes("contest-memory-ribbon") && !p.ribbons.includes("contest-memory-ribbon-gold") && contestMemories.length && currentGen >= 6){
		if(currentGen === 7){
			if(ribbonCountGen7Check >= 40){
				contestMemory = "-gold";
			}
		} else {
			if(contestMemories.length == 40){
				contestMemory = "-gold";
			}
		}
		var $ribbonBtn = $("<a>", { "class": "auto-memory-ribbon contest-memory-ribbon" + contestMemory + " ribbonsprite", "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": "<div>" + ribbons["contest-memory-ribbon" + contestMemory].names[translations.ietfToPokemon[settings.language]] + " (" + contestMemories.length + ")</div><div class='popover-ribbon-title'>(" + ribbons["contest-memory-ribbon" + contestMemory].titles[translations.ietfToPokemon[settings.language]] + ")</div>", "data-bs-content": ribbons["contest-memory-ribbon" + contestMemory].descs[translations.ietfToPokemon[settings.language]] + "<div class='card-ribbons-memories d-flex flex-wrap mt-2'>" });
		for(let m in contestMemories){
			$ribbonBtn.attr("data-bs-content", $ribbonBtn.attr("data-bs-content") + "<span class='" + contestMemories[m] + " ribbonsprite' role='img' aria-label='" + ribbons[contestMemories[m]].names[translations.ietfToPokemon[settings.language]] + "'></span>");
		}
		$ribbonBtn.attr("data-bs-content", $ribbonBtn.attr("data-bs-content") + "</div>");
		$cardRibbons.append($ribbonBtn);
	}
	$cardBody.append($cardRibbons);

	/* footer */
	var $cardFooterTop = $("<div>", { "class": "card-footer-top d-flex justify-content-between" })
		.append($("<div>").text(ribbonCount + " Ribbon" + (ribbonCount !== 1 ? "s" : "") + (markCount ? ", " + markCount + " Mark" + (markCount !== 1 ? "s" : "") : "")));
	if(p.box !== -1){
		$cardCol.attr("data-box", "" + p.box);
		var boxName = userBoxes[p.box];
		var $cardFooterBox = $("<div>", { "class": "card-footer-top-box" })
			.append($("<img>", { "class": "align-text-top me-1", "src": "img/ui/box-closed.png", "alt": "Box", "title": "Box" }))
			.append($("<span>", { "class": "card-footer-top-box-name" }).text(boxName));
		$cardFooterTop.append($cardFooterBox);
	}
	var $cardFooterBottom = $("<div>", { "class": "card-footer-bottom d-flex justify-content-between" });
	var $cardFooterBottomLevel = $("<span>", { "class": "align-middle card-footer-level" } )
		.append($("<span>").text("Lv."))
		.append($("<span>").text(p.currentlevel));
	var displayLang = p.language;
	if(displayLang === "spa"){
		displayLang === "sp-eu";
	}
	var $cardFooterBottomLeft = $("<div>")
		.append($cardFooterBottomLevel,
			$("<span>", { "class": "align-middle card-footer-language d-inline-block text-center rounded-pill fw-bold mx-2 text-uppercase" }).text(displayLang)
		);
	var originName = origins[p.originmark].name;
	if(p.origingame){
		originName = getGameData(p.origingame, "name");
	}
	if(p.originmark == "none"){
		if(p.origingame){
			var originGen = getGameData(p.origingame, "gen");
			var platformIcon = getGameData(p.origingame, "platformIcon");
			$cardFooterBottomLeft.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-arabic", "src": "img/origins/custom/arabic/" + originGen + ".svg", "alt": originName, "title": originName }))
				.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-arabic-outline", "src": "img/origins/custom/arabic-outline/" + originGen + ".svg", "alt": originName, "title": originName }))
				.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-roman", "src": "img/origins/custom/roman/" + originGen + ".svg", "alt": originName, "title": originName }))
				.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-roman-outline", "src": "img/origins/custom/roman-outline/" + originGen + ".svg", "alt": originName, "title": originName }))
				.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-platform", "src": "img/origins/custom/platforms/" + platformIcon + ".svg", "alt": originName, "title": originName }));
		}
	} else {
		$cardFooterBottomLeft.append($("<img>", { "class": "align-middle card-footer-origin", "src": "img/origins/" + p.originmark + ".png", "alt": originName, "title": originName }));
	}
	var $cardFooterBottomRight = $("<div>")
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 align-text-bottom card-sortable-handle" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/move.svg", "alt": "Move", "title": "Drag to re-order" })))
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 align-text-bottom", "onclick": "editPokemon()" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/edit.svg", "alt": "Edit", "title": "Edit" })))
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 align-text-bottom", "onclick": "copyPokemon()" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/copy.svg", "alt": "Copy", "title": "Copy" })))
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 align-text-bottom", "onclick": "deletePokemon()" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/delete.svg", "alt": "Delete", "title": "Delete" })));
	$cardFooterBottom.append($cardFooterBottomLeft, $cardFooterBottomRight);
	$cardFooter.append($cardFooterTop, $cardFooterBottom);

	/* create and return the card */
	$cardContainer.append($cardHeader, $cardBody, $cardFooter);
	$cardCol.append($cardContainer);
	return $cardCol;
}

/* preset settings */
function presetSettings(change = false){
	if(settings.theme){
		$("#settingsTheme").val(settings.theme);
		if(change) $("#settingsTheme").change();
	}
	if(settings.language){
		$("#settingsLanguage").val(settings.language);
		if(change) $("#settingsLanguage").change();
	}
	if(settings.ChecklistButtons){
		$("#settingsChecklistButtons").val(settings.ChecklistButtons);
		if(change) $("#settingsChecklistButtons").change();
	}
	if(settings.TitleRibbon){
		$("#settingsTitleRibbon").val(settings.TitleRibbon);
		if(change) $("#settingsTitleRibbon").change();
	}
	if(settings.OldRibbons){
		$("#settingsOldRibbons").val(settings.OldRibbons);
		if(change) $("#settingsOldRibbons").change();
	}
	if(settings.ExtraOriginMarks){
		$("#settingsExtraOriginMarks").val(settings.ExtraOriginMarks);
		if(change) $("#settingsExtraOriginMarks").change();
	}
	if(settings.CardView){
		$("#switchViewBtn-" + settings.CardView).prop("checked", true);
	}
	if(settings.RibbonFormView){
		$("#switchRibbonFormViewBtn-" + settings.RibbonFormView).prop("checked", true);
	}
	for(let i in toggles){
		if(toggles[i]){
			// default is true
			if(settings[i] && settings[i] == "false"){
				$("#settings" + i).prop("checked", false);
			} else {
				$("#settings" + i).prop("checked", true);
			}
		} else {
			// default is false
			if(settings[i] && settings[i] == "true"){
				$("#settings" + i).prop("checked", true);
			} else {
				$("#settings" + i).prop("checked", false);
			}
		}
		if(change) $("#settings" + i).change();
	}
}

/* reset Pokemon form */
function resetPokemonForm(edit = false){
	setFormValidAll();
	if(edit){
		$("#modalPokemonFormLabel").text("Edit Pokémon");
	} else {
		$("#modalPokemonFormLabel").text("Add New Pokémon");
	}
	$("#pokemonFormTabs-details").click();
	$("#modalPokemonForm input").each(function(){
		if($(this).attr("type") === "text" || $(this).attr("type") === "number" || $(this).attr("type") === "date" || $(this).attr("type") === "search"){
			$(this).val("").change();
		} else if($(this).attr("type") === "checkbox"){
			$(this).prop("checked", false).change();
		}
	});
	$("#modalPokemonForm select").each(function(){
		$(this).val(null).change();
	});
	$("#pokemonFormShinyGroup input, #pokemonFormGenderGroup input").prop("disabled", false);
	$("#pokemonFormGender-unknown").prop("disabled", true);
	$("#pokemonFormShiny-normal, #pokemonFormGender-male, #pokemonFormStrangeBall-global, #pokemonFormPokerus-none").prop("checked", true).change();
	$("#pokemonFormNotes").val("");
	$("#pokemonFormSprite").attr("src", "img/ui/1x1.svg");
	$("#pokemonFormLanguage").val(translations.ietfToPokemon[settings.language]).change();

	/* re-populate boxes dropdown */
	var $boxNone = $("<option>", { "value": "-1" }).text(translations.none["eng"]);
	for(var lang in translations.none){
		$boxNone.attr("data-lang-" + lang, translations.none[lang]);
	}
	$("#pokemonFormBox").html($boxNone);
	for(var b in userBoxes){
		$("#pokemonFormBox").append(new Option(userBoxes[b], b));
	}
	$("#pokemonFormBox").val("-1").change();
	$("#pokemonFormTitle").val("None").change();
	$("#pokemonFormRibbons li").removeClass("d-none");
	$("#pokemonFormRibbons-none").addClass("d-none");
}

function relistFilterBoxes(){
	var $boxNone = $("<option>", { "value": "-1" }).text(translations.none["eng"]);
	for(var lang in translations.none){
		$boxNone.attr("data-lang-" + lang, translations.none[lang]);
	}
	$("#filterFormBox").html(new Option()).append($boxNone);
	for(var b in userBoxes){
		$("#filterFormBox").append(new Option(userBoxes[b], b));
	}
}

/* reset filter form */
function resetFilterForm(relistBoxes = false){
	filterState = "reset";

	/* re-populate boxes dropdown */
	if(relistBoxes){
		relistFilterBoxes();
	}

	/* reset all options */
	$("#modalFilterForm select, #modalFilterForm input").each(function(){
		if(this.id === "filterFormSort"){
			$(this).val("default").change();
		} else {
			$(this).val("").change();
		}
	});
	$("#tracker-grid .col").show();
	filterBubble();
	filterState = "default";
}

function sortPokemonList(){
	var trackerList = document.querySelector("#tracker-grid");
	var comparison = function(a, b){
		return a.dataset.pokemonId - b.dataset.pokemonId;
	}
	if(activeSort == "dexasc"){
		comparison = function(a, b){
			return a.dataset.nationalDex - b.dataset.nationalDex;
		}
	} else if(activeSort == "dexdesc"){
		comparison = function(a, b){
			return b.dataset.nationalDex - a.dataset.nationalDex;
		}
	} else if(activeSort == "levelasc"){
		comparison = function(a, b){
			return a.dataset.level - b.dataset.level;
		}
	} else if(activeSort == "leveldesc"){
		comparison = function(a, b){
			return b.dataset.level - a.dataset.level;
		}
	} else if(activeSort == "nameasc"){
		comparison = function(a, b){
			return a.dataset.name.toLowerCase().localeCompare(b.dataset.name.toLowerCase());
		}
	} else if(activeSort == "namedesc"){
		comparison = function(a, b){
			return b.dataset.name.toLowerCase().localeCompare(a.dataset.name.toLowerCase());
		}
	}
	[...trackerList.children].sort(comparison).forEach(node => trackerList.appendChild(node));
	filterBubble();
}

function filterBubble(){
	var activeFilterNum = Object.keys(activeFilters).length;
	$("#sectionTrackerFilterCount-num").text(activeFilterNum);
	if(activeSort == "default" && activeFilterNum == 0){
		$("#sectionTrackerFilterCount, #sectionTrackerFilterCount-num, #sectionTrackerFilterCount-sort").hide();
		if(sortablePokemon){
			sortablePokemon.option("disabled", false);
			$("body").removeClass("sorting-disabled");
		}
	} else {
		$("#sectionTrackerFilterCount").show();
		if(sortablePokemon){
			sortablePokemon.option("disabled", true);
			$("body").addClass("sorting-disabled");
		}
		if(activeSort == "default"){
			$("#sectionTrackerFilterCount-sort").hide();
		} else {
			$("#sectionTrackerFilterCount-sort").show();
		}
		if(activeFilterNum){
			$("#sectionTrackerFilterCount-num").show();
		} else {
			$("#sectionTrackerFilterCount-num").hide();
		}
	}


}

function filterPokemon(p, classes, data){
	var pass = true;
	filter_check:
	for(var f in activeFilters){
		if(f == "name"){
			if(data.nationalDex != activeFilters[f]){
				if(!data.name.toLowerCase().includes(activeFilters[f].toLowerCase())){
					if(!data.species.includes(activeFilters[f].toLowerCase())){
						pass = false;
						break;
					}
				}
			}
		} else if(f == "gender"){
			if(p.gender !== activeFilters[f]){
				pass = false;
				break;
			}
		} else if(f == "shiny"){
			if(activeFilters[f] == "shiny"){
				if(!p.shiny.length){
					pass = false;
					break;
				}
			} else if(activeFilters[f] == "normal"){
				if(p.shiny.length){
					pass = false;
					break;
				}
			} else {
				if(p.shiny !== activeFilters[f]){
					pass = false;
					break;
				}
			}
		} else if(f == "language"){
			if(p.language !== activeFilters[f]){
				pass = false;
				break;
			}
		} else if(f == "ball"){
			if(p.ball !== activeFilters[f]){
				pass = false;
				break;
			}
		} else if(f == "currentlevel-min"){
			if(Number(p.currentlevel) < Number(activeFilters[f])){
				pass = false;
				break;
			}
		} else if(f == "currentlevel-max"){
			if(Number(p.currentlevel) > Number(activeFilters[f])){
				pass = false;
				break;
			}
		} else if(f == "gmax"){
			if((p.gmax + "") !== activeFilters[f]){
				pass = false;
				break;
			}
		} else if(f == "pokerus"){
			if(activeFilters[f] == "any"){
				if(!p.pokerus.length){
					pass = false;
					break;
				}
			} else if(activeFilters[f] == "none"){
				if(p.pokerus.length){
					pass = false;
					break;
				}
			} else {
				if(p.pokerus !== activeFilters[f]){
					pass = false;
					break;
				}
			}
		} else if(f == "originmark"){
			if(p.originmark !== activeFilters[f]){
				pass = false;
				break;
			}
		} else if(f == "currentgame"){
			if(p.currentgame !== activeFilters[f]){
				pass = false;
				break;
			}
		} else if(f == "box"){
			if(Number(p.box) !== Number(activeFilters[f])){
				pass = false;
				break;
			}
		} else if(f == "targetgames"){
			var targetgames = JSON.parse(data.compatibleGames);
			if(!targetgames.includes(activeFilters[f])){
				pass = false;
				break;
			}
		} else if(f == "earnedribbons"){
			var earnedRibbons = JSON.parse(data.earnedRibbons);
			for(var er in activeFilters[f]){
				if(!earnedRibbons.includes(activeFilters[f][er])){
					pass = false;
					break filter_check;
				}
			}
		} else if(f == "targetribbons"){
			if(data.remainingRibbons){
				var targetRibbons = JSON.parse(data.remainingRibbons);
				var plainTargetRibbons = [];
				for(var game in targetRibbons){
					plainTargetRibbons = plainTargetRibbons.concat(targetRibbons[game]);
				}
				plainTargetRibbons = [...new Set(plainTargetRibbons)];
				for(var tr in activeFilters[f]){
					if(!plainTargetRibbons.includes(activeFilters[f][tr])){
						pass = false;
						break filter_check;
					}
				}
			} else {
				pass = false;
				break;
			}
		} else if(f == "status"){
			if(activeFilters[f] === "incomplete"){
				if(classes.length !== 1){
					pass = false;
					break;
				}
			} else if(!classes.contains(activeFilters[f])){
				pass = false;
				break;
			}
		}
	}
	return pass;
}

function filterPokemonList(){
	$("#tracker-grid .col").each(function(){
		var pokemonToFilter = userPokemon[this.dataset.pokemonId];
		if(filterPokemon(pokemonToFilter, this.classList, this.dataset)){
			$(this).show();
		} else {
			$(this).hide();
		}
	});
	filterBubble();
}

function updateFormSprite(){
	if($("#pokemonFormSpecies").val()){
		var species = $("#pokemonFormSpecies").val();
		var shinyDir = $("#pokemonFormShiny-normal").prop("checked") ? "regular/" : "shiny/";
		var femaleDir = $("#pokemonFormGender-female").prop("checked") && getPokemonData(species, "femsprite") ? "female/" : "";
		if(species.startsWith("alcremie-") && shinyDir == "shiny/"){
			var alcremieRegex = /caramel|lemon|matcha|mint|rainbow|rubycream|rubyswirl|salted|vanilla/;
			species = species.replace(alcremieRegex, "").replace("--", "-").replace("-strawberry", "");
		}
		$("#pokemonFormSprite").attr("src", "img/pkmn/" + shinyDir + femaleDir + species + ".png");
	}
}

function selectCustomMatcher(params, data){
	// fallbacks
	if(!params.term){
		return data;
	}
	var searchTerm = params.term.toUpperCase().trim();
	if(searchTerm === ""){
		return data;
	}
	if(typeof data.text === "undefined"){
		return null;
	}
	// if the plain text matches
	var dataText = data.text.normalize("NFC").replace(/[\u0300-\u036f]/g, "").toUpperCase();
	if(dataText.indexOf(searchTerm) > -1){
		var modifiedData = $.extend({}, data, true);
		return modifiedData;
	}
	// if other languages match
	for(var ded in data.element.dataset){
		if(ded.indexOf("lang") == 0){
			dataText = data.element.dataset[ded].normalize("NFC").replace(/[\u0300-\u036f]/g, "").toUpperCase();
			if(dataText.indexOf(searchTerm) > -1){
				var modifiedData = $.extend({}, data, true);
				return modifiedData;
			}
		}
	}
	return null;
}

function selectCustomOption(o){
	// o.id is the option value
	// TODO: some of these alternate-language options have data- attributes holding them, so there shouldn't be any need to search global JSON a second time
	var result = o._resultId || o.text;
	var selectIconClass = "pokemonFormSelectIcon";
	if(result.indexOf("filterForm") > 0){
		selectIconClass = "filterFormSelectIcon";
	}
	if(result.indexOf("pokemonFormBall") > 0 || result.indexOf("filterFormBall") > 0){
		var $ball = $("<span>")
			.append($("<span>", { "class": selectIconClass + " ball ball-" + o.id }));
		for(var oed in o.element.dataset){
			if(oed.indexOf("lang") == 0){
				lang = oed.substring(4).toLowerCase();
				$ball.append($("<span>", { "class": "translation translation-" + lang}).text(balls[o.id][lang]));
			}
		}
		return $ball;
	} else if(result.indexOf("pokemonFormOriginMark") > 0 || result.indexOf("filterFormOriginMark") > 0){
		var $mark = $("<span>");
		if(o.id === "none"){
			// TODO: reduce duplication: image holding area
			var noneGens = [3, 4, 5];
			var noneTypes = ["arabic", "arabic-outline", "roman", "roman-outline"];
			var nonePlatforms = ["gba", "gamecube", "dsi"];
			for(var i in noneGens){
				for(var t in noneTypes){
					$mark.append($("<img>", { "class": selectIconClass + " light-invert select-icon-origin select-icon-origin-" + noneTypes[t], "src": "img/origins/custom/" + noneTypes[t] + "/" + noneGens[i] + ".svg" }));
				}
			}
			for(var p in nonePlatforms){
				$mark.append($("<img>", { "class": selectIconClass + " light-invert select-icon-origin select-icon-origin-platform", "src": "img/origins/custom/platforms/" + nonePlatforms[p] + ".svg" }));
			}
			for(var lang in translations.none){
				$mark.append($("<span>", { "class": "translation translation-" + lang}).text(translations.none[lang]));
			}
		} else {
			$mark.append($("<img>", { "class": selectIconClass + " light-invert", "src": "img/origins/" + o.id + ".png" }))
				.append($("<span>").text(origins[o.id].name));
		}
		return $mark;
	} else if(result.indexOf("settingsExtraOriginMarks") > 0){
		var $marks = $("<span>");
		// TODO: reduce duplication: image holding area
		if(o.id === "platforms"){
			var nonePlatforms = ["gba", "gamecube", "dsi"];
			for(var p in nonePlatforms){
				$marks.append($("<img>", { "class": selectIconClass + " light-invert", "src": "img/origins/custom/platforms/" + nonePlatforms[p] + ".svg" }));
			}
		} else if(o.id !== "none"){
			var noneGens = [3, 4, 5];
			for(var i in noneGens){
				$marks.append($("<img>", { "class": selectIconClass + " light-invert", "src": "img/origins/custom/" + o.id + "/" + noneGens[i] + ".svg" }));
			}
		}
		$marks.append($("<span>").text(o.text));
		return $marks;
	} else if(result.indexOf("pokemonFormNature") > 0){
		var $nature = $("<span>");
		for(var oed in o.element.dataset){
			if(oed.indexOf("lang") == 0){
				lang = oed.substring(4).toLowerCase();
				$nature.append($("<span>", { "class": "translation translation-" + lang}).text(natures[o.id][lang]));
			}
		}
		return $nature;
	} else if(result.indexOf("pokemonFormBox") > 0 || result.indexOf("filterFormBox") > 0){
		var $box = $("<span>");
		var boxImage = "closed";
		if(o.id == "-1"){
			boxImage = "ball";
		}
		$box.append($("<img>", { "class": selectIconClass, "src": "img/ui/box-" + boxImage + ".png" }));
		if(o.id == "-1"){
			for(var lang in translations.none){
				$box.append($("<span>", { "class": "translation translation-" + lang}).text(translations.none[lang]));
			}
		} else {
			$box.append($("<span>").text(userBoxes[o.id]));
		}
		return $box;
	} else if(result.indexOf("pokemonFormSpecies") > 0){
		var $pokemon = $("<span>");
		for(var oed in o.element.dataset){
			if(oed.indexOf("name") == 0){
				var lang = oed.substring(4);
				var form = "";
				if(o.element.dataset["form" + lang]){
					form = " (" + o.element.dataset["form" + lang] + ")";
				} else if(o.element.dataset["formAll"]){
					form = " (" + o.element.dataset["formAll"] + ")";
				}
				$pokemon.append($("<span>", { "class": "translation translation-" + lang.toLowerCase() }).text(o.element.dataset["name" + lang] + form));
			}
		}
		return $pokemon;
	} else if(result.indexOf("pokemonFormTitle") > 0 || result.indexOf("filterFormEarnedRibbons") > 0 || result.indexOf("filterFormTargetRibbons") > 0){
		$option = $("<span>");
		if(o.id === "None"){
			for(var lang in translations.none){
				$option.append($("<span>", { "class": "translation translation-" + lang}).text(translations.none[lang]));
			}
		} else {
			$option.append($("<span>", { "class": selectIconClass + " ribbonsprite " + o.id, "role": "img", "aria-label": ribbons[o.id].names["eng"] }));
			for(var oed in o.element.dataset){
				if(oed.indexOf("lang") == 0 && oed.indexOf("langRibbon") == -1){
					lang = oed.substring(4).toLowerCase();
					if(result.indexOf("pokemonFormTitle") > 0){
						$option.append($("<span>", { "class": "translation translation-" + lang}).text(ribbons[o.id].titles[lang]));
					} else if(result.indexOf("filterFormEarnedRibbons") > 0 || result.indexOf("filterFormTargetRibbons") > 0){
						$option.append($("<span>", { "class": "translation translation-" + lang}).text(ribbons[o.id].names[lang]));
					}
				}
			}
		}
		return $option;
	} else if(result.indexOf("filterFormGender") > 0){
		var $gender = $("<span>")
			.append($("<img>", { "class": selectIconClass, "src": "img/ui/gender-" + o.id + ".png" }))
			.append($("<span>").text(o.text));
		return $gender;
	} else if(result.indexOf("filterFormShiny") > 0){
		var $shiny = $("<span>");
		if(o.id === "shiny" || o.id === "star"){
			$shiny.append($("<img>", { "class": selectIconClass + " light-invert", "src": "img/ui/shiny-star.png" }));
		}
		if(o.id === "shiny" || o.id === "square"){
			$shiny.append($("<img>", { "class": selectIconClass + " light-invert", "src": "img/ui/shiny-square.svg" }));
		}
		$shiny.append($("<span>").text(o.text));
		return $shiny;
	} else if(result.indexOf("filterFormGMax") > 0){
		var $gmax = $("<span>");
		if(o.id === "true"){
			$gmax.append($("<img>", { "class": selectIconClass, "src": "img/ui/gigantamax.png" }));
		}
		$gmax.append($("<span>").text(o.text));
		return $gmax;
	} else if(result.indexOf("filterFormPokerus") > 0){
		var $pokerus = $("<span>");
		if(o.id === "any" || o.id === "infected"){
			$pokerus.append($("<img>", { "class": selectIconClass, "src": "img/ui/pokerus-infected.png" }));
		}
		if(o.id === "any" || o.id === "cured"){
			$pokerus.append($("<img>", { "class": selectIconClass, "src": "img/ui/pokerus-cured.png" }));
		}
		$pokerus.append($("<span>").text(o.text));
		return $pokerus;
	} else {
		return o.text;
	}
}

function boxRow(name){
	var $boxRow = $("<li>", { "class": "list-group-item list-group-item-action d-flex align-items-center border-0 px-1" });
	var $boxRowInner = $("<div>", { "class": "d-flex w-100 justify-content-between align-items-center" });
	var $boxRowLeft = $("<div>")
		.append($("<img>", { "class": "ms-1 align-middle img-box", "src": "img/ui/box-closed.png", "alt": "Box", "title": "Box" }))
		.append($("<span>", { "class": "ms-2 align-middle" }).text(name));
	var $boxRowRight = $("<div>", { "class": "box-controls" })
		.append($("<button>", { "class": "btn btn-link p-0 lh-1 align-middle", "onclick": "editBox()" }).html($("<img>", { "class": "align-middle", "src": "img/ui/edit.svg", "alt": "Edit", "title": "Edit" })))
		.append($("<button>", { "class": "ms-2 btn btn-link p-0 lh-1 align-middle", "onclick": "deleteBox()" }).html($("<img>", { "class": "align-middle", "src": "img/ui/delete.svg", "alt": "Delete", "title": "Delete" })));
	$boxRowInner.append($boxRowLeft, $boxRowRight);
	$boxRow.append($boxRowInner);
	return $boxRow;
}

function populateBoxes(){
	$("#modalBoxesList li:not(#modalBoxesList-none)").remove();
	for(var b in userBoxes){
		$("#modalBoxesList").append(boxRow(userBoxes[b]));
	}
}

function createOrEditBox(edit = null, editID = -1){
	var boxName;
	if(edit){
		boxName = prompt("Change box name:", edit);
	} else {
		boxName = prompt("Add a new box:");
	}
	if(boxName){
		if(edit){
			if(boxName === edit) return;
			userBoxes[editID] = boxName;
			$("#modalBoxesList li:nth-child(" + (editID+2) + ")").replaceWith(boxRow(boxName));
			$("#tracker-grid .col").each(function(){
				if(this.dataset.box == editID){
					$(this).find(".card-footer-top-box-name").text(boxName);
				}
			});
		} else {
			userBoxes.push(boxName);
			$("#modalBoxesList").append(boxRow(boxName));
		}
		relistFilterBoxes();
		if(activeFilters.box){
			if(edit && activeFilters.box === edit){
				$("#filterFormBox").val(editID);
			} else {
				$("#filterFormBox").val(activeFilters.box);
			}
		}
		localStorage.boxes = JSON.stringify(userBoxes);
		updateModifiedDate();
	}
}

function editBox(){
	var listContainer = $(event.target).parents(".list-group-item");
	var boxID = listContainer.index() - 1;
	createOrEditBox(userBoxes[boxID], boxID);
}

function deleteBox(){
	var listContainer = $(event.target).parents(".list-group-item");
	var boxID = listContainer.index() - 1;
	if(confirm("Are you sure you want to delete " + userBoxes[boxID] + "? All of the Pokémon in " + userBoxes[boxID] + " will become unsorted.")){
		listContainer.fadeOut(250, function(){
			$(this).remove();
		});
		userBoxes.splice(boxID, 1);
		localStorage.boxes = JSON.stringify(userBoxes);
		var pokemonChanges = false;
		for(var p in userPokemon){
			if(userPokemon[p].box || userPokemon[p].box == 0){
				if(userPokemon[p].box == boxID){
					pokemonChanges = true;
					$("#tracker-grid .col[data-pokemon-id='" + p + "']").removeAttr("data-box").find(".card-footer-top-box").remove();
					userPokemon[p].box = -1;
				} else if(Number(userPokemon[p].box) > boxID){
					pokemonChanges = true;
					$("#tracker-grid .col[data-pokemon-id='" + p + "']").attr("data-box", Number(userPokemon[p].box) - 1);
					userPokemon[p].box = Number(userPokemon[p].box) - 1;
				}
			}
		}
		if(pokemonChanges){
			localStorage.pokemon = JSON.stringify(userPokemon);
		}
		relistFilterBoxes();
		if(activeFilters.box){
			if(activeFilters.box == boxID){
				$("#filterFormBox").val("").change();
			} else {
				$("#filterFormBox").val(activeFilters.box);
			}
		}
		updateModifiedDate();
	}
}

function initRun(){
	function loadingBar(n){
		$("#loading-spinner-info-progress").attr("aria-valuenow", n);
		$("#loading-spinner-info-progress-bar").css("width", n + "%");
	}
	/* initial preset of settings and data modals */
	$("#loading-spinner-info-text").text("Loading settings");
	presetSettings();
	if(localStorage.lastModified){
		updateModifiedDate(false);
	} else {
		updateModifiedDate();
	}

	/* data load */
	loadingBar(10);
	$("#loading-spinner-info-text").text("Loading data");
	$.when(
		$.getJSON("./data/balls.json"),
		$.getJSON("./data/changelog.json"),
		$.getJSON("./data/games.json"),
		$.getJSON("./data/origins.json"),
		$.getJSON("./data/pokemon.json"),
		$.getJSON("./data/ribbons.json"),
		$.getJSON("./data/translations.json")
	).fail(function(response, status, error){
		var $errorimg = $("<img>", { "src": "./img/ui/cross.svg", "class": "mb-3" });
		var $errortext = $("<div>", { "id": "loading-spinner-info-text", "class": "fw-bold", "role": "status" }).text("Data loading error: " + error);
		$("#loading-spinner-info").html($errorimg).append($errortext);
	}).done(function(dataBalls, dataChangelog, dataGames, dataOrigins, dataPokemon, dataRibbons, dataTranslations){
		/* set variables */
		balls = dataBalls[0];
		changelog = dataChangelog[0];
		games = dataGames[0];
		origins = dataOrigins[0];
		pokemon = dataPokemon[0];
		ribbons = dataRibbons[0];
		translations = dataTranslations[0];
		forms = translations.forms;
		natures = translations.natures;
		for(var g in games){
			var thisGameOrder = Number(getGameData(g, "gen")) * 10;
			if(getGameData(g, "ribbonGenOrder")){
				thisGameOrder += Number(getGameData(g, "ribbonGenOrder"));
			}
			gameOrder[g] = thisGameOrder;
		}

		/* initialize forms */
		loadingBar(15);
		$("#loading-spinner-info-text").text("Loading form");
		/* create temporary image area for later image loading */
		$("body").append($("<div>", { "id": "imageHoldingArea", "class": "d-none" }));
		/* add form options */
		for(var b in balls){
			var $ballOption = $("<option>", { "value": b }).text(balls[b]["eng"]);
			for(var lang in balls[b]){
				if(lang === "hisui") continue;
				$ballOption.attr("data-lang-" + lang, balls[b][lang]);
			}
			$("#pokemonFormBall, #filterFormBall").append($ballOption);
		}
		$("#imageHoldingArea").append($("<img>", { "src": "img/balls.png" }));
		for(var g in games){
			if(games[g].combo || games[g].solo){
				$("#filterFormTargetGames").append(new Option(games[g].name, g));
			}
			if(!games[g].combo){
				// temporary until Legends: Z-A releases
				if(g !== "plza"){
					$("#pokemonFormCurrentGame, #filterFormCurrentGame").append(new Option(games[g].name, g));
				}
			}
		}
		for(var o in origins){
			$("#pokemonFormOriginMark, #filterFormOriginMark").prepend(new Option(origins[o].name, o));
			// TODO: reduce duplication: selectCustomOption
			if(origins[o].name == "None"){
				var noneGens = [3, 4, 5];
				var noneTypes = ["arabic", "arabic-outline", "roman", "roman-outline"];
				var nonePlatforms = ["dsi", "gamecube", "gba"];
				for(var i in noneGens){
					for(var t in noneTypes){
						$("#imageHoldingArea").append($("<img>", { "src": "img/origins/custom/" + noneTypes[t] + "/" + noneGens[i] + ".svg" }));
					}
				}
				for(var p in nonePlatforms){
					$("#imageHoldingArea").append($("<img>", { "src": "img/origins/custom/platforms/" + nonePlatforms[p] + ".svg" }));
				}
			} else {
				$("#imageHoldingArea").append($("<img>", { "src": "img/origins/" + o + ".png" }));
			}
		}
		var pokemonCount = 0;
		var pokemonTotal = Object.keys(pokemon).length;
		for(var p in pokemon){
			pokemonCount++;
			var $pokemon = $("<option>", { "value": p, "data-natdex": getPokemonData(p, "natdex") });
			var pokemonNames = getPokemonData(p, "names");
			for(var lang in pokemonNames){
				$pokemon.attr("data-name-" + lang, pokemonNames[lang]);
			}
			var pokemonForms = getPokemonData(p, "forms");
			var pokemonFormDisplay = "";
			if(!pokemonForms){
				pokemonForms = getPokemonData(p, "forms-all");
				if(!pokemonForms){
					var pokemonFormSource = getPokemonData(p, "form-source");
					if(pokemonFormSource){
						pokemonForms = translations.forms[pokemonFormSource];
					}
				}
			}
			if(pokemonForms){
				if(typeof pokemonForms === 'string'){
					pokemonFormDisplay = " (" + pokemonForms + ")";
					$pokemon.attr("data-form-all", pokemonForms);
				} else {
					pokemonFormDisplay = " (" + pokemonForms["eng"] + ")";
					for(var lang in pokemonForms){
						$pokemon.attr("data-form-" + lang, pokemonForms[lang]);
					}
				}
			}
			var pokemonSort = getPokemonData(p, "sort", true);
			if(pokemonSort){
				$pokemon.attr("data-sort", pokemonSort);
			}
			$pokemon.text(pokemonNames["eng"] + pokemonFormDisplay);
			$("#pokemonFormSpecies").append($pokemon);
			if(pokemonCount === pokemonTotal){
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
				var allPokemonOptions = $("#pokemonFormSpecies").find("option").get();
				allPokemonOptions.sort(dexSort);
				for(var z = 0; z < allPokemonOptions.length; z++){
					allPokemonOptions[z].parentNode.appendChild(allPokemonOptions[z]);
				}
			}
		}
		for(var r in ribbons){
			var $ribbonOption = $("<option>", { "value": r }).text(ribbons[r].names["eng"]);
			var formRibbonSelect = "#filterFormEarnedRibbons";
			var $ribbonRow = $("<li>", { "class": "list-group-item list-group-item-action d-flex align-items-center border-0", "title": ribbons[r].names.eng + " - " + ribbons[r].descs.eng })
				.append($("<input>", { "type": "checkbox", "value": "", "class": "form-check-input mt-0 ms-lg-1 me-1 me-lg-2", "id": "pokemonFormRibbon-" + r }));
			if(r.startsWith("contest-memory-ribbon") || r.startsWith("battle-memory-ribbon")){
				$ribbonRow.append($("<img>", { "src": "img/ui/sync.svg", "class": "pokemonFormRibbon-memory-sync" }));
			}
			var $ribbonRowLabel = $("<label>", { "for": "pokemonFormRibbon-" + r, "class": "form-check-label stretched-link d-flex align-items-center w-100" })
				.append($("<span>", { "class": "me-2 ribbonsprite " + r, "title": ribbons[r].names.eng, "role": "img", "aria-label": ribbons[r].names.eng }));
			var $ribbonRowInfo = $("<div>", { "class": "w-100" });
			var $ribbonRowInfoName = $("<div>", { "class": "fw-bold lh-1 my-1 d-flex w-100 justify-content-between align-items-center" });
			var $ribbonRowInfoDesc = $("<div>", { "class": "lh-1 mb-1" });
			for(var lang in ribbons[r].names){
				$ribbonOption.attr("data-lang-" + lang, ribbons[r].names[lang]);
				$ribbonRowInfoName.append($("<span>", { "class": "translation translation-" + lang }).text(ribbons[r].names[lang]));
				$ribbonRowInfoDesc.append($("<small>", { "class": "translation translation-" + lang }).text(ribbons[r].descs[lang]));
			}
			var ribbonGen = ribbons[r].gen;
			var ribbonGenText = translations.arabicToRoman[ribbonGen-1];
			if(ribbons[r].available && r !== "jumbo-mark" && r !== "mini-mark"){
				formRibbonSelect = formRibbonSelect + ", #filterFormTargetRibbons";
				var ribbonGenMax = ribbonGen;
				for(var gameKey in ribbons[r].available){
					var game = ribbons[r].available[gameKey];
					var gameGen = getGameData(game, "gen");
					if(gameGen > ribbonGenMax){
						ribbonGenMax = gameGen;
					}
				}
				if(ribbonGenMax > ribbonGen){
					ribbonGenText = ribbonGenText + " – " + translations.arabicToRoman[ribbonGenMax-1];
				}
				$ribbonRowInfoName.append($("<span>", { "class": "badge text-bg-primary rounded-pill ms-2" }).text(ribbonGenText));
				if(!r.startsWith("contest-memory-ribbon") && !r.startsWith("battle-memory-ribbon")){
					$ribbonRow.addClass("ribbon-gen-" + ribbonGen);
				}
			} else {
				$ribbonRowInfoName.append($("<span>", { "class": "badge text-bg-secondary rounded-pill" }).text("E"));
			}
			if(!r.startsWith("contest-memory-ribbon") && !r.startsWith("battle-memory-ribbon")){
				$(formRibbonSelect).append($ribbonOption);
			}
			$ribbonRowInfo.append($ribbonRowInfoName, $ribbonRowInfoDesc);
			$ribbonRowLabel.append($ribbonRowInfo);
			$ribbonRow.append($ribbonRowLabel);
			$("#pokemonFormRibbons").append($ribbonRow);
			if(ribbons[r].titles){
				var $titleOption = $("<option>", { "value": r }).text(ribbons[r].titles["eng"]);
				for(var lang in ribbons[r].names){
					$titleOption.attr("data-lang-" + lang, ribbons[r].titles[lang]).attr("data-lang-ribbon-" + lang, ribbons[r].names[lang]);
				}
				$("#pokemonFormTitle").append($titleOption);
			}
		}
		$("#imageHoldingArea").append($("<img>", { "src": "img/ribbons.png" }));
		for(var n in natures){
			var $natureOption = $("<option>", { "value": n }).text(natures[n]["eng"]);
			for(var lang in natures[n]){
				$natureOption.attr("data-lang-" + lang, natures[n][lang]);
			}
			$("#pokemonFormNature").append($natureOption);
		}
		/* apply select2 dropdowns */
		$("#pokemonFormLanguage, #pokemonFormOriginGame, #pokemonFormCurrentGame").select2({
			matcher: selectCustomMatcher,
			dropdownParent: $("#pokemonFormSections")
		});
		$("#pokemonFormBall, #pokemonFormNature, #pokemonFormBox, #pokemonFormOriginMark, #pokemonFormSpecies, #pokemonFormTitle").select2({
			matcher: selectCustomMatcher,
			templateSelection: selectCustomOption,
			templateResult: selectCustomOption,
			dropdownParent: $("#pokemonFormSections")
		});
		$("#filterFormSort, #filterFormLanguage, #filterFormCurrentGame, #filterFormTargetGames").select2({
			matcher: selectCustomMatcher,
			dropdownParent: $("#modalFilterForm .modal-body")
		});
		$("#filterFormStatus, #filterFormGender, #filterFormShiny, #filterFormBall, #filterFormOriginMark, #filterFormBox, #filterFormEarnedRibbons, #filterFormTargetRibbons, #filterFormGMax, #filterFormPokerus").select2({
			matcher: selectCustomMatcher,
			templateSelection: selectCustomOption,
			templateResult: selectCustomOption,
			dropdownParent: $("#modalFilterForm .modal-body")
		});
		$("#settingsTheme, #settingsLanguage, #settingsChecklistButtons, #settingsTitleRibbon, #settingsOldRibbons, #settingsExtraOriginMarks").select2({
			debug: true,
			matcher: selectCustomMatcher,
			templateSelection: selectCustomOption,
			templateResult: selectCustomOption,
			dropdownParent: $("#modalSettings")
		});
		/* listeners */
		$("input[name='pokemonFormGender'], input[name='pokemonFormShiny']").change(function(){
			updateFormSprite();
		});
		$("#pokemonFormRibbonSearch").on("input", function(){
			var searchText = $(this).val().normalize("NFC").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
			if(searchText){
				var matchedRibbons = 0;
				$("#pokemonFormRibbons li").each(function(i, e){
					if(i !== 0){
						var ribbonText = $(this).text().normalize("NFC").replace(/[\u0300-\u036f]/g, "").toUpperCase();
						if(ribbonText.indexOf(searchText) > -1){
							matchedRibbons++;
							$(e).removeClass("d-none");
						} else {
							$(e).addClass("d-none");
						}
					}
				});
				if(matchedRibbons == 0){
					$("#pokemonFormRibbons-none").removeClass("d-none");
				} else {
					$("#pokemonFormRibbons-none").addClass("d-none");
				}
			} else {
				$("#pokemonFormRibbons li").removeClass("d-none");
				$("#pokemonFormRibbons-none").addClass("d-none");
			}
		});
		$("#pokemonFormRibbons input[type='checkbox']").change(function(){
			var ribbon = this.id.replace("pokemonFormRibbon-", "");
			var pokemonFlags = getPokemonData($("#pokemonFormSpecies").val(), "flags");
			var pokemonSizeLocked = false;
			if(pokemonFlags && pokemonFlags.includes("sizeLocked")){
				pokemonSizeLocked = true;
			}
			if(ribbon == "mini-mark" || ribbon == "jumbo-mark" || ribbon == "titan-mark" || ribbon == "alpha-mark"){
				if($("#pokemonFormRibbon-mini-mark").prop("checked") || $("#pokemonFormRibbon-jumbo-mark").prop("checked") || $("#pokemonFormRibbon-titan-mark").prop("checked") || $("#pokemonFormRibbon-alpha-mark").prop("checked")){
					if(!pokemonSizeLocked) $("#pokemonFormScale").prop({ "checked": true, "disabled": true });
					if($("#pokemonFormRibbon-mini-mark").prop("checked")){
						$("#pokemonFormRibbon-jumbo-mark").prop({ "checked": false, "disabled": true });
					} else {
						$("#pokemonFormRibbon-jumbo-mark").prop({ "disabled": false });
					}
					if($("#pokemonFormRibbon-jumbo-mark").prop("checked") || $("#pokemonFormRibbon-titan-mark").prop("checked") || $("#pokemonFormRibbon-alpha-mark").prop("checked")){
						$("#pokemonFormRibbon-mini-mark").prop({ "checked": false, "disabled": true });
						$("#pokemonFormRibbon-jumbo-mark").prop({ "disabled": false });
					} else {
						$("#pokemonFormRibbon-mini-mark").prop({ "disabled": false });
					}
				} else {
					if(!pokemonSizeLocked) $("#pokemonFormScale").prop({ "checked": false, "disabled": false });
					$("#pokemonFormRibbon-mini-mark, #pokemonFormRibbon-jumbo-mark").prop({ "disabled": false });
				}
			} else if(ribbon.startsWith("battle-memory-ribbon")){
				if($("#pokemonFormRibbon-battle-memory-ribbon-gold").prop("checked")){
					$("#pokemonFormRibbon-battle-memory-ribbon").prop({ "checked": false, "disabled": true });
				} else {
					$("#pokemonFormRibbon-battle-memory-ribbon").prop({ "disabled": false });
				}
				if($("#pokemonFormRibbon-battle-memory-ribbon").prop("checked")){
					$("#pokemonFormRibbon-battle-memory-ribbon-gold").prop({ "checked": false, "disabled": true });
				} else {
					$("#pokemonFormRibbon-battle-memory-ribbon-gold").prop({ "disabled": false });
				}
			} else if(ribbon.startsWith("contest-memory-ribbon")){
				if($("#pokemonFormRibbon-contest-memory-ribbon-gold").prop("checked")){
					$("#pokemonFormRibbon-contest-memory-ribbon").prop({ "checked": false, "disabled": true });
				} else {
					$("#pokemonFormRibbon-contest-memory-ribbon").prop({ "disabled": false });
				}
				if($("#pokemonFormRibbon-contest-memory-ribbon").prop("checked")){
					$("#pokemonFormRibbon-contest-memory-ribbon-gold").prop({ "checked": false, "disabled": true });
				} else {
					$("#pokemonFormRibbon-contest-memory-ribbon-gold").prop({ "disabled": false });
				}
			}
		});
		$("#pokemonFormRibbonToggle button").click(function(){
			var toggleGen = this.dataset.gen;
			$("#pokemonFormRibbons .ribbon-gen-" + toggleGen + " input[type='checkbox']").each(function(i, c){
				$(c).prop("checked", !$(c).prop("checked"));
			});
		});
		$("#pokemonFormSpecies").change(function(){
			var species = $(this).val();
			if(species){
				var pokemonGender = getPokemonData(species, "gender");
				if(pokemonGender === "both"){
					$("#pokemonFormGender-unknown").prop("disabled", true);
					$("#pokemonFormGender-male, #pokemonFormGender-female").prop("disabled", false);
					if(!$("#pokemonFormGender-female").prop("checked")){
						$("#pokemonFormGender-male").prop("checked", true).change();
					}
				} else {
					$("#pokemonFormGenderGroup input").prop("disabled", true);
					$("#pokemonFormGender-" + pokemonGender).prop("checked", true).change();
				}

				var pokemonFlags = getPokemonData(species, "flags");
				if(pokemonFlags && pokemonFlags.includes("shinyLocked")){
					$("#pokemonFormShinyGroup input").prop("disabled", true);
					$("#pokemonFormShiny-normal").prop("checked", true).change();
				} else {
					$("#pokemonFormShinyGroup input").prop("disabled", false);
				}
				if(pokemonFlags && pokemonFlags.includes("sizeLocked")){
					$("#pokemonFormScale").prop({ "checked": true, "disabled": true }).change();
				} else {
					$("#pokemonFormScale").prop({ "checked": false, "disabled": false }).change();
				}

				updateFormSprite();
			}
		});
		$("#pokemonFormOriginMark").change(function(){
			if($(this).val()){
				var matchingGames = origins[$(this).val()].games;
				if(matchingGames.length == 1){
					$("#pokemonFormOriginGame").html("<option></option>").prop("disabled", true);
					$("#pokemonFormOriginGame").append(new Option(games[matchingGames[0]].name, matchingGames[0]));
					$("#pokemonFormOriginGame").val(matchingGames[0]).change();
				} else {
					$("#pokemonFormOriginGame").html("<option></option>").prop("disabled", false);
					for(var g in matchingGames){
						var gameKey = matchingGames[g];
						$("#pokemonFormOriginGame").append(new Option(games[gameKey].name, gameKey));
					}
					$("#pokemonFormOriginGame").val("").change();
				}
			} else {
				$("#pokemonFormOriginGame").html("<option></option>").prop("disabled", true);
			}
		});
		$("#modalFilterForm select:not(#filterFormSort), #modalFilterForm input[type='number'], #modalFilterForm input[type='text']").change(function(){
			var filterName = this.id.replace("filterForm", "").toLowerCase();
			var filterSearch = $(this).val();
			if(filterSearch == "" || filterSearch === null){
				delete activeFilters[filterName];
			} else {
				filterSearch = filterSearch.trim();
				if(filterSearch == ""){
					$(this).val("").change();
				} else {
					var filterLevel = Number(filterSearch);
					if(filterName == "currentlevel-max" && filterLevel > 99){
						$(this).val("").change();
					} else if(filterName == "currentlevel-max" && filterLevel < 1){
						$(this).val(1).change();
					} else if(filterName == "currentlevel-min" && filterLevel < 2){
						$(this).val("").change();
					} else if(filterName == "currentlevel-min" && filterLevel > 100){
						$(this).val(100).change();
					} else {
						if(filterName == "currentlevel-min" && $("#filterFormCurrentLevel-max").val().length && filterLevel > Number($("#filterFormCurrentLevel-max").val())){
							$("#filterFormCurrentLevel-max").val(filterLevel).change();
						} else if(filterName == "currentlevel-max" && $("#filterFormCurrentLevel-min").val().length && filterLevel < Number($("#filterFormCurrentLevel-min").val())){
							$("#filterFormCurrentLevel-min").val(filterLevel).change();
						}
						activeFilters[filterName] = filterSearch;
					}
				}
			}
			if(filterState == "default"){
				if(Object.keys(activeFilters).length){
					filterPokemonList();
				} else {
					$("#tracker-grid .col").show();
				}
			}
			filterBubble();
		});
		$("#filterFormSort").change(function(){
			activeSort = $(this).val();
			sortPokemonList();
		});
		/* prevent clear button from re-opening the dropdown */
		/* https://github.com/select2/select2/issues/3320#issuecomment-524153140 */
		$("select").on("select2:clear", function (evt) {
			$(this).on("select2:opening.cancelOpen", function (evt) {
				evt.preventDefault();
				$(this).off("select2:opening.cancelOpen");
			});
		});
		/* initial form reset */
		resetPokemonForm();
		resetFilterForm(true);

		/* changelog logic */
		/* TODO: reduce duplication with full changelog behavior */
		loadingBar(20);
		$("#loading-spinner-info-text").text("Loading changelog");
		var newChanges = [], initialRun = true;
		for(let date in changelog){
			if(initialRun){
				initialRun = false;
				localStorage.changelog = date;
				if(!lastChangeDate){
					break;
				}
			}
			let changeDate = new Date(date);
			if(changeDate > lastChangeDate){
				let $changeContainer = $("<div>", { "class": "list-group-item py-3" })
					.append($("<h6>", { "class": "fw-bold" }).text(date));
				let $changeList = $("<ul>", { "class": "mb-0" });
				for(let change in changelog[date]){
					if(changelog[date][change].startsWith("\\")){
						$changeContainer.append($("<p>").html(changelog[date][change].substring(1)));
					} else {
						$changeList.append($("<li>").html(changelog[date][change]));
					}
				}
				$changeContainer.append($changeList);
				newChanges.push($changeContainer);
			}
		}
		if(newChanges.length){
			$(function(){
				for(let i in newChanges){
					$("#modalChangelog .list-group").append(newChanges[i]);
				}
				new bootstrap.Modal("#modalChangelog").toggle();
			});
		}

		/* Samsung Internet detection */
		if(navigator.userAgent.match(/samsungbrowser/i)){
			$(function(){
				if(!localStorage.SamsungInternet){
					new bootstrap.Modal("#modalSamsungInternet").toggle();
					$("#modalSamsungInternet").on("hidden.bs.modal", function(e){
						localStorage.SamsungInternet = "dismissed";
					});
				}
			});
		}

		/* data conversion from old app */
		if((userPokemon.entries && typeof userPokemon.entries !== "function") || (userBoxes.entries && typeof userBoxes.entries !== "function")){
			loadingBar(22);
			$("#loading-spinner-info-text").text("Converting old data");
			if(userPokemon.entries && typeof userPokemon.entries !== "function"){
				userPokemon = Object.assign([], userPokemon.entries.filter(Boolean));
				for(let p in userPokemon){
					userPokemon[p] = updateOldPokemon(userPokemon[p]);
				}
				localStorage.pokemon = JSON.stringify(userPokemon);
			}
			if(userBoxes.entries && typeof userBoxes.entries !== "function"){
				userBoxes = Object.assign([], userBoxes.entries.filter(Boolean));
				localStorage.boxes = JSON.stringify(userBoxes);
			}
			updateModifiedDate();
		}

		/* create the Pokemon list */
		loadingBar(23);
		$("#loading-spinner-info-text").text("Loading Pokémon list");
		for(let p in userPokemon){
			try {
				$("#tracker-grid").append(createCard(userPokemon[p], p));
			} catch(err) {
				var $errorimg = $("<img>", { "src": "./img/ui/cross.svg", "class": "mb-3" });
				var $errortext = $("<div>", { "id": "loading-spinner-info-text", "class": "fw-bold", "role": "status" }).html("Pokémon list error on Pokémon #" + p + "<br>" + err);
				$("#loading-spinner-info").html($errorimg).append($errortext);
				return;
			}
		}
		updatePopovers();
		sortablePokemon = new Sortable($("#tracker-grid")[0], {
			handle: ".card-sortable-handle",
			animation: 200,
			put: false,
			onEnd: function(evt){
				if(evt.oldDraggableIndex !== evt.newDraggableIndex){
					var movedPokemon = userPokemon[evt.oldDraggableIndex];
					userPokemon.splice(evt.oldDraggableIndex, 1);
					userPokemon.splice(evt.newDraggableIndex, 0, movedPokemon);
					localStorage.pokemon = JSON.stringify(userPokemon);
					updateModifiedDate();
					$("#tracker-grid .col").each(function(i){
						$(this).attr("data-pokemon-id", i);
					});
				}
			}
		});
		sortableBoxes = new Sortable($("#modalBoxesList")[0], {
			filter: ".box-controls",
			animation: 200,
			put: false,
			onEnd: function(evt){
				if(evt.oldDraggableIndex !== evt.newDraggableIndex){
					var oldBoxID = evt.oldDraggableIndex - 1;
					var newBoxID = evt.newDraggableIndex - 1;
					var movedBox = userBoxes[oldBoxID];
					userBoxes.splice(oldBoxID, 1);
					userBoxes.splice(newBoxID, 0, movedBox);
					localStorage.boxes = JSON.stringify(userBoxes);
					updateModifiedDate();
					var pokemonChanges = false;
					for(var p in userPokemon){
						if(userPokemon[p].box || userPokemon[p].box == 0){
							if(userPokemon[p].box == oldBoxID){
								pokemonChanges = true;
								$("#tracker-grid .col[data-pokemon-id='" + p + "']").attr("data-box", newBoxID);
								userPokemon[p].box = newBoxID;
							} else {
								var oldBoxNumber = Number(userPokemon[p].box);
								if(oldBoxID < newBoxID){
									// box moved down the list
									// everything higher than oldDraggableIndex and below or equal to newDraggableIndex needs to subtract 1
									if(oldBoxNumber > oldBoxID && oldBoxNumber <= newBoxID){
										pokemonChanges = true;
										$("#tracker-grid .col[data-pokemon-id='" + p + "']").attr("data-box", oldBoxNumber-1);
										userPokemon[p].box = oldBoxNumber-1;
									}
								} else if(oldBoxID > newBoxID){
									// box moved up the list
									// everything higher than or equal to newDraggableIndex and lower than oldDraggableIndex needs to add 1
									if(oldBoxNumber < oldBoxID && oldBoxNumber >= newBoxID){
										pokemonChanges = true;
										$("#tracker-grid .col[data-pokemon-id='" + p + "']").attr("data-box", oldBoxNumber+1);
										userPokemon[p].box = oldBoxNumber+1;
									}
								}
							}
						}
					}
					if(pokemonChanges){
						localStorage.pokemon = JSON.stringify(userPokemon);
					}
					relistFilterBoxes();
					if(activeFilters.box){
						if(activeFilters.box == oldBoxID){
							$("#filterFormBox").val(newBoxID).change();
						} else {
							var oldBoxFilter = Number(activeFilters.box);
							if(oldBoxID < newBoxID){
								if(oldBoxFilter > oldBoxID && oldBoxFilter <= newBoxID){
									$("#filterFormBox").val(oldBoxFilter-1).change();
								} else {
									$("#filterFormBox").val(oldBoxFilter).change();
								}
							} else if(oldBoxID > newBoxID){
								if(oldBoxFilter < oldBoxID && oldBoxFilter >= newBoxID){
									$("#filterFormBox").val(oldBoxFilter+1).change();
								} else {
									$("#filterFormBox").val(oldBoxFilter).change();
								}
							}
						}
					}
				}
			}
		});

		/* initialize tooltips */
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

		/* image check */
		loadingBar(25);
		$("#loading-spinner-info-text").text("Loading images");
		/* thanks to Sean C Davis */
		/* https://www.seancdavis.com/posts/wait-until-all-images-loaded/ */
		var imagesLoaded = 0;
		var totalImages = $("img").length;
		$("img").each(function(idx, img){
			$("<img>").on("load error", imageLoaded).attr("src", $(img).attr("src"));
		});
		var imagesProgress = 0;
		function imageLoaded(){
			imagesLoaded++;
			loadingBar(25 + Math.floor((imagesLoaded/totalImages)*75));
			if(imagesLoaded == totalImages){
				allImagesLoaded();
			}
		}
		/* finally ready to remove spinner */
		function allImagesLoaded(){
			setTimeout(() => {
				$("#loading-spinner").fadeOut("fast")
			}, 500);
		}
	});
}

/* init */
$(function(){
	/* set modals */
	modalSettings = new bootstrap.Modal("#modalSettings");
	modalData = new bootstrap.Modal("#modalData");
	/* dropdown listeners */
	$("#settingsTheme").change(function(){
		changeTheme($(this).val());
	});
	$("#settingsLanguage").change(function(){
		changeLanguage($(this).val());
		modalSettings.toggle();
		new bootstrap.Modal("#modalReloading").toggle();
		setTimeout(function(){ location.reload() }, 500);
	});
	$("#settingsChecklistButtons").change(function(){
		changeChecklistButtons($(this).val());
	});
	$("#settingsTitleRibbon").change(function(){
		changeTitleRibbon($(this).val());
	});
	$("#settingsOldRibbons").change(function(){
		changeOldRibbons($(this).val());
	});
	$("#settingsExtraOriginMarks").change(function(){
		changeExtraOriginMarks($(this).val());
	});
	/* device theme change listener */
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', () => {
		if((settings.theme && settings.theme == "auto") || !settings.theme){
			changeTheme("auto");
		}
	});
	/* card view listener */
	$("#switchView label").click(function(){
		changeCardView($(this).prev().val());
	});
	/* ribbon form view listener */
	$("#switchRibbonFormView label").click(function(){
		changeRibbonFormView($(this).prev().val());
	});
	/* checkbox listeners */
	for(let i in toggles){
		$("#settings" + i).change(function(){
			changeCheckToggle(i, $(this).prop("checked") ? "true" : "false", true);
		});
	}
	/* button listeners */
	$("#headerNavSettingsLink").click(function(){
		modalSettings.toggle();
	});
	$("#headerNavDataLink").click(function(){
		modalData.toggle();
	});
	$("#modalDataSaveBackup").click(function(){
		saveBackup();
	});
	$("#modalDataLoadBackupButton").click(function(){
		$("#modalDataLoadBackupFile").click();
	});
	$("#modalDataLoadBackupFile").change(function(){
		var file = $(this)[0].files[0];
		if(file) loadBackup(file, $(this).val());
	});
	modalPokemonForm = new bootstrap.Modal("#modalPokemonForm");
	$("#modalPokemonForm").on("hide.bs.modal", function(e){
		if(modalPokemonState !== "saving"){
			if(!confirm("Are you sure you wish to cancel? All of your changes will be lost!")){
				e.preventDefault();
			}
		}
	});
	$("#modalPokemonForm").on("hidden.bs.modal", function(e){
		modalPokemonState = "default";
		modalPokemonEditing = -1;
	});
	$("#sectionTrackerButtonAdd").click(function(){
		resetPokemonForm();
		modalPokemonForm.toggle();
	});
	$("#modalPokemonFormSave").click(function(){
		savePokemon(modalPokemonState === "editing");
	});
	$("#modalFilterFormReset").click(function(){
		resetFilterForm();
	});
	$("#modalBoxes").on("show.bs.modal", function(e){
		populateBoxes();
	});
	$("#modalBoxesNew").click(function(){
		createOrEditBox();
	});
	/* TODO: reduce duplication with changelog updates */
	$("#modalAboutViewChangelog").click(function(){
		var changeList = [];
		$("#modalChangelog .list-group").html("");
		for(let date in changelog){
			let changeDate = new Date(date);
			let $changeContainer = $("<div>", { "class": "list-group-item py-3" })
				.append($("<h6>", { "class": "fw-bold" }).text(date));
			let $changeList = $("<ul>", { "class": "mb-0" });
			for(let change in changelog[date]){
				if(changelog[date][change].startsWith("\\")){
					$changeContainer.append($("<p>").html(changelog[date][change].substring(1)));
				} else {
					$changeList.append($("<li>").html(changelog[date][change]));
				}
			}
			$changeContainer.append($changeList);
			changeList.push($changeContainer);
		}
		if(changeList.length){
			$(function(){
				for(let i in changeList){
					$("#modalChangelog .list-group").append(changeList[i]);
				}
				new bootstrap.Modal("#modalChangelog").toggle();
			});
		}
	});
	modalRibbonChecklist = new bootstrap.Modal("#modalRibbonChecklist");
	
	/* button to scroll to top */
	window.onscroll = function(){
		scrollFunction();
	};
	function scrollFunction(){
		if(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50){
			$(".button-to-top").fadeIn(250);
		} else {
			$(".button-to-top").fadeOut(250);
		}
	}
	$(".button-to-top").click(function(){
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});
	
	/* initial functions that run after all else */
	initRun();
});