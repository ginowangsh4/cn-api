let stage = {
	// stage number
	stage_number : 2
	// chapters in this stage
	chapters : []
	// progression of the stages
	prev_stage : 1
	next_stage : 3
	// progression rule of the chapters
	chapter_map : { B : D;
						 B : E;
						 C : E;
						 // example ... other chapter relationships
						}
}

var chapter = {
	// list of stage it belongs to
	stages : []
	// context of the chapter
	setting : setting
	// list of characters it contains
	characters : []
	// list of objects it contains
	objects : []

	// chapter number 
	chapter_number : 2
	// next chapter as determined by character actions taken 
	next_chapter : 2

	// optional
	transition : transition

	// static affordance for participants
	// find all participants for chapter
	find_participants_for_chapter : function(setting) {}
	// find participants for each character
	find_participants_for_character : function(character.context.chapter_number) {}

	// at the end of chapter, do things based on narrative-specific character attributes
	charater_modifier : function(character[]) {}
	// at the end of chapter, do things based on narrative-specific object attributes
	object_modifier : function (object[]) {}
}

var character = {
	// list of chapters this character appears
	owner_chapters : []
	// list of objects owned by this character (at any time in narrative)
	owned_objects  : []

	// soon-to-be current chapter
	chapter_number : 2

	// context for a character is different in different chapters
	context : {
					chapter_number : {
						context : context
					}
					// ... and more of this struct
				 }

	// action for a character is different in different chapters
	// an action can change next chapter, character representation and object representation
	action :  {
					chapter_number : {
						action_description  : ""
						change_next_chapter : function(chapter_number, next_chapter_number){}
						change_character    : function(character[], next_chapter_number) {}
						change_object       : function(object[], next_chapter_number) {}
					}
					// ... and more of this struct
			 	 }

	// current participant, not sure if needed
	current_participant : participant
}

var object = {
	// name of object, like a super potion
	name : ""
	// list of owners, mutable
	owner_characters : []
	// soon-to-be current chapter
	chapter_number : 2
}

var setting = {
	context
}

var context = {
	location
	time
	weather
	day
	// ... other stuff
}

var transition = {
	end_chapter
	end_chapter.character
	begin_chapter.character
	object
}

var participant = {
	context
}
