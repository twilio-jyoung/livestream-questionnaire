exports.handler = function(context, event, callback) {
  let responseObject = {};

  let parsed_memory = JSON.parse(event.Memory);

  let spaces_v_tabs = getAnswer(parsed_memory, "spaces_v_tabs");
  let influencer_person = getAnswer(parsed_memory, "influencer_person");
  let influencer_company = getAnswer(parsed_memory, "influencer_company");
  let country = getAnswer(parsed_memory, "country");

  const twilioClient = context.getTwilioClient();
  twilioClient.sync
    .services(context.SYNC_SERVICE_SID)
    .syncMaps(context.SYNC_MAP_QUESTIONS)
    .syncMapItems.create({
      key: event.DialogueSid,
      data: {
        spaces_v_tabs: spaces_v_tabs,
        influencer_person: influencer_person,
        influencer_company: influencer_company,
        country: country
      }
    })
    .then(sync_map_item => {
      responseObject = {
        "actions": [
          {
            say: "Thanks for participating!  Check the screen to see audience results! You can hangup now or say Goodbye"
          },
          {
            listen: true
          }
        ]
      };
      callback(null, responseObject);
      console.log(sync_map_item.key);
    });
};

function getAnswer(memory, question) {
  let path = `twilio.collected_data.collect_developer_questions.answers.${question}.answer`;

  let _ = require("lodash");
  var result = _.get(memory, path)
    .toLowerCase()
    .trim();

  console.log(`${question}: `, result);
  return result;
}
