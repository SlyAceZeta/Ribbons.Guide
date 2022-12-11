// Languages
const languages = {
	"ger": "Deutsch",			// German
	"eng": "English",			// English
	"spa": "Español (España)",	// Spanish
	"fre": "Français",			// French
	"ita": "Italiano",			// Italian
	"jpn": "日本語",			// Japanese
	"kor": "한국어",			// Korean
	"cht": "正體字",			// Traditional Chinese (Cantonese)
	"chs": "简化字"			// Simplified Chinese (Mandarin)
}

// Origin Marks
const games = {
	"home":		{"name": "HOME",				"gen": null,	"mark": null},
	"bank":		{"name": "Bank",				"gen": null,	"mark": null},
	"scar":		{"name": "Scarlet",				"gen": 9,		"mark": "paldea"},
	"vio":		{"name": "Violet",				"gen": 9,		"mark": "paldea"},
	"sw":		{"name": "Sword",				"gen": 8,		"mark": "galar"},
	"sh":		{"name": "Shield",				"gen": 8,		"mark": "galar"},
	"bd":		{"name": "Brilliant Diamond",	"gen": 8,		"mark": "bdsp"},
	"sp":		{"name": "Shining Pearl",		"gen": 8,		"mark": "bdsp"},
	"pla":		{"name": "Legends: Arceus",		"gen": 8,		"mark": "hisui"},
	"go":		{"name": "GO",					"gen": 7,		"mark": "go"},
	"sun":		{"name": "Sun",					"gen": 7,		"mark": "clover"},
	"moon":		{"name": "Moon",				"gen": 7,		"mark": "clover"},
	"usun":		{"name": "Ultra Sun",			"gen": 7,		"mark": "clover"},
	"umoon":	{"name": "Ultra Moon",			"gen": 7,		"mark": "clover"},
	"lgp":		{"name": "Let's Go, Pikachu!",	"gen": 7,		"mark": "lets-go"},
	"lge":		{"name": "Let's Go, Eevee!",	"gen": 7,		"mark": "lets-go"},
	"x":		{"name": "X",					"gen": 6,		"mark": "pentagon"},
	"y":		{"name": "Y",					"gen": 6,		"mark": "pentagon"},
	"or":		{"name": "Omega Ruby",			"gen": 6,		"mark": "pentagon"},
	"as":		{"name": "Alpha Sapphire",		"gen": 6,		"mark": "pentagon"},
	"black":	{"name": "Black",				"gen": 5,		"mark": null},
	"white":	{"name": "White",				"gen": 5,		"mark": null},
	"black2":	{"name": "Black 2",				"gen": 5,		"mark": null},
	"white2":	{"name": "White 2",				"gen": 5,		"mark": null},
	"diamond":	{"name": "Diamond",				"gen": 4,		"mark": null},
	"pearl":	{"name": "Pearl",				"gen": 4,		"mark": null},
	"platinum":	{"name": "Platinum",			"gen": 4,		"mark": null},
	"hg":		{"name": "HeartGold",			"gen": 4,		"mark": null},
	"ss":		{"name": "SoulSilver",			"gen": 4,		"mark": null},
	"ruby":		{"name": "Ruby",				"gen": 3,		"mark": null},
	"sapphire":	{"name": "Sapphire",			"gen": 3,		"mark": null},
	"emerald":	{"name": "Emerald",				"gen": 3,		"mark": null},
	"fr":		{"name": "FireRed",				"gen": 3,		"mark": null},
	"lg":		{"name": "LeafGreen",			"gen": 3,		"mark": null},
	"colosseum":{"name": "Colosseum",			"gen": 3,		"mark": null},
	"xd":		{"name": "XD: Gale of Darkness","gen": 3,		"mark": null},
	"gold":		{"name": "Gold",				"gen": 2,		"mark": "game-boy"},
	"silver":	{"name": "Silver",				"gen": 2,		"mark": "game-boy"},
	"crystal":	{"name": "Crystal",				"gen": 2,		"mark": "game-boy"},
	"red-jpn":	{"name": "Red (JPN)",			"gen": 1,		"mark": "game-boy"},
	"green":	{"name": "Green",				"gen": 1,		"mark": "game-boy"},
	"blue-jpn":	{"name": "Blue (JPN)",			"gen": 1,		"mark": "game-boy"},
	"red-eng":	{"name": "Red (ENG)",			"gen": 1,		"mark": "game-boy"},
	"blue-eng":	{"name": "Blue (ENG)",			"gen": 1,		"mark": "game-boy"},
	"yellow":	{"name": "Yellow",				"gen": 1,		"mark": "game-boy"}
};

// Mint sprites
const mints = {
	"Lonely":	"atk",
	"Adamant":	"atk",
	"Naughty":	"atk",
	"Brave":	"atk",
	"Bold":		"def",
	"Impish":	"def",
	"Lax":		"def",
	"Relaxed":	"def",
	"Modest":	"spa",
	"Mild": 	"spa",
	"Rash":		"spa",
	"Quiet":	"spa",
	"Calm":		"spd",
	"Gentle":	"spd",
	"Careful":	"spd",
	"Sassy":	"spd",
	"Timid":	"spe",
	"Hasty":	"spe",
	"Jolly":	"spe",
	"Naive":	"spe",
	"Serious":	"neutral"
}

const balls = {
	"poke": {	"ger": "Pokéball",		"eng": "Poké Ball",		"spa": "Poké Ball",		"fre": "Poké Ball",		"ita": "Poké Ball",		"jpn": "モンスターボール", "kor": "몬스터볼", "cht": "精靈球", "chs": "精灵球"},
	"great": {	"ger": "Superball",		"eng": "Great Ball",	"spa": "Superball",		"fre": "Super Ball",	"ita": "Mega Ball",		"jpn": "スーパーボール", "kor": "수퍼볼", "cht": "超級球", "chs": "超级球"},
	"ultra": {	"ger": "Hyperball",		"eng": "Ultra Ball",	"spa": "Ultraball",		"fre": "Hyper Ball",	"ita": "Ultra Ball",	"jpn": "ハイパーボール", "kor": "하이퍼볼", "cht": "高級球", "chs": "高级球"},
	"master": {	"ger": "Meisterball",	"eng": "Master Ball",	"spa": "Master Ball",	"fre": "Master Ball",	"ita": "Master Ball",	"jpn": "マスターボール", "kor": "마스터볼", "cht": "大師球", "chs": "大师球"},
	"safari": {	"ger": "Safariball",	"eng": "Safari Ball",	"spa": "Safari Ball",	"fre": "Safari Ball",	"ita": "Safari Ball",	"jpn": "サファリボール", "kor": "사파리볼", "cht": "狩獵球", "chs": "狩猎球"},
	"fast": {	"ger": "Turboball",		"eng": "Fast Ball",		"spa": "Rapid Ball",	"fre": "Speed Ball",	"ita": "Rapid Ball",	"jpn": "スピードボール", "kor": "스피드볼", "cht": "速度球", "chs": "速度球"},
	"level": {	"ger": "Levelball",		"eng": "Level Ball",	"spa": "Nivel Ball",	"fre": "Niveau Ball",	"ita": "Level Ball",	"jpn": "レベルボール", "kor": "레벨볼", "cht": "等級球", "chs": "等级球"},
	"lure": {	"ger": "Köderball",		"eng": "Lure Ball",		"spa": "Cebo Ball",		"fre": "Appat Ball",	"ita": "Esca Ball",		"jpn": "ルアーボール", "kor": "루어볼", "cht": "誘餌球", "chs": "诱饵球"},
	"heavy": {	"ger": "Schwerball",	"eng": "Heavy Ball",	"spa": "Peso Ball",		"fre": "Masse Ball",	"ita": "Peso Ball",		"jpn": "ヘビーボール", "kor": "헤비볼", "cht": "沉重球", "chs": "沉重球"},
	"love": {	"ger": "Sympaball",		"eng": "Love Ball",		"spa": "Amor Ball",		"fre": "Love Ball",		"ita": "Love Ball",		"jpn": "ラブラブボール", "kor": "러브러브볼", "cht": "甜蜜球", "chs": "甜蜜球"},
	"friend": {	"ger": "Freundesball",	"eng": "Friend Ball",	"spa": "Amigo Ball",	"fre": "Copain Ball",	"ita": "Friend Ball",	"jpn": "フレンドボール", "kor": "프랜드볼", "cht": "友友球", "chs": "友友球"},
	"moon": {	"ger": "Mondball",		"eng": "Moon Ball",		"spa": "Luna Ball",		"fre": "Lune Ball",		"ita": "Luna Ball",		"jpn": "ムーンボール", "kor": "문볼", "cht": "月亮球", "chs": "月亮球"},
	"sport": {	"ger": "Turnierball",	"eng": "Sport Ball",	"spa": "Competi Ball",	"fre": "Compét'Ball",	"ita": "Gara Ball",		"jpn": "コンペボール", "kor": "콤페볼", "cht": "競賽球", "chs": "竞赛球"},
	"net": {	"ger": "Netzball",		"eng": "Net Ball",		"spa": "Malla Ball",	"fre": "Filet Ball",	"ita": "Rete Ball",		"jpn": "ネットボール", "kor": "넷트볼", "cht": "捕網球", "chs": "捕网球"},
	"dive": {	"ger": "Tauchball",		"eng": "Dive Ball",		"spa": "Buceo Ball",	"fre": "Scuba Ball",	"ita": "Sub Ball",		"jpn": "ダイブボール", "kor": "다이브볼", "cht": "潛水球", "chs": "潜水球"},
	"nest": {	"ger": "Nestball",		"eng": "Nest Ball",		"spa": "Nido Ball",		"fre": "Faiblo Ball",	"ita": "Minor Ball",	"jpn": "ネストボール", "kor": "네스트볼", "cht": "巢穴球", "chs": "巢穴球"},
	"repeat": {	"ger": "Wiederball",	"eng": "Repeat Ball",	"spa": "Acopio Ball",	"fre": "Bis Ball",		"ita": "Bis Ball",		"jpn": "リピートボール", "kor": "리피드볼", "cht": "重複球", "chs": "重复球"},
	"timer": {	"ger": "Timerball",		"eng": "Timer Ball",	"spa": "Turno Ball",	"fre": "Chrono Ball",	"ita": "Timer Ball",	"jpn": "タイマーボール", "kor": "타이마볼", "cht": "計時球", "chs": "计时球"},
	"luxury": {	"ger": "Luxusball",		"eng": "Luxury Ball",	"spa": "Lujo Ball",		"fre": "Luxe Ball",		"ita": "Chic Ball",		"jpn": "ゴージャスボール", "kor": "럭셔리볼", "cht": "豪華球", "chs": "豪华球"},
	"premier": {"ger": "Premierball",	"eng": "Premier Ball",	"spa": "Honor Ball",	"fre": "Honor Ball",	"ita": "Premier Ball",	"jpn": "プレミアボール", "kor": "프레미어볼", "cht": "紀念球", "chs": "纪念球"},
	"dusk": {	"ger": "Finsterball",	"eng": "Dusk Ball",		"spa": "Ocaso Ball",	"fre": "Sombre Ball",	"ita": "Scuro Ball",	"jpn": "ダークボール", "kor": "다크볼", "cht": "黑暗球", "chs": "黑暗球"},
	"heal": {	"ger": "Heilball",		"eng": "Heal Ball",		"spa": "Sana Ball",		"fre": "Soin Ball",		"ita": "Cura Ball",		"jpn": "ヒールボール", "kor": "힐볼", "cht": "治癒球", "chs": "治愈球"},
	"quick": {	"ger": "Flottball",		"eng": "Quick Ball",	"spa": "Veloz Ball",	"fre": "Rapide Ball",	"ita": "Velox Ball",	"jpn": "クイックボール", "kor": "퀵볼", "cht": "先機球", "chs": "先机球"},
	"cherish": {"ger": "Jubelball",		"eng": "Cherish Ball",	"spa": "Gloria Ball",	"fre": "Mémoire Ball",	"ita": "Pregio Ball",	"jpn": "プレシャスボール", "kor": "프레셔스볼", "cht": "貴重球", "chs": "贵重球"},
	"dream": {	"ger": "Traumball",		"eng": "Dream Ball",	"spa": "Ensueño Ball",	"fre": "Rêve Ball",		"ita": "Dream Ball",	"jpn": "ドリームボール", "kor": "드림볼", "cht": "夢境球", "chs": "梦境球"},
	"beast": {	"ger": "Ultraball",		"eng": "Beast Ball",	"spa": "Ente Ball",		"fre": "Ultra Ball",	"ita": "UC Ball",		"jpn": "ウルトラボール", "kor": "울트라볼", "cht": "究極球", "chs": "究极球"}
}
const hisuiballs = {
	"hisuian-poke": {	"ger": "Hisui-Pokéball",	"eng": "Hisuian Poké Ball",		"spa": "Poké Ball de Hisui",	"fre": "Poké Ball de Hisui",	"ita": "Poké Ball di Hisui",	"jpn": "モンスターボール (ヒスイ)", "kor": "몬스터볼 (히스이)", "cht": "精靈球 (洗翠)", "chs": "精灵球 (洗翠)"},
	"hisuian-great": {	"ger": "Hisui-Superball",	"eng": "Hisuian Great Ball",	"spa": "Super Ball de Hisui",	"fre": "Super Ball de Hisui",	"ita": "Mega Ball di Hisui",	"jpn": "スーパーボール (ヒスイ)", "kor": "수퍼볼 (히스이)", "cht": "超級球 (洗翠)", "chs": "超级球 (洗翠)"},
	"hisuian-ultra": {	"ger": "Hisui-Hyperball",	"eng": "Hisuian Ultra Ball",	"spa": "Ultra Ball de Hisui",	"fre": "Hyper Ball de Hisui",	"ita": "Ultra Ball di Hisui",	"jpn": "ハイパーボール (ヒスイ)", "kor": "하이퍼볼 (히스이)", "cht": "高級球 (洗翠)", "chs": "高级球 (洗翠)"},
	"hisuian-heavy": {	"ger": "Hisui-Schwerball",	"eng": "Hisuian Heavy Ball",	"spa": "Peso Ball de Hisui",	"fre": "Masse Ball de Hisui",	"ita": "Peso Ball di Hisui",	"jpn": "ヘビーボール (ヒスイ)", "kor": "헤비볼 (히스이)", "cht": "沉重球 (洗翠)", "chs": "沉重球 (洗翠)"},
	"leaden": {			"ger": "Zentnerball",	"eng": "Leaden Ball",	"spa": "Kilo Ball",		"fre": "Mégamasse Ball",	"ita": "Megaton Ball",	"jpn": "メガトンボール", "kor": "메가톤볼", "cht": "超重球", "chs": "超重球"},
	"gigaton": {		"ger": "Tonnenball",	"eng": "Gigaton Ball",	"spa": "Quintal Ball",	"fre": "Gigamasse Ball",	"ita": "Gigaton Ball",	"jpn": "ギガトンボール", "kor": "기가톤볼", "cht": "巨重球", "chs": "巨重球"},
	"feather": {		"ger": "Federball",		"eng": "Feather Ball",	"spa": "Pluma Ball",	"fre": "Plume Ball",		"ita": "Piuma Ball",	"jpn": "フェザーボール", "kor": "페더볼", "cht": "飛羽球", "chs": "飞羽球"},
	"wing": {			"ger": "Flügelball",	"eng": "Wing Ball",		"spa": "Ala Ball",		"fre": "Envol Ball",		"ita": "Wing Ball",		"jpn": "ウイングボール", "kor": "윙볼", "cht": "飛翼球", "chs": "飞翼球"},
	"jet": {			"ger": "Düsenball",		"eng": "Jet Ball",		"spa": "Aero Ball",		"fre": "Propulse Ball",		"ita": "Jet Ball",		"jpn": "ジェットボール", "kor": "제트볼", "cht": "飛梭球", "chs": "飞梭球"},
	"origin": {			"ger": "Urball",		"eng": "Origin Ball",	"spa": "Origen Ball",	"fre": "Origine Ball",		"ita": "Origin Ball",	"jpn": "オリジンボール", "kor": "오리진볼", "cht": "起源球", "chs": "起源球"}
}
