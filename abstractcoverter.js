function convertChapterToExperience(chapter) {
  //need a way to keep number of already completed actions 
  let number_of_actions_done = 0;

  let places = [];

  for each (detector in chapter.setting.contexts) { //detectors of the chapter's setting
    places.push(detector);
  }
  let detectorIds = [
  "F8YqP3AEbyguQMJ9i",
  "ueBZrF5mCRrcFBc8g",
  "yxQP8QrCdAWakjMaY",
  "DPxfkTQQFggzNJBXD"
  ];
  let i = 0;
  _.forEach(places, place => {
    let newVars = JSON.parse(
      JSON.stringify(CONSTANTS.DETECTORS[place]["variables"])
      );
    newVars.push("var participatedInPotterNarrative" + chapter.title + ";");

    let det = {
      _id: detectorIds[i],
      description:
      CONSTANTS.DETECTORS[place].description + "_PotterNarrative" + chapter.title,
      variables: newVars,
      rules: [
      "(" +
      CONSTANTS.DETECTORS[place].rules[0] +
      " ) && !participatedInPotterNarrative" + chapter.title + ";"
      ]
    };
    Detectors.insert(det);

    i++;
  });

  let chapterActions = []; //total list of actions that will be completed in the chapter

  for each (character in chapter.characters) {
    for each (action in character.actions[chapter.title]) {
          chapterActions.push([action.description, "F8YqP3AEbyguQMJ9i", action.priority])
        /* var newNeed = {
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
        */
      }
  }

  //find the min priority
  let first_action = chapterActions[0];
  let max_actions_allowed = 0;
  for each (action in chapterActions) {
    if action.priority < first_action.priority {
      first_action = action;
    }
    if action.priority > max_actions_allowed {
      max_actions_allowed = action.priority;
    }
  }


  chapterActions = chapterActions.filter(function(x) {
      return x[2] == number_of_actions_done;
    });

  let sendNotification = function(sub) {
    let uids = Submissions.find({ iid: sub.iid }).fetch().map(function(x) {
      return x.uid;
    });
    notify(
      uids,
      sub.iid,
      "Chapter 1 is complete. Find out what happened here!",
      "",
      "/apicustomresults/" + sub.iid + "/" + sub.eid
      );
  };

  let exp = {
    _id: Random.id(),
    name: chapter.title,
    resultsTemplate: "scavengerHunt",
    contributionTypes: [  
      needName: first_action.description, //should be the title of the action
      situation: { detector: "F8YqP3AEbyguQMJ9i", number: "1"},
      toPass: {
        instruction: first_action.description,
        firstSentence: chapter.title,
        dropdownChoices: {
          name: "affordance",
          options: chapterActions
        }
      },
      numberNeeded: 1
    ],
    description: chapter.title,
    notificationText: "A new chapter has begun: " + chapter.title,
    callbacks: [ 
    {
      trigger: "cb.newSubmission() && (cb.numberOfSubmissions() < " + max_actions_allowed + ")",
      function: storytimeCallback.toString()
    },
    {
      trigger: "cb.incidentFinished()",
      function: sendNotification.toString() //start the next chapter
    }
    ]
  };

  /* old method
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
  } */

  let storytimeCallback = function(sub) {
    Meteor.users.update(
    {
      _id: sub.uid
    },
    {
      $set: {
       "profile.staticAffordances.participatedInPotterNarrative" + chapter.title: true
      }
    }
    );

    number_of_actions_done += 1; //an action  has now been performed

    let affordance = sub.content.affordance;//not sure if this is still needed

    let options = chapterActions; //takes the list of actions within the chapter 

    options = options.filter(function(x) { //filters out all the actions that cannot be done at the moment
      return x[2] == number_of_actions_done;
    });

    let needName = "Action" + Random.id(3); //which action in the chapter is being completed 
    if (cb.numberOfSubmissions() === 2) {
      needName = "pageFinal";
    }
    let contribution = {
      needName: needName,
      situation: { detector: affordance, number: "1" },
      toPass: {
        instruction: sub.content.sentence, //what is this?
        dropdownChoices: { name: "affordance", options: options }
      },
      numberNeeded: 1
    };
    addContribution(sub.iid, contribution);
  };

  Experiences.insert(exp);
  let incident = createIncidentFromExperience(exp);
  startRunningIncident(incident);
}