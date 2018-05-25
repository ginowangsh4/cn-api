// narrative API definition
// function Stage (stage_number, prev_stage, next_stage, chapters, chapter_map) {
//     this.stage_number = stage_number;
//     this.prev_stage = prev_stage || stage_number - 1;
//     this.next_stage = next_stage || stage_number + 1;
//     this.chapters = chapters || [];
//     this.chapter_map = chapter_map || {};
// }

let update_chapter_map = function(chapter_number, next_chapter_number) {
	chapter_map.chapter_number = next_chapter_number;
};

let chapter_map;

function Setting (name, context) {
	this.name = name;
	this.context = context;
}

function Chapter (title, setting, characters, objects) {
	this.title = title;
	this.setting = setting;
    this.characters = characters;
	this.objects = objects || [];
	this.find_participants_for_character = find_participants_for_character;
}

function Character (name, owner_chapters, owned_objects, actions, contexts, first_chapter_appearance) {
	this.name = name;
	this.owner_chapters = owner_chapters;
	this.owned_objects = owned_objects || [];
	this.actions = actions || [];
	this.contexts = contexts || []; // map of chapter_number to list of contexts
	this.current_participant = null;
	this.active_chapter = first_chapter_appearance;
}


/* function Action (description, change_character_and_object) {
	this.description = description;
	this.change_character_and_object = change_character_and_object;
} */

var Action = function(description) {  
  this.description = description;
};

//possible prototype based action
Action.prototype.repercussions = function() {  
  console.log('These are the repercussions of each subAction');
};

var give_Harry_bottle = function () {  
  Action.call(this, value);
  this.description = "Give Harry a potion bottle";
};

function Object (name, owner, first_chapter_appearance) {
	this.name = name;
	this.owner = owner || null;
	this.active_chapter = first_chapter_appearance;
}

let find_participants_for_chapter = function(setting) {
	// query database
};

let find_participants_for_character = function(character, chapter) {
	var setting = new Setting(character.context[chapter]);
	// query database
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
chapter_map = {"1" : "2"};

// create setting
var Common_Room = new Setting("Common Room", "inside_a_building || in_a_school_building");
var Bedroom = new Setting("Bedroom", "inside_a_building || in_a_dorm");

// create character
var bottle = new Object("bottle", "hermione", "1");
var health = new Object("health", "ron", "2B");
// name, chapters, objects, actions, contexts, first appearance
var harry = new Character("harry", ["1", "2A"], [], [], [], "1");
var ron = new Character("ron", ["2B"], [], [], [], "2B");
var hermione = new Character("hermione", ["1", "2B"], [], [], [], "1");


// create chapter
var chapter_one = new Chapter("1", Common_Room, [harry, hermione], [bottle]);
var chapter_twoA = new Chapter("2A", Bedroom, [harry], [bottle]);
var chapter_twoB = new Chapter("2b", Common_Room, [harry, ron, hermione], [bottle]);

// update context
update_character_context(harry, "1", "sitting_by_table");
update_character_context(harry, "2A", "sitting_by_bed");
update_character_context(hermione, "1", "has_a_bottle");
update_character_context(ron, "2B", "sitting_by_table");

// update action
let a1_give_harry_bottle = function() {
    bottle.owner = "harry";
    harry.owned_objects.add(bottle);
};

//an example of a protoype based action
give_Harry_bottle.prototype.repercussions = function() {  
  bottle.owner = "harry";
  harry.owned_objects.add(bottle);
};


let a1_take_potion_to_bed = function() {
    update_chapter_map("1", "2");
};

let a1_leave_potion_on_table = function() {
    bottle.owner = null;
    harry.owned_objects.remove(bottle);
    update_chapter_map("1", "2B");
};

let a2_leave_bedroom = function() {
    bottle.owner = null;
    harry.owned_objects.remove(bottle);
};

let a2B_drink_potion_bottle = function() {
    health.owner = null;
    ron.owned_objects.remove(health);
};

let a2B_rush_ron_outside = function() {
    hermione.active_chapter = "3B";
    ron.active_chapter = "3B";
};

let a2B_take_potion_to_class = function() {
    bottle.owner = "harry";
    harry.owned_objects.add(bottle);
};


add_action_to_character(harry, "1", new Action("Take potion bottle with him to bed", a1_take_potion_to_bed));
add_action_to_character(harry, "1", new Action("Leave potion bottle on table", a1_leave_potion_on_table));
add_action_to_character(harry, "2A", new Action("Leave the bedroom", a2_leave_bedroom));
add_action_to_character(harry, "2B", new Action("Takes potion bottle with him to class", a2B_take_potion_to_class));

add_action_to_character(ron, "2B", new Action("Drinks out of potion bottle", a2B_drink_potion_bottle));

add_action_to_character(hermione, "1", new Action("Give Harry a portion bottle", a1_give_harry_bottle));
add_action_to_character(hermione, "2B", new Action("Rush Ron outside", a2B_rush_ron_outside));

// end goal
function convertChapterToExperience(chapter) {
	let exp = {
    _id: Random.id(),
    name: chapter.title,
    resultsTemplate: "scavengerHunt",
    contributionTypes: [    ],
    description: chapter.title,
    notificationText: "A new chapter has begun: " + chapter.title,
    callbacks: [ //don't understand 
    {
      trigger: "cb.incidentFinished()",
      function:
      "function (sub) {                                                                     // 611\n  var uids = Submissions.find({                                                                                      // 612\n    iid: sub.iid                                                                                                     // 612\n  }).fetch().map(function (x) {                                                                                      // 612\n    return x.uid;                                                                                                    // 613\n  });                                                                                                                // 614\n  notify(uids, sub.iid, 'Wooh! All the scavenger hunt items were found. Click here to see all of them.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);\n}"
    }
    ]
  };

  for each (character in chapter.characters) {
  		for each (action in character.actions) {
  			var newNeed = {
  				needName: action.description,
  				situation {
  					detector: character.contexts[chapter],
  					number: 1
  				},
  				toPass {
  					instruction: action.description
  				},
  				numberNeeded: 1
  			}
  			exp.contributionTypes += newNeed;
  		}
  }

  Experiences.insert(exp);
  let incident = createIncidentFromExperience(exp);
  startRunningIncident(incident);

}