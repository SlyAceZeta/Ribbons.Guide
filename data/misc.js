// Languages
const languages = {
	"ger": { "iso": "de", "name": "Deutsch" },			// German
	"eng": { "iso": "en", "name": "English" },			// English
	"spa": { "iso": "es", "name": "Español (España)" },	// Spanish
	"fre": { "iso": "fr", "name": "Français" },			// French
	"ita": { "iso": "it", "name": "Italiano" },			// Italian
	"jpn": { "iso": "ja", "name": "日本語" },			// Japanese
	"kor": { "iso": "ko", "name": "한국어" },			// Korean
	"cht": { "iso": "zh-Hant", "name": "正體字" },		// Traditional Chinese (Cantonese)
	"chs": { "iso": "zh-Hans", "name": "简化字" }		// Simplified Chinese (Mandarin)
}

// General terms
const terms = {
	"mint": {
		"ger": "Minze",
		"eng": "Mint",
		"spa": "Menta",
		"fre": "Aromate",
		"ita": "Menta",
		"jpn": "ミント",
		"kor": "민트",
		"cht": "薄荷",
		"chs": "薄荷"
	},
	"none": {
		"ger": "Keiner",
		"eng": "None",
		"spa": "Ninguna",
		"fre": "Aucune",
		"ita": "Nessuno",
		"jpn": "なし",
		"kor": "없음",
		"cht": "沒有任何",
		"chs": "没有任何"
	},
	"gens": {
		1: "Gen&nbsp;I Virtual Console",
		2: "Gen&nbsp;II Virtual Console",
		3: "Gen&nbsp;III",
		4: "Gen&nbsp;IV",
		5: "Gen&nbsp;V",
		6: "Gen&nbsp;VI",
		7: "Gen&nbsp;VII",
		8: "Gen&nbsp;VIII",
		9: "Gen&nbsp;IX",
		"e": "Event",
		"m": "Marks"
	}
}

// Origin Marks
const games = {
	"home":		{"name": "HOME - Gen VIII",		"gen": 8,		"mark": null},
	"bank7":	{"name": "Bank - Gen VII",		"gen": 7,		"mark": null},
	"bank":		{"name": "Bank - Gen VI",		"gen": 6,		"mark": null},
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

// Natures
const natures = {
	"Lonely": {		"index":  1, "img": "atk",	"names": { "ger": "Solo",		"eng": "Lonely",	"spa": "Huraña",	"fre": "Solo",		"ita": "Schiva",	"jpn": "さみしがり", "kor": "외로움", "cht": "怕寂寞", "chs": "怕寂寞"}},
	"Adamant": {	"index":  3, "img": "atk",	"names": { "ger": "Hart",		"eng": "Adamant",	"spa": "Firme",		"fre": "Rigide",	"ita": "Decisa",	"jpn": "いじっぱり", "kor": "고집", "cht": "固執", "chs": "固执"}},
	"Naughty": {	"index":  4, "img": "atk",	"names": { "ger": "Frech",		"eng": "Naughty",	"spa": "Pícara",	"fre": "Mauvais",	"ita": "Birbona",	"jpn": "やんちゃ", "kor": "개구쟁이", "cht": "頑皮", "chs": "顽皮"}},
	"Brave": {		"index":  2, "img": "atk",	"names": { "ger": "Mutig",		"eng": "Brave",		"spa": "Audaz",		"fre": "Brave",		"ita": "Audace",	"jpn": "ゆうかん", "kor": "용감", "cht": "勇敢", "chs": "勇敢"}},
	"Bold": {		"index":  5, "img": "def",	"names": { "ger": "Kühn",		"eng": "Bold",		"spa": "Osada",		"fre": "Assuré",	"ita": "Sicura",	"jpn": "ずぶとい", "kor": "대담", "cht": "大膽", "chs": "大胆"}},
	"Impish": {		"index":  8, "img": "def",	"names": { "ger": "Pfiffig",	"eng": "Impish",	"spa": "Agitada",	"fre": "Malin",		"ita": "Scaltra",	"jpn": "わんぱく", "kor": "장난꾸러기", "cht": "淘氣", "chs": "淘气"}},
	"Lax": {		"index":  9, "img": "def",	"names": { "ger": "Lasch",		"eng": "Lax",		"spa": "Floja",		"fre": "Lâche",		"ita": "Fiacca",	"jpn": "のうてんき", "kor": "촐랑", "cht": "樂天", "chs": "乐天"}},
	"Relaxed": {	"index":  7, "img": "def",	"names": { "ger": "Locker",		"eng": "Relaxed",	"spa": "Plácida",	"fre": "Relax",		"ita": "Placida",	"jpn": "のんき", "kor": "무사태평", "cht": "悠閒", "chs": "悠闲"}},
	"Modest": {		"index": 15, "img": "spa",	"names": { "ger": "Mäßig",		"eng": "Modest",	"spa": "Modesta",	"fre": "Modeste",	"ita": "Modesta",	"jpn": "ひかえめ", "kor": "조심", "cht": "內斂", "chs": "内敛"}},
	"Mild": {		"index": 16, "img": "spa",	"names": { "ger": "Mild",		"eng": "Mild",		"spa": "Afable",	"fre": "Doux",		"ita": "Mite",		"jpn": "おっとり", "kor": "의젓", "cht": "慢吞吞", "chs": "慢吞吞"}},
	"Rash": {		"index": 19, "img": "spa",	"names": { "ger": "Hitzig",		"eng": "Rash",		"spa": "Alocada",	"fre": "Foufou",	"ita": "Ardente",	"jpn": "うっかりや", "kor": "덜렁", "cht": "馬虎", "chs": "马虎"}},
	"Quiet": {		"index": 17, "img": "spa",	"names": { "ger": "Ruhig",		"eng": "Quiet",		"spa": "Mansa",		"fre": "Discret",	"ita": "Quieta",	"jpn": "れいせい", "kor": "냉정", "cht": "冷靜", "chs": "冷静"}},
	"Calm": {		"index": 20, "img": "spd",	"names": { "ger": "Still",		"eng": "Calm",		"spa": "Serena",	"fre": "Calme",		"ita": "Calma",		"jpn": "おだやか", "kor": "차분", "cht": "溫和", "chs": "温和"}},
	"Gentle": {		"index": 21, "img": "spd",	"names": { "ger": "Zart",		"eng": "Gentle",	"spa": "Amable",	"fre": "Gentil",	"ita": "Gentile",	"jpn": "おとなしい", "kor": "얌전", "cht": "溫順", "chs": "温顺"}},
	"Careful": {	"index": 23, "img": "spd",	"names": { "ger": "Sacht",		"eng": "Careful",	"spa": "Cauta",		"fre": "Prudent",	"ita": "Cauta",		"jpn": "しんちょう", "kor": "신중", "cht": "慎重", "chs": "慎重"}},
	"Sassy": {		"index": 22, "img": "spd",	"names": { "ger": "Forsch",		"eng": "Sassy",		"spa": "Grosera",	"fre": "Malpoli",	"ita": "Vivace",	"jpn": "なまいき", "kor": "건방", "cht": "自大", "chs": "自大"}},
	"Timid": {		"index": 10, "img": "spe",	"names": { "ger": "Scheu",		"eng": "Timid",		"spa": "Miedosa",	"fre": "Timide",	"ita": "Timida",	"jpn": "おくびょう", "kor": "겁쟁이", "cht": "膽小", "chs": "胆小"}},
	"Hasty": {		"index": 11, "img": "spe",	"names": { "ger": "Hastig",		"eng": "Hasty",		"spa": "Activa",	"fre": "Pressé",	"ita": "Lesta",		"jpn": "せっかち", "kor": "성급", "cht": "急躁", "chs": "急躁"}},
	"Jolly": {		"index": 13, "img": "spe",	"names": { "ger": "Froh",		"eng": "Jolly",		"spa": "Alegre",	"fre": "Jovial",	"ita": "Allegra",	"jpn": "ようき", "kor": "명랑", "cht": "爽朗", "chs": "爽朗"}},
	"Naive": {		"index": 14, "img": "spe",	"names": { "ger": "Naiv",		"eng": "Naive",		"spa": "Ingenua",	"fre": "Naïf",		"ita": "Ingenua",	"jpn": "むじゃき", "kor": "천진난만", "cht": "天真", "chs": "天真"}},
	"Serious": {	"index": 12, "img": "neu",	"names": { "ger": "Ernst",		"eng": "Serious",	"spa": "Seria",		"fre": "Sérieux",	"ita": "Seria",		"jpn": "まじめ", "kor": "성실", "cht": "認真", "chs": "认真"}},
	"Hardy": {		"index":  0,				"names": { "ger": "Robust",		"eng": "Hardy",		"spa": "Fuerte",	"fre": "Hardi",		"ita": "Ardita",	"jpn": "がんばりや", "kor": "노력", "cht": "勤奮", "chs": "勤奋"}},
	"Docile": {		"index":  6,				"names": { "ger": "Sanft",		"eng": "Docile",	"spa": "Dócil",		"fre": "Docile",	"ita": "Docile",	"jpn": "すなお", "kor": "온순", "cht": "坦率", "chs": "坦率"}},
	"Bashful": {	"index": 18,				"names": { "ger": "Zaghaft",	"eng": "Bashful",	"spa": "Tímida",	"fre": "Pudique",	"ita": "Ritrosa",	"jpn": "てれや", "kor": "수줍음", "cht": "害羞", "chs": "害羞"}},
	"Quirky": {		"index": 24,				"names": { "ger": "Kauzig",		"eng": "Quirky",	"spa": "Rara",		"fre": "Bizarre",	"ita": "Furba",		"jpn": "きまぐれ", "kor": "변덕", "cht": "浮躁", "chs": "浮躁"}}
}

// Characteristics
const characteristics = {
	"hp0": { "ger": "Liebt es zu essen.",	"eng": "It loves to eat!",	"spa": "Le encanta comer.",	"fre": "Il adore manger.",	"ita": "Adora mangiare.",	"jpn": "食べるのが　大好き。",	"kor": "먹는 것을 제일 좋아함.",	"cht": "非常喜歡吃東西。",	"chs": "非常喜欢吃东西。"},
	"hp1": { "ger": "Nickt oft ein.",	"eng": "It takes plenty of siestas!",	"spa": "A menudo se duerme.",	"fre": "Il s'assoupit souvent.",	"ita": "Si addormenta spesso.",	"jpn": "昼寝を　よくする。",	"kor": "낮잠을 잘 잠.",	"cht": "經常睡午覺。",	"chs": "经常睡午觉。"},
	"hp2": { "ger": "Schläft gern.",	"eng": "It nods off a lot!",	"spa": "Duerme mucho.",	"fre": "Il dort beaucoup.",	"ita": "Dorme a lungo.",	"jpn": "居眠りが　多い。",	"kor": "말뚝잠이 많음.",	"cht": "常常打瞌睡。",	"chs": "常常打瞌睡。"},
	"hp3": { "ger": "Macht oft Unordnung.",	"eng": "It scatters things often!",	"spa": "Suele desordenar cosas.",	"fre": "Il éparpille souvent les choses.",	"ita": "Lascia cose in giro.",	"jpn": "ものを　よく　散らかす。",	"kor": "물건을 잘 어지름.",	"cht": "經常亂扔東西。",	"chs": "经常乱扔东西。"},
	"hp4": { "ger": "Mag es, sich zu entspannen.",	"eng": "It likes to relax!",	"spa": "Le gusta relajarse.",	"fre": "Il aime se détendre.",	"ita": "Adora rilassarsi.",	"jpn": "のんびりするのが　好き。",	"kor": "유유자적함을 좋아함.",	"cht": "喜歡悠然自在。",	"chs": "喜欢悠然自在。"},
	"atk0": { "ger": "Ist stolz auf seine Stärke.",	"eng": "It's proud of its power!",	"spa": "Se enorgullece de su fuerza.",	"fre": "Il est fier de sa puissance.",	"ita": "La forza è il suo vanto.",	"jpn": "力が　自慢。",	"kor": "힘자랑이 특기임.",	"cht": "以力氣大為傲。",	"chs": "以力气大为傲。"},
	"atk1": { "ger": "Prügelt sich gern.",	"eng": "It likes to thrash about!",	"spa": "Le gusta revolverse.",	"fre": "Il aime se démener.",	"ita": "Adora dimenarsi.",	"jpn": "暴れることが　好き。",	"kor": "난동부리기를 좋아함.",	"cht": "喜歡胡鬧。",	"chs": "喜欢胡闹。"},
	"atk2": { "ger": "Besitzt Temperament.",	"eng": "It's a little quick tempered!",	"spa": "A veces se enfada.",	"fre": "Il est un peu coléreux.",	"ita": "Si arrabbia facilmente.",	"jpn": "ちょっと　怒りっぽい。",	"kor": "약간 화를 잘 내는 성미임.",	"cht": "有點容易生氣。",	"chs": "有点容易生气。"},
	"atk3": { "ger": "Liebt Kämpfe.",	"eng": "It likes to fight!",	"spa": "Le gusta luchar.",	"fre": "Il aime combattre.",	"ita": "Adora lottare.",	"jpn": "ケンカを　するのが　好き。",	"kor": "싸움을 좋아함.",	"cht": "喜歡打架。",	"chs": "喜欢打架。"},
	"atk4": { "ger": "Ist impulsiv.",	"eng": "It's quick tempered!",	"spa": "Tiene mal genio.",	"fre": "Il s'emporte facilement.",	"ita": "È facilmente irritabile.",	"jpn": "血の気が　多い。",	"kor": "혈기가 왕성함.",	"cht": "血氣方剛。",	"chs": "血气方刚。"},
	"def0": { "ger": "Hat einen robusten Körper.",	"eng": "It has a sturdy body!",	"spa": "Se caracteriza por su cuerpo resistente.",	"fre": "Il a un corps robuste.",	"ita": "Ha un corpo robusto.",	"jpn": "体が　丈夫。",	"kor": "몸이 튼튼함.",	"cht": "身體強壯。",	"chs": "身体强壮。"},
	"def1": { "ger": "Kann Treffer gut verkraften.",	"eng": "It's capable of taking hits!",	"spa": "Encaja bien los ataques.",	"fre": "Il sait encaisser les coups.",	"ita": "Incassa bene i colpi.",	"jpn": "打たれ強い。",	"kor": "맷집이 강함.",	"cht": "抗打能力強。",	"chs": "抗打能力强。"},
	"def2": { "ger": "Ist äußerst zäh.",	"eng": "It's highly persistent!",	"spa": "Es muy persistente.",	"fre": "Il est très obstiné.",	"ita": "È molto ostinato.",	"jpn": "粘り強い。",	"kor": "끈질김.",	"cht": "頑強不屈。",	"chs": "顽强不屈。"},
	"def3": { "ger": "Hat eine gute Ausdauer.",	"eng": "It has good endurance!",	"spa": "Se caracteriza por ser muy resistente.",	"fre": "Il a une bonne endurance.",	"ita": "È molto paziente.",	"jpn": "辛抱強い。",	"kor": "인내심이 강함.",	"cht": "能吃苦耐勞。",	"chs": "能吃苦耐劳。"},
	"def4": { "ger": "Ist beharrlich.",	"eng": "It has good perseverance!",	"spa": "Es muy perseverante.",	"fre": "Il est persévérant.",	"ita": "È molto tenace.",	"jpn": "我慢強い。",	"kor": "잘 참음.",	"cht": "善於忍耐。",	"chs": "善于忍耐。"},
	"spe0": { "ger": "Ist gerne schnell unterwegs.",	"eng": "It likes to run!",	"spa": "Le gusta ir muy rápido.",	"fre": "Il aime la vitesse.",	"ita": "Adora andare veloce.",	"jpn": "駆けっこが　好き。",	"kor": "달리기를 좋아함.",	"cht": "喜歡比誰跑得快。",	"chs": "喜欢比谁跑得快。"},
	"spe1": { "ger": "Achtet auf Geräusche.",	"eng": "It's alert to sounds!",	"spa": "Siempre tiene el oído alerta.",	"fre": "Il est attentif aux sons.",	"ita": "Fa attenzione ai suoni.",	"jpn": "物音に　敏感。",	"kor": "주위 소리에 민감함.",	"cht": "對聲音敏感。",	"chs": "对声音敏感。"},
	"spe2": { "ger": "Ist ungestüm und einfältig.",	"eng": "It's impetuous and silly!",	"spa": "Es de carácter simple e impetuoso.",	"fre": "Il est bête et impulsif.",	"ita": "È irruente e semplice.",	"jpn": "おっちょこちょい。",	"kor": "촐랑대는 성격임.",	"cht": "冒冒失失。",	"chs": "冒冒失失。"},
	"spe3": { "ger": "Ist ein bisschen albern.",	"eng": "It's somewhat of a clown!",	"spa": "Le encanta hacer payasadas.",	"fre": "Il aime faire le pitre.",	"ita": "È una specie di buffone.",	"jpn": "すこし　お調子者。",	"kor": "약간 우쭐쟁이임.",	"cht": "有點容易得意忘形。",	"chs": "有点容易得意忘形。"},
	"spe4": { "ger": "Flüchtet schnell.",	"eng": "It's quick to flee!",	"spa": "Huye rápido.",	"fre": "Il fuit rapidement.",	"ita": "Sa fuggire velocemente.",	"jpn": "逃げるのが　はやい。",	"kor": "도망에는 선수임.",	"cht": "逃得快。",	"chs": "逃得快。"},
	"spa0": { "ger": "Ist sehr neugierig.",	"eng": "It's highly curious!",	"spa": "Siente mucha curiosidad por todo.",	"fre": "Il est extrêmement curieux.",	"ita": "È un grande ficcanaso.",	"jpn": "好奇心が　強い。",	"kor": "호기심이 강함.",	"cht": "好奇心強。",	"chs": "好奇心强。"},
	"spa1": { "ger": "Ist hinterhältig.",	"eng": "It's mischievous!",	"spa": "Le gusta hacer travesuras.",	"fre": "Il est coquin.",	"ita": "È alquanto vivace.",	"jpn": "イタズラが　好き。",	"kor": "장난을 좋아함.",	"cht": "喜歡惡作劇。",	"chs": "喜欢恶作剧。"},
	"spa2": { "ger": "Ist äußerst gerissen.",	"eng": "It's thoroughly cunning!",	"spa": "Es muy sagaz.",	"fre": "Il est très astucieux.",	"ita": "È estremamente sagace.",	"jpn": "抜け目が　ない。",	"kor": "빈틈이 없음.",	"cht": "做事萬無一失。",	"chs": "做事万无一失。"},
	"spa3": { "ger": "Ist oft in Gedanken.",	"eng": "It's often lost in thought!",	"spa": "A menudo está en Babia.",	"fre": "Il est souvent dans la lune.",	"ita": "Si perde nel suo mondo.",	"jpn": "考え事が　多い。",	"kor": "걱정거리가 많음.",	"cht": "經常思考。",	"chs": "经常思考。"},
	"spa4": { "ger": "Ist sehr pedantisch.",	"eng": "It's very finicky!",	"spa": "Es muy tiquismiquis.",	"fre": "Il est très particulier.",	"ita": "È molto esigente.",	"jpn": "とても　きちょうめん。",	"kor": "매우 꼼꼼함.",	"cht": "一絲不苟。",	"chs": "一丝不苟。"},
	"spd0": { "ger": "Besitzt einen starken Willen.",	"eng": "It's strong willed!",	"spa": "Se distingue por su gran fuerza de voluntad.",	"fre": "Il est très volontaire.",	"ita": "Sa il fatto suo.",	"jpn": "気が　強い。",	"kor": "기가 센 성격임.",	"cht": "性格強勢。",	"chs": "性格强势。"},
	"spd1": { "ger": "Ist etwas eitel.",	"eng": "It's somewhat vain!",	"spa": "Es un poco petulante.",	"fre": "Il est un peu vaniteux.",	"ita": "È abbastanza superficiale.",	"jpn": "ちょっぴり　みえっぱり。",	"kor": "조금 겉치레를 좋아함.",	"cht": "有一點點愛慕虛榮。",	"chs": "有一点点爱慕虚荣。"},
	"spd2": { "ger": "Ist sehr aufsässig.",	"eng": "It's strongly defiant!",	"spa": "Es muy insolente.",	"fre": "Il a l'esprit rebelle.",	"ita": "È molto insolente.",	"jpn": "負けん気が　強い。",	"kor": "오기가 센 성격임.",	"cht": "爭強好勝。",	"chs": "争强好胜。"},
	"spd3": { "ger": "Hasst Niederlagen.",	"eng": "It hates to lose!",	"spa": "Odia perder.",	"fre": "Il a horreur de perdre.",	"ita": "Non sopporta perdere.",	"jpn": "負けず嫌い。",	"kor": "지기 싫어함.",	"cht": "不服輸。",	"chs": "不服输。"},
	"spd4": { "ger": "Ist dickköpfig.",	"eng": "It's somewhat stubborn!",	"spa": "Es un poco cabezota.",	"fre": "Il est assez entêté.",	"ita": "È un po' testardo.",	"jpn": "ちょっぴり　強情。",	"kor": "조금 고집통이임.",	"cht": "有一點點固執。",	"chs": "有一点点固执。"}
}

// Poké Balls
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
