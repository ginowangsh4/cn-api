// narrative API definition
// function Stage (stage_number, prev_stage, next_stage, chapters, chapter_map) {
//     this.stage_number = stage_number;
//     this.prev_stage = prev_stage || stage_number - 1;
//     this.next_stage = next_stage || stage_number + 1;
//     this.chapters = chapters || [];
//     this.chapter_map = chapter_map || {};
// }

let chapter_map;

function Setting (name, context) {
    this.name = name; // useful for story-telling
	this.context = context;
}

function Chapter (number, setting, characters, objects) {
	this.number = number;
	this.setting = setting;
    this.characters = characters;
	this.objects = objects;
	this.find_participants_for_chapter = find_participants_for_chapter;
	this.find_participants_for_character = find_participants_for_character;
}

function Character (name, owner_chapters, owned_objects, actions, contexts, first_chapter_appearance) {
	this.name = name;
	this.owner_chapters = owner_chapters;
	this.owned_objects = owned_objects;
	this.actions = actions;
	this.contexts = contexts; // map of chapter_number to list of contexts
	this.current_participant = null;
	this.active_chapter = first_chapter_appearance;
}

function Action (description, change_character_and_object) {
	this.description = description;
	this.change_character_and_object = change_character_and_object;
}

function Object (name, owner, first_chapter_appearance) {
	this.name = name;
	this.owner = owner;
	this.active_chapter = first_chapter_appearance;
}

let find_participants_for_chapter = function(setting) {
	// query database
};

let find_participants_for_character = function(character, chapter) {
	var setting = new Setting(character.context[chapter]);
	// query database
};

let update_chapter_map = function(chapter_number, next_chapter_number) {
	chapter_map.chapter_number = next_chapter_number;
};

let update_character_context = function(character, chapter_number, contexts) {
	// add chapter-specific context
	character.context[chapter.number].add(chapter.setting.context);
	// add character-specific context for this chapter
	character.context[chapter.number].addAll(contexts);
}

let add_action_to_character = function(character, chapter_number, action) {
	character.actions[chapter_number].add(action);
};

// create narrative here
chapter_map = {1 : 2};

// create setting
var in_common_room = new Setting("in_common_room", "inside_a_building");
var in_bedroom = new Setting("in_bedroom", "inside_a_building");

// create character
var bottle = new Object("bottle", "hermione", 1);
var health = new Object("health", "ron", 3);
// name, chapters, objects, actions, contexts, first appearance
var harry = new Character("harry", [1, 2], [], [], [], 1);
var ron = new Character("ron", [3], [], [], [], 3);
var hermione = new Character("hermione", [1, 3], [], [], [], 1);


// create chapter
var chapter_one = new Chapter(1, in_common_room, [harry, hermione], [bottle]);
var chapter_two = new Chapter(2, in_bedroom, [harry], [bottle]);
var chapter_three = new Chapter(3, in_common_room, [harry, ron, hermione], [bottle]);

// update context
update_character_context(harry, 1, "sitting_by_table");
update_character_context(harry, 2, "sitting_by_bed");
update_character_context(hermione, 1, "has_a_bottle");
update_character_context(ron, 3, "sitting_by_table");

// update action
let a1_give_harry_bottle = function() {
    bottle.owner = "harry";
    harry.owned_objects.add(bottle);
};

let a1_take_potion_to_bed = function() {
    update_chapter_map(1, 2);
};

let a1_leave_potion_on_table = function() {
    bottle.owner = null;
    harry.owned_objects.remove(bottle);
    update_chapter_map(1, 3);
};

let a2_leave_bedroom = function() {
    bottle.owner = null;
    harry.owned_objects.remove(bottle);
};

let a3_drink_potion_bottle = function() {
    health.owner = null;
    ron.owned_objects.remove(health);
};

let a3_rush_ron_outside = function() {
    hermione.active_chapter = 4;
    ron.active_chapter = 4;
};

let a3_take_potion_to_class = function() {
    bottle.owner = "harry";
    harry.owned_objects.add(bottle);
};

add_action_to_character(harry, 1, new Action("Take potion bottle with him to bed", a1_take_potion_to_bed));
add_action_to_character(harry, 1, new Action("Leave potion bottle on table", a1_leave_potion_on_table));
add_action_to_character(harry, 2, new Action("Leave the bedroom", a2_leave_bedroom));
add_action_to_character(harry, 3, new Action("Takes potion bottle with him to class", a3_take_potion_to_class));

add_action_to_character(ron, 3, new Action("Drinks out of potion bottle", a3_drink_potion_bottle));

add_action_to_character(hermione, 1, new Action("Give Harry a portion bottle", a1_give_harry_bottle));
add_action_to_character(hermione, 3, new Action("Rush Ron outside", a3_rush_ron_outside));

// end goal
function createNewExperience() {

}