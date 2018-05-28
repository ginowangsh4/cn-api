// function stage (stage_number) {
//     this.stage_number = stage_number;
//     this.prev_stage = stage_number - 1;
//     this.next_stage = stage_number + 1;
//     this.chapters = [];
//     this.chapter_map = {};
// }
//
// function setting (name, detectors) {
// 		this.name = name;
// 		this.context = function (detectors) {
// 			for each (detector in detectors) {
// 				this.context += detector;
// 			}
// 		}
// }
//
// function chapter (title, stage_number, setting, characters, objects, transition) {
// 	this.title = title;
// 	this.setting = setting;
// 	this.objects = objects;
// 	this.characters = function(characters) {
// 		for each (character in characters)
// 			this.characters += character;
// 	}
// 	this.transition = transition;
// 	this.addToStage = function (stage_number, chapter) {
// 		findStage(stage_number).addChapterToStage(this);
// 	}
// }
//
// function character (name, chapters, objects, list_of_actions, chapter_specific_context) {
// 	this.name = name;
// 	this.chapters = chapters;
// 	this.objects = objects;
// 	this.list_of_actions = list_of_actions;
// 	this.current_participant // figure out later
// 	this.addContexts = function (chapters) {
// 		for each (chapter in chapters) {
// 			this.chapter_contexts[chapter] = chapter.setting.context + chapter_specific_context[chapter];
// 		}
// 	}
// 	this.performAction = function (action) {
// 		//do later
// 	}
// }
//
// function action (description, characters, objects) {
// 	//how the fuck do you make this specific
// }
//
//
// function object (name, owners, first_chapter_appearance) {
// 	this.name = name;
// 	this.owners = owners;
// 	this.active_chapter = first_chapter_appearance;
// 	this.change_chapter = function() {
// 		//changes the object to have another active chapter
// 	}
// }
//
// function addToStage (stage_number, chapter) { //called in make new chapter
// 	findStage(stage_number).addChapterToStage(chapter);
// }
//
// function makeNewChapter ()
