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
       "profile.staticAffordances.participatedInPotterNarrativeChapterOne": true
      }
    }
    );

    let affordance = sub.content.affordance;
    number_of_actions_done += 1;

    let options = [
    ["Give Harry a potion bottle", "F8YqP3AEbyguQMJ9i", 0]
    ["Take potion bottle with you to bed", "F8YqP3AEbyguQMJ9i", 1], //fix detector IDs
    ["Leave potion bottle on the table", "F8YqP3AEbyguQMJ9i", 1]
    ];

    options = options.filter(function(x) {
      return x[2] == number_of_actions_done;
    });

    let needName = "Harry's action" + Random.id(3);
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
    newVars.push("var participatedInPotterNarrativeChapterOne;");

    let det = {
      _id: detectorIds[i],
      description:
      CONSTANTS.DETECTORS[place].description + "_PotterNarrativeChapterOne",
      variables: newVars,
      rules: [
      "(" +
      CONSTANTS.DETECTORS[place].rules[0] +
      " ) && !participatedInPotterNarrativeChapterOne;"
      ]
    };
    Detectors.insert(det);

    i++;
  });

  let dropdownOptions = [
   ["Give Harry a potion bottle", "F8YqP3AEbyguQMJ9i", 0]
    ["Take potion bottle with you to bed", "F8YqP3AEbyguQMJ9i", 1], //fix detector IDs
    ["Leave potion bottle on the table", "F8YqP3AEbyguQMJ9i", 1]
  ];

  dropdownOptions = dropdownOptions.filter(function(x) {
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
      needName: a1_give_harry_bottle,
      situation: { detector: "a1_give_harry_bottle.detector", number: "1"},
      toPass: {
        instruction: hermione.actions[0].description,
        firstSentence: "Harry is making a potion for his homework assignment when he realizes that he's all out of potion bottles.",
        dropdownChoices: {
          name: "affordance",
          options: dropdownOptions
        }
      },
      numberNeeded: 1
    ],
    description: chapter.title,
    notificationText: "A new chapter has begun: " + chapter.title,
    callbacks: [ //don't understand 
    {
      trigger: "cb.newSubmission() && (cb.numberOfSubmissions() < 2)",
      function: storytimeCallback.toString()
    },
    {
      trigger: "cb.incidentFinished()",
      function: sendNotification.toString()
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