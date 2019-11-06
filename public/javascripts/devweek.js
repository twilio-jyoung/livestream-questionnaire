var responseCount = 0;

var syncClient;
$.getJSON("https://wenge-squirrel-9758.twil.io/sync-token", function(tokenResponse) {
  syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: "info" });
  syncClient.on("connectionStateChanged", function(state) {
    //- console.log("SYNC CONNECTION STATUS CHANGE: ", state);
    $("#connection_status").html(`<span><span>${state}</span>: <i class='fa fa-refresh fa-spin' style='color: green'></i></span>`);
  });

  syncClient
    .map("MPf88eb40724c74f56b4624c488654ffbb")
    .then(function(map) {
      // console.log("map opened successfully");

      // iterate through all pages of the map (50 items each) and aggregate answers
      var pageHandler = function(paginator) {
        responseCount = paginator.items.length;
        console.log(`Response Count: ${responseCount} @ Page Load`);

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
        responseCount++;
        console.log(`Response Count: ${responseCount}.  Item Added - `, args.item.value);
        aggregateData(args.item.value);
      });
    })
    .catch(function(error) {
      console.log("Unexpected error", error);
    });
});

var map_country = new Map();

function aggregateData(data) {
  spaces_v_tabs.aggregate(data.spaces_v_tabs);
  influencer_person.aggregate(data.influencer_person);
  influencer_company.aggregate(data.influencer_company);
  country.aggregate(data.country);
}
