// Name: Livestream Questionnaire
// Path: /livestream_questionnaire
// Check for valid Twilio signature: CHECKED!

exports.handler = function (context, event, callback) {
  const twilioClient = context.getTwilioClient();

  let dialogue_sid = event.DialogueSid;

  if (event.Event == "onDialogueStart") {
    // user has started interacting with the bot, create a sync map
    console.log("creating blank sync map item");
    createSyncMap(context, dialogue_sid).then(() => {
      callback(null);
    });
  } else if (event.Event == "onCollectAttempt") {
    // user has answered a question, update the syncmap

    // only submit successful collects into the syncmap
    if (!event.CollectSuccess) callback(null);

    console.log("fetching what should be in the sync map item from the autopilot memory");
    // get everything that should be in the map already that we have to put back in
    let parsed_memory = JSON.parse(event.Memory);
    let map_item_data = getDataForMap(parsed_memory);

    console.log("appending new data");
    // append the new data
    map_item_data[event.CollectFieldName] = event.CollectOutput.toLowerCase();

    // update the map
    updateSyncMap(context, dialogue_sid, map_item_data).then(() => {
      callback(null);
    });
  }
};

function getDataForMap(memory) {
  let completed_answers = {};

  if (memory.twilio.collected_data) {
    let keys = Object.keys(memory.twilio.collected_data.collect_answers.answers);

    for (var i = 0; i < keys.length; i++) {
      completed_answers[keys[i]] = memory.twilio.collected_data.collect_answers.answers[keys[i]].answer.toLowerCase();
    }

    console.log(completed_answers);
  }

  return completed_answers;
}

function createSyncMap(context, dialogue_sid) {
  console.log("updating sync map item");

  var promise = new Promise(function (resolve, reject) {
    twilioClient.sync
      .services(context.SYNC_SERVICE_SID)
      .syncMaps(context.SYNC_MAP_TTDALLAS2020)
      .syncMapItems.create({
        key: dialogue_sid,
        itemTtl: 300,
        data: {},
      })
      .then((sync_map_item) => {
        console.log(sync_map_item.key);
        resolve(sync_map_item.key);
      });
  });
  return promise;
}

function updateSyncMap(context, dialogue_sid, data) {
  console.log("updating sync map item");

  var promise = new Promise(function (resolve, reject) {
    twilioClient.sync
      .services(context.SYNC_SERVICE_SID)
      .syncMaps(context.SYNC_MAP_TTDALLAS2020)
      .syncMapItems(dialogue_sid)
      .update({
        data: data,
      })
      .then((sync_map_item) => {
        console.log(sync_map_item.key);
        resolve(sync_map_item.key);
      });
  });
  return promise;
}
