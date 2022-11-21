const ribbonIDs = {"Event": "e", "Marks": "m", "Gen III": 3, "Gen IV": 4, "Gen VI": 6, "Gen VII": 7, "Gen VIII": 8, "Gen IX": 9};

const allRibbons = {
	"champion-ribbon": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald",
			"fr",
			"lg"
		],
		"names": {
			"eng": "Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for clearing the Pokémon League and entering the Hall of Fame somewhere long ago.",
		},
		"titles": {
			"eng": "the Champion",
		}
	},
	"sinnoh-champion-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Sinnoh Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for beating the Sinnoh Champion and entering the Sinnoh Hall of Fame.",
		},
		"titles": {
			"eng": "the Sinnoh Champion",
		}
	},
	"kalos-champion-ribbon": {
		"gen": 6,
		"available": [
			"x",
			"y"
		],
		"names": {
			"eng": "Kalos Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for beating the Kalos Champion and entering the Kalos Hall of Fame.",
		},
		"titles": {
			"eng": "the Kalos Champion",
		}
	},
	"hoenn-champion-ribbon": {
		"gen": 6,
		"available": [
			"or",
			"as"
		],
		"names": {
			"eng": "Hoenn Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for beating the Hoenn Champion and entering the Hoenn Hall of Fame.",
		},
		"titles": {
			"eng": "the Hoenn Champion",
		}
	},
	"alola-champion-ribbon": {
		"gen": 7,
		"available": [
			"sun",
			"moon",
			"usun",
			"umoon"
		],
		"names": {
			"eng": "Alola Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for becoming the Alola Champion and entering the Alola Hall of Fame.",
		},
		"titles": {
			"eng": "the Alola Champion",
		}
	},
	"galar-champion-ribbon": {
		"gen": 8,
		"available": [
			"sw",
			"sh"
		],
		"names": {
			"eng": "Galar Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for becoming the Galar Champion and entering the Galar Hall of Fame.",
		},
		"titles": {
			"eng": "the Galar Champion",
		}
	},
	"paldea-champion-ribbon": {
		"gen": 9,
		"available": [
			"scar",
			"vio"
		],
		"names": {
			"eng": "Paldea Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for becoming a Paldea Champion and entering the Paldea Hall of Fame.",
		},
		"titles": {
			"eng": "the Paldea Champion",
		}
	},
	"cool-ribbon-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Cool Ribbon",
		},
		"descs": {
			"eng": "Hoenn Cool Contest Normal Rank winner!",
		}
	},
	"cool-ribbon-super-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Cool Ribbon Super",
		},
		"descs": {
			"eng": "Hoenn Cool Contest Super Rank winner!",
		}
	},
	"cool-ribbon-hyper-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Cool Ribbon Hyper",
		},
		"descs": {
			"eng": "Hoenn Cool Contest Hyper Rank winner!",
		}
	},
	"cool-ribbon-master-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Cool Ribbon Master",
		},
		"descs": {
			"eng": "Hoenn Cool Contest Master Rank winner!",
		}
	},
	"beauty-ribbon-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Beauty Ribbon",
		},
		"descs": {
			"eng": "Hoenn Beauty Contest Normal Rank winner!",
		}
	},
	"beauty-ribbon-super-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Beauty Ribbon Super",
		},
		"descs": {
			"eng": "Hoenn Beauty Contest Super Rank winner!",
		}
	},
	"beauty-ribbon-hyper-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Beauty Ribbon Hyper",
		},
		"descs": {
			"eng": "Hoenn Beauty Contest Hyper Rank winner!",
		}
	},
	"beauty-ribbon-master-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Beauty Ribbon Master",
		},
		"descs": {
			"eng": "Hoenn Beauty Contest Master Rank winner!",
		}
	},
	"cute-ribbon-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Cute Ribbon",
		},
		"descs": {
			"eng": "Hoenn Cute Contest Normal Rank winner!",
		}
	},
	"cute-ribbon-super-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Cute Ribbon Super",
		},
		"descs": {
			"eng": "Hoenn Cute Contest Super Rank winner!",
		}
	},
	"cute-ribbon-hyper-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Cute Ribbon Hyper",
		},
		"descs": {
			"eng": "Hoenn Cute Contest Hyper Rank winner!",
		}
	},
	"cute-ribbon-master-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Cute Ribbon Master",
		},
		"descs": {
			"eng": "Hoenn Cute Contest Master Rank winner!",
		}
	},
	"smart-ribbon-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Smart Ribbon",
		},
		"descs": {
			"eng": "Hoenn Smart Contest Normal Rank winner!",
		}
	},
	"smart-ribbon-super-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Smart Ribbon Super",
		},
		"descs": {
			"eng": "Hoenn Smart Contest Super Rank winner!",
		}
	},
	"smart-ribbon-hyper-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Smart Ribbon Hyper",
		},
		"descs": {
			"eng": "Hoenn Smart Contest Hyper Rank winner!",
		}
	},
	"smart-ribbon-master-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Smart Ribbon Master",
		},
		"descs": {
			"eng": "Hoenn Smart Contest Master Rank winner!",
		}
	},
	"tough-ribbon-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Tough Ribbon",
		},
		"descs": {
			"eng": "Hoenn Tough Contest Normal Rank winner!",
		}
	},
	"tough-ribbon-super-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Tough Ribbon Super",
		},
		"descs": {
			"eng": "Hoenn Tough Contest Super Rank winner!",
		}
	},
	"tough-ribbon-hyper-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Tough Ribbon Hyper",
		},
		"descs": {
			"eng": "Hoenn Tough Contest Hyper Rank winner!",
		}
	},
	"tough-ribbon-master-hoenn": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Tough Ribbon Master",
		},
		"descs": {
			"eng": "Hoenn Tough Contest Master Rank winner!",
		}
	},
	"cool-ribbon-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Cool Ribbon",
		},
		"descs": {
			"eng": "Super Contest Cool Category Normal Rank winner!",
		}
	},
	"cool-ribbon-great-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Cool Ribbon Great",
		},
		"descs": {
			"eng": "Super Contest Cool Category Great Rank winner!",
		}
	},
	"cool-ribbon-ultra-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Cool Ribbon Ultra",
		},
		"descs": {
			"eng": "Super Contest Cool Category Ultra Rank winner!",
		}
	},
	"cool-ribbon-master-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Cool Ribbon Master",
		},
		"descs": {
			"eng": "Super Contest Cool Category Master Rank winner!",
		}
	},
	"beauty-ribbon-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Beauty Ribbon",
		},
		"descs": {
			"eng": "Super Contest Beauty Category Normal Rank winner!",
		}
	},
	"beauty-ribbon-great-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Beauty Ribbon Great",
		},
		"descs": {
			"eng": "Super Contest Beauty Category Great Rank winner!",
		}
	},
	"beauty-ribbon-ultra-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Beauty Ribbon Ultra",
		},
		"descs": {
			"eng": "Super Contest Beauty Category Ultra Rank winner!",
		}
	},
	"beauty-ribbon-master-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Beauty Ribbon Master",
		},
		"descs": {
			"eng": "Super Contest Beauty Category Master Rank winner!",
		}
	},
	"cute-ribbon-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Cute Ribbon",
		},
		"descs": {
			"eng": "Super Contest Cute Category Normal Rank winner!",
		}
	},
	"cute-ribbon-great-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Cute Ribbon Great",
		},
		"descs": {
			"eng": "Super Contest Cute Category Great Rank winner!",
		}
	},
	"cute-ribbon-ultra-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Cute Ribbon Ultra",
		},
		"descs": {
			"eng": "Super Contest Cute Category Ultra Rank winner!",
		}
	},
	"cute-ribbon-master-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Cute Ribbon Master",
		},
		"descs": {
			"eng": "Super Contest Cute Category Master Rank winner!",
		}
	},
	"smart-ribbon-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Smart Ribbon",
		},
		"descs": {
			"eng": "Super Contest Smart Category Normal Rank winner!",
		}
	},
	"smart-ribbon-great-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Smart Ribbon Great",
		},
		"descs": {
			"eng": "Super Contest Smart Category Great Rank winner!",
		}
	},
	"smart-ribbon-ultra-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Smart Ribbon Ultra",
		},
		"descs": {
			"eng": "Super Contest Smart Category Ultra Rank winner!",
		}
	},
	"smart-ribbon-master-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Smart Ribbon Master",
		},
		"descs": {
			"eng": "Super Contest Smart Category Master Rank winner!",
		}
	},
	"tough-ribbon-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Tough Ribbon",
		},
		"descs": {
			"eng": "Super Contest Tough Category Normal Rank winner!",
		}
	},
	"tough-ribbon-great-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Tough Ribbon Great",
		},
		"descs": {
			"eng": "Super Contest Tough Category Great Rank winner!",
		}
	},
	"tough-ribbon-ultra-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Tough Ribbon Ultra",
		},
		"descs": {
			"eng": "Super Contest Tough Category Ultra Rank winner!",
		}
	},
	"tough-ribbon-master-sinnoh": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum"
		],
		"names": {
			"eng": "Tough Ribbon Master",
		},
		"descs": {
			"eng": "Super Contest Tough Category Master Rank winner!",
		}
	},
	"coolness-master-ribbon": {
		"gen": 6,
		"available": [
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Coolness Master Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon that has perfectly embodied Coolness in Pokémon Contests.",
		},
		"titles": {
			"eng": "the Former Star",
		}
	},
	"beauty-master-ribbon": {
		"gen": 6,
		"available": [
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Beauty Master Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon that has perfectly embodied Beauty in Pokémon Contests.",
		},
		"titles": {
			"eng": "the Vintage Beauty",
		}
	},
	"cuteness-master-ribbon": {
		"gen": 6,
		"available": [
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Cuteness Master Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon that has perfectly embodied Cuteness in Pokémon Contests.",
		},
		"titles": {
			"eng": "the Former Idol",
		}
	},
	"cleverness-master-ribbon": {
		"gen": 6,
		"available": [
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Cleverness Master Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon that has perfectly embodied Cleverness in Pokémon Contests.",
		},
		"titles": {
			"eng": "the Historic Genius",
		}
	},
	"toughness-master-ribbon": {
		"gen": 6,
		"available": [
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Toughness Master Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon that has perfectly embodied Toughness in Pokémon Contests.",
		},
		"titles": {
			"eng": "the Formerly Buff",
		}
	},
	"contest-star-ribbon": {
		"gen": 6,
		"available": [
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Contest Star Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon that has performed superbly in every kind of contest.",
		},
		"titles": {
			"eng": "the Shining Star",
		}
	},
	"twinkling-star-ribbon": {
		"gen": 8,
		"available": [
			"bd",
			"sp"
		],
		"names": {
			"eng": "Twinkling Star Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon that has perfectly embodied shining brilliance in Super Contest Shows.",
		}
	},
	"contest-memory-ribbon": {
		"gen": 6,
		"available": [
			"x",
			"y",
			"or",
			"as"
		],
		"names": {
			"eng": "Contest Memory Ribbon",
		},
		"descs": {
			"eng": "A commemorative Ribbon representing all of the Ribbons you collected for contests somewhere long ago.",
		},
		"titles": {
			"eng": "the Treasured Memory",
		}
	},
	"contest-memory-ribbon-gold": {
		"gen": 6,
		"available": [
			"x",
			"y",
			"or",
			"as"
		],
		"names": {
			"eng": "Contest Memory Ribbon",
		},
		"descs": {
			"eng": "A commemorative Ribbon representing all of the Ribbons you collected for contests somewhere long ago.",
		},
		"titles": {
			"eng": "the Treasured Memory",
		}
	},
	"winning-ribbon": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Winning Ribbon",
		},
		"descs": {
			"eng": "Ribbon awarded for clearing Hoenn's Battle Tower's Lv. 50 challenge.",
		}
	},
	"victory-ribbon": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Victory Ribbon",
		},
		"descs": {
			"eng": "Ribbon awarded for clearing Hoenn's Battle Tower's Lv. 100 challenge.",
		}
	},
	"ability-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss"
		],
		"names": {
			"eng": "Ability Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for defeating the Tower Tycoon at the Battle Tower.",
		}
	},
	"great-ability-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss"
		],
		"names": {
			"eng": "Great Ability Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for defeating the Tower Tycoon at the Battle Tower.",
		}
	},
	"double-ability-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss"
		],
		"names": {
			"eng": "Double Ability Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for completing the Battle Tower Double challenge.",
		}
	},
	"multi-ability-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss"
		],
		"names": {
			"eng": "Multi Ability Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for completing the Battle Tower Multi challenge.",
		}
	},
	"pair-ability-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss"
		],
		"names": {
			"eng": "Pair Ability Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for completing the Battle Tower Link Multi challenge.",
		}
	},
	"world-ability-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss"
		],
		"names": {
			"eng": "World Ability Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for completing the Wi-Fi Battle Tower challenge.",
		}
	},
	"battle-memory-ribbon": {
		"gen": 6,
		"available": [
			"x",
			"y",
			"or",
			"as"
		],
		"names": {
			"eng": "Battle Memory Ribbon",
		},
		"descs": {
			"eng": "A commemorative Ribbon representing all of the Ribbons you collected for battling somewhere long ago.",
		},
		"titles": {
			"eng": "the Exciting Memory",
		}
	},
	"battle-memory-ribbon-gold": {
		"gen": 6,
		"available": [
			"x",
			"y",
			"or",
			"as"
		],
		"names": {
			"eng": "Battle Memory Ribbon",
		},
		"descs": {
			"eng": "A commemorative Ribbon representing all of the Ribbons you collected for battling somewhere long ago.",
		},
		"titles": {
			"eng": "the Exciting Memory",
		}
	},
	"skillful-battler-ribbon": {
		"gen": 6,
		"available": [
			"x",
			"y",
			"or",
			"as"
		],
		"names": {
			"eng": "Skillful Battler Ribbon",
		},
		"descs": {
			"eng": "A Ribbon that can be given to a Pokémon that has achieved victory in difficult battles.",
		},
		"titles": {
			"eng": "the Veteran",
		}
	},
	"expert-battler-ribbon": {
		"gen": 6,
		"available": [
			"x",
			"y",
			"or",
			"as"
		],
		"names": {
			"eng": "Expert Battler Ribbon",
		},
		"descs": {
			"eng": "A Ribbon that can be given to a brave Pokémon that has honed its battle skills to an art.",
		},
		"titles": {
			"eng": "the Master",
		}
	},
	"battle-tree-great-ribbon": {
		"gen": 7,
		"available": [
			"sun",
			"moon",
			"usun",
			"umoon"
		],
		"names": {
			"eng": "Battle Tree Great Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for winning against a Battle Legend in the Battle Tree.",
		},
		"titles": {
			"eng": "the Tree Victor",
		}
	},
	"battle-tree-master-ribbon": {
		"gen": 7,
		"available": [
			"sun",
			"moon",
			"usun",
			"umoon"
		],
		"names": {
			"eng": "Battle Tree Master Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for winning against a Battle Legend in super battles in the Battle Tree.",
		},
		"titles": {
			"eng": "the Tree Master",
		}
	},
	"tower-master-ribbon": {
		"gen": 8,
		"available": [
			"sw",
			"sh",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Tower Master Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for winning against a champion in the Battle Tower.",
		},
		"titles": {
			"eng": "the Tower Master",
		}
	},
	"artist-ribbon": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald"
		],
		"names": {
			"eng": "Artist Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for being chosen as a super sketch model in the Hoenn region.",
		},
		"titles": {
			"eng": "the Model for Paintings",
		}
	},
	"effort-ribbon": {
		"gen": 3,
		"available": [
			"ruby",
			"sapphire",
			"emerald",
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss",
			"x",
			"y",
			"or",
			"as",
			"sun",
			"moon",
			"usun",
			"umoon",
			"sw",
			"sh",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Effort Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for being an exceptionally hard worker.",
		},
		"titles": {
			"eng": "the Once Well-Trained",
		}
	},
	"alert-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss",
			"x",
			"y",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Alert Ribbon",
		},
		"descs": {
			"eng": "A Ribbon for recalling an invigorating event that created life energy.",
		},
		"titles": {
			"eng": "the Once Vigilant",
		}
	},
	"shock-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss",
			"x",
			"y",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Shock Ribbon",
		},
		"descs": {
			"eng": "A Ribbon for recalling a thrilling event that made life more exciting.",
		},
		"titles": {
			"eng": "the Once Cowardly",
		}
	},
	"downcast-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss",
			"x",
			"y",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Downcast Ribbon",
		},
		"descs": {
			"eng": "A Ribbon for recalling feelings of sadness that added spice to life.",
		},
		"titles": {
			"eng": "the Once Shaken",
		}
	},
	"careless-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss",
			"x",
			"y",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Careless Ribbon",
		},
		"descs": {
			"eng": "A Ribbon for recalling a careless error that helped steer life decisions.",
		},
		"titles": {
			"eng": "the Once Imperfect",
		}
	},
	"relax-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss",
			"x",
			"y",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Relax Ribbon",
		},
		"descs": {
			"eng": "A Ribbon for recalling a refreshing event that added sparkle to life.",
		},
		"titles": {
			"eng": "the Once Well-Rested",
		}
	},
	"snooze-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss",
			"x",
			"y",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Snooze Ribbon",
		},
		"descs": {
			"eng": "A Ribbon for recalling a deep slumber that made life soothing.",
		},
		"titles": {
			"eng": "the Once Sleepy",
		}
	},
	"smile-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"hg",
			"ss",
			"x",
			"y",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Smile Ribbon",
		},
		"descs": {
			"eng": "A Ribbon for recalling that smiles enrich the quality of life.",
		},
		"titles": {
			"eng": "the Once Cheery",
		}
	},
	"gorgeous-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Gorgeous Ribbon",
		},
		"descs": {
			"eng": "An extraordinarily gorgeous and extravagant Ribbon.",
		},
		"titles": {
			"eng": "the Gorgeous",
		}
	},
	"royal-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Royal Ribbon",
		},
		"descs": {
			"eng": "An incredibly regal Ribbon with an air of nobility.",
		},
		"titles": {
			"eng": "the Royal",
		}
	},
	"gorgeous-royal-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"or",
			"as",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Gorgeous Royal Ribbon",
		},
		"descs": {
			"eng": "A gorgeous and regal Ribbon that is the peak of fabulous.",
		},
		"titles": {
			"eng": "the Gorgeous Royal",
		}
	},
	"footprint-ribbon": {
		"gen": 4,
		"available": [
			"diamond",
			"pearl",
			"platinum",
			"x",
			"y",
			"or",
			"as",
			"sun",
			"moon",
			"usun",
			"umoon",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Footprint Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon deemed to have a top-quality footprint.",
		},
		"titles": {
			"eng": "the Strutter",
		}
	},
	"legend-ribbon": {
		"gen": 4,
		"available": [
			"hg",
			"ss"
		],
		"names": {
			"eng": "Legend Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for setting a legendary record.",
		},
		"titles": {
			"eng": "the Living Legend",
		}
	},
	"best-friends-ribbon": {
		"gen": 6,
		"available": [
			"x",
			"y",
			"or",
			"as",
			"sun",
			"moon",
			"usun",
			"umoon",
			"sw",
			"sh",
			"bd",
			"sp"
		],
		"names": {
			"eng": "Best Friends Ribbon",
		},
		"descs": {
			"eng": "A Ribbon that can be given to a Pokémon with which you share a close and meaningful bond.",
		},
		"titles": {
			"eng": "the Great Friend",
		}
	},
	"training-ribbon": {
		"gen": 6,
		"available": [
			"x",
			"y",
			"or",
			"as"
		],
		"names": {
			"eng": "Training Ribbon",
		},
		"descs": {
			"eng": "A Ribbon that can be given to a Pokémon that has overcome rigorous trials and training.",
		},
		"titles": {
			"eng": "the Tried and True",
		}
	},
	"battle-royal-master-ribbon": {
		"gen": 7,
		"available": [
			"sun",
			"moon",
			"usun",
			"umoon"
		],
		"names": {
			"eng": "Battle Royal Master Ribbon",
		},
		"descs": {
			"eng": "A Ribbon that can be given to a Pokémon that has achieved victory in the Battle Royal.",
		},
		"titles": {
			"eng": "the Royal Master",
		}
	},
	"master-rank-ribbon": {
		"gen": 8,
		"available": [
			"sw",
			"sh"
		],
		"names": {
			"eng": "Master Rank Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for winning against a Trainer in the Master Ball Tier of Ranked Battles.",
		},
		"titles": {
			"eng": "the Rank Master",
		}
	},
	"hisui-ribbon": {
		"gen": 8,
		"available": [
			"pla"
		],
		"names": {
			"eng": "Hisui Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon that posed for a photograph in Hisui in the distant past.",
		},
		"titles": {
			"eng": "of the Distant Past",
		}
	},
	"once-in-a-lifetime-ribbon": {
		"gen": 9,
		"available": [
			"scar",
			"vio"
		],
		"names": {
			"eng": "Once-in-a-Lifetime Ribbon",
		},
		"descs": {
			"eng": "A rare Ribbon found extremely infrequently on Pokémon obtained in a Surprise Trade.",
		},
		"titles": {
			"eng": "the One-in-a-Million",
		}
	},
	"country-ribbon": {
		"gen": 3,
		"available": null,
		"names": {
			"eng": "Country Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon League Champion.",
		},
		"titles": {
			"eng": "the Victor",
		}
	},
	"national-ribbon": {
		"gen": 3,
		"available": [
			"colosseum",
			"xd"
		],
		"names": {
			"eng": "National Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for overcoming all difficult challenges.",
		},
		"titles": {
			"eng": "the Triumphant",
		}
	},
	"earth-ribbon": {
		"gen": 3,
		"available": [
			"colosseum",
			"xd"
		],
		"names": {
			"eng": "Earth Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for winning one hundred battles in a row.",
		},
		"titles": {
			"eng": "the 100× Victorious",
		}
	},
	"world-ribbon": {
		"gen": 3,
		"available": null,
		"names": {
			"eng": "World Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Pokémon League Champion.",
		},
		"titles": {
			"eng": "the World Conqueror",
		}
	},
	"classic-ribbon": {
		"gen": 4,
		"available": null,
		"names": {
			"eng": "Classic Ribbon",
		},
		"descs": {
			"eng": "A Ribbon that proclaims love for Pokémon.",
		},
		"titles": {
			"eng": "the Pokémon Fan",
		}
	},
	"premier-ribbon": {
		"gen": 4,
		"available": null,
		"names": {
			"eng": "Premier Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for a special holiday.",
		},
		"titles": {
			"eng": "the Celebratory",
		}
	},
	"event-ribbon": {
		"gen": 5,
		"available": null,
		"names": {
			"eng": "Event Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded for participating in a special Pokémon event.",
		},
		"titles": {
			"eng": "the Festive",
		}
	},
	"birthday-ribbon": {
		"gen": 5,
		"available": null,
		"names": {
			"eng": "Birthday Ribbon",
		},
		"descs": {
			"eng": "A Ribbon that commemorates a birthday.",
		},
		"titles": {
			"eng": "the Best Buddy",
		}
	},
	"special-ribbon": {
		"gen": 5,
		"available": null,
		"names": {
			"eng": "Special Ribbon",
		},
		"descs": {
			"eng": "A special Ribbon for a special day.",
		},
		"titles": {
			"eng": "the Premium",
		}
	},
	"souvenir-ribbon": {
		"gen": 5,
		"available": null,
		"names": {
			"eng": "Souvenir Ribbon",
		},
		"descs": {
			"eng": "A Ribbon for cherishing a special memory.",
		},
		"titles": {
			"eng": "the Cherished",
		}
	},
	"wishing-ribbon": {
		"gen": 5,
		"available": null,
		"names": {
			"eng": "Wishing Ribbon",
		},
		"descs": {
			"eng": "A Ribbon said to make your wish come true.",
		},
		"titles": {
			"eng": "the Wish Granter",
		}
	},
	"battle-champion-ribbon": {
		"gen": 5,
		"available": null,
		"names": {
			"eng": "Battle Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a Battle Competition Champion.",
		},
		"titles": {
			"eng": "the Battle Champion",
		}
	},
	"world-champion-ribbon": {
		"gen": 5,
		"available": null,
		"names": {
			"eng": "World Champion Ribbon",
		},
		"descs": {
			"eng": "A Ribbon awarded to a World Champion in the Pokémon World Championships.",
		},
		"titles": {
			"eng": "the World Champion",
		}
	},
	"lunchtime-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Mittags-Zeichen",
			"eng": "Lunchtime Mark",
		},
		"descs": {
			"eng": "A mark for a peckish Pokémon.",
		},
		"titles": {
			"eng": "the Peckish",
		}
	},
	"sleepy-time-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Mitternachts-Zeichen",
			"eng": "Sleepy-Time Mark",
		},
		"descs": {
			"eng": "A mark for a sleepy Pokémon.",
		},
		"titles": {
			"eng": "the Sleepy",
		}
	},
	"dusk-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Abenddämmerungs-Zeichen",
			"eng": "Dusk Mark",
		},
		"descs": {
			"eng": "A mark for a dozy Pokémon.",
		},
		"titles": {
			"eng": "the Dozy",
		}
	},
	"dawn-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Morgendämmerungs-Zeichen",
			"eng": "Dawn Mark",
		},
		"descs": {
			"eng": "A mark for an early-riser Pokémon.",
		},
		"titles": {
			"eng": "the Early Riser",
		}
	},
	"cloudy-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Wolken-Zeichen",
			"eng": "Cloudy Mark",
		},
		"descs": {
			"eng": "A mark for a cloud-watching Pokémon.",
		},
		"titles": {
			"eng": "the Cloud Watcher",
		}
	},
	"rainy-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Regen-Zeichen",
			"eng": "Rainy Mark",
		},
		"descs": {
			"eng": "A mark for a sodden Pokémon.",
		},
		"titles": {
			"eng": "the Sodden",
		}
	},
	"stormy-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Gewitter-Zeichen",
			"eng": "Stormy Mark",
		},
		"descs": {
			"eng": "A mark for a thunderstruck Pokémon.",
		},
		"titles": {
			"eng": "the Thunderstruck",
		}
	},
	"snowy-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Schneefall-Zeichen",
			"eng": "Snowy Mark",
		},
		"descs": {
			"eng": "A mark for a snow-frolicking Pokémon.",
		},
		"titles": {
			"eng": "the Snow Frolicker",
		}
	},
	"blizzard-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Schneesturm-Zeichen",
			"eng": "Blizzard Mark",
		},
		"descs": {
			"eng": "A mark for a shivering Pokémon.",
		},
		"titles": {
			"eng": "the Shivering",
		}
	},
	"dry-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Dürre-Zeichen",
			"eng": "Dry Mark",
		},
		"descs": {
			"eng": "A mark for a parched Pokémon.",
		},
		"titles": {
			"eng": "the Parched",
		}
	},
	"sandstorm-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Sandsturm-Zeichen",
			"eng": "Sandstone Mark",
		},
		"descs": {
			"eng": "A mark for a sandswept Pokémon.",
		},
		"titles": {
			"eng": "the Sandswept",
		}
	},
	"misty-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Nebel-Zeichen",
			"eng": "Misty Mark",
		},
		"descs": {
			"eng": "A mark for a mist-drifter Pokémon.",
		},
		"titles": {
			"eng": "the Mist Drifter",
		}
	},
	"destiny-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Schicksals-Zeichen",
			"eng": "Destiny Mark",
		},
		"descs": {
			"eng": "A mark of a chosen Pokémon.",
		},
		"titles": {
			"eng": "the Chosen One",
		}
	},
	"fishing-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Angel-Zeichen",
			"eng": "Fishing Mark",
		},
		"descs": {
			"eng": "A mark for a catch-of-the-day Pokémon.",
		},
		"titles": {
			"eng": "the Catch of the Day",
		}
	},
	"curry-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Curry-Zeichen",
			"eng": "Curry Mark",
		},
		"descs": {
			"eng": "A mark for a curry-connoisseur Pokémon.",
		},
		"titles": {
			"eng": "the Curry Connoisseur",
		}
	},
	"uncommon-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Gängigkeits-Zeichen",
			"eng": "Uncommon Mark",
		},
		"descs": {
			"eng": "A mark for a sociable Pokémon.",
		},
		"titles": {
			"eng": "the Sociable",
		}
	},
	"rare-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Raritäts-Zeichen",
			"eng": "Rare Mark",
		},
		"descs": {
			"eng": "A mark for a reclusive Pokémon.",
		},
		"titles": {
			"eng": "the Recluse",
		}
	},
	"rowdy-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Raufbold-Zeichen",
			"eng": "Rowdy Mark",
		},
		"descs": {
			"eng": "A mark for a rowdy Pokémon.",
		},
		"titles": {
			"eng": "the Rowdy",
		}
	},
	"absent-minded-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Sorglos-Zeichen",
			"eng": "Absent-Minded Mark",
		},
		"descs": {
			"eng": "A mark for a spacey Pokémon.",
		},
		"titles": {
			"eng": "the Spacey",
		}
	},
	"jittery-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Spannungs-Zeichen",
			"eng": "Jittery Mark",
		},
		"descs": {
			"eng": "A mark for an anxious Pokémon.",
		},
		"titles": {
			"eng": "the Anxious",
		}
	},
	"excited-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Vorfreude-Zeichen",
			"eng": "Excited Mark",
		},
		"descs": {
			"eng": "A mark for a giddy Pokémon.",
		},
		"titles": {
			"eng": "the Giddy",
		}
	},
	"charismatic-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Charisma-Zeichen",
			"eng": "Charismatic Mark",
		},
		"descs": {
			"eng": "A mark for a radiant Pokémon.",
		},
		"titles": {
			"eng": "the Radiant",
		}
	},
	"calmness-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Gelassenheits-Zeichen",
			"eng": "Calmness Mark",
		},
		"descs": {
			"eng": "A mark for a serene Pokémon.",
		},
		"titles": {
			"eng": "the Serene",
		}
	},
	"intense-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Hitzkopf-Zeichen",
			"eng": "Intense Mark",
		},
		"descs": {
			"eng": "A mark for a feisty Pokémon.",
		},
		"titles": {
			"eng": "the Feisty",
		}
	},
	"zoned-out-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Achtlos-Zeichen",
			"eng": "Zoned-Out Mark",
		},
		"descs": {
			"eng": "A mark for a daydreaming Pokémon.",
		},
		"titles": {
			"eng": "the Daydreamer",
		}
	},
	"joyful-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Glücklichkeits-Zeichen",
			"eng": "Joyful Mark",
		},
		"descs": {
			"eng": "A mark for a joyful Pokémon.",
		},
		"titles": {
			"eng": "the Joyful",
		}
	},
	"angry-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Wut-Zeichen",
			"eng": "Angry Mark",
		},
		"descs": {
			"eng": "A mark for a furious Pokémon.",
		},
		"titles": {
			"eng": "the Furious",
		}
	},
	"smiley-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Lächel-Zeichen",
			"eng": "Smiley Mark",
		},
		"descs": {
			"eng": "A mark for a beaming Pokémon.",
		},
		"titles": {
			"eng": "the Beaming",
		}
	},
	"teary-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Trübsal-Zeichen",
			"eng": "Teary Mark",
		},
		"descs": {
			"eng": "A mark for a teary-eyed Pokémon.",
		},
		"titles": {
			"eng": "the Teary-Eyed",
		}
	},
	"upbeat-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Heiterkeits-Zeichen",
			"eng": "Upbeat Mark",
		},
		"descs": {
			"eng": "A mark for a chipper Pokémon.",
		},
		"titles": {
			"eng": "the Chipper",
		}
	},
	"peeved-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Missmut-Zeichen",
			"eng": "Peeved Mark",
		},
		"descs": {
			"eng": "A mark for a grumpy Pokémon.",
		},
		"titles": {
			"eng": "the Grumpy",
		}
	},
	"intellectual-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Verstands-Zeichen",
			"eng": "Intellectual Mark",
		},
		"descs": {
			"eng": "A mark for a scholarly Pokémon.",
		},
		"titles": {
			"eng": "the Scholar",
		}
	},
	"ferocious-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Impulsiv-Zeichen",
			"eng": "Ferocious Mark",
		},
		"descs": {
			"eng": "A mark for a rampaging Pokémon.",
		},
		"titles": {
			"eng": "the Rampaging",
		}
	},
	"crafty-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Listigkeits-Zeichen",
			"eng": "Crafty Mark",
		},
		"descs": {
			"eng": "A mark for an opportunistic Pokémon.",
		},
		"titles": {
			"eng": "the Opportunist",
		}
	},
	"scowling-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Grimmig-Zeichen",
			"eng": "Scowling Mark",
		},
		"descs": {
			"eng": "A mark for a stern Pokémon.",
		},
		"titles": {
			"eng": "the Stern",
		}
	},
	"kindly-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Sanftmut-Zeichen",
			"eng": "Kindly Mark",
		},
		"descs": {
			"eng": "A mark for a kindhearted Pokémon.",
		},
		"titles": {
			"eng": "the Kindhearted",
		}
	},
	"flustered-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Panik-Zeichen",
			"eng": "Flustered Mark",
		},
		"descs": {
			"eng": "A mark for an easily flustered Pokémon.",
		},
		"titles": {
			"eng": "the Easily Flustered",
		}
	},
	"pumped-up-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Ansporn-Zeichen",
			"eng": "Pumped-Up Mark",
		},
		"descs": {
			"eng": "A mark for a driven Pokémon.",
		},
		"titles": {
			"eng": "the Driven",
		}
	},
	"zero-energy-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Lustlos-Zeichen",
			"eng": "Zero Energy Mark",
		},
		"descs": {
			"eng": "A mark for an apathetic Pokémon.",
		},
		"titles": {
			"eng": "the Apathetic",
		}
	},
	"prideful-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Selbstvertrauens-Zeichen",
			"eng": "Prideful Mark",
		},
		"descs": {
			"eng": "A mark for an arrogant Pokémon.",
		},
		"titles": {
			"eng": "the Arrogant",
		}
	},
	"unsure-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Selbstzweifel-Zeichen",
			"eng": "Unsure Mark",
		},
		"descs": {
			"eng": "A mark for an unsure Pokémon.",
		},
		"titles": {
			"eng": "the Reluctant",
		}
	},
	"humble-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Arglos-Zeichen",
			"eng": "Humble Mark",
		},
		"descs": {
			"eng": "A mark for a humble Pokémon.",
		},
		"titles": {
			"eng": "the Humble",
		}
	},
	"thorny-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Scheinheilig-Zeichen",
			"eng": "Thorny Mark",
		},
		"descs": {
			"eng": "A mark for a pompous Pokémon.",
		},
		"titles": {
			"eng": "the Pompous",
		}
	},
	"vigor-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Elan-Zeichen",
			"eng": "Vigor Mark",
		},
		"descs": {
			"eng": "A mark for a lively Pokémon.",
		},
		"titles": {
			"eng": "the Lively",
		}
	},
	"slump-mark": {
		"gen": 8,
		"available": null,
		"mark": true,
		"names": {
			"ger": "Formtief-Zeichen",
			"eng": "Slump Mark",
		},
		"descs": {
			"eng": "A mark for a worn-out Pokémon.",
		},
		"titles": {
			"eng": "the Worn-Out",
		}
	},
	"jumbo-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"eng": "Jumbo Mark",
		},
		"descs": {
			"eng": "A mark for a Pokémon that's the largest it can be.",
		},
		"titles": {
			"eng": "the Great",
		}
	},
	"mini-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"eng": "Mini Mark",
		},
		"descs": {
			"eng": "A mark for a Pokémon that's the smallest it can be.",
		},
		"titles": {
			"eng": "the Teeny",
		}
	},
	"itemfinder-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"eng": "Itemfinder Mark",
		},
		"descs": {
			"eng": "A mark for a Pokémon that likes to pick things up.",
		},
		"titles": {
			"eng": "the Treasure Hunter",
		}
	},
	"partner-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"eng": "Partner Mark",
		},
		"descs": {
			"eng": "A mark for a friendly Pokémon.",
		},
		"titles": {
			"eng": "the Reliable Partner",
		}
	},
	"gourmand-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"eng": "Gourmand Mark",
		},
		"descs": {
			"eng": "A mark for a Pokémon gourmet.",
		},
		"titles": {
			"eng": "the Gourmet",
		}
	},
	"alpha-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"eng": "Alpha Mark",
		},
		"descs": {
			"eng": "A mark for a Pokémon that was an alpha.",
		},
		"titles": {
			"eng": "the Former Alpha",
		}
	},
	"mightiest-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"eng": "Mightiest Mark",
		},
		"descs": {
			"eng": "A mark for a Pokémon caught in a seven-star Tera Raid Battle.",
		},
		"titles": {
			"eng": "the Unrivaled",
		}
	},
	"titan-mark": {
		"gen": 9,
		"available": null,
		"mark": true,
		"names": {
			"eng": "Titan Mark",
		},
		"descs": {
			"eng": "A mark for a Pokémon that was a titan.",
		},
		"titles": {
			"eng": "the Former Titan",
		}
	}
}
