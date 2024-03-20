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
var sortablePokemon;

/* change setting */
function changeSetting(key, value){
	settings[key] = value;
	localStorage.settings = JSON.stringify(settings);
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
	if(browserLocales){
		for(var i = 0; i < browserLocales.length; i++){
			var locale = browserLocales[i].split(/-|_/)[0];
			if(supportedLanguages.indexOf(locale) > -1){
				changeLanguage(locale);
				break;
			}
		}
	}
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
			$("#tracker-grid").attr("class", "row g-3 mt-2 mb-4 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6");
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

/* toggle settings list */
var toggles = { // default settings
	"ShowWorldAbility": false,
	"AutoMemoryRibbons": true,
	"AutoStrangeBall": true,
	"DisplaySquareShiny": false,
	"FooterExtraInfo": true
};
/* change toggle settings */
function changeCheckToggle(name, value){
	changeSetting(name, "" + value);
	$("html").attr("data-" + name.toLowerCase(), "" + value);
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

/* Pokemon data update from old app */
function updateOldPokemon(p){
	delete p.iv;
	delete p.ev;
	delete p.ability;
	delete p.mint;
	delete p.characteristic;
	if(p.origin){
		var newmark = "none";
		// old app only had one origin game per mark, so only check for the first result
		for(let o in origins){
			if(origins[o].games.includes(p.origin)){
				newmark = o;
				break;
			}
		}
		p.originmark = newmark;
		p.origingame = p.origin;
		delete p.origin;
	}
	return p;
}

/* save backup */
function saveBackup(){
	var backupObj = {};
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
			var backupPokemon = [], backupBoxes = [];
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
				}
				for(let p in backupPokemon){
					backupPokemon[p] = updateOldPokemon(backupPokemon[p]);
				}
				localStorage.pokemon = JSON.stringify(backupPokemon);
				localStorage.boxes = JSON.stringify(backupBoxes);
				location.reload();
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

function getEarnableRibbons(dex, currentLevel, metLevel, currentGame, originGame, currentRibbons, checkedSize){
	var earnableRibbons = {};
	var earnableNotices = [];
	var earnableWarnings = [];
	var nextRibbonGen = 1000;
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
	// add warning for USUM Totem Pokemon
	// TODO: update this to look for the Totem setting instead of current game
	if(dex === "marowak-alola" || dex === "ribombee" || dex === "araquanid" || dex === "togedemaru"){
		if((currentGame === "usun" || currentGame === "umoon") && (originGame === "usun" || originGame === "umoon")){
			earnableNotices.push("usum-totem");
		}
	}
	// add warning for SwSh Gigantamax Pokemon
	// TODO: update this to look for the GMax setting instead of current game
	if(dex === "pikachu" || dex === "eevee" || dex === "meowth" || dex == "duraludon"){
		if(currentGame === "sw" || currentGame === "sh" || currentGame === "home"){
			earnableNotices.push("gigantamax");
		}
	}

	for(let ribbon in ribbons){
		// skip if Ribbon is already earned
		if(currentRibbons.includes(ribbon)) continue;
		// skip if Ribbon cannot be earned
		if(!ribbons[ribbon].available) continue;
		// skip if Pokemon is on Ribbon's ban list
		if(ribbons[ribbon].banned && ribbons[ribbon].banned.includes(dex)) continue;
		// skip if Pokemon is Mythical and Ribbon is not allowed for Mythicals
		if(ribbons[ribbon].nomythical && mythical) continue;

		var ribbonGames = ribbons[ribbon].available;
		var ribbonGens = [];
		for(let g in ribbonGames){
			var ribbonGame = ribbonGames[g];
			// skip if this game is part of a combo that already has this Ribbon
			var ribbonGameCombo = getGameData(ribbonGame, "partOf", true);
			if(ribbonGameCombo){
				if(earnableRibbons[ribbonGameCombo] && earnableRibbons[ribbonGameCombo].includes(ribbon)) continue;
			}

			var ribbonGen = parseInt(getGameData(ribbonGame, "gen"));
			if(ribbonGen && ribbonGen >= currentGen){
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
						// Spinda originally from BDSP cannot leave BDSP
						if(originGame == "bd" || originGame == "sp"){
							if(ribbonGame !== "bd" && ribbonGame !== "sp"){
								continue;
							}
						// all other Spinda cannot enter BDSP
						} else {
							if(ribbonGame == "bd" || ribbonGame == "sp"){
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
						// can only be earned by Pokemon from Colo/XD
						if(originGame !== "colosseum" && originGame !== "xd"){
							continue;
						} else {
							// if the Pokemon has left Colo/XD then it should be selected already
							if(currentGame !== "colosseum" && currentGame !== "xd"){
								continue;
							}
						}
					} else if(ribbon == "tower-master-ribbon"){
						// banlist and Mythicals cannot earn this, but only in BDSP
						if(ribbonGame == "bd" || ribbonGame == "sp"){
							if(mythical || ribbons[ribbon].bannedBDSP.includes(dex)){
								continue;
							}
						}
					} else if(ribbon == "jumbo-mark"){
						if(checkedSize || currentRibbons.includes("mini-mark")){
							continue;
						}
					} else if(ribbon == "mini-mark"){
						if(checkedSize || currentRibbons.includes("jumbo-mark") || currentRibbons.includes("titan-mark")){
							continue;
						}
					} else if(ribbon == "footprint-ribbon"){
						// if Pokemon can to go to Gen IV, it can always earn this
						if(ribbonGen !== 4){
							// if Pokemon is voiceless and can go to Gen VIII, it can always earn this
							var voiceless = getPokemonData(dex, "voiceless");
							if(!(ribbonGen == 8 && voiceless)){
								// otherwise, Footprint relies on Met Level < 71
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
											continue;
										}
									} else {
										// user has not set Met Level, let's try to determine it automatically
										// Pokemon from GO must have Met Level < 50 and can always earn Footprint
										if(originGame !== "go"){
											// Pokemon in Gen V+ with Current Level < 71 must also have Met Level < 71 and can always earn Footprint
											if(!currentLevelBelow71){
												// we cannot automatically determine Met Level
												// before we warn the user as such, let's check if the ribbon will appear for the Pokemon in BDSP--if so, no warning is necessary
												if(!((compatibleGames.includes("bd") || compatibleGames.includes("sp")) && voiceless)){
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
					ribbonGens.push(ribbonGen);
				}
			}
		}
		if(ribbonGens.length){
			var maxRibbonGen = Math.max(...ribbonGens);
			if(maxRibbonGen < nextRibbonGen){
				nextRibbonGen = maxRibbonGen;
			}
		}
	}

	// remove duplicate notices and warnings
	earnableNotices = [...new Set(earnableNotices)];
	earnableWarnings = [...new Set(earnableWarnings)];

	// return
	return {"remaining": earnableRibbons, "notices": earnableNotices, "warnings": earnableWarnings, "nextRibbonGen": nextRibbonGen};
}

function copyPokemon(){
	var cardContainer = $(event.target).parents(".col");
	var pokemonID = cardContainer.index();
	var pokemonName = cardContainer.find(".card-header-name").text();
	if(confirm("Are you sure you want to create a copy of " + pokemonName + "?")){
		var pokemonToCopy = userPokemon[pokemonID];
		userPokemon.splice(pokemonID, 0, pokemonToCopy);
		localStorage.pokemon = JSON.stringify(userPokemon);
		cardContainer.after(createCard(pokemonToCopy));
	}
}

function deletePokemon(){
	var cardContainer = $(event.target).parents(".col");
	var pokemonID = cardContainer.index();
	var pokemonName = cardContainer.find(".card-header-name").text();
	if(confirm("Are you sure you want to delete " + pokemonName + "? This is permanent!")){
		cardContainer.fadeOut(250, function(){
			$(this).remove();
		});
		userPokemon.splice(pokemonID, 1);
		localStorage.pokemon = JSON.stringify(userPokemon);
	}
}

function createCard(p){
	/* information */
	var ribbonLists;
	var currentGen = 1000;
	if(p.currentgame){
		if(p.currentgame == "go"){
			currentGen = 8;
		} else {
			currentGen = parseInt(getGameData(p.currentgame, "gen"));
		}
		if(currentGen < 3){
			currentGen = 7;
		}
	}
	var metLevel;
	if(p.metlevel){
		metLevel = p.metlevel;
	}
	if(p.currentgame && p.origingame){
		ribbonLists = getEarnableRibbons(p.dex, p.level, metLevel, p.currentgame, p.origingame, p.ribbons, p.scale);
	}
	var displayName = p.name;
	if(displayName.length === 0){
		var displayNameLang = p.lang;
		if(!displayNameLang) displayNameLang = "ENG";
		displayNameLang = displayNameLang.toLowerCase();
		displayName = getPokemonData(p.dex, "names")[displayNameLang];
	}

	/* containers and filters */
	var $cardCol = $("<div>", { "class": "col", "data-name": displayName, "data-national-dex": getPokemonData(p.dex, "natdex"), "data-level": p.level, "data-gender": p.gender, "data-shiny": p.shiny, "data-language": p.lang, "data-ball": p.ball, "data-origin-mark": p.originmark, "data-current-ribbons": p.ribbons });
	if(p.origingame){
		$cardCol.attr({ "data-origin-game": p.origingame });
	}
	if(p.currentgame){
		$cardCol.attr({ "data-current-game": p.currentgame });
	}
	if(ribbonLists){
		if(Object.keys(ribbonLists.remaining).length == 0){
			$cardCol.addClass("no-ribbons-left");
		} else {
			$cardCol.attr({ "data-remaining-ribbons": JSON.stringify(ribbonLists.remaining) });
			if(ribbonLists.nextRibbonGen > currentGen){
				$cardCol.addClass("move-to-next-gen");
			}
		}
		if(ribbonLists.notices.length !== 0){
			$cardCol.attr({ "data-ribbon-notices": ribbonLists.notices });
		}
		if(ribbonLists.warnings.length !== 0){
			$cardCol.attr({ "data-ribbon-warnings": ribbonLists.warnings });
		}
	}
	var $cardContainer = $("<div>", { "class": "card border-0" });

	/* sections */
	var $cardHeader = $("<div>", { "class": "card-header d-flex justify-content-between" });
	var $cardBody = $("<div>", { "class": "card-body d-flex align-items-center p-0" });
	var $cardFooter = $("<div>", { "class": "card-footer" });

	/* header */
	var $cardHeaderLeft = $("<div>");
	var $cardHeaderBallMain = $("<img>", { "class": "align-middle me-2", "src": "img/balls/"+p.ball+".png", "alt": balls[p.ball].eng, "title": balls[p.ball].eng });
	var $cardHeaderBallStrange = "";
	if(p.currentgame && ((p.currentgame !== "pla" && balls[p.ball].hisui) || (p.currentgame == "pla" && !balls[p.ball].hisui))){
		$cardHeaderBallMain.addClass("card-header-ball-selected");
		$cardHeaderBallStrange = $("<img>", { "class": "align-middle me-2 card-header-ball-strange", "src": "img/balls/strange.png", "alt": "Strange Ball", "title": "Strange Ball" });
	}
	$cardHeaderLeft.append($cardHeaderBallMain).append($cardHeaderBallStrange);
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
					titleText = titleText.replace(/\[.*?\]/, p.ot);
				}
				$cardHeaderLeft.append($("<span>", { "class": "align-middle me-1 card-header-title translation translation-" + tp, text: titleText }));
			}
		}
	}
	$cardHeaderLeft.append($("<span>", { "class": "align-middle fw-bold d-inline-block card-header-name", text: displayName }));
	if(p.title && p.title !== "None"){
		for(let tp in titlePositions){
			if(titlePositions[tp] == "suffix"){
				var titleText = titleRibbon.titles[tp];
				if(p.title == "partner-ribbon"){
					titleText = titleText.replace(/\[.*?\]/, p.ot);
				}
				$cardHeaderLeft.append($("<span>", { "class": "align-middle ms-1 card-header-title translation translation-" + tp, text: titleText }));
			}
		}
	}
	if(p.gender && p.gender !== "unknown"){
		var genderText = p.gender.charAt(0).toUpperCase() + p.gender.slice(1);
		$cardHeaderLeft.append($("<img>", { "class": "align-middle card-header-gender ms-2", "src": "img/ui/" + p.gender + ".png", "alt": genderText, "title": genderText }));
	}
	if(p.shiny){
		var shinyIcon = "shiny-star.png";
		if(p.shiny == "square"){
			shinyIcon = "shiny-square.svg";
		}
		$cardHeaderLeft.append($("<img>", { "class": "align-middle ms-2 card-header-shiny", "src": "img/ui/" + shinyIcon, "alt": "Shiny", "title": "Shiny" }));
	}
	$cardHeader.append($cardHeaderLeft);
	var $cardHeaderButton = $("<button>", { "type": "button", "class": "btn btn-link p-0 ms-1 position-relative" })
		.append($("<span>", { "class": "ribbon-checklist-warning-badge position-absolute translate-middle bg-danger rounded-circle" }).html($("<span>", {"class": "visually-hidden"}).text("Warnings")));

	$cardHeader.append($cardHeaderButton);

	/* body */
	var genderDirectory = (getPokemonData(p.dex, "femsprite") && p.gender === "female") ? "female/" : "";
	console.log(p.dex);
	$cardBody.append($("<img>", { "class": "card-sprite p-1 flex-shrink-0", "src": "img/pkmn/" + (p.shiny ? "shiny" : "regular") + "/" + genderDirectory + p.dex + ".png", "alt": getPokemonData(p.dex, "names")["eng"], "title": getPokemonData(p.dex, "names")["eng"] }));
	var $cardRibbons = $("<div>", { "class": "card-ribbons flex-grow-1 d-flex flex-wrap p-1" });
	var ribbonCount = 0;
	var markCount = 0;
	for(let r in p.ribbons){
		if(ribbons[p.ribbons[r]].mark){
			$cardRibbons.append($("<img>", { "class": p.ribbons[r], "src": "img/marks/" + p.ribbons[r] + ".png", "alt": ribbons[p.ribbons[r]].names["eng"], "title": ribbons[p.ribbons[r]].names["eng"] + " - " + ribbons[p.ribbons[r]].descs["eng"] }));
			markCount++;
		} else {
			$cardRibbons.append($("<img>", { "class": p.ribbons[r], "src": "img/ribbons/" + p.ribbons[r] + ".png", "alt": ribbons[p.ribbons[r]].names["eng"], "title": ribbons[p.ribbons[r]].names["eng"] + " - " + ribbons[p.ribbons[r]].descs["eng"] }));
			ribbonCount++;
		}
	}
	if(ribbonCount == 0 && markCount == 0){
		$cardRibbons.append($("<div>", { "class": "ms-2" }).text("This Pokémon has no ribbons."));
	}
	$cardBody.append($cardRibbons);

	/* footer */
	var $cardFooterTop = $("<div>", { "class": "card-footer-top d-flex justify-content-between" })
		.append($("<div>").text(ribbonCount + " Ribbon" + (ribbonCount !== 1 ? "s" : "") + (markCount ? ", " + markCount + " Mark" + (markCount !== 1 ? "s" : "") : "")));
	if(p.box){
		var boxName = userBoxes[p.box];
		var $cardFooterBox = $("<div>")
			.append($("<img>", { "class": "align-text-top me-1", "src": "img/ui/box-closed.png", "alt": "Box", "title": "Box" }))
			.append($("<span>").text(boxName));
		$cardFooterTop.append($cardFooterBox);
	}
	var $cardFooterBottom = $("<div>", { "class": "card-footer-bottom d-flex justify-content-between" });
	var $cardFooterBottomLevel = $("<span>", { "class": "align-middle card-footer-level" } )
		.append($("<span>").text("Lv."))
		.append($("<span>").text(p.level));
	var $cardFooterBottomLeft = $("<div>")
		.append($cardFooterBottomLevel)
		.append($("<span>", { "class": "align-middle card-footer-language d-inline-block text-center rounded-pill fw-bold mx-2" }).text(p.lang));
	var originName = origins[p.originmark].name;
	if(p.origingame){
		originName = getGameData(p.origingame, "name");
	}
	if(p.originmark == "none" && p.origingame){
		var originGen = getGameData(p.origingame, "gen");
		var originGenRoman = "III";
		if(originGen == 4){
			originGenRoman = "IV";
		} else if(originGen == 5){
			originGenRoman = "V";
		}
		var platformIcon = getGameData(p.origingame, "platformIcon");
		$cardFooterBottomLeft.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-arabic", "src": "img/origins/custom/arabic/" + originGen + ".svg", "alt": originName, "title": originName }))
			.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-arabic-outline", "src": "img/origins/custom/arabic-outline/" + originGen + ".svg", "alt": originName, "title": originName }))
			.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-roman", "src": "img/origins/custom/roman/" + originGen + ".svg", "alt": originName, "title": originName }))
			.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-roman-outline", "src": "img/origins/custom/roman-outline/" + originGen + ".svg", "alt": originName, "title": originName }))
			.append($("<img>", { "class": "align-middle card-footer-origin card-footer-origin-platform", "src": "img/origins/custom/platforms/" + platformIcon + ".svg", "alt": originName, "title": originName }));
	} else {
		$cardFooterBottomLeft.append($("<img>", { "class": "align-middle card-footer-origin", "src": "img/origins/" + p.originmark + ".png", "alt": originName, "title": originName }));
	}
	var $cardFooterBottomRight = $("<div>")
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 align-text-bottom card-sortable-handle" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/move.svg", "alt": "Move", "title": "Drag to re-order" })))
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 align-text-bottom" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/edit.svg", "alt": "Edit", "title": "Edit" })))
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 align-text-bottom", "onclick": "copyPokemon()" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/copy.svg", "alt": "Copy", "title": "Copy" })))
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 align-text-bottom", "onclick": "deletePokemon()" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/delete.svg", "alt": "Delete", "title": "Delete" })));
	$cardFooterBottom.append($cardFooterBottomLeft).append($cardFooterBottomRight);
	$cardFooter.append($cardFooterTop).append($cardFooterBottom);

	/* create and return the card */
	$cardContainer.append($cardHeader).append($cardBody).append($cardFooter);
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
	if(settings.ExtraOriginMarks){
		$("#settingsExtraOriginMarks").val(settings.ExtraOriginMarks);
		if(change) $("#settingsExtraOriginMarks").change();
	}
	if(settings.CardView){
		$("#switchViewBtn-" + settings.CardView).prop("checked", true);
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

var balls, games, origins, pokemon, ribbons;
function initRun(){
	function loadingBar(n){
		$("#loading-spinner-info-progress").attr("aria-valuenow", n);
		$("#loading-spinner-info-progress-bar").css("width", n + "%");
	}
	/* initial preset of settings modal */
	$("#loading-spinner-info-text").text("Loading settings");
	presetSettings();

	/* data load */
	loadingBar(10);
	$("#loading-spinner-info-text").text("Loading data");
	$.when(
		$.getJSON("./data/balls.json"),
		$.getJSON("./data/changelog.json"),
		$.getJSON("./data/games.json"),
		$.getJSON("./data/origins.json"),
		$.getJSON("./data/pokemon.json"),
		$.getJSON("./data/ribbons.json")
	).fail(function(response, status, error){
		var $errorimg = $("<img>", { "src": "./img/ui/cross.svg", "class": "mb-3" });
		var $errortext = $("<div>", { "id": "loading-spinner-info-text", "class": "fw-bold", "role": "status" }).text("Data loading error: " + error);
		$("#loading-spinner-info").html($errorimg).append($errortext);
	}).done(function(dataBalls, dataChangelog, dataGames, dataOrigins, dataPokemon, dataRibbons){
		/* set variables */
		balls = dataBalls[0];
		var changelog = dataChangelog[0];
		games = dataGames[0];
		origins = dataOrigins[0];
		pokemon = dataPokemon[0];
		ribbons = dataRibbons[0];

		/* changelog logic */
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
					$changeList.append($("<li>").html(changelog[date][change]));
				}
				$changeContainer.append($changeList);
				newChanges.push($changeContainer);
			}
		}
		if(newChanges.length){
			$(function(){
				for(let i in newChanges){
					$("#modalChangelog .list-group").prepend(newChanges[i]);
				}
				new bootstrap.Modal("#modalChangelog").toggle();
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
		}

		/* create the Pokemon list */
		loadingBar(23);
		$("#loading-spinner-info-text").text("Loading Pokémon list");
		for(let p in userPokemon){
			$("#tracker-grid").append(createCard(userPokemon[p]));
		}
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
				}
			}
		});

		/* image check */
		loadingBar(25);
		$("#loading-spinner-info-text").text("Loading images");
		/* thanks to Sean C Davis */
		/* https://www.seancdavis.com/posts/wait-until-all-images-loaded/ */
		var imagesLoaded = 0;
		var totalImages = $("img").length;
		$("img").each(function(idx, img){
			$("<img>").on("load", imageLoaded).attr("src", $(img).attr("src"));
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
	/* dropdown listeners */
	$("#settingsTheme").change(function(){
		changeTheme($(this).val());
	});
	$("#settingsLanguage").change(function(){
		changeLanguage($(this).val());
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
	/* checkbox listeners */
	for(let i in toggles){
		$("#settings" + i).change(function(){
			changeCheckToggle(i, $(this).prop("checked") ? "true" : "false");
		});
	}
	/* backup button listeners */
	$("#modalSettingsSaveBackup").click(function(){
		saveBackup();
	});
	$("#modalSettingsLoadBackup").change(function(){
		var file = $(this)[0].files[0];
		if(file) loadBackup(file, $(this).val());
	});
	/* initial functions that run after all else */
	initRun();
});