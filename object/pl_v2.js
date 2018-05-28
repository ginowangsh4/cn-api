// narrative API definition
// function Stage (stage_number, prev_stage, next_stage, chapters, chapter_map) {
//     this.stage_number = stage_number;
//     this.prev_stage = prev_stage || stage_number - 1;
//     this.next_stage = next_stage || stage_number + 1;
//     this.chapters = chapters || [];
//     this.chapter_map = chapter_map || {};
// }
function writeNarrative() {
    let update_chapter_map = function (chapter_title, next_chapter_title) {
        chapter_map.chapter_title = next_chapter_title;
    };

    let chapter_map;

    function Setting(name, contexts) {
        this.name = name;
        this.contexts = contexts;
    }

    function Chapter(title, setting, characters, objects) {
        this.title = title;
        this.setting = setting;
        this.characters = characters;
        this.objects = objects || [];
        this.find_participants_for_character = find_participants_for_character;
    }

    function Character(name, owner_chapters, owned_objects, actions, contexts, first_chapter_appearance) {
        this.name = name;
        this.owner_chapters = owner_chapters;
        this.owned_objects = owned_objects || [];
        this.actions = actions || {};   // map of arrays based on chapter
        this.contexts = contexts || {}; // map of chapter_title to list of contexts
        this.current_participant = null;
        this.active_chapter = first_chapter_appearance;
    }


    function Action(description, change_character_and_object, priority) {
        this.description = description;
        this.change_character_and_object = change_character_and_object;
        this.priority = priority;
    }

//     var Action = function (description) {
//         this.description = description;
//     };
//
// //possible prototype based action
//     Action.prototype.repercussions = function () {
//         console.log('These are the repercussions of each subAction');
//     };
//
//     var give_Harry_bottle = function () {
//         Action.call(this, value);
//         this.description = "Give Harry a potion bottle";
//     };

    function Object(name, owner, first_chapter_appearance) {
        this.name = name;
        this.owner = owner || null;
        this.active_chapter = first_chapter_appearance;
    }

    let find_participants_for_chapter = function (setting) {
        // query database
    };

    let find_participants_for_character = function (character, chapter) {
        var setting = new Setting(character.context[chapter]);
        // query database
    };

    let update_character_context = function (character, chapter, contexts) {

        var chapter_title = chapter.title;

        // add chapter-specific context
        character.contexts[chapter_title] += chapter.setting.contexts;
        // add character-specific context for this chapter
        character.contexts[chapter_title] += " || " + contexts;
    };

    let add_action_to_character = function (character, chapter, action) {
        character.actions[chapter.title].push(action);
    };

// create narrative here
    chapter_map = {"1": "2A"};

// create setting
    var Common_Room = new Setting("Common Room", "inside_a_building || in_a_school_building");
    var Bedroom = new Setting("Bedroom", "inside_a_building || in_a_dorm");

// create character
    var bottle = new Object("bottle", "hermione", "1");
    var health = new Object("health", "ron", "2B");
// name, chapters, objects, actions, contexts, first appearance
    var actions_struct = {"1" : [], "2A" : [], "2B" : []};
    var contexts_struct = {"1" : "", "2A" : "", "2B" : ""};
    var harry = new Character("harry", ["1", "2A"], [],
        actions_struct, contexts_struct, "1");
    var ron = new Character("ron", ["2B"], [],
        actions_struct, contexts_struct, "2B");
    var hermione = new Character("hermione", ["1", "2B"], [],
        actions_struct, contexts_struct, "1");


// create chapter
    var chapter_one = new Chapter("1", Common_Room, [harry, hermione], [bottle]);
    var chapter_twoA = new Chapter("2A", Bedroom, [harry], [bottle]);
    var chapter_twoB = new Chapter("2B", Common_Room, [harry, ron, hermione], [bottle]);

// update context
    update_character_context(harry, chapter_one, "sitting_by_table");
    update_character_context(harry, chapter_twoA, "sitting_by_bed");
    update_character_context(hermione, chapter_one, "has_a_bottle");
    update_character_context(ron, chapter_twoB, "sitting_by_table");

// update action
    let a1_give_harry_bottle = function () {
        bottle.owner = "harry";
        harry.owned_objects.push(bottle);
    };

    let a1_take_potion_to_bed = function () {
        update_chapter_map("1", "2");
    };

    let a1_leave_potion_on_table = function () {
        bottle.owner = null;
        harry.owned_objects.remove(bottle);
        update_chapter_map("1", "2B");
    };

    let a2_leave_bedroom = function () {
        bottle.owner = null;
        harry.owned_objects.remove(bottle);
    };

    let a2B_drink_potion_bottle = function () {
        health.owner = null;
        ron.owned_objects.remove(health);
    };

    let a2B_rush_ron_outside = function () {
        hermione.active_chapter = "3B";
        ron.active_chapter = "3B";
    };

    let a2B_take_potion_to_class = function () {
        bottle.owner = "harry";
        harry.owned_objects.push(bottle);
    };


    add_action_to_character(harry, chapter_one, new Action("Take potion bottle with him to bed", a1_take_potion_to_bed, 1));
    add_action_to_character(harry, chapter_one, new Action("Leave potion bottle on table", a1_leave_potion_on_table, 1));
    add_action_to_character(harry, chapter_twoA, new Action("Leave the bedroom", a2_leave_bedroom, 0));
    add_action_to_character(harry, chapter_twoB, new Action("Takes potion bottle with him to class", a2B_take_potion_to_class, 2));

    add_action_to_character(ron, chapter_twoB, new Action("Drinks out of potion bottle", a2B_drink_potion_bottle, 0));

    add_action_to_character(hermione, chapter_one, new Action("Give Harry a portion bottle", a1_give_harry_bottle, 0));
    add_action_to_character(hermione, chapter_twoB, new Action("Rush Ron outside", a2B_rush_ron_outside, 1));
}

writeNarrative();

// // end goal
// function convertChapterToExperience(chapter) {
//   //need a way to keep number of already completed actions
//   let number_of_actions_done = 0;
//
//   let places = [];
//
//   for each (detector in chapter.setting.contexts) { //detectors of the chapter's setting
//     places.push(detector);
//   }
//   let detectorIds = [
//   "F8YqP3AEbyguQMJ9i",
//   "ueBZrF5mCRrcFBc8g",
//   "yxQP8QrCdAWakjMaY",
//   "DPxfkTQQFggzNJBXD"
//   ];
//   let i = 0;
//   _.forEach(places, place => {
//     let newVars = JSON.parse(
//       JSON.stringify(CONSTANTS.DETECTORS[place]["variables"])
//       );
//     newVars.push("var participatedInPotterNarrative" + chapter.title + ";");
//
//     let det = {
//       _id: detectorIds[i],
//       description:
//       CONSTANTS.DETECTORS[place].description + "_PotterNarrative" + chapter.title,
//       variables: newVars,
//       rules: [
//       "(" +
//       CONSTANTS.DETECTORS[place].rules[0] +
//       " ) && !participatedInPotterNarrative" + chapter.title + ";"
//       ]
//     };
//     Detectors.insert(det);
//
//     i++;
//   });
//
//   let chapterActions = []; //total list of actions that will be completed in the chapter
//
//   for each (character in chapter.characters) {
//     for each (action in character.actions) {
//       //action[0] is the action itself, action[1] is the chapter it refers to
//        if (action[1] == chapter) //check if the action is in the chapter
//           chapterActions.push([action[0].description, "F8YqP3AEbyguQMJ9i", action[0].priority])
//         /* var newNeed = {
//           needName: action.description,
//           situation {
//             detector: character.contexts[chapter],
//             number: 1
//           },
//           toPass {
//             instruction: action.description
//           },
//           numberNeeded: 1
//         }
//         exp.contributionTypes += newNeed;
//         */
//       }
//   }
//
//   //find the min priority
//   let first_action = chapterActions[0];
//   let max_actions_allowed = 0;
//   for each (action in chapterActions) {
//     if action[2] < first_action.priority {
//       first_action = action;
//     }
//     if action[2] > max_actions_allowed {
//       max_actions_allowed = action[2];
//     }
//   }
//
//
//   chapterActions = chapterActions.filter(function(x) {
//       return x[2] == number_of_actions_done;
//     });
//
//   let sendNotification = function(sub) {
//     let uids = Submissions.find({ iid: sub.iid }).fetch().map(function(x) {
//       return x.uid;
//     });
//     notify(
//       uids,
//       sub.iid,
//       "Chapter 1 is complete. Find out what happened here!",
//       "",
//       "/apicustomresults/" + sub.iid + "/" + sub.eid
//       );
//   };
//
//   let exp = {
//     _id: Random.id(),
//     name: chapter.title,
//     resultsTemplate: "scavengerHunt",
//     contributionTypes: [
//       needName: first_action.description, //should be the title of the action
//       situation: { detector: "F8YqP3AEbyguQMJ9i", number: "1"},
//       toPass: {
//         instruction: first_action.description,
//         firstSentence: chapter.title,
//         dropdownChoices: {
//           name: "affordance",
//           options: chapterActions
//         }
//       },
//       numberNeeded: 1
//     ],
//     description: chapter.title,
//     notificationText: "A new chapter has begun: " + chapter.title,
//     callbacks: [
//     {
//       trigger: "cb.newSubmission() && (cb.numberOfSubmissions() < " + max_actions_allowed + ")",
//       function: storytimeCallback.toString()
//     },
//     {
//       trigger: "cb.incidentFinished()",
//       function: sendNotification.toString() //start the next chapter
//     }
//     ]
//   };
//
//   /* old method
//   for each (character in chapter.characters) {
//       for each (action in character.actions) {
//         var newNeed = {
//           needName: action.description,
//           situation {
//             detector: character.contexts[chapter],
//             number: 1
//           },
//           toPass {
//             instruction: action.description
//           },
//           numberNeeded: 1
//         }
//         exp.contributionTypes += newNeed;
//       }
//   } */
//
//   let storytimeCallback = function(sub) {
//     Meteor.users.update(
//     {
//       _id: sub.uid
//     },
//     {
//       $set: {
//        "profile.staticAffordances.participatedInPotterNarrative" + chapter.title: true
//       }
//     }
//     );
//
//     number_of_actions_done += 1; //an action  has now been performed
//
//     let affordance = sub.content.affordance;//not sure if this is still needed
//
//     let options = chapterActions; //takes the list of actions within the chapter
//
//     options = options.filter(function(x) { //filters out all the actions that cannot be done at the moment
//       return x[2] == number_of_actions_done;
//     });
//
//     let needName = "Action" + Random.id(3); //which action in the chapter is being completed
//     if (cb.numberOfSubmissions() === 2) {
//       needName = "pageFinal";
//     }
//     let contribution = {
//       needName: needName,
//       situation: { detector: affordance, number: "1" },
//       toPass: {
//         instruction: sub.content.sentence, //what is this?
//         dropdownChoices: { name: "affordance", options: options }
//       },
//       numberNeeded: 1
//     };
//     addContribution(sub.iid, contribution);
//   };
//
//   Experiences.insert(exp);
//   let incident = createIncidentFromExperience(exp);
//   startRunningIncident(incident);
// }