exports.handler = function(context, event, callback) {
  // make sure you enable ACCOUNT_SID and AUTH_TOKEN in Functions/Configuration
  const ACCOUNT_SID = context.ACCOUNT_SID;

  const SERVICE_SID = context.SYNC_SERVICE_SID;
  const API_KEY = context.TWILIO_API_KEY;
  const API_SECRET = context.TWILIO_API_SECRET;

  // REMINDER: This identity is only for prototyping purposes
  const IDENTITY = "only for testing";

  const AccessToken = Twilio.jwt.AccessToken;
  const SyncGrant = AccessToken.SyncGrant;

  const syncGrant = new SyncGrant({
    serviceSid: SERVICE_SID
  });

  const accessToken = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);

  accessToken.addGrant(syncGrant);
  accessToken.identity = IDENTITY;

  let token = accessToken.toJwt();
  console.log(token);

  let response = new Twilio.Response();
  let headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  response.setHeaders(headers);

  response.setBody({
    token: token
  });

  callback(null, response);
};
