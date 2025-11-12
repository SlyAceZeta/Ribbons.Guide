/* globals */
var balls, changelog, games, gameOrder = {}, importmap, origins, pokemon, ribbons, translations, forms, natures, modalSettings, modalRibbonChecklist, modalPokemonForm, modalPokemonState = "default", modalPokemonEditing = -1, activeFilters = {}, activeSort = "default", filterState = "default", offcanvasSelect, selectState = "off";
// TODO: add tutorials
/* clear old local storage properties if still present */
/* except theme which gets special handling */
var oldProps = ["site-update-warning"];
for(var o in oldProps){
	if(localStorage[oldProps[o]]){
		localStorage.removeItem(oldProps[o]);
	}
}
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
	} else {
		modifiedDate.setTime(localStorage.lastModified);
	}
	$("#modalDataLastModified").text(modifiedDate.toLocaleDateString() + ", " + modifiedDate.toLocaleTimeString());
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
			$("html").attr("data-bs-theme", "lumiosenight");
		} else {
			$("html").attr("data-bs-theme", "lumioseday");
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

/* normalize languages */
function normalizeLang(lang){
	if(lang === "eses"){
		return "es-es";
	} else if(lang === "es419"){
		return "es-419";
	} else if(lang === "zhhans"){
		return "zh-Hans";
	} else if(lang === "zhhant"){
		return "zh-Hant";
	} else {
		return lang;
	}
}

/* change site language */
var supportedLanguages = ["en", "es-es", "es-419", "fr", "de", "it", "ja", "ko", "zh-Hans", "zh-Hant"];
function changeLanguage(l, page = true){
	changeSetting("language", l);
	if(page){
		$("html").attr("lang", l);
	}
}
/* initial language set */
if(settings.language){
	var languageToSet = settings.language;
	// Spanish backward compatibility
	if(languageToSet == "es"){
		languageToSet = "es-es";
	}
	changeLanguage(languageToSet);
} else {
	const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages;
	if(typeof browserLocales === "string"){
		if(supportedLanguages.includes(browserLocales)){
			changeLanguage(browserLocales);
		}
	} else if(typeof browserLocales === "object"){
		for(var i = 0; i < browserLocales.length; i++){
			var locale = browserLocales[i].split(/-|_/)[0];
			if(supportedLanguages.includes(locale)){
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

/* change Gen 3/4/5 origin marks */
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
	"NewChangelogs": true,
	"AprilFools": true
};
/* change toggle settings */
function changeCheckToggle(name, value, reload = false){
	changeSetting(name, "" + value);
	if(name !== "AprilFools" && name !== "ShowWorldAbility") $("html").attr("data-" + name.toLowerCase(), "" + value);
	if(reload && name == "AprilFools"){
		modalSettings.toggle();
		new bootstrap.Modal("#modalReloading").toggle();
		console.log("reload A: name = " + name + ", value = " + value + ", reload = " + reload);
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

/* Dropbox */
(function (window) {
	window.utils = {
		parseQueryString(str) {
			const ret = Object.create(null);
			
			if (typeof str !== 'string') {
				return ret;
			}
			
			str = str.trim().replace(/^(\?|#|&)/, '');
			
			if (!str) {
				return ret;
			}
			
			str.split('&').forEach((param) => {
				const parts = param.replace(/\+/g, ' ').split('=');
				// Firefox (pre 40) decodes `%3D` to `=`
				// https://github.com/sindresorhus/query-string/pull/37
				let key = parts.shift();
				let val = parts.length > 0 ? parts.join('=') : undefined;
				
				key = decodeURIComponent(key);
				
				// missing `=` should be `null`:
				// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
				val = val === undefined ? null : decodeURIComponent(val);
				
				if (ret[key] === undefined) {
					ret[key] = val;
				} else if (Array.isArray(ret[key])) {
					ret[key].push(val);
				} else {
					ret[key] = [ret[key], val];
				}
			});
			
			return ret;
		},
	};
}(window));

var DROPBOX_CLIENT_ID = 'xxvozybw2lp9ycy';
// Parses the url and gets the access token if it is in the urls hash
function getDropboxTokenFromUrl() {
	return utils.parseQueryString(window.location.hash).access_token;
}
function setDropboxTokenToLocalStorage(t) {
	localStorage.DropboxToken = t;
}
function getDropboxTokenFromLocalStorage() {
	return localStorage.DropboxToken;
}
function getDropboxToken() {
	var DropboxToken = getDropboxTokenFromUrl();
	if(DropboxToken){
		return DropboxToken;
	} else {
		return getDropboxTokenFromLocalStorage();
	}
}
// If the user was just redirected from authenticating, the urls hash will
// contain the access token.
function isAuthenticatedDropbox() {
	return !!getDropboxToken();
}
// Render a list of items to #files
/*function renderItems(items) {
	var filesContainer = document.getElementById('files');
	items.forEach(function(item) {
		var li = document.createElement('li');
		li.innerHTML = item.name;
		filesContainer.appendChild(li);
	});
}*/
$(function(){
	if(localStorage.dropboxTest){
		$("#dropboxTest").removeClass("d-none");
		if (isAuthenticatedDropbox()) {
			var DropboxToken = getDropboxTokenFromLocalStorage();
			if(!DropboxToken){
				DropboxToken = getDropboxTokenFromUrl();
				setDropboxTokenToLocalStorage(DropboxToken);
			}
			
			// Create an instance of Dropbox with the access token and use it to
			// fetch and render the files in the users root directory.
			var dbx = new Dropbox.Dropbox({ accessToken: DropboxToken });
			dbx.filesListFolder({path: ''})
			.then(function(response) {
				$('#modalDataOnlineLoggedIn').removeClass("d-none");
				//renderItems(response.result.entries);
			})
			.catch(function(error) {
				console.error(error?.error || error);
				$("#modalDataOnlineErrorText").text(error?.error?.error_summary || error?.error || error);
				$("#modalDataOnlineError").removeClass("d-none");
			});
		} else {
			$('#modalDataOnlineLogin').removeClass("d-none");
			
			// Set the login anchors href using dbx.getAuthenticationUrl()
			var dbx = new Dropbox.Dropbox({ clientId: DROPBOX_CLIENT_ID });
			var dbxAuthUrl = dbx.auth.getAuthenticationUrl('http://127.0.0.1:3000')
			.then((dbxAuthUrl) => {
				document.getElementById('modalDataOnlineLogin').href = dbxAuthUrl;
			})
		}
	}
});

/* April Fools */
var aprilFools = false;
var todayDate = new Date();
if(todayDate.getMonth() == 3 && todayDate.getDate() == 1){
	$(document).ready(function(){ $("#settingsAprilFoolsContainer").removeClass("d-none").addClass("d-flex"); });
	if(settings["AprilFools"] == "true"){
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
		language: p.lang ? p.lang.toLowerCase() : "en",
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
function saveBackup(name = "RibbonBackup"){
	var backupObj = {};
	backupObj.lastModified = localStorage.lastModified;
	backupObj.settings = JSON.parse(localStorage.settings);
	backupObj.pokemon = localStorage.pokemon ? JSON.parse(localStorage.pokemon) : {};
	backupObj.boxes = localStorage.boxes ? JSON.parse(localStorage.boxes) : {};
	var blob = new Blob([JSON.stringify(backupObj)], {type: 'application/json'});

	var ele = document.createElement('a');
	ele.href = URL.createObjectURL(blob);
	ele.target = "_blank";
	ele.download = name + ".json";

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
				console.log("reload B: fileVersion = " + fileVersion);
				setTimeout(function(){ location.reload() }, 500);
			} else {
				alert("This is not a valid Ribbons.Guide backup. Your data has not changed.");
			}
		}
	}
	reader.readAsText(file);
}

/* import Pokémon files */
/* massive credit to https://github.com/PSWiFi/PSWiFi.github.io/tree/master/misc/pkparse */
function getStringFromBuffer(data) {
	var res = "";
	for (var i = 0; i < 26; i += 2) {
		var char = data.getUint16(i, true);
		if (char == 0) break;
		res += String.fromCharCode(char);
	}
	return res;
}

var gen9First = 917;
var gen9Table = [
  65, -1, -1, -1, -1, 31, 31, 47, 47, 29, 29, 53, 31, 31, 46, 44, 30, 30, -7,
  -7, -7, 13, 13, -2, -2, 23, 23, 24, -21, -21, 27, 27, 47, 47, 47, 26, 14, -33,
  -33, -33, -17, -17, 3, -29, 12, -12, -31, -31, -31, 3, 3, -24, -24, -44, -44,
  -30, -30, -28, -28, 23, 23, 6, 7, 29, 8, 3, 4, 4, 20, 4, 23, 6, 3, 3, 4, -1,
  13, 9, 7, 5, 7, 9, 9, -43, -43, -43, -68, -68, -68, -58, -58, -25, -29, -31,
  6, -1, 6, 0, 0, 0, 3, 3, 4, 2, 3, 3, -5, -12, -12,
];
function getSpecies9(id) {
	return importmap.species[getNational9(id)];
}
function getNational9(raw) {
	if (raw < gen9First) return raw;
	return raw + gen9Table[raw - gen9First];
}

function importFiles(files, delay = 150, i = 0){
	if(i >= files.length){ return; }
	
	var file = files[i];
	var filename = file.name;
	var ext = filename.substring(filename.lastIndexOf("."));
	
	var speciesloc, idsloc, gmaxloc, pidloc, natureloc, fatefulloc, genderloc, formloc, nicknameloc, ogloc, formargloc, otloc, ballloc, gen;
	
	switch(ext){
		case ".pk9": // SV
		case ".pa9": // Z-A
			if (file.size != 344) return alert("Incorrect file size!\nExpected: 344\nGot: " + file.size);
			speciesloc = 0x08;
			idsloc = 0x0c;
			pidloc = 0x1c;
			natureloc = 0x20;
			fatefulloc = 0x22;
			genderloc = 0x22;
			formloc = 0x24;
			nicknameloc = 0x58;
			ogloc = 0xce;
			formargloc = 0xd0;
			otloc = 0xf8;
			ballloc = 0x124;
			gen = 9;
			break;
			
		case ".pa8": // PLA
			if (file.size != 376) return alert("Incorrect file size!\nExpected: 376\nGot: " + file.size);
			speciesloc = 0x08;
			idsloc = 0x0c;
			pidloc = 0x1c;
			natureloc = 0x20;
			fatefulloc = 0x22;
			genderloc = 0x22;
			formloc = 0x24;
			nicknameloc = 0x60;
			ogloc = 0xee;
			formargloc = 0xf4;
			otloc = 0x110;
			ballloc = 0x137;
			gen = 8;
			break;
			
		case ".pk8": // SwSh
		case ".pb8": // BDSP
			if(file.size != 344) return alert("Incorrect file size!\nExpected: 344\nGot: " + file.size);
			speciesloc = 0x08;
			idsloc = 0x0c;
			gmaxloc = 0x16;
			pidloc = 0x1c;
			natureloc = 0x20;
			fatefulloc = 0x22;
			genderloc = 0x22;
			formloc = 0x24;
			nicknameloc = 0x58;
			ogloc = 0xde;
			formargloc = 0xe4;
			otloc = 0xf8;
			ballloc = 0x124;
			gen = 8;
			break;
			
		case ".pk7": // SM/USUM
			if (file.size != 206) return alert("Incorrect file size!\nExpected: 206\nGot: " + file.size);
			speciesloc = 0x08;
			idsloc = 0x0c;
			pidloc = 0x18;
			natureloc = 0x1c;
			fatefulloc = 0x1d;
			genderloc = 0x1d;
			formloc = 0x1d;
			formargloc = 0x3c;
			nicknameloc = 0x40;
			otloc = 0xb0;
			ballloc = 0xdc;
			ogloc = 0xdf;
			gen = 7;
			break;
			
		case ".pk6": // XY/ORAS
			if (file.size != 206) return alert("Incorrect file size!\nExpected: 206\nGot: " + file.size);
			speciesloc = 0x08;
			idsloc = 0x0c;
			pidloc = 0x18;
			natureloc = 0x1c;
			fatefulloc = 0x1d;
			genderloc = 0x1d;
			formloc = 0x1d;
			formargloc = 0x3c;
			nicknameloc = 0x40;
			otloc = 0xb0;
			ballloc = 0xdc;
			ogloc = 0xdf;
			gen = 6;
			break;
			
		default:
			return alert("Unsupported file type provided: " + filename);
	}
	
	file.arrayBuffer().then((buf) => {
		var newP = {
			//species:		DONE
			//gender:		DONE
			//shiny:		DONE
			//nickname:		DONE
			//language:
			//ball:			DONE
			//strangeball:	DONE
			//currentlevel:
			//nature:		DONE
			//totem:		DONE
			//gmax:			DONE
			//shadow:
			//trainername:	DONE
			//trainerid:	DONE
			//originmark:	DONE
			//origingame:	DONE
			//currentgame:	LET USER SELECT
			//box:			DONE
			//title:
			//scale:		DONE
			//ribbons:
			//metlevel:
			//metdate:
			//metlocation:
			//pokerus:
			//achievements:
			//notes:		DONE
		};
		
		var data = new DataView(buf);
		var devid = data.getUint16(speciesloc, true);
		var species = gen === 9 ? getSpecies9(devid) : importmap.species[devid];
		var formdata = data.getUint8(formloc);
		var formval = gen <= 7 ? formdata >>> 3 : formdata;
		var form =
			formval > 0 || devid === 666 || devid === 774 // Vivillon and Minior need special handling because of course they do
			? importmap.forms[String(getNational9(devid))][formval].replace(species, "")
			: "";
		var formarg = data.getUint32(formargloc, true);
		if (devid === 869) form += importmap["alcremie-sweets"][formarg]; // Special handling for Alcremie Sweets
		var totem = false;
		if(form == "-totem"){
			totem = true;
			form = "";
		}
		newP.species = species + form;
		
		var genderID = (data.getUint8(genderloc) >>> (gen === 8 ? 2 : 1)) & 0x3;
		if(genderID == 0){
			newP.gender = "male";
		} else if(genderID == 1){
			newP.gender = "female";
		} else {
			newP.gender = "unknown";
		}
		
		var ogval = data.getUint8(ogloc);
		var pid = data.getUint32(pidloc, true);
		var ids = data.getUint32(idsloc, true);
		var tid5 = ids & 0xffff;
		var sid5 = ids >>> 16;
		var fullid = sid5 * 65536 + tid5;
		var tid7 = fullid % 1000000;
		var sid7 = ~~(fullid / 1000000);
		var tid =
			(ogval >= 30 && ogval <= 34) || ogval >= 42 // Exclude VC
			? tid7.toString().padStart(6, "0")
			: tid5.toString().padStart(5, "0");
		var fateful = (data.getUint8(fatefulloc) & 1) === 1;
		var shinyxor = (pid >>> 16) ^ (pid & 0xffff) ^ tid5 ^ sid5;
		newP.shiny =
			(shinyxor < 16 && fateful) || shinyxor === 0
			? "square"
			: shinyxor < 16
			? "star"
			: "";
			
		var nickarrbuf = buf.slice(nicknameloc, nicknameloc + 26);
		var nickname = getStringFromBuffer(new DataView(nickarrbuf));
		// TODO: remove nickname if it equates to the Pokémon species name in the Pokémon's language
		newP.nickname = nickname;
		
		newP.ball = importmap.balls[data.getUint8(ballloc)];
		newP.strangeball = "";
		
		newP.nature = importmap.natures[data.getUint8(natureloc)];
		
		newP.totem = totem;
		newP.gmax = gmaxloc ? (data.getUint8(gmaxloc) & 16) !== 0 : false;
		
		var otarrbuf = buf.slice(otloc, otloc + 26);
		newP.trainername = getStringFromBuffer(new DataView(otarrbuf));
		newP.trainerid = tid;
		
		if(importmap.originmarks[ogval]){
			newP.originmark = importmap.originmarks[ogval];
		}
		if(importmap.origingames[ogval]){
			newP.origingame = importmap.origingames[ogval];
		} else {
			newP.origingame = "";
		}
		newP.currentgame = "";
		newP.box = -1;
		newP.scale = false;
		newP.achievements = [];
		newP.notes = "";
		
		var speciesSprite = newP.species;
		var genderDirectory = (getPokemonData(speciesSprite, "femsprite") && newP.gender === "female") ? "female/" : "";
		if(speciesSprite.startsWith("alcremie-") && newP.shiny){
			var alcremieRegex = /caramel|lemon|matcha|mint|rainbow|rubycream|rubyswirl|salted|vanilla/;
			speciesSprite = speciesSprite.replace(alcremieRegex, "").replace("--", "-").replace("-strawberry", "");
		}
		
		$("#modalImportPokemonList").append("<div class='my-1 py-1 border-top d-flex'>" +
			"<img src='img/pkmn/" + (newP.shiny ? "shiny" : "regular") + "/" + genderDirectory + speciesSprite + ".png' class='me-2' style='height:80px'>" + 
			"<div>" + 
				"<div class='fs-5'>" +
					"<img src='img/balls/" + newP.ball + ".png' style='height:24px'>" +
					"<span class='ms-2 fw-bold align-middle'>" + newP.nickname + "</span>" +
				"</div>" +
				"<div>OT: " + newP.trainername + "&nbsp;&nbsp;&nbsp;ID: " + newP.trainerid + "</div>" +
				"<div>Origin Game: " + (newP.origingame ? getLanguage(getGameData(newP.origingame, "names")) : "<em>unknown</em>") + "</div>" +
			"</div>" +
		"</div>");
	});
	
	i++;
	
	setTimeout(() => {
		importFiles(files, delay, i);
	}, delay);
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

function getLanguage(data, language = settings.language){
	if(!language) language = "en";
	if(typeof data === "object"){
		if(data[language]){
			return data[language];
		} else if(language == "es-419" && data["es-es"]){
			return data["es-es"];
		} else if(data["en"]){
			return data["en"];
		} else {
			console.error("getLanguage error: data does not have values for en or " + language);
		}
	} else {
		console.error("getLanguage error: provided data is not of type object");
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
	var compatibleGames = [];
	var getCompatibleGames = getPokemonData(dex, "games");
	for(var g in getCompatibleGames){
		compatibleGames.push(getCompatibleGames[g]);
	}
	// temporary until Z-A HOME support when we add "plza" to pokemon.json
	if(currentGame == "plza") compatibleGames.push("plza");
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
			
			var ribbonGameCombo = getGameData(ribbonGame, "partOf", true);
			if(ribbonGameCombo){
				// skip if this game is part of a combo that already has this Ribbon
				if(earnableRibbons[ribbonGameCombo] && earnableRibbons[ribbonGameCombo].includes(ribbon)) continue;
				
				// skip if this game is SV and the Pokemon is in Z-A
				if(ribbonGameCombo == "sv" && currentGame == "plza") continue;
			}

			var ribbonGen = parseInt(getGameData(ribbonGame, "gen"));
			// verify this game has a gen
			if(ribbonGen){
				// verify one of the following:
				// A) this game's gen is the same as, or above, the Pokémon's current gen
				// B) this game's gen is Gen 8 but the Pokémon is currently in a Gen 9 game other than Z-A
				if( (ribbonGen >= currentGen) || (ribbonGen == 8 && currentGen == 9 && currentGame !== "plza") ){
					// verify that the Pokémon can even go to this game
					// if this game is a Gen 7 game, also verify that this Pokémon is not currently in LGPE
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
						} else if(ribbon == "battle-tree-great-ribbon"){
							// Legendaries and Mythicals can earn this in USUM, but not in SM
							// the banlist is identical to the Battle Tree Master Ribbon
							if(ribbonGame == "sun" || ribbonGame == "moon"){
								if(mythical || ribbons["battle-tree-master-ribbon"].banned.includes(dex)){
									continue;
								}
							}
						} else if(ribbon == "gorgeous-ribbon"){
							// Pokémon with the Royal or Gorgeous Royal Ribbon cannot earn this Ribbon in BDSP
							if(ribbonGame == "bd" || ribbonGame == "sp"){
								if(currentRibbons.includes("royal-ribbon") || currentRibbons.includes("gorgeous-royal-ribbon")){
									continue;
								}
							}
						} else if(ribbon == "royal-ribbon"){
							// Pokémon with the Gorgeous Royal Ribbon cannot earn this Ribbon in BDSP
							if(ribbonGame == "bd" || ribbonGame == "sp"){
								if(currentRibbons.includes("gorgeous-royal-ribbon")){
									continue;
								}
							}
						} else if(ribbon == "footprint-ribbon"){
							// if Pokemon can to go to Gen 4, it can always earn this
							if(ribbonGen !== 4){
								// if Pokemon is voiceless and can go to Gen 8, it can always earn this
								var voiceless = getPokemonData(dex, "voiceless");
								if(!(ribbonGen == 8 && voiceless) || ((dex === "beldum" || dex === "metang") && (originGame === "scar" || originGame === "vio")) ){
									// otherwise, Footprint relies on Met Level < 71
									// Beldum and Metang are voiceless, but Metagross is not, and Beldum can be met as high as Lv.74 in SV DLC, so evolving to Metagross will also disqualify it
									var currentLevelBelow71 = currentLevel < 71;
									// Met Level changes upon entering Gen 5 or leaving Virtual Console
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
										// Pokemon has left Gen 5 and Virtual Console, so Met Level is now permanently set
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
												// Pokemon in Gen 5+ with Current Level < 71 must also have Met Level < 71 and can always earn Footprint
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
						} else if(ribbon == "master-rank-ribbon"){
							// Mythicals can temporarily earn this in Gen 9, but not in Gen 8
							if(mythical){
								if(ribbonGen == "8"){
									continue;
								} else {
									earnableWarnings.push("master-rank-sv-2025");
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
	if(evoWarnMon && evoWarnGen && Object.keys(earnableRibbons).length !== 0){
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

function selectPokemon(event){
	if(selectState == "selecting"){
		if($(event.target).closest(".popover, .card-footer-dropdown, a[role='button']").length){
			event.stopPropagation();
			return;
		}
		
		var $cardContainer = $(event.target).parents(".col");
		var $cardCheckbox = $cardContainer.find(".card-header-checkbox");
		
		var isCheckboxClick = event.target.classList.contains("card-header-checkbox");
		var tagWhitelist = ["div", "span", "img"];
		if(!isCheckboxClick && !tagWhitelist.includes(event.target.tagName.toLowerCase())){
			return;
		}
		
		if(isCheckboxClick){
			if($cardCheckbox.prop("checked")){
				$cardContainer.addClass("selected");
			} else {
				$cardContainer.removeClass("selected");
			}
		} else {
			var newCheckboxState = !$cardCheckbox.prop("checked");
			$cardCheckbox.prop("checked", newCheckboxState);
			if(newCheckboxState){
				$cardContainer.addClass("selected");
			} else {
				$cardContainer.removeClass("selected");
			}
		}
		
		var selectedPokemonNum = $("#tracker-grid .col.selected").length;
		$("#offcanvasSelectEditNum").text(selectedPokemonNum);
		var selectDisabled = (selectedPokemonNum === 0);
		$("#offcanvasSelectEdit, #offcanvasSelectDelete").prop("disabled", selectDisabled);
	}
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
		var failOrigins = [];
		if(newP.language == "es-419"){
			failOrigins = ["none", "pentagon", "clover", "game-boy", "go", "lets-go", "galar", "bdsp", "hisui", "paldea"];
		} else if(newP.language == "zh-Hans" || newP.language == "zh-Hant"){
			failOrigins = ["none", "pentagon"];
		} else if(newP.language == "ko"){
			if(newP.origingame){
				var failGames = ["fr", "lg", "colosseum", "xd", "ruby", "sapphire", "emerald"];
				if(failGames.includes(newP.origingame)){
					continueForm = false;
					setFormInvalid("Language", "Korean Pokémon cannot originate from this game.");
				} else {
					setFormValid("Language");
				}
			} else {
				setFormValid("Language");
			}
		}
		if(failOrigins.length > 0 && failOrigins.includes(newP.originmark)){
			continueForm = false;
			setFormInvalid("Language", "Pokémon with this language cannot have this Origin Mark.");
		} else if(newP.language !== "ko") {
			setFormValid("Language");
		}
	} else {
		continueForm = false;
		setFormInvalid("OriginMark", "Please select an Origin Mark.");
	}
	if((newP.ribbons.includes("partner-ribbon") || newP.title == "partner-ribbon") && !newP.trainername){
		continueForm = false;
		setFormInvalid("TrainerName", "The Partner Ribbon requires an OT.");
	} else {
		setFormValid("TrainerName");
	}
	if(newP.currentgame){
		if(getPokemonData(newP.species, "cannotStore") && getGameData(newP.currentgame, "storage", true)){
			continueForm = false;
			setFormInvalid("CurrentGame", "This Pokémon cannot be stored in Bank or HOME.");
		} else if(!getGameData(newP.currentgame, "storage", true) && !getPokemonData(newP.species, "games").includes(newP.currentgame)) {
			// temporary until Z-A HOME support when we add "plza" to pokemon.json
			if(newP.currentgame == "plza"){
				if(newP.originmark == "plza"){
					setFormValid("CurrentGame");
				} else {
					continueForm = false;
					setFormInvalid("CurrentGame", "HOME does not yet support Z-A.");
				}
			} else {
				continueForm = false;
				setFormInvalid("CurrentGame", "This Pokémon cannot go to this game.");
			}
		} else {
			setFormValid("CurrentGame");
		}
	} else {
		setFormValid("CurrentGame");
	}
	if(continueForm){
		if(edit){
			userPokemon[modalPokemonEditing] = newP;
			$("#tracker-grid .col[data-pokemon-id='" + modalPokemonEditing + "']").replaceWith(createCard(newP, modalPokemonEditing));
		} else {
			userPokemon.push(newP);
			$("#tracker-grid").append(createCard(newP, userPokemon.length-1));
			$("#sectionTrackerCountTotal").text(userPokemon.length);
		}
		sortPokemonList();
		filterPokemonList();
		localStorage.pokemon = JSON.stringify(userPokemon);
		updateModifiedDate();
		updatePopovers();
		modalPokemonForm.toggle();
	} else {
		$("#pokemonFormTabs-details").trigger("click");
		modalPokemonState = edit ? "editing" : "default";
	}
}

function saveMultiplePokemon(){
	selectState = "saving";
	var newRibbons = [];
	$("#pokemonFormMultiRibbons input:checked").each(function(){
		newRibbons.push($(this).attr("id").replace("pokemonFormMultiRibbon-", ""));
	});
	var selectedPokemonNum = $("#tracker-grid .col.selected").length;
	var saveConfirmInitial = "Are you sure you want to make all of the following changes to " + selectedPokemonNum + " Pokémon?\n";
	var saveConfirm = saveConfirmInitial;
	var newCurrentGame = $("#pokemonFormMultiCurrentGame").val();
	var newCurrentGameLabel = $("#pokemonFormMultiCurrentGame option[value="+newCurrentGame+"]").text();
	if(newCurrentGame !== "nochange"){
		saveConfirm = saveConfirm + "\n- Moved to " + newCurrentGameLabel;
	}
	var newBox = $("#pokemonFormMultiBox").val();
	if(newBox !== "nochange"){
		if(newBox == "-1"){
			saveConfirm = saveConfirm + "\n- Removed from box";
		} else {
			saveConfirm = saveConfirm + "\n- Changed box to " + $("#pokemonFormMultiBox option[value="+newBox+"]").text();
		}
	}
	var scaleChecked = $("#pokemonFormMultiScale").prop("checked");
	if(scaleChecked){
		saveConfirm = saveConfirm + "\n- Checked scale in Mesagoza";
	}
	if(newRibbons.length){
		saveConfirm = saveConfirm + "\n- Up to " + newRibbons.length + " new Ribbon";
		if(newRibbons.length > 1){
			saveConfirm = saveConfirm + "s";
		}
	}
	if(saveConfirm == saveConfirmInitial){
		alert("You didn't make any changes!");
		return;
	}
	if(confirm(saveConfirm)){
		var multiSaveSuccess = 0, multiSaveSome = 0, multiSaveFail = 0, multiSaveNone = 0;
		$("#tracker-grid .col.selected").each(function(){
			var pokemonID = Number($(this)[0].dataset.pokemonId);
			var newP = JSON.parse(JSON.stringify(userPokemon[pokemonID]));
			var gameChangeValid = true;
			if(newCurrentGame !== "nochange"){
				var originalgame = newP.currentgame;
				newP.currentgame = newCurrentGame;
				if(getPokemonData(newP.species, "cannotStore") && getGameData(newP.currentgame, "storage", true)){
					gameChangeValid = false;
				} else if(!getGameData(newP.currentgame, "storage", true) && !getPokemonData(newP.species, "games").includes(newP.currentgame)) {
					// temporary until Z-A HOME support when we add "plza" to pokemon.json
					if(newP.currentgame == "plza"){
						if(newP.originmark !== "plza"){
							gameChangeValid = false;
						}
					} else {
						gameChangeValid = false;
					}
				}
				if(!gameChangeValid){
					newP.currentgame = originalgame;
				}
			}
			var changedBox = false;
			if(newBox !== "nochange" && newP.box !== newBox){
				newP.box = newBox;
				changedBox = true;
			}
			var changedScale = false;
			if(scaleChecked && newP.scale != true){
				newP.scale = true;
				changedScale = true;
			}
			var changedAnyRibbons = false;
			if(newRibbons.length){
				for(var r in newRibbons){
					if(!newP.ribbons.includes(newRibbons[r])){
						newP.ribbons.push(newRibbons[r]);
						changedAnyRibbons = true;
					}
				}
			}
			var changedAnything = false;
			if(!changedBox && !changedScale && !changedAnyRibbons){
				// no changes were made, except for the game, let's check that now
				if(newCurrentGame == "nochange"){
					// game change was not even requested
					// but in order to reach this, another change had to have been requested
					multiSaveNone++;
				} else if(gameChangeValid){
					// game change was requested and valid, success
					multiSaveSuccess++;
					changedAnything = true;
				} else {
					// game change was requested and failed
					// we will check whether other requests were made (and failed) in the error message
					multiSaveFail++;
				}
			} else {
				// box, scale, or ribbons were changed
				changedAnything = true;
				if(newCurrentGame == "nochange" || gameChangeValid){
					// if a game change was not requested, or was requested and was valid, success
					multiSaveSuccess++;
				} else {
					// if a game change was requested and failed
					multiSaveSome++;
				}
			}
			if(changedAnything){
				userPokemon[pokemonID] = newP;
				$("#tracker-grid .col[data-pokemon-id='" + pokemonID + "']").replaceWith(createCard(newP, pokemonID));
			}
		});
		
		if(multiSaveSuccess || multiSaveSome){
			$("#offcanvasSelectEditNum").text("0");
			$("#offcanvasSelectEdit, #offcanvasSelectDelete").prop("disabled", true);
			
			sortPokemonList();
			filterPokemonList();
			localStorage.pokemon = JSON.stringify(userPokemon);
			updateModifiedDate();
			updatePopovers();
			offcanvasSelect.hide(); // because of card overwrites
		}
		
		modalPokemonFormMulti.toggle();
		
		$("#modalPokemonMultiOutcome .modal-body").html("");
		var outcomeHTML = [];
		if(multiSaveSuccess){
			outcomeHTML.push($("<p>").text("Successfully updated " + multiSaveSuccess + " Pokémon!"));
		}
		if(multiSaveNone){
			var pluralOne = multiSaveNone === 1 ? "was" : "were";
			var pluralTwo = multiSaveNone === 1 ? "it" : "they";
			outcomeHTML.push($("<p>").text(multiSaveNone + " Pokémon " + pluralOne + " not updated because " + pluralTwo + " already had every selected change."));
		}
		if(multiSaveSome){
			var pluralOne = multiSaveSome === 1 ? "was" : "were";
			var pluralTwo = multiSaveSome === 1 ? "its" : "their";
			outcomeHTML.push($("<p>").text(multiSaveSome + " Pokémon " + pluralOne + " updated, but " + pluralTwo + " Current Game was not changed because they cannot travel to " + newCurrentGameLabel + "."));
		}
		if(multiSaveFail){
			var pluralOne = multiSaveFail === 1 ? "was" : "were";
			var pluralTwo = multiSaveFail === 1 ? "it" : "they";
			var changesAddon = (newBox == "nochange" || !scaleChecked && !newRibbons.length)
				? pluralTwo + " already had every selected change, except the Current Game; "
				: "";
			outcomeHTML.push($("<p>").html(multiSaveFail + " Pokémon " + pluralOne + " not updated because " + changesAddon + pluralTwo + " cannot travel to " + newCurrentGameLabel + "."));
		}
		$("#modalPokemonMultiOutcome .modal-body").append(outcomeHTML);
		new bootstrap.Modal("#modalPokemonMultiOutcome").toggle();
	}
}

function editPokemon(event){
	resetPokemonForm(true);
	var cardContainer = $(event.target).parents(".col");
	var pokemonID = cardContainer[0].dataset.pokemonId;
	modalPokemonState = "editing";
	modalPokemonEditing = pokemonID;
	var pokemonToEdit = userPokemon[pokemonID];
	$("#pokemonFormSpecies").val(pokemonToEdit.species).trigger("change");
	if(pokemonToEdit.gender === "female") $("#pokemonFormGender-female").prop("checked", true).trigger("change");
	if(pokemonToEdit.shiny.length){
		var shinyType = (pokemonToEdit.shiny === "square") ? "square" : "star";
		$("#pokemonFormShiny-" + shinyType).prop("checked", true).trigger("change");
	}
	$("#pokemonFormNickname").val(pokemonToEdit.nickname);
	$("#pokemonFormLanguage").val(pokemonToEdit.language).trigger("change");
	$("#pokemonFormBall").val(pokemonToEdit.ball).trigger("change");
	if(pokemonToEdit.strangeball.length) $("#pokemonFormStrangeBall-" + pokemonToEdit.strangeball).prop("checked", true).trigger("change");
	$("#pokemonFormCurrentLevel").val(pokemonToEdit.currentlevel);
	$("#pokemonFormNature").val(pokemonToEdit.nature).trigger("change");
	if(pokemonToEdit.totem) $("#pokemonFormTotem").prop("checked", true).trigger("change");
	if(pokemonToEdit.gmax) $("#pokemonFormGMax").prop("checked", true).trigger("change");
	if(pokemonToEdit.shadow) $("#pokemonFormShadow").prop("checked", true).trigger("change");
	$("#pokemonFormTrainerName").val(pokemonToEdit.trainername);
	$("#pokemonFormTrainerID").val(pokemonToEdit.trainerid);
	$("#pokemonFormOriginMark").val(pokemonToEdit.originmark).trigger("change");
	$("#pokemonFormOriginGame").val(pokemonToEdit.origingame).trigger("change");
	$("#pokemonFormCurrentGame").val(pokemonToEdit.currentgame).trigger("change");
	if(pokemonToEdit.box || pokemonToEdit.box == 0) $("#pokemonFormBox").val(pokemonToEdit.box).trigger("change");
	$("#pokemonFormTitle").val(pokemonToEdit.title).trigger("change");
	if(pokemonToEdit.scale) $("#pokemonFormScale").prop("checked", true).trigger("change");
	for(var r in pokemonToEdit.ribbons){
		$("#pokemonFormRibbon-" + pokemonToEdit.ribbons[r]).prop("checked", true).trigger("change");
	}
	if(pokemonToEdit.metlevel) $("#pokemonFormMetLevel").val(pokemonToEdit.metlevel);
	$("#pokemonFormMetDate").val(pokemonToEdit.metdate).trigger("change");
	$("#pokemonFormMetLocation").val(pokemonToEdit.metlocation);
	if(pokemonToEdit.pokerus.length) $("#pokemonFormPokerus-" + pokemonToEdit.pokerus).prop("checked", true).trigger("change");
	for(var a in pokemonToEdit.achievements){
		$("#pokemonFormAchievements-" + pokemonToEdit.achievements[a]).prop("checked", true).trigger("change");
	}
	$("#pokemonFormNotes").val(pokemonToEdit.notes);
	modalPokemonForm.toggle();
}

function copyPokemon(event){
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
		$("#sectionTrackerCountTotal").text(userPokemon.length);
		$("#sectionTrackerCountNotAllNum").text($("#tracker-grid .col:not(.d-none)").length);
		updatePopovers();
	}
}

function deletePokemon(event){
	var cardContainer = $(event.target).parents(".col");
	var pokemonID = Number(cardContainer[0].dataset.pokemonId);
	var pokemonName = cardContainer[0].dataset.name;
	if(confirm("Are you sure you want to delete " + pokemonName + "? This is permanent!")){
		cardContainer.fadeOut(250, function(){
			$(this).remove();
			userPokemon.splice(pokemonID, 1);
			localStorage.pokemon = JSON.stringify(userPokemon);
			updateModifiedDate();
			$("#tracker-grid .col").each(function(){
				if(Number(this.dataset.pokemonId) > pokemonID){
					$(this).attr("data-pokemon-id", Number(this.dataset.pokemonId)-1);
				}
			});
			$("#sectionTrackerCountTotal").text(userPokemon.length);
			$("#sectionTrackerCountNotAllNum").text($("#tracker-grid .col:not(.d-none)").length);
		});
	}
}

function deleteMultiplePokemon(){
	var selectedPokemonNum = $("#tracker-grid .col.selected").length;
	if(confirm("Are you sure you want to delete " + selectedPokemonNum + " Pokémon? This is permanent!")){
		var removedCount = 0;
		$("#tracker-grid .col.selected").each(function(i, e){
			var pokemonID = Number($(e)[0].dataset.pokemonId);
			$(e).fadeOut(250, function(){
				$(e).remove();
				userPokemon.splice(pokemonID, 1);
				
				$("#tracker-grid .col").each(function(){
					if(Number(this.dataset.pokemonId) > pokemonID){
						$(this).attr("data-pokemon-id", Number(this.dataset.pokemonId)-1);
					}
				});
				
				removedCount++;
				if(removedCount === selectedPokemonNum){
					localStorage.pokemon = JSON.stringify(userPokemon);
					updateModifiedDate();
					$("#sectionTrackerCountTotal").text(userPokemon.length);
					$("#sectionTrackerCountNotAllNum").text($("#tracker-grid .col:not(.d-none)").length);
					$("#offcanvasSelectEditNum").text("0");
					$("#offcanvasSelectEdit, #offcanvasSelectDelete").prop("disabled", true);
				}
			});
		});
	}
}

function ribbonChecklist(event){
	var $cardContainer = $(event.target).parents(".col");
	var cardData = $cardContainer[0].dataset;

	// top info - sprite
	var cardSprite = $cardContainer.find(".card-sprite").attr("src");
	$("#modalRibbonChecklistInfo-sprite img").attr("src", "img/ui/1x1.svg"); // initial reset
	$("#modalRibbonChecklistInfo-sprite img").attr("src", cardSprite);

	// top info - name
	var $cardName = $("<div>").html($cardContainer.find(".card-header-fullname").html());
	$cardName.find("img, input").remove();
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
		$("#modalRibbonChecklistInfo-currentgame").text("Currently in " + getLanguage(getGameData(currentGame, "names", true)));
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
			if(ribbonWarnings[w] == "footprint-gen4") warningText = "If " + cardData.name + " reaches Lv.71 before transferring to Gen&nbsp;5, the Footprint Ribbon will only be available in Gen&nbsp;4!";
			if(ribbonWarnings[w] == "footprint-virtualconsole") warningText = "If " + cardData.name + " reaches Lv.71 before transferring to Gen&nbsp;7, the Footprint Ribbon will become unavailable!";
			if(ribbonWarnings[w] == "footprint-met-level") warningText = cardData.name + "'s Met Level has not been set. The availability of the Footprint Ribbon cannot be determined.";
			if(ribbonWarnings[w] == "footprint-beldum") warningText = "Evolving " + cardData.name + " into Metagross will make the Footprint Ribbon unavailable!";
			if(ribbonWarnings[w] == "master-rank-sv-2025") warningText = cardData.name + " can temporarily earn the Master Rank Ribbon during the current " + getLanguage(getGameData("sv", "names", true)) + " regulation. This ends on January&nbsp;3!";
			if(ribbonWarnings[w] == "evolution-warning"){
				var evoWarnName = getLanguage(getPokemonData(cardData.evolutionWarning, "names"));
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
						evoWarnName = evoWarnName + " (" + getLanguage(evoWarnForms) + ")";
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
					var plainGameName = getLanguage(games[game].names);
					// SM/USUM Battle Tree Great check
					var combineGen7 = true;
					if(remainingRibbons["usum"] && remainingRibbons["usum"].includes("battle-tree-great-ribbon") && (getPokemonData(cardData.species, "mythical") || ribbons["battle-tree-master-ribbon"]["banned"].includes(cardData.species))){
						combineGen7 = false;
					}
					if(combineGen7 && (game == "sm" || game == "usum")){
						if($("#modalRibbonChecklistRows .alola").length){
							continue;
						} else {
							$checklistRow.addClass("alola");
							if((game == "sm" && Object.keys(remainingRibbons).includes("usum")) || (game == "usum" && Object.keys(remainingRibbons).includes("sm"))){
								plainGameName = getLanguage(games["sm"].names) + "/" + getLanguage(games["usum"].names);
							}
						}
					}
					var formattedGameName = "<span class='text-nowrap'>" + plainGameName.replaceAll("/", "/</span><span class='text-nowrap'>") + "</span>";
					$checklistRowTitle = $("<div>", { "class": "modalRibbonChecklistRows-gamename fw-bold mb-2" }).html(formattedGameName);
					if(game == currentGame || game == getGameData(currentGame, "partOf", true) || (combineGen7 && game == "sm" && getGameData(currentGame, "partOf", true) == "usum")){
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
						var $ribbonBtn = $("<a>", { "class": "d-inline-block p-0 my-1 modalRibbonChecklistRows-ribbon", "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": getLanguage(ribbons[allGameRibbons[r]].names), "data-bs-content": getLanguage(ribbons[allGameRibbons[r]].descs) })
							.append($("<img>", { "src": "img/ribbons-and-marks/" + allGameRibbons[r] + ".png", "style": "width:32px;" }));
						if(ribbons[allGameRibbons[r]].titles){
							$ribbonBtn.attr("title", "<div>" + $ribbonBtn.attr("title") + "</div><div class='popover-ribbon-title'>(" + getLanguage(ribbons[allGameRibbons[r]].titles) + ")</div>");
						}
						$(g).find(addToList).append($ribbonBtn);
					}
				});
				if(currentGameStatus === "last-chance"){
					$("#modalRibbonChecklistStatus-text").addClass("bg-danger-subtle").html(cardData.name + " still has " + ribbonDisplay + " to earn in <span class='text-nowrap'>" + getLanguage(games[currentGame].names) + "</span>");
					if(compatibleGames.includes("plza") && currentGame !== "plza"){
						// if this Pokemon can travel to Z-A, warn that it shouldn't
						$("#modalRibbonChecklistStatus-text").append(" and cannot enter Legends: Z-A yet.");
					} else {
						$("#modalRibbonChecklistStatus-text").append(".");
					}
				} else {
					var moveTo = $(".last-chance, .scale-marks").first().prev().html().toString();
					if(lastChanceGen == Number(getGameData(currentGame, "gen")) && lastChanceGen < 8){
						$("#modalRibbonChecklistStatus-text").addClass("bg-warning-subtle").html(cardData.name + " can safely move to " + moveTo + " but " + pronounSubject + " cannot leave Gen " + lastChanceGen + " yet.");
					} else if((lastChanceGen == 8 || lastChanceGen == 9) && compatibleGames.includes("plza") && currentGame !== "plza"){
						// if this Pokemon can travel to Z-A, warn that it shouldn't
						$("#modalRibbonChecklistStatus-text").addClass("bg-warning-subtle").html(cardData.name + " can safely move to " + moveTo + " but " + pronounSubject + " cannot enter Legends: Z-A yet.");
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
		// origin game is only needed for Gen 3 and Nincada
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
		displayName = getLanguage(getPokemonData(p.species, "names"), p.language);
	}
	var compatibleGames = [];
	var getCompatibleGames = getPokemonData(p.species, "games");
	for(var g in getCompatibleGames){
		compatibleGames.push(getCompatibleGames[g]);
	}
	// temporary until Z-A HOME support when we add "plza" to pokemon.json
	if(p.currentgame == "plza") compatibleGames.push("plza");
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
						if(p.currentgame == "plza" && targetGen == 9){
							// Pokemon in Z-A can only travel to Z-A in Gen 9
							if(compatibleGames[cg] == "plza"){
								compatibleTest = true;
							}
						} else {
							compatibleTest = true;
						}
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
	var $cardCol = $("<div>", { "class": "col", "data-name": displayName, "data-national-dex": getPokemonData(p.species, "natdex"), "data-level": p.currentlevel, "data-origin-mark": p.originmark, "data-origin-game": p.origingame, "data-current-game": p.currentgame, "data-compatible-games": JSON.stringify(compatibleFiltered), "data-earned-ribbons": JSON.stringify(p.ribbons), "data-pokemon-id": id, "data-gender": p.gender, "data-species": p.species, "data-current-gen": currentGen, "data-scale-checked": p.scale ? "" + p.scale : "false" });
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
	var $cardContainer = $("<div>", { "class": "card border-0", "onclick": "selectPokemon(event)" });

	/* sections */
	var $cardHeader = $("<div>", { "class": "card-header d-flex justify-content-between" });
	var $cardBody = $("<div>", { "class": "card-body d-flex align-items-center p-0" });
	var $cardFooter = $("<div>", { "class": "card-footer" });

	/* header */
	var $cardHeaderLeft = $("<div>", { "class": "card-header-fullname" });
	var $cardHeaderCheckbox = $("<input>", { "type": "checkbox", "class": "card-header-checkbox form-check-input me-2 d-none", "aria-label": "Select " + displayName, "disabled": true });
	var $cardHeaderBallMain = $("<img>", { "class": "align-text-top me-2", "src": "img/balls/" + p.ball + ".png", "alt": getLanguage(balls[p.ball]), "title": getLanguage(balls[p.ball]) });
	var $cardHeaderBallStrange = "";
	if(p.currentgame && ((p.currentgame !== "pla" && p.currentgame !== "home" && balls[p.ball].hisui) || (p.currentgame == "pla" && !balls[p.ball].hisui))){
		if(p.strangeball !== "disabled"){
			$cardHeaderBallStrange = $("<img>", { "class": "align-text-top me-2", "src": "img/balls/strange.png", "alt": getLanguage(translations["strange-ball"]), "title": getLanguage(translations["strange-ball"]) });
			if(p.strangeball == ""){
				$cardHeaderBallMain.addClass("card-header-ball-selected");
				$cardHeaderBallStrange.addClass("card-header-ball-strange");
			} else if(p.strangeball == "enabled"){
				$cardHeaderBallMain = $cardHeaderBallStrange;
			}
		}
	}
	$cardHeaderLeft.append($cardHeaderCheckbox, $cardHeaderBallMain, $cardHeaderBallStrange);
	var $cardHeaderLeftName = $("<span>", { "class": "align-baseline" });
	var titleRibbon;
	var titlePositions = {};
	if(p.title && p.title !== "None"){
		titleRibbon = ribbons[p.title];
		for(var lang in translations.languages){
			var titlePosition = translations.languages[lang].titlePosition;
			if(titleRibbon.titlePositions && titleRibbon.titlePositions[lang]){
				titlePosition = titleRibbon.titlePositions[lang];
			}
			titlePositions[lang] = titlePosition;
		}
		for(let tp in titlePositions){
			if(titlePositions[tp] == "prefix"){
				var titleText = getLanguage(titleRibbon.titles, tp);
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
				var titleText = getLanguage(titleRibbon.titles, tp);
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
		$cardHeaderTitle = $("<a>", { "class": "ms-2 card-header-title-ribbon", "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": getLanguage(ribbons[p.title].names), "data-bs-content": getLanguage(ribbons[p.title].descs) })
			.append($("<img>", { "src": "img/ribbons-and-marks/" + p.title + ".png" }));
		if(ribbons[p.title].titles){
			$cardHeaderTitle.attr("title", "<div>" + $cardHeaderTitle.attr("title") + "</div><div class='popover-ribbon-title'>(" + getLanguage(ribbons[p.title].titles) + ")</div>");
		}
	}
	var $cardHeaderButton = $("<button>", { "type": "button", "class": "btn btn-link p-0 ms-1 position-relative", "onclick": "ribbonChecklist(event)", "aria-label": "Ribbon Checklist", "title": "Ribbon Checklist" })
		.append($("<span>", { "class": "ribbon-checklist-warning-badge position-absolute translate-middle bg-danger rounded-circle" }).html($("<span>", {"class": "visually-hidden"}).text("Warnings")));
	$cardHeaderRight.append($cardHeaderTitle, $cardHeaderButton);

	$cardHeader.append($cardHeaderRight);

	/* body */
	var speciesSprite = p.species;
	if(aprilFools && settings["AprilFools"] == "true"){
		speciesSprite = "ditto";
		if(p.species == "ditto"){
			speciesSprite = "mew";
		}
	}
	var genderDirectory = ((!aprilFools || settings["AprilFools"] == "false") && getPokemonData(speciesSprite, "femsprite") && p.gender === "female") ? "female/" : "";
	if(speciesSprite.startsWith("alcremie-") && p.shiny){
		var alcremieRegex = /caramel|lemon|matcha|mint|rainbow|rubycream|rubyswirl|salted|vanilla/;
		speciesSprite = speciesSprite.replace(alcremieRegex, "").replace("--", "-").replace("-strawberry", "");
	}
	$cardBody.append($("<img>", { "class": "card-sprite p-1 flex-shrink-0", "src": "img/pkmn/" + (p.shiny ? "shiny" : "regular") + "/" + genderDirectory + speciesSprite + ".png", "alt": getLanguage(getPokemonData(p.species, "names")), "title": getLanguage(getPokemonData(p.species, "names")) }));
	var $cardRibbons = $("<div>", { "class": "card-ribbons flex-grow-1 d-flex flex-wrap p-1" });
	var ribbonCount = 0, ribbonCountGen7Check = 0, markCount = 0, battleMemory = "", contestMemory = "", battleMemories = [], contestMemories = [];
	for(let r in p.ribbons){
		var cardRibbonClass = p.ribbons[r];
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
		var $ribbonBtn = $("<a>", { "class": cardRibbonClass, "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": getLanguage(ribbons[p.ribbons[r]].names), "data-bs-content": getLanguage(ribbons[p.ribbons[r]].descs) })
			.append($("<img>", { "src": "img/ribbons-and-marks/" + p.ribbons[r] + ".png" }));
		if(ribbons[p.ribbons[r]].titles){
			$ribbonBtn.attr("title", "<div>" + $ribbonBtn.attr("title") + "</div><div class='popover-ribbon-title'>(" + getLanguage(ribbons[p.ribbons[r]].titles) + ")</div>");
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
		var $ribbonBtn = $("<a>", { "class": "auto-memory-ribbon battle-memory-ribbon" + battleMemory, "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": "<div>" + getLanguage(ribbons["battle-memory-ribbon" + battleMemory].names) + " (" + battleMemories.length + ")</div><div class='popover-ribbon-title'>(" + getLanguage(ribbons["battle-memory-ribbon" + battleMemory].titles) + ")</div>", "data-bs-content": getLanguage(ribbons["battle-memory-ribbon" + battleMemory].descs) + "<div class='card-ribbons-memories d-flex flex-wrap mt-2'>" })
			.append($("<img>", { "src": "img/ribbons-and-marks/battle-memory-ribbon" + battleMemory + ".png" }));
		for(let m in battleMemories){
			$ribbonBtn.attr("data-bs-content", $ribbonBtn.attr("data-bs-content") + "<img class='" + battleMemories[m] + "' src='img/ribbons-and-marks/" + battleMemories[m] + ".png' alt='" + getLanguage(ribbons[battleMemories[m]].names) + "'>");
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
		var $ribbonBtn = $("<a>", { "class": "auto-memory-ribbon contest-memory-ribbon" + contestMemory, "tabindex": "0", "role": "button", "data-bs-toggle": "popover", "title": "<div>" + getLanguage(ribbons["contest-memory-ribbon" + contestMemory].names) + " (" + contestMemories.length + ")</div><div class='popover-ribbon-title'>(" + getLanguage(ribbons["contest-memory-ribbon" + contestMemory].titles) + ")</div>", "data-bs-content": getLanguage(ribbons["contest-memory-ribbon" + contestMemory].descs) + "<div class='card-ribbons-memories d-flex flex-wrap mt-2'>" })
			.append($("<img>", { "src": "img/ribbons-and-marks/contest-memory-ribbon" + contestMemory + ".png" }));
		for(let m in contestMemories){
			$ribbonBtn.attr("data-bs-content", $ribbonBtn.attr("data-bs-content") + "<img class='" + contestMemories[m] + "' src='img/ribbons-and-marks/" + contestMemories[m] + ".png' alt='" + getLanguage(ribbons[contestMemories[m]].names) + "'></span>");
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
	var $cardFooterBottomLeft = $("<div>")
		.append($cardFooterBottomLevel,
			$("<span>", { "class": "align-middle card-footer-language d-inline-block text-center rounded-pill fw-bold mx-2" }).text(translations.languages[p.language].abbr)
		);
	var originName;
	if(p.origingame){
		originName = getLanguage(getGameData(p.origingame, "names"));
		if(getGameData(p.origingame, "storage", true)){
			originName = originName.replace(/ \(.*\)/, "");
		}
	} else if(p.originmark === "none"){
		originName = getLanguage(translations.none);
	} else {
		originName = getLanguage(origins[p.originmark].names);
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
		.append($("<button>", { "class": "btn btn-link p-0 ms-2 lh-1 align-text-bottom card-sortable-handle" }).html($("<img>", { "class": "align-text-bottom", "src": "img/ui/move.svg", "alt": "Move", "title": "Drag to re-order" })))
		.append($("<div>", { "class": "card-footer-dropdown dropdown d-inline ms-2 align-text-bottom" })
			.append($("<button>", { "class": "btn btn-link dropdown-toggle p-0 border-0", "type": "button", "data-bs-toggle": "dropdown", "data-bs-display": "static", "aria-expanded": "false" }).html($("<img>", { "src": "img/ui/more.svg", "alt": "More", "title": "More actions" })))
			.append($("<ul>", { "class": "dropdown-menu dropdown-menu-end py-1" })
				.append($("<li>").html($("<button>", { "class": "dropdown-item", "type": "button", "onclick": "editPokemon(event)" }).html("<img src='/img/ui/edit.svg' class='me-2' style='height:18px'><span class='align-middle'>Edit " + displayName + "</span>")))
				.append($("<li>").html($("<button>", { "class": "dropdown-item", "type": "button", "onclick": "copyPokemon(event)" }).html("<img src='/img/ui/copy.svg' class='me-2' style='height:18px'><span class='align-middle'>Copy " + displayName + "</span>")))
				.append($("<hr>", { "class": "dropdown-divider my-1" }))
				.append($("<li>").html($("<button>", { "class": "dropdown-item", "type": "button", "onclick": "deletePokemon(event)" }).html("<img src='/img/ui/delete.svg' class='me-2' style='height:18px'><span class='align-middle'>Delete " + displayName + "</span>")))
			)
		);
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
		if(change) $("#settingsTheme").trigger("change");
	}
	if(settings.ChecklistButtons){
		$("#settingsChecklistButtons").val(settings.ChecklistButtons);
		if(change) $("#settingsChecklistButtons").trigger("change");
	}
	if(settings.TitleRibbon){
		$("#settingsTitleRibbon").val(settings.TitleRibbon);
		if(change) $("#settingsTitleRibbon").trigger("change");
	}
	if(settings.OldRibbons){
		$("#settingsOldRibbons").val(settings.OldRibbons);
		if(change) $("#settingsOldRibbons").trigger("change");
	}
	if(settings.ExtraOriginMarks){
		$("#settingsExtraOriginMarks").val(settings.ExtraOriginMarks);
		if(change) $("#settingsExtraOriginMarks").trigger("change");
	}
	if(settings.CardView){
		$("#switchViewBtn-" + settings.CardView).prop("checked", true);
	}
	if(settings.RibbonFormView){
		$("#switchRibbonFormViewBtn-" + settings.RibbonFormView + ", #switchRibbonFormMultiViewBtn-" + settings.RibbonFormView).prop("checked", true);
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
		if(change) $("#settings" + i).trigger("change");
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
	$("#pokemonFormTabs-details").trigger("click");
	$("#modalPokemonForm input").each(function(){
		if($(this).attr("type") === "text" || $(this).attr("type") === "number" || $(this).attr("type") === "date" || $(this).attr("type") === "search"){
			$(this).val("").trigger("change");
		} else if($(this).attr("type") === "checkbox"){
			$(this).prop("checked", false).trigger("change");
		}
	});
	$("#modalPokemonForm select").each(function(){
		$(this).val(null).trigger("change");
	});
	$("#pokemonFormShinyGroup input, #pokemonFormGenderGroup input").prop("disabled", false);
	$("#pokemonFormGender-unknown").prop("disabled", true);
	$("#pokemonFormShiny-normal, #pokemonFormGender-male, #pokemonFormStrangeBall-global, #pokemonFormPokerus-none").prop("checked", true).trigger("change");
	$("#pokemonFormNotes").val("");
	$("#pokemonFormSprite").attr("src", "img/ui/1x1.svg");
	$("#pokemonFormLanguage").val(settings.language).trigger("change");

	/* re-populate boxes dropdown */
	var $boxNone = $("<option>", { "value": "-1" }).text(getLanguage(translations.none));
	for(var lang in translations.none){
		$boxNone.attr("data-lang-" + lang, translations.none[lang]);
	}
	$("#pokemonFormBox").html($boxNone);
	for(var b in userBoxes){
		$("#pokemonFormBox").append(new Option(userBoxes[b], b));
	}
	$("#pokemonFormBox").val("-1").trigger("change");
	$("#pokemonFormTitle").val("None").trigger("change");
	$("#pokemonFormRibbons li").removeClass("d-none");
	$("#pokemonFormRibbons-none").addClass("d-none");
}

function resetPokemonFormMulti(){
	$("#modalPokemonFormMulti input").each(function(){
		if($(this).attr("type") === "search"){
			$(this).val("").trigger("change");
		} else if($(this).attr("type") === "checkbox"){
			$(this).prop("checked", false).trigger("change");
		}
	});
	$("#modalPokemonFormMulti select").each(function(){
		$(this).val("nochange").trigger("change");
	});
	$("#pokemonFormMultiRibbons li").removeClass("d-none");
	$("#pokemonFormMultiRibbons-none").addClass("d-none");

	/* re-populate boxes dropdown */
	var $boxNoChange = $("<option>", { "value": "nochange" }).text("No change");
	$("#pokemonFormMultiBox").html($boxNoChange);
	
	var $boxNone = $("<option>", { "value": "-1" }).text(getLanguage(translations.none));
	for(var lang in translations.none){
		$boxNone.attr("data-lang-" + lang, translations.none[lang]);
	}
	$("#pokemonFormMultiBox").append($boxNone);
	
	for(var b in userBoxes){
		$("#pokemonFormMultiBox").append(new Option(userBoxes[b], b));
	}
	$("#pokemonFormMultiBox").val("nochange").trigger("change");
}

function relistFilterBoxes(){
	var $boxNone = $("<option>", { "value": "-1" }).text(getLanguage(translations.none));
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
			$(this).val("default").trigger("change");
		} else {
			$(this).val("").trigger("change");
		}
	});
	filterPokemonList();
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
		$("#sectionTrackerFilterCount, #sectionTrackerFilterCount-num, #sectionTrackerFilterCount-sort").addClass("d-none");
		if(sortablePokemon){
			sortablePokemon.option("disabled", false);
			$("body").removeClass("sorting-disabled");
		}
	} else {
		$("#sectionTrackerFilterCount").removeClass("d-none");
		if(sortablePokemon){
			sortablePokemon.option("disabled", true);
			$("body").addClass("sorting-disabled");
		}
		if(activeSort == "default"){
			$("#sectionTrackerFilterCount-sort").addClass("d-none");
		} else {
			$("#sectionTrackerFilterCount-sort").removeClass("d-none");
		}
		if(activeFilterNum){
			$("#sectionTrackerFilterCount-num").removeClass("d-none");
		} else {
			$("#sectionTrackerFilterCount-num").addClass("d-none");
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
			if(activeFilters[f] === "incomplete" || activeFilters[f] === "warning"){
				if(classes.length !== 1){
					pass = false;
					break;
				}
				if(activeFilters[f] === "warning" && !data.ribbonWarnings){
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
	if(filterState == "default" && Object.keys(activeFilters).length){
		var pokemonNumFiltered = 0;
		$("#tracker-grid .col").each(function(){
			var pokemonToFilter = userPokemon[this.dataset.pokemonId];
			if(filterPokemon(pokemonToFilter, this.classList, this.dataset)){
				$(this).removeClass("d-none");
				pokemonNumFiltered++;
			} else {
				$(this).addClass("d-none");
			}
		});
		$("#sectionTrackerCountAll").addClass("d-none");
		$("#sectionTrackerCountNotAll").removeClass("d-none").find("#sectionTrackerCountNotAllNum").text(pokemonNumFiltered);
	} else {
		$("#tracker-grid .col, #sectionTrackerCountAll").removeClass("d-none");
		$("#sectionTrackerCountNotAll").addClass("d-none");
	}
	filterBubble();
}

function updateFormSprite(){
	if($("#pokemonFormSpecies").val()){
		$("#pokemonFormSprite").attr("src", "img/ui/1x1.svg"); // initial reset
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
			.append($("<img>", { "class": selectIconClass, "src": "img/balls/" + o.id + ".png" }))
			.append($("<span>").text(getLanguage(balls[o.id])));
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
			$mark.append($("<span>").text(getLanguage(translations.none)));
		} else {
			$mark.append($("<img>", { "class": selectIconClass + " light-invert", "src": "img/origins/" + o.id + ".png" }))
				.append($("<span>").text(getLanguage(origins[o.id].names)));
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
		var $nature = $("<span>").text(getLanguage(natures[o.id]));
		return $nature;
	} else if(result.indexOf("pokemonFormBox") > 0 || result.indexOf("pokemonFormMultiBox") > 0 || result.indexOf("filterFormBox") > 0){
		var $box = $("<span>");
		var boxImage = "closed";
		if(o.id == "-1"){
			boxImage = "ball";
		}
		if(o.id !== "nochange") $box.append($("<img>", { "class": selectIconClass, "src": "img/ui/box-" + boxImage + ".png" }));
		if(o.id == "-1"){
			$box.append($("<span>").text(getLanguage(translations.none)));
		} else if(o.id == "nochange") {
			$box.append($("<span>").text("No change"));
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
				$pokemon.append($("<span>", { "class": "translation translation-" + normalizeLang(lang.toLowerCase()) }).text(o.element.dataset["name" + lang] + form));
			}
		}
		return $pokemon;
	} else if(result.indexOf("pokemonFormTitle") > 0 || result.indexOf("filterFormEarnedRibbons") > 0 || result.indexOf("filterFormTargetRibbons") > 0){
		$option = $("<span>");
		if(o.id === "None"){
			$option.append($("<span>").text(getLanguage(translations.none)));
		} else {
			$option.append($("<img>", { "class": selectIconClass, "src": "img/ribbons-and-marks/" + o.id + ".png", "alt": getLanguage(ribbons[o.id].names) }));
			for(var oed in o.element.dataset){
				if(oed.indexOf("lang") == 0 && oed.indexOf("langRibbon") == -1){
					lang = oed.substring(4).toLowerCase();
					if(result.indexOf("pokemonFormTitle") > 0){
						$option.append($("<span>", { "class": "translation translation-" + normalizeLang(lang) }).text(getLanguage(ribbons[o.id].titles, normalizeLang(lang))));
					} else if(result.indexOf("filterFormEarnedRibbons") > 0 || result.indexOf("filterFormTargetRibbons") > 0){
						$option.append($("<span>", { "class": "translation translation-" + normalizeLang(lang) }).text(getLanguage(ribbons[o.id].names, normalizeLang(lang))));
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
		.append($("<button>", { "class": "btn btn-link p-0 lh-1 align-middle", "onclick": "editBox(event)" }).html($("<img>", { "class": "align-middle", "src": "img/ui/edit.svg", "alt": "Edit", "title": "Edit" })))
		.append($("<button>", { "class": "ms-2 btn btn-link p-0 lh-1 align-middle", "onclick": "deleteBox(event)" }).html($("<img>", { "class": "align-middle", "src": "img/ui/delete.svg", "alt": "Delete", "title": "Delete" })));
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

function editBox(event){
	var listContainer = $(event.target).parents(".list-group-item");
	var boxID = listContainer.index() - 1;
	createOrEditBox(userBoxes[boxID], boxID);
}

function deleteBox(event){
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
				$("#filterFormBox").val("").trigger("change");
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
		$.getJSON("./data/importmap.json"),
		$.getJSON("./data/origins.json"),
		$.getJSON("./data/pokemon.json"),
		$.getJSON("./data/ribbons.json"),
		$.getJSON("./data/translations.json")
	).fail(function(response, status, error){
		var responseHTML = response.responseText;
		var responseRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
		var responseBody = responseHTML.match(responseRegex);
		var responseText = "";
		if(responseBody && responseBody.length > 1){
			responseText = responseBody[1].trim();
		}
		var $errorimg = $("<img>", { "src": "./img/ui/cross.svg" });
		var $errortext = $("<div>", { "class": "fw-bold", "role": "status" })
			.append($("<div>", { "class": "my-3" }).html("<span class='text-uppercase'>Data loading error: " + error));
		if(responseText.length > 1){
			$errortext.append($("<div>", { "class": "mb-3" }).html(responseText));
		}
		$errortext.append($("<div>").html("Please inform Sly on <a href='https://github.com/SlyAceZeta/Ribbons.Guide'>GitHub</a> or <a href='https://discord.gg/frv7dpWzDG'>Discord</a>."));
		$("#loading-spinner-info").html($errorimg).append($errortext);
	}).done(function(dataBalls, dataChangelog, dataGames, dataImportMap, dataOrigins, dataPokemon, dataRibbons, dataTranslations){
		/* set variables */
		balls = dataBalls[0];
		changelog = dataChangelog[0];
		games = dataGames[0];
		importmap = dataImportMap[0];
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
			var $ballOption = $("<option>", { "value": b }).text(getLanguage(balls[b]));
			for(var lang in translations.languages){
				$ballOption.attr("data-lang-" + lang, getLanguage(balls[b], lang));
			}
			$("#pokemonFormBall, #filterFormBall").append($ballOption);
			$("#imageHoldingArea").append($("<img>", { "src": "img/balls/" + b + ".png" }));
		}
		$("#imageHoldingArea").append($("<img>", { "src": "img/balls/strange.png" }));
		for(var g in games){
			if(games[g].combo || games[g].solo){
				// temporary until Z-A HOME support when we add "plza" to pokemon.json
				if(g == "plza"){
					$("#filterFormTargetGames").append(new Option(getLanguage(games[g].names) + " (disabled until HOME support)", g)).children(":last").prop("disabled", true);
				} else {
					$("#filterFormTargetGames").append(new Option(getLanguage(games[g].names), g));
				}
			}
			if(!games[g].combo){
				$("#pokemonFormCurrentGame, #pokemonFormMultiCurrentGame, #filterFormCurrentGame").append(new Option(getLanguage(games[g].names), g));
			}
		}
		for(var lang in translations.languages){
			var langTrans = getLanguage(translations.languages[lang].name);
			var langAbbr = translations.languages[lang].abbr;
			$("#pokemonFormLanguage, #filterFormLanguage").append(new Option(langAbbr + " - " + langTrans, lang));
			if(lang == settings.language){
				$("#settingsLanguage").append(new Option(translations.languages[lang].name[lang], lang));
			} else {
				$("#settingsLanguage").append(new Option(translations.languages[lang].name[lang] + " / " + langTrans, lang));
			}
		}
		if(settings.language){
			$("#settingsLanguage").val(settings.language);
		}
		for(var o in origins){
			var optionText;
			if(o === "none"){
				optionText = getLanguage(translations.none);
			} else {
				optionText = getLanguage(origins[o].names);
			}
			$("#pokemonFormOriginMark, #filterFormOriginMark").prepend(new Option(optionText, o));
			// TODO: reduce duplication: selectCustomOption
			if(o == "none"){
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
			for(var lang in translations.languages){
				$pokemon.attr("data-name-" + lang, getLanguage(pokemonNames, lang));
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
				if(typeof pokemonForms === "string"){
					pokemonFormDisplay = " (" + pokemonForms + ")";
					$pokemon.attr("data-form-all", pokemonForms);
				} else {
					pokemonFormDisplay = " (" + getLanguage(pokemonForms) + ")";
					for(var lang in translations.languages){
						$pokemon.attr("data-form-" + lang, getLanguage(pokemonForms, lang));
					}
				}
			}
			var pokemonSort = getPokemonData(p, "sort", true);
			if(pokemonSort){
				$pokemon.attr("data-sort", pokemonSort);
			}
			$pokemon.text(getLanguage(pokemonNames) + pokemonFormDisplay);
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
			var $ribbonOption = $("<option>", { "value": r }).text(getLanguage(ribbons[r].names));
			var formRibbonSelect = "#filterFormEarnedRibbons";
			var $ribbonRow = $("<li>", { "class": "list-group-item list-group-item-action d-flex align-items-center border-0", "aria-label": getLanguage(ribbons[r].names) + " - " + getLanguage(ribbons[r].descs) })
				.append($("<input>", { "type": "checkbox", "value": "", "class": "form-check-input mt-0 ms-lg-1 me-1 me-lg-2", "id": "pokemonFormRibbon-" + r }));
			if(r.startsWith("contest-memory-ribbon") || r.startsWith("battle-memory-ribbon")){
				$ribbonRow.append($("<img>", { "src": "img/ui/sync.svg", "class": "pokemonFormRibbon-memory-sync" }));
			}
			var $ribbonRowLabel = $("<label>", { "for": "pokemonFormRibbon-" + r, "class": "form-check-label stretched-link d-flex align-items-center w-100" })
				.append($("<img>", { "src": "img/ribbons-and-marks/" + r + ".png", "class": "me-2", "alt": getLanguage(ribbons[r].names), "title": getLanguage(ribbons[r].names) }));
			var $ribbonRowInfo = $("<div>", { "class": "w-100" });
			var $ribbonRowInfoName = $("<div>", { "class": "fw-bold lh-1 my-1 d-flex w-100 justify-content-between align-items-center" }).append($("<span>").text(getLanguage(ribbons[r].names)));
			var $ribbonRowInfoDesc = $("<div>", { "class": "lh-1 mb-1" }).append($("<small>").text(getLanguage(ribbons[r].descs)));
			for(var lang in translations.languages){
				$ribbonOption.attr("data-lang-" + lang, getLanguage(ribbons[r].names, lang));
				$ribbonRowInfoName.append($("<span>", { "class": "d-none" }).text(getLanguage(ribbons[r].names, lang)));
				$ribbonRowInfoDesc.append($("<small>", { "class": "d-none" }).text(getLanguage(ribbons[r].descs, lang)));
			}
			var ribbonGen = ribbons[r].gen;
			var ribbonGenText = "Gen " + ribbonGen;
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
					ribbonGenText = "Gens " + ribbonGen + " – " + ribbonGenMax;
				}
				$ribbonRowInfoName.append($("<span>", { "class": "badge text-bg-primary rounded-pill ms-2" }).text(ribbonGenText));
				if(!r.startsWith("contest-memory-ribbon") && !r.startsWith("battle-memory-ribbon")){
					$ribbonRow.addClass("ribbon-gen-" + ribbonGen);
				}
			} else {
				if(ribbons[r].mark && r !== "mightiest-mark"){
					$ribbonRowInfoName.append($("<span>", { "class": "badge text-bg-secondary rounded-pill" }).text("Encounter"));
					if(r == "jumbo-mark" || r== "mini-mark"){
						formRibbonSelect = formRibbonSelect + ", #filterFormTargetRibbons";
					}
				} else {
					$ribbonRowInfoName.append($("<span>", { "class": "badge text-bg-secondary rounded-pill" }).text("Event"));
				}
			}
			if(!r.startsWith("contest-memory-ribbon") && !r.startsWith("battle-memory-ribbon")){
				$(formRibbonSelect).append($ribbonOption);
			}
			$ribbonRowInfo.append($ribbonRowInfoName, $ribbonRowInfoDesc);
			$ribbonRowLabel.append($ribbonRowInfo);
			$ribbonRow.append($ribbonRowLabel);
			$("#pokemonFormRibbons").append($ribbonRow);
			
			/* multi edit form */
			var $ribbonRowMulti = $ribbonRow.clone(true);
			var ribbonRowMultiHtml = $ribbonRowMulti[0].outerHTML;
			ribbonRowMultiHtml = ribbonRowMultiHtml.replaceAll("pokemonFormRibbon", "pokemonFormMultiRibbon");
			$ribbonRowMulti = $(ribbonRowMultiHtml);
			$("#pokemonFormMultiRibbons").append($ribbonRowMulti);
			
			if(ribbons[r].titles){
				var $titleOption = $("<option>", { "value": r }).text(getLanguage(ribbons[r].titles));
				for(var lang in translations.languages){
					$titleOption.attr("data-lang-" + lang, getLanguage(ribbons[r].titles, lang)).attr("data-lang-ribbon-" + lang, getLanguage(ribbons[r].names, lang));
				}
				$("#pokemonFormTitle").append($titleOption);
			}
			$("#imageHoldingArea").append($("<img>", { "src": "img/ribbons-and-marks/" + r + ".png" }));
		}
		for(var n in natures){
			var $natureOption = $("<option>", { "value": n }).text(getLanguage(natures[n]));
			for(var lang in translations.languages){
				$natureOption.attr("data-lang-" + lang, getLanguage(natures[n], lang));
			}
			$("#pokemonFormNature").append($natureOption);
		}
		/* apply select2 dropdowns */
		$("#pokemonFormMultiCurrentGame").select2({
			matcher: selectCustomMatcher,
			dropdownParent: $("#modalPokemonFormMulti")
		});
		$("#pokemonFormMultiBox").select2({
			matcher: selectCustomMatcher,
			templateSelection: selectCustomOption,
			templateResult: selectCustomOption,
			dropdownParent: $("#modalPokemonFormMulti")
		});
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
			matcher: selectCustomMatcher,
			templateSelection: selectCustomOption,
			templateResult: selectCustomOption,
			dropdownParent: $("#modalSettings")
		});
		/* listeners */
		$("input[name='pokemonFormGender'], input[name='pokemonFormShiny']").on("change", function(){
			updateFormSprite();
		});
		$("#pokemonFormRibbonSearch, #pokemonFormMultiRibbonSearch").on("input", function(){
			var openForm = "pokemonFormRibbons";
			if(this.id == "pokemonFormMultiRibbonSearch") openForm = "pokemonFormMultiRibbons";
			var searchText = $(this).val().normalize("NFC").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
			if(searchText){
				var matchedRibbons = 0;
				$("#" + openForm + " li").each(function(i, e){
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
					$("#" + openForm + "-none").removeClass("d-none");
				} else {
					$("#" + openForm + "-none").addClass("d-none");
				}
			} else {
				$("#" + openForm + " li").removeClass("d-none");
				$("#" + openForm + "-none").addClass("d-none");
			}
		});
		$("#pokemonFormRibbons input[type='checkbox']").on("change", function(){
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
		$("#pokemonFormRibbonToggle button").on("click", function(){
			var toggleGen = this.dataset.gen;
			$("#pokemonFormRibbons .ribbon-gen-" + toggleGen + " input[type='checkbox']").each(function(i, c){
				$(c).prop("checked", !$(c).prop("checked"));
			});
		});
		$("#pokemonFormSpecies").on("change", function(){
			var species = $(this).val();
			if(species){
				var pokemonGender = getPokemonData(species, "gender");
				if(pokemonGender === "both"){
					$("#pokemonFormGender-unknown").prop("disabled", true);
					$("#pokemonFormGender-male, #pokemonFormGender-female").prop("disabled", false);
					if(!$("#pokemonFormGender-female").prop("checked")){
						$("#pokemonFormGender-male").prop("checked", true).trigger("change");
					}
				} else {
					$("#pokemonFormGenderGroup input").prop("disabled", true);
					$("#pokemonFormGender-" + pokemonGender).prop("checked", true).trigger("change");
				}

				var pokemonFlags = getPokemonData(species, "flags");
				if(pokemonFlags && pokemonFlags.includes("shinyLocked")){
					$("#pokemonFormShinyGroup input").prop("disabled", true);
					$("#pokemonFormShiny-normal").prop("checked", true).trigger("change");
				} else {
					$("#pokemonFormShinyGroup input").prop("disabled", false);
				}
				if(pokemonFlags && pokemonFlags.includes("sizeLocked")){
					$("#pokemonFormScale").prop({ "checked": true, "disabled": true }).trigger("change");
				} else {
					$("#pokemonFormScale").prop({ "checked": false, "disabled": false }).trigger("change");
				}

				updateFormSprite();
			}
		});
		$("#pokemonFormOriginMark").on("change", function(){
			if($(this).val()){
				var matchingGames = origins[$(this).val()].games;
				if(matchingGames.length == 1){
					$("#pokemonFormOriginGame").html("<option></option>").prop("disabled", true);
					var gameName = getLanguage(games[matchingGames[0]].names);
					if(getGameData(gameKey, "storage", true)){
						gameName = gameName.replace(/ \(.*\)/, "");
					}
					$("#pokemonFormOriginGame").append(new Option(gameName, matchingGames[0]));
					$("#pokemonFormOriginGame").val(matchingGames[0]).trigger("change");
				} else {
					$("#pokemonFormOriginGame").html("<option></option>").prop("disabled", false);
					for(var g in matchingGames){
						var gameKey = matchingGames[g];
						var gameName = getLanguage(games[gameKey].names);
						if(getGameData(gameKey, "storage", true)){
							gameName = gameName.replace(/ \(.*\)/, "");
						}
						$("#pokemonFormOriginGame").append(new Option(gameName, gameKey));
					}
					$("#pokemonFormOriginGame").val("").trigger("change");
				}
			} else {
				$("#pokemonFormOriginGame").html("<option></option>").prop("disabled", true);
			}
		});
		$("#modalFilterForm select:not(#filterFormSort), #modalFilterForm input[type='number'], #modalFilterForm input[type='text']").on("change", function(){
			var filterName = this.id.replace("filterForm", "").toLowerCase();
			var filterSearch = $(this).val();
			if(filterSearch == "" || filterSearch === null){
				delete activeFilters[filterName];
			} else {
				if(typeof filterSearch == "string") filterSearch.trim();
				if(filterSearch == ""){
					$(this).val("").trigger("change");
				} else {
					var filterLevel = Number(filterSearch);
					if(filterName == "currentlevel-max" && filterLevel > 99){
						$(this).val("").trigger("change");
					} else if(filterName == "currentlevel-max" && filterLevel < 1){
						$(this).val(1).trigger("change");
					} else if(filterName == "currentlevel-min" && filterLevel < 2){
						$(this).val("").trigger("change");
					} else if(filterName == "currentlevel-min" && filterLevel > 100){
						$(this).val(100).trigger("change");
					} else {
						if(filterName == "currentlevel-min" && $("#filterFormCurrentLevel-max").val().length && filterLevel > Number($("#filterFormCurrentLevel-max").val())){
							$("#filterFormCurrentLevel-max").val(filterLevel).trigger("change");
						} else if(filterName == "currentlevel-max" && $("#filterFormCurrentLevel-min").val().length && filterLevel < Number($("#filterFormCurrentLevel-min").val())){
							$("#filterFormCurrentLevel-min").val(filterLevel).trigger("change");
						}
						activeFilters[filterName] = filterSearch;
					}
				}
			}
			if(filterState == "default"){
				filterPokemonList();
			}
		});
		$("#filterFormSort").on("change", function(){
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
		if(settings.NewChangelogs === "true"){
			var newChanges = [], initialRun = true;
			for(let c in changelog){
				var date = changelog[c].date;
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
					if(changelog[c].header){
						$changeContainer.append($("<p>").html(changelog[c].header));
					}
					let $changeList = $("<ul>", { "class": "mb-0" });
					for(let change in changelog[c].changes){
						$changeList.append($("<li>").html(changelog[c].changes[change]));
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
					if(newChanges.length > 1){
						$("#modalChangelog #modalChangelogNew").removeClass("d-none").addClass("d-block");
					}
					new bootstrap.Modal("#modalChangelog").toggle();
				});
			}
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
			loadingBar(21);
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
		
		/* update all Pokemon languages */
		loadingBar(22);
		$("#loading-spinner-info-text").text("Updating Pokémon languages");
		var languageConvert = {
			"eng": "en",
			"spa": "es-es",
			"fre": "fr",
			"ger": "de",
			"ita": "it",
			"jpn": "ja",
			"kor": "ko",
			"chs": "zh-Hans",
			"cht": "zh-Hant"
		};
		var changedALanguage = false;
		for(let p in userPokemon){
			if(languageConvert[userPokemon[p].language.toLowerCase()]){
				changedALanguage = true;
				userPokemon[p].language = languageConvert[userPokemon[p].language.toLowerCase()];
			}
		}
		if(changedALanguage){
			localStorage.pokemon = JSON.stringify(userPokemon);
			updateModifiedDate();
		}

		/* create the Pokemon list */
		loadingBar(23);
		$("#loading-spinner-info-text").text("Loading Pokémon list");
		for(let p in userPokemon){
			try {
				$("#tracker-grid").append(createCard(userPokemon[p], p));
			} catch(err) {
				var $errorimg = $("<img>", { "src": "./img/ui/cross.svg" });
				var $errortext = $("<div>", { "class": "fw-bold", "role": "status" })
					.append($("<div>", { "class": "my-3" }).html("<span class='text-uppercase'>Pokémon list error on Pokémon #" + p + "</span><br>" + err))
					.append($("<div>").html("Please inform Sly on <a href='https://github.com/SlyAceZeta/Ribbons.Guide'>GitHub</a> or <a href='https://discord.gg/frv7dpWzDG'>Discord</a>."))
					.append($("<div>").html("Attach the following file with your report (tap or left-click to download): <button type='button' class='btn btn-link p-0 fw-bold align-baseline' onclick='saveBackup(\"RibbonError\")'>RibbonError.json</button>"));
				$("#loading-spinner-info").html($errorimg).append($errortext);
				return;
			}
		}
		$("#sectionTrackerCountTotal").text(userPokemon.length);
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
							$("#filterFormBox").val(newBoxID).trigger("change");
						} else {
							var oldBoxFilter = Number(activeFilters.box);
							if(oldBoxID < newBoxID){
								if(oldBoxFilter > oldBoxID && oldBoxFilter <= newBoxID){
									$("#filterFormBox").val(oldBoxFilter-1).trigger("change");
								} else {
									$("#filterFormBox").val(oldBoxFilter).trigger("change");
								}
							} else if(oldBoxID > newBoxID){
								if(oldBoxFilter < oldBoxID && oldBoxFilter >= newBoxID){
									$("#filterFormBox").val(oldBoxFilter+1).trigger("change");
								} else {
									$("#filterFormBox").val(oldBoxFilter).trigger("change");
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
		
		/* show temporary Master Rank Ribbon warning */
		if(!localStorage["master-rank-sv-2025"]){
			$("#master-rank-sv-2025-alert").removeClass("d-none").addClass("d-flex show").find("#master-rank-sv-2025-alert-game").text(getLanguage(getGameData("sv", "names", true)));
			document.getElementById("master-rank-sv-2025-alert").addEventListener("close.bs.alert", event => {
				if(confirm("Are you sure you want to permanently dismiss this alert?")){
					localStorage["master-rank-sv-2025"] = "dismissed";
					$("#headerNavDataLink").focus();
				} else {
					event.preventDefault();
				}
			});
		}

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
	/* set offcanvas */
	offcanvasSelect = new bootstrap.Offcanvas("#offcanvasSelect");
	/* set modals */
	modalSettings = new bootstrap.Modal("#modalSettings");
	modalData = new bootstrap.Modal("#modalData");
	modalImport = new bootstrap.Modal("#modalImport");
	/* dropdown listeners */
	$("#settingsTheme").on("change", function(){
		changeTheme($(this).val());
	});
	$("#settingsLanguage").on("change", function(){
		changeLanguage($(this).val(), false);
		modalSettings.toggle();
		new bootstrap.Modal("#modalReloading").toggle();
		console.log("reload C: " + $(this).val());
		setTimeout(function(){ location.reload() }, 500);
	});
	$("#settingsChecklistButtons").on("change", function(){
		changeChecklistButtons($(this).val());
	});
	$("#settingsTitleRibbon").on("change", function(){
		changeTitleRibbon($(this).val());
	});
	$("#settingsOldRibbons").on("change", function(){
		changeOldRibbons($(this).val());
	});
	$("#settingsExtraOriginMarks").on("change", function(){
		changeExtraOriginMarks($(this).val());
	});
	/* device theme change listener */
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', () => {
		if((settings.theme && settings.theme == "auto") || !settings.theme){
			changeTheme("auto");
		}
	});
	/* card view listener */
	$("#switchView label").on("click", function(){
		changeCardView($(this).prev().val());
	});
	/* ribbon form view listener */
	$("#switchRibbonFormView label, #switchRibbonFormMultiView label").on("click", function(){
		var selectedValue = $(this).prev().val();
		changeRibbonFormView(selectedValue);
		$("#switchRibbonFormView input[value='" + selectedValue + "'], #switchRibbonFormMultiView input[value='" + selectedValue + "']").prop("checked", true);
	});
	/* checkbox listeners */
	for(let i in toggles){
		$("#settings" + i).on("change", function(){
			changeCheckToggle(i, $(this).prop("checked") ? "true" : "false", true);
		});
	}
	/* offcanvas listeners */
	$("#offcanvasSelect").on("show.bs.offcanvas", function(){
		// ensure buttons are disabled, prevent edge cases
		$("#offcanvasSelectEditNum").text("0");
		$("#offcanvasSelectEdit, #offcanvasSelectDelete").prop("disabled", true);
		
		$("#sectionTrackerButtonSelect").addClass("active").prop("aria-pressed", true);
		$(".card-header-checkbox").prop({ "disabled": false }).removeClass("d-none");
		$(".card-header img[src*='/balls']").addClass("d-none");
		$(".dropdown-toggle.show").dropdown("hide");
		$(".card-footer-dropdown .dropdown-toggle, .sectionTrackerButton:not(#sectionTrackerButtonSelect)").prop("disabled", true);
		selectState = "selecting";
	});
	$("#offcanvasSelect").on("hide.bs.offcanvas", function(){
		$("#sectionTrackerButtonSelect").removeClass("active").prop("aria-pressed", false);
		$(".card-header-checkbox").addClass("d-none");
		$(".card-header img[src*='/balls']").removeClass("d-none");
		$(".card-footer-dropdown .dropdown-toggle, .sectionTrackerButton:not(#sectionTrackerButtonSelect)").prop("disabled", false);
		$("#tracker-grid .col.selected").removeClass("selected");
		selectState = "off";
	});
	$("#offcanvasSelect").on("hidden.bs.offcanvas", function(){
		$(".card-header-checkbox").prop({ "checked": false, "disabled": true });
		$("#offcanvasSelectEditNum").text("0");
		$("#offcanvasSelectEdit, #offcanvasSelectDelete").prop("disabled", true);
	});
	/* button listeners */
	$("#sectionTrackerButtonSelect").on("click", function(){
		if($(this).hasClass("active")){
			offcanvasSelect.hide();
		} else {
			offcanvasSelect.show();
		}
	});
	$("#offcanvasSelectEdit").on("click", function(){
		resetPokemonFormMulti();
		modalPokemonFormMulti.toggle();
	});
	$("#offcanvasSelectDelete").on("click", function(){
		deleteMultiplePokemon();
	});
	$("#headerNavSettingsLink").on("click", function(){
		modalSettings.toggle();
	});
	$("#headerNavDataLink").on("click", function(){
		modalData.toggle();
	});
	$("#modalDataSaveBackup").on("click", function(){
		saveBackup();
	});
	$("#modalDataLoadBackupButton").on("click", function(){
		$("#modalDataLoadBackupFile").trigger("click");
	});
	$("#modalDataLoadBackupFile").on("change", function(){
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
	modalPokemonFormMulti = new bootstrap.Modal("#modalPokemonFormMulti");
	$("#modalPokemonFormMulti").on("hide.bs.modal", function(e){
		if(selectState == "selecting"){
			if(!confirm("Are you sure you wish to cancel? All of your changes will be lost!")){
				e.preventDefault();
			}
		}
	});
	$("#sectionTrackerButtonAdd").on("click", function(){
		resetPokemonForm();
		modalPokemonForm.toggle();
	});
	if(localStorage.importTest){
		$("#sectionTrackerButtonImport").removeClass("d-none");
	}
	$("#sectionTrackerButtonImport").on("click", function(){
		modalImport.toggle();
	});
	$("#modalImportButton").on("click", function(){
		$("#modalImportFiles").trigger("click");
	});
	$("#modalImportFiles").on("change", function(){
		var files = $(this)[0].files;
		if(files && files.length) importFiles(files);
	});
	$("#modalPokemonFormSave").on("click", function(){
		savePokemon(modalPokemonState === "editing");
	});
	$("#modalPokemonFormMultiSave").on("click", function(){
		saveMultiplePokemon();
	});
	$("#modalFilterFormReset").on("click", function(){
		resetFilterForm();
	});
	$("#modalBoxes").on("show.bs.modal", function(e){
		populateBoxes();
	});
	$("#modalBoxesNew").on("click", function(){
		createOrEditBox();
	});
	/* TODO: reduce duplication with changelog updates */
	$("#modalAboutViewChangelog").on("click", function(){
		var changeList = [];
		$("#modalChangelog .list-group").html("");
		var stillToUpdate = true;
		for(let c in changelog){
			var date = changelog[c].date;
			if(stillToUpdate){
				stillToUpdate = false;
				localStorage.changelog = date;
			}
			let changeDate = new Date(date);
			let $changeContainer = $("<div>", { "class": "list-group-item py-3" })
				.append($("<h6>", { "class": "fw-bold" }).text(date));
			if(changelog[c].header){
				$changeContainer.append($("<p>").html(changelog[c].header));
			}
			let $changeList = $("<ul>", { "class": "mb-0" });
			for(let change in changelog[c].changes){
				$changeList.append($("<li>").html(changelog[c].changes[change]));
			}
			$changeContainer.append($changeList);
			changeList.push($changeContainer);
		}
		if(changeList.length){
			$(function(){
				for(let i in changeList){
					$("#modalChangelog .list-group").append(changeList[i]);
				}
				$("#modalChangelog #modalChangelogNew").removeClass("d-block").addClass("d-none");
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
	$(".button-to-top").on("click", function(){
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});
	
	/* initial functions that run after all else */
	initRun();
});