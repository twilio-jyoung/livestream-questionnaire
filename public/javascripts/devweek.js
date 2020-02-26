var responseCount = 0;

var syncClient;
$.getJSON("https://wenge-squirrel-9758.twil.io/sync-token", function(tokenResponse) {
  syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: "info" });
  syncClient.on("connectionStateChanged", function(state) {
    //- console.log("SYNC CONNECTION STATUS CHANGE: ", state);
    $("#connection_status").html(`<span><span>${state}</span>: <i class='fa fa-refresh fa-spin' style='color: green'></i></span>`);
  });

  syncClient
    .map("MP4aeeb8e1f7d9465db44a447f1ce5b4e0")
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
    if (data.destination) {
      country.aggregate(data.destination);
    } else if (data.influencer_company) {
      influencer_company.aggregate(data.influencer_company);
    } else if (data.influencer_person) {
      influencer_person.aggregate(data.influencer_person);
    } else if (data.channel_preference) {
      channel_preference.aggregate(data.channel_preference);
    }
  } else {
    // we want to add as many questions as are answered
    if (data.channel_preference) {
      channel_preference.aggregate(data.channel_preference);
    }
    if (data.influencer_person) {
      influencer_person.aggregate(data.influencer_person);
    }
    if (data.influencer_company) {
      influencer_company.aggregate(data.influencer_company);
    }
    if (data.destination) {
      country.aggregate(data.destination);
    }
  }

  // spaces_v_tabs.aggregate(data.spaces_v_tabs);
  // influencer_person.aggregate(data.influencer_person);
  // influencer_company.aggregate(data.influencer_company);
  // country.aggregate(data.country);
}
