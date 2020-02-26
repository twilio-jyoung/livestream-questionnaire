var responseCount = 0;

var syncClient;
$.getJSON("https://wenge-squirrel-9758.twil.io/sync-token", function(tokenResponse) {
  syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: "info" });
  syncClient.on("connectionStateChanged", function(state) {
    //- console.log("SYNC CONNECTION STATUS CHANGE: ", state);
    $("#connection_status").html(`<span><span>${state}</span>: <i class='fa fa-refresh fa-spin' style='color: green'></i></span>`);
  });

  syncClient
    .map("MPc483cbc25d1e41b7b6da376047ff2002")
    .then(function(map) {
      // console.log("map opened successfully");

      // iterate through all pages of the map (50 items each) and aggregate answers
      var pageHandler = function(paginator) {
        responseCount = paginator.items.length;
        // console.log(`Response Count: ${responseCount} @ Page Load`);
        $("#participant_count").html(`<span>Participants: ${responseCount}</span>`);

        paginator.items.forEach(function(item) {
          // this is where the magic happens.
          // console.log(item.value);
          aggregateData(item.value);
        });
        return paginator.hasNextPage ? paginator.nextPage().then(pageHandler) : null;
      };
      map
        .getItems()
        .then(pageHandler)
        .catch(function(error) {
          console.error("Map getItems() failed", error);
        });

      // subscribe to updates to show realtime event streams
      map.on("itemAdded", function(args) {
        // console.log("itemAdded");
        responseCount++;
        console.log(`Response Count: ${responseCount}.  Item Added - `, args.item.value);
        $("#participant_count").html(`<span>Participants: ${responseCount}</span>`);
        aggregateData(args.item.value);
      });

      map.on("itemUpdated", function(args) {
        // console.log("item_updated");
        aggregateData(args.item.value, true);
      });
    })
    .catch(function(error) {
      console.log("Unexpected error", error);
    });
});

var map_country = new Map();

function aggregateData(data, isUpdate = false) {
  if (isUpdate) {
    // we only want to update the most recent answers, not re-aggregate answers already accounted for in previous updates, so this is a bit weird...
    if (data.question_4) {
      country.aggregate(data.question_4);
    } else if (data.question_3) {
      influencer_company.aggregate(data.question_3);
    } else if (data.question_2) {
      influencer_person.aggregate(data.question_2);
    } else if (data.question_1) {
      channel_preference.aggregate(data.question_1);
    }
  } else {
    // we want to add as many questions as are answered
    if (data.question_1) {
      channel_preference.aggregate(data.question_1);
    }
    if (data.question_2) {
      influencer_person.aggregate(data.question_2);
    }
    if (data.question_3) {
      influencer_company.aggregate(data.question_3);
    }
    if (data.question_4) {
      country.aggregate(data.question_4);
    }
  }

  // spaces_v_tabs.aggregate(data.spaces_v_tabs);
  // influencer_person.aggregate(data.influencer_person);
  // influencer_company.aggregate(data.influencer_company);
  // country.aggregate(data.country);
}
