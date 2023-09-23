// don't forget to update index.html cache-version
const changelog = {
	"23 September 2023": [
		"Updated sprites for new Pokémon in The Teal Mask",
		"Added a checkbox to indicate that you've checked the Pokémon's scale in Mesagoza to hide the Jumbo and Mini Marks from the guide <a href='https://github.com/Azekthi/Ribbons.Guide/issues/67'>#67</a> (thanks Fanriya!)"
	],
	"15 September 2023": [
		"Fixed issue introduced in the previous update where no Ribbons were suggested for Alolan Marowak, Ribombee, Araquanid, and Togedemaru if they originated from games other than USUM (thanks autumn!)",
		"Fixed remaining cases where apostrophes were not being properly escaped <a href='https://github.com/Azekthi/Ribbons.Guide/issues/70'>#70</a> (thanks FlitPix!)"
	],
	"13 September 2023": [
		"Added support for new/returning Pokémon in The Teal Mask",
		"Restored the Itemfinder Mark! Game Freak has fixed the bug preventing it from being earned",
		"Replaced pixel sprites with HOME renders, resolving the SV fan art requirement and matching the app's overall style",
		"Added Hoopa (Unbound), Zygarde (10% Forme), Cosplay Pikachu's outfits, and Urshifu (Rapid Strike Style); <strong>all existing Urshifus display as Single Strike Style until edited</strong>",
		"Added handling for Spinda and Nincada's BDSP restrictions",
		"Added warnings for Totem-sized Pokémon from USUM <a href='https://github.com/Azekthi/Ribbons.Guide/issues/52'>#52</a>",
		"Removed Footprint Ribbon warning for Pokémon from GO, since their Met Level must be ≤50 (thanks Josh Lemmy!)",
		"Removed 5-or-6-digit requirement from ID No. field (thanks Randomdice101!)",
		"Improved Pikachu and Furfrou sorting in the dropdown menu",
		"Fixed display of Oricorio (Pa'u Style) in the dropdown menu"
	],
	"2 September 2023": [
		"Fixed an issue where Gen VII Ribbons appeared in the guide for Pokémon currently in Let's Go, Pikachu! and Let's Go, Eevee! (thanks Fanriya!)"
	],
	"1 September 2023": [
		"Updated description of Mightiest Mark"
	],
	"31 August 2023": [
		"Added a pulsing alert bubble and guide warning for time-limited events",
		"Fixed display of Unown forms in the dropdown menu"
	],
	"30 May 2023": [
		"Added HOME support for Scarlet/Violet! (finally)",
		"Combined Gens VIII and IX to support Gen VIII's forward compatibility with Pokémon caught in Gen IX! Check your Gen IX-origin Pokémon in case they can earn more Ribbons!",
		"Removed Once-in-a-Lifetime Ribbon and Itemfinder Mark",
		"Fixed an issue where the Ribbon Guide was asking to check Battle and Contest Memory Ribbons for Pokémon caught in Gen V, which cannot have these Ribbons (thanks OrangeAurora!)",
		"More updates coming soon!"
	],
	"11 March 2023": [
		"Expanded height of Pokémon card headers; on mobile, if the name and title do not fit, the title will move to a second line <a href='https://github.com/Azekthi/Ribbons.Guide/issues/51'>#51</a> (thanks Pikapal52!)",
		"Improved handling of box names in Pokémon card footers to ensure they are properly truncated across all mobile devices",
		"Improved positioning of the New Pokémon button at the bottom-right on mobile devices",
		"Ribbon Guide warnings are now in a single section and can be collapsed after viewing them <a href='https://github.com/Azekthi/Ribbons.Guide/issues/49'>#49</a>",
		"Fixed the swapped colors of Intrepid Sword and Dauntless Shield (thanks Vamp1836!)",
	],
	"9 March 2023": [
		"Fixed an issue where Ribbons from the Battle Tower, Battle Maison, and Battle Tree did not show in the Ribbon Guide for certain Legendary Pokémon (thanks Athis!)",
		"Fixed an issue where Ribbons from the Battle Tower were showing in the Ribbon Guide for Spiky-eared Pichu",
		"Added a Discord invite link"
	],
	"6 March 2023": [
		"Ribbons.Guide is now a progressive web app! Visit the site using a <a href='https://en.wikipedia.org/wiki/Progressive_web_app' target='_blank'>supported browser</a> to install it directly to your device!",
		"Your list of Pokémon can now be filtered by the games they can travel to, their Poké Ball, and more <a href='https://github.com/Azekthi/Ribbons.Guide/issues/18'>#18</a>&nbsp;&&nbsp;<a href='https://github.com/Azekthi/Ribbons.Guide/issues/32'>#32</a> (thanks Noaxzl!)",
		"Your list of Pokémon can now be sorted by their National Pokédex number, their current level, and their (nick)name <a href='https://github.com/Azekthi/Ribbons.Guide/issues/17'>#17</a> (thanks Noaxzl!)",
		"The tooltips for the Battle and Contest Memory Ribbons now include how many Ribbons were merged into them <a href='https://github.com/Azekthi/Ribbons.Guide/issues/30'>#30</a> (thanks SadisticMystic!)",
		"The World Ability and Once-in-a-Lifetime Ribbons are now displayed like other special-case Ribbons in the Ribbon Guide",
		"Spiky-eared Pichu and Cosplay Pikachu are now available as separate forms",
		"The footer can now be collapsed <a href='https://github.com/Azekthi/Ribbons.Guide/issues/33'>#33</a>",
	],
	"1 March 2023": [
		"We've moved to ribbons.guide! Name is updated everywhere",
		"Added Chinese names for Walking Wake and Iron Leaves",
		"Added new themes \"Intrepid Sword\" and \"Dauntless Shield\"",
		"Devices on light mode will default to \"Intrepid Sword\" theme if no theme had already been selected",
		"GitHub readme now lists the open-source license, data version, and status of online version",
		"The online version now minifies the code, providing a small boost to page speed; further optimization work is still to come"
	],
	"27 February 2023": [
		"Happy Pokémon Day! Added Walking Wake and Iron Leaves (sprites and Chinese names to be updated)",
		"Removed unavailable Ribbons that were inadvertendly added in a prior update",
		"Fixed an error where old Battle and Contest Ribbons were hidden from Gen V Pokémon; they will now start hiding in Gen VI as in the games (thanks SadisticMystic!)",
		"Fixed an issue where Pokémon caught in Scarlet or Violet were not showing Ribbon guidance if they were not National #906 or above"
	],
	"9 January 2023": [
		"Added the long-awaited Ribbon Master Guide! Click the clipboard icon on a Pokémon's summary to see the remaining Ribbons available to them! <a href='https://github.com/Azekthi/Ribbons.Guide/issues/8'>#8</a>",
		"Bank is now split into Gen VI and Gen VII because Pokémon sent to Gen VII cannot go back to Gen VI; all Pokémon currently in Bank are set to Gen VI until edited",
		"Warnings appear in the Ribbon Master Guide for cross-generation evolutions and level-locked Ribbons where applicable",
		"Battle and Contest Ribbons are now hidden from the main display if the Pokémon is in Gen V or above",
		"Box names are no longer limited to 12 characters and can be edited from the edit window"
	],
	"6 January 2023": [
		"Added support for Square shinies <a href='https://github.com/Azekthi/Ribbons.Guide/issues/10'>#10</a>",
		"Updated gender toggle similar to new shiny toggle",
		"Ribbon categories can now be collapsed in the form (Event and Marks are collapsed by default)",
		"Fixed various mobile issues; Pokémon can now be dragged and re-ordered on mobile, and certain Pokémon will no longer overflow the add/edit form"
	],
	"2 January 2023": [
		"Added Boxes to group your Pokémon <a href='https://github.com/Azekthi/Ribbons.Guide/issues/16'>#16</a>",
		"Added ability to drag and re-order Pokémon <a href='https://github.com/Azekthi/Ribbons.Guide/issues/21'>#21</a>",
		"Updated data backup/restore to include Boxes; Pokémon order is also saved; restore is backwards compatible with older files",
		"Added new theme \"Start Menu\"; updated Naranja and Uva themes to appear closer to the game",
		"Replaced add/edit form tab labels with icons",
		"Added Pokémon sprite preview to add/edit form",
		"Species, mint, and nature dropdowns support searching in all nine languages (display coming soon)",
		"Ribbon list in the add/edit form is now scrollable",
		"Selected Ribbons in the form are now covered by a checkmark",
		"Updated action icons (Edit, Delete, etc.) for better visibility",
		"Many accessibility improvements, bug fixes, and code updates",
		"Downloaded version of website can now be run fully offline"
	],
	"12 December 2022": [
		"Added Scarlet/Violet Pokémon, forms, and origin mark <a href='https://github.com/Azekthi/Ribbons.Guide/issues/22'>#22</a>",
		"Updated SPA language tag to SP-EU as per Scarlet/Violet"
	],
	"21 November 2022": [
		"Added Scarlet/Violet Ribbons, Marks, and Games (thanks SadisticMystic!)",
		"Added HOME and Bank as Current Game options",
		"Updated Timer Ball sprite"
	],
	"17 November 2022": [
		"Add/edit form now supports Current Game, IVs, EVs, Ability, Met Level, Met Date, and Characteristic <a href='https://github.com/Azekthi/Ribbons.Guide/issues/11'>#11</a>",
		"Updated ball and mint sprites to match their HOME/PLA sprites"
	],
	"14 November 2022": [
		"Added all forms to the species selection",
		"Nickname field can now be left empty; species name will be used in these cases",
		"Add/edit form now has tabs! They don't look the best for now, but they work!",
		"You can now add notes to each Pokémon (thanks lovelycoris!)"
	],
	"13 November 2022": [
		"Added a changelog! This will automatically appear when there's a new update."
	]
}