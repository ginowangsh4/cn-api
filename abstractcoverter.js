function convertChapterToExperience(chapter) {
  //need a way to keep number of already actions 
  let number_of_actions_done = 0;
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

    let affordance = sub.content.affordance;
    number_of_actions_done += 1;

    let options = chapterActions;

    options = options.filter(function(x) {
      return x[2] == number_of_actions_done;
    });

    let needName = "Action" + Random.id(3);
    if (cb.numberOfSubmissions() === 2) {
      needName = "pageFinal";
    }
    let contribution = {
      needName: needName,
      situation: { detector: affordance, number: "1" },
      toPass: {
        instruction: sub.content.sentence,
        dropdownChoices: { name: "affordance", options: options }
      },
      numberNeeded: 1
    };
    addContribution(sub.iid, contribution);
  };

  let places = [];

  for each (detector in chapter.setting.contexts) {
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

  let chapterActions = [];

  for each (character in chapter.characters) {
    for each (action in character.actions) {

       if (action[1] == chapter) //check if the action is in the chapter
          chapterActions.push([action[0].description, "F8YqP3AEbyguQMJ9i", action[0].priority])
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

  //sort by action priority


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
      needName: chapterActions[0][0], //should be the title of the action
      situation: { detector: "F8YqP3AEbyguQMJ9i", number: "1"},
      toPass: {
        instruction: chapterActions[0][0],
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
      trigger: "cb.newSubmission() && (cb.numberOfSubmissions() < 2)",
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

  Experiences.insert(exp);
  let incident = createIncidentFromExperience(exp);
  startRunningIncident(incident);
}