/**
 * @typedef {Object} pokemon
 * @property {string} species
 * @property {string} gender
 * @property {string} shiny
 * @property {string} speciesName
 * @property {string} nickname
 * @property {string?} language
 * @property {string} ball
 * @property {boolean} strangeball
 * @property {number} currentlevel // TODO, needs to be calculated from EXP (which means we need personal?)
 * @property {string} nature
 * @property {boolean} totem
 * @property {boolean} gmax
 * @property {boolean} shadow // Prompt user for selection, not able to be derived from xk3 without entire savefile
 * @property {string} trainername
 * @property {string} trainerid
 * @property {string} origingame
 * @property {string} currentgame // Prompt user for selection, not necessarily able to derive from pk*
 * @property {number} box
 * @property {string} title
 * @property {boolean} scale
 * @property {string[]} ribbons
 * @property {number} metlevel
 * @property {string} metdate
 * @property {string} metlocation
 * @property {boolean} pokerus
 * @property {string[]} achievements // LeafCrown and PokestarShiny can be read from pk4 and pk5 directly, else prompt user for input
 * @property {string} notes
 */

/** 
 * @param pk
 * @param {number} gen
 * @returns {pokemon} 
 */
function processPkx(pk, gen) {
    /** @type {pokemon} */
    var obj = {};
    var species = pk.Species;
    obj.species = importmap.species[species];

    var form = pk.Form;
    var _form = "";
    if (form > 0 || species === 666 /* Vivillon */ || species === 774 /* Minior */) {
        _form = importmap[forms][species][form].replace(obj.species, "")
    }

    var formarg = Object.hasOwn(pk, "FormArgument") ? pk.FormArgument : 0;
    if (species === 869 /* Alcremie */) _form += importmap["alcremie-sweets"][formarg];

    obj.totem = false;
    if (_form === "-totem") {
        _form = "";
        obj.totem = true;
    }

    obj.species += _form;

    var gender = pk.Gender;
    obj.gender = gender === 0 ? "male" : gender === 1 ? "female" : "unknown";

    var origingame = pk.Version;
    var _origingame = importmap.origingames[origingame];
    obj.origingame = !!_origingame ? _origingame : ""; // safe to check with !! because 0 (falsey) is normalized to the game name at this point

    var shiny = pk.IsSquareShiny ? "square" : pk.IsStarShiny ? "star" : "";
    obj.shiny = shiny;

    var language = pk.Language;
    obj.language = importmap.languages[language];

    var nickname = pk.Nickname;
    var _name = getLanguage(getPokemonData(obj.species, "names"), obj.language);
    obj.speciesName = _name;
    obj.nickname = nickname !== _name ? nickname : "";

    var ball = pk.Ball;
    obj.ball = importmap.balls[ball];
    obj.strangeball = "";

    // TODO: Calculate this
    // Maybe add growth rates to /data/pokemon.json ? See #159
    // var exp = pk.EXP;
    // var level = getLevel(exp, growthrates[species]);
    // obj.currentlevel = level;
    obj.currentlevel = -1;

    var nature = pk.Nature;
    obj.nature = importmap.natures[nature];

    obj.gmax = Object.hasOwn(pk, "CanGigantamax") && pk.CanGigantamax;
    
    // Prompt user for this later, ideally
    obj.shadow = false;

    obj.trainername = pk.OriginalTrainerName;
    obj.trainerid =
        (origingame >= 30 && origingame <= 34) || origingame >= 42 ?
            (pk.ID32 % 1_000_000).toString().padStart(6, "0") : (pk.TID16).toString().padStart(5, "0");

    obj.box = -1;

    var affixed = pk?.AffixedRibbon ?? -1;
    var title = "";
    if (affixed >= 0) { // 0 is Kalos Champ, so check >= 0 instead of > 0
        var id = getInternalRibbonID6789(affixed);
        // getInternalRibbonID6789 can return once-in-a-lifetime-ribbon, but it doesn't exist in the importmap
        // Filter it out here as a failsafe against hacked imports
        if (id !== "once-in-a-lifetime-ribbon")  
            title = ribbons[id].titles[obj.language];
    }
    obj.title = title;

    var hasScale = Object.hasOwn(pk, "Scale");
    var hasHeight = Object.hasOwn(pk, "HeightScalar");

    if (hasScale && pk.Scale === 0 || pk.Scale === 255) obj.scale = true;
    else if (hasHeight && pk.HeightScalar === 0 || pk.HeightScalar === 255) obj.scale = true;
    else obj.scale = false;

    obj.metlevel = pk.MetLevel;

    obj.metdate = "20" + pk.MetYear + "-" + pk.MetMonth + "-" + pk.MetDay;

    var metlocation = pk.MetLocation; // TODO: Make this human-readable instead of just an ID
    obj.metlocation = metlocation;

    var pkrsInfected = pk.PokerusStrain !== 0 || pk.PokerusDays !== 0;
    var pkrsCured = pk.PokerusStrain > 0 && pk.PokerusDays === 0;
    var pkrs = pkrsInfected || pkrsCured;
    obj.pokerus = pkrs;

    var achievments = [];
    if (gen === 5)
        if (pk.IsPokeStar) achievments.push("PokestarShine");
    
    if (gen === 4)
        if (pk.ShinyLeaf === 0b00_1_11111) achievments.push("LeafCrown");

    obj.ribbons = handlePkxRibbons(pk, gen);

    obj.achievements = achievments;
    obj.notes = "";

    return obj;
}

/** 
 * @description Gets the R.G internal ribbon ID for a given Gen 6, 7, 8, or 9 RibbonIndex
 * @param {number} index
 */
function getInternalRibbonID6789(index) {
    var map6789 = [
        "kalos-champion-ribbon", // 0
        "champion-ribbon",
        "sinnoh-champion-ribbon",
        "best-friends-ribbon",
        "training-ribbon",
        "skillful-battler-ribbon",
        "expert-battler-ribbon",
        "effort-ribbon",

        "alert-ribbon",
        "shock-ribbon",
        "downcast-ribbon",
        "careless-ribbon",
        "relax-ribbon",
        "snooze-ribbon",
        "smile-ribbon",
        "gorgeous-ribbon",

        "royal-ribbon",
        "gorgeous-royal-ribbon",
        "artist-ribbon",
        "footprint-ribbon",
        "record-ribbon",
        "legend-ribbon",
        "country-ribbon",
        "national-ribbon",

        "earth-ribbon",
        "world-ribbon",
        "classic-ribbon",
        "premier-ribbon",
        "event-ribbon",
        "birthday-ribbon",
        "special-ribbon",
        "souvenir-ribbon",

        "wishing-ribbon",
        "battle-champion-ribbon",
        "regional-champion-ribbon",
        "national-champion-ribbon",
        "world-champion-ribbon",
        "contest-memory-ribbon",
        "battle-memory-ribbon",
        "hoenn-champion-ribbon",

        "contest-star-ribbon",
        "coolness-master-ribbon",
        "beauty-master-ribbon",
        "cuteness-master-ribbon",
        "cleverness-master-ribbon",
        "toughness-master-ribbon",
        "alola-champion-ribbon",
        "battle-royal-master-ribbon",

        "battle-tree-great-ribbon",
        "battle-tree-master-ribbon",
        "galar-champion-ribbon",
        "tower-master-ribbon",
        "master-rank-ribbon",
        "lunchtime-mark",
        "sleepy-time-mark",
        "dusk-mark",

        "dawn-mark",
        "cloudy-mark",
        "rainy-mark",
        "stormy-mark",
        "snowy-mark",
        "blizzard-mark",
        "dry-mark",
        "sandstorm-mark",

        "misty-mark",
        "destiny-mark",
        "fishing-mark",
        "curry-mark",
        "uncommon-mark",
        "rare-mark",
        "rowdy-mark",
        "absent-minded-mark",

        "jittery-mark",
        "excited-mark",
        "charismatic-mark",
        "calmness-mark",
        "intense-mark",
        "zoned-out-mark",
        "joyful-mark",
        "angry-mark",

        "smiley-mark",
        "teary-mark",
        "upbeat-mark",
        "peeved-mark",
        "intellectual-mark",
        "ferocious-mark",
        "crafty-mark",
        "scowling-mark",

        "kindly-mark",
        "flustered-mark",
        "pumped-up-mark",
        "zero-energy-mark",
        "prideful-mark",
        "unsure-mark",
        "humble-mark",
        "thorny-mark",

        "vigor-mark",
        "slump-mark",
        "hisui-ribbon",
        "twinkling-star-ribbon",
        "paldea-champion-ribbon",
        "jumbo-mark",
        "mini-mark",
        "itemfinder-mark",

        "partner-mark",
        "gourmand-mark",
        "once-in-a-lifetime-mark", // unused
        "alpha-mark",
        "mightiest-mark",
        "titan-mark",
        "partner-ribbon",
    ];

    return map6789[index];
}

/** 
 * @description Gets the R.G internal ribbon ID for a given Gen 4 or 5 RibbonIndex
 * @param {number} index
 */
function getInternalRibbonID45(index) {
    var map45 = [
        "sinnoh-champion-ribbon",
        "ability-ribbon",
        "great-ability-ribbon",
        "double-ability-ribbon",
        "multi-ability-ribbon",
        "pair-ability-ribbon",
        "world-ability-ribbon",
        "alert-ribbon",

        "shock-ribbon",
        "downcast-ribbon",
        "careless-ribbon",
        "relax-ribbon",
        "snooze-ribbon",
        "smile-ribbon",
        "gorgeous-ribbon",
        "royal-ribbon",

        "gorgeous-royal-ribbon",
        "footprint-ribbon",
        "record-ribbon",
        "event-ribbon",
        "legend-ribbon",
        "world-champion-ribbon",
        "birthday-ribbon",
        "special-ribbon",

        "souvenir-ribbon",
        "wishing-ribbon",
        "classic-ribbon",
        "premier-ribbon",
        null,
        null,
        null,
        null,

        "cool-ribbon-hoenn",
        "cool-ribbon-super-hoenn",
        "cool-ribbon-hyper-hoenn",
        "cool-ribbon-master-hoenn",
        "beauty-ribbon-hoenn",
        "beauty-ribbon-super-hoenn",
        "beauty-ribbon-hyper-hoenn",
        "beauty-ribbon-master-hoenn",

        "cute-ribbon-hoenn",
        "cute-ribbon-super-hoenn",
        "cute-ribbon-hyper-hoenn",
        "cute-ribbon-master-hoenn",
        "smart-ribbon-hoenn",
        "smart-ribbon-super-hoenn",
        "smart-ribbon-hyper-hoenn",
        "smart-ribbon-master-hoenn",

        "tough-ribbon-hoenn",
        "tough-ribbon-super-hoenn",
        "tough-ribbon-hyper-hoenn",
        "tough-ribbon-master-hoenn",
        "champion-ribbon",
        "winning-ribbon",
        "victory-ribbon",
        "artist-ribbon",

        "effort-ribbon",
        "battle-champion-ribbon",
        "regional-champion-ribbon",
        "national-champion-ribbon",
        "country-ribbon",
        "national-ribbon",
        "earth-ribbon",
        "world-ribbon",
    ];

    return map45[index];
}

/** 
 * @param pk 
 * @param {number} gen 
 * @returns {string[]} An array of all the R.G internal ribbon IDs equating to the set RibbonIndexes on the provided pk file
 */
function handlePkxRibbons(pk, gen) {
    // TODO: Add handling for merged ribbons
    var rib = [];

    if (gen === 9 || gen === 8) {
        var ribbon1 = pk.Ribbon1 & 0b11111111_11111111_11111111_11111111;
        var ribbon2 = pk.Ribbon2 & 0b11111111_11111111_11111111_11111111;
        var ribbon3 = pk.Ribbon3 & 0b11111111_11111111_11111111_11111111;
        var ribbon4 = pk.Ribbon4 & 0b00000000_00000000_00111111_11111111;

        var parts = [ribbon1, ribbon2, ribbon3, ribbon4];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) rib.push(getInternalRibbonID6789(i + (j * 32)));
            }
        }
    }

    if (gen === 7) {
        var ribbon1 = pk.Ribbon1 & 0b11111111_11111111_11111111_11111111;
        var ribbon2 = pk.Ribbon2 & 0b00000000_00000011_11111111_11111111;

        var parts = [ribbon1, ribbon2];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) rib.push(getInternalRibbonID6789(i + (j * 32)));
            }
        }
    }

    if (gen === 6) {
        var ribbon1 = pk.Ribbon1 & 0b11111111_11111111_11111111_11111111;
        var ribbon2 = pk.Ribbon2 & 0b00000000_00000000_00111111_11111111;

        var parts = [ribbon1, ribbon2];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) rib.push(getInternalRibbonID6789(i + (j * 32)));
            }
        }
    }

    // Gen 5 didn't add any new ribbons and they're stored the same way, so we can group these together
    if (gen === 5 || gen === 4) {
        var ribbon1 = pk.Ribbon1 & 0b00001111_11111111_11111111_11111111;
        var ribbon2 = pk.Ribbon2 & 0b11111111_11111111_11111111_11111111;
        var ribbon3 = pk.Ribbon3 & 0b00000000_00001111_11111111_11111111;
        
        var parts = [ribbon1, ribbon2, ribbon3];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) rib.push(getInternalRibbonID45(i + (j * 32)));
            }
        }
    }

    if (gen === 3) {
        var ribbon1 = pk.RIB0 & 0b00000111_11111111_11111111_11111111;
        
        var parts = [ribbon1];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) rib.push(getInternalRibbonID45(i + (j + 1) * 32));
            }
        }
    }

    return rib;
}