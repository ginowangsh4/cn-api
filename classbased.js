class stage {
  constructor(stage_number) {
    this.stage_number = stage_number;
    this.prev_stage = stage_number - 1;
    this.next_stage = stage_number + 1;
    this.chapters = [];
    this.chapter_map = {};
  }
}

class setting {
	constructor(name, detectors) {
		this.name = name;
		this.context = function (detectors) {
			for each (detector in detectors) {
				context += detector;
			}
			return context;
		} 
	}
}

class chapter {
	constructor(title, stage, setting, characters, objects, transition) {
		this.title = title;
		this.setting = setting;
		for each (character in characters) {
			this.characters += character;
		} 
	}
}