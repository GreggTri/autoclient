const sendToMixpanel = async (
    eventName: string,
    eventProperties?: Record<string, any>
  ) => {
  
  //this part of code handles getting the UTM parameters that we can't get by default server side
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: urlParams.get("utm_source") || undefined,
      utm_medium: urlParams.get("utm_medium") || undefined,
      utm_campaign: urlParams.get("utm_campaign") || undefined,
      utm_term: urlParams.get("utm_term") || undefined,
      utm_content: urlParams.get("utm_content") || undefined,
      id: urlParams.get("id") || undefined,
    };
  
  //In my application I'm not authenticating users, so here I'm using uuid library to assign a random id that I will assign to users based on their session, if you are authenticating users you will have to do some additional steps
  //More info here: https://docs.mixpanel.com/docs/tracking-methods/id-management/identifying-users
  
  function getUser() {

    //TODO:: get from auth session that we have

    let userUUID = localStorage.getItem("userUUID");
    if (!userUUID) {
        userUUID = uuidv4();
        localStorage.setItem("userUUID", userUUID);
    }
    return userUUID;
}
    const userUUID = getUserUUID();
  
  //Here we are including additional data that will be sent to Mixpanel like device information, UTM parameters and location
    const additionalProperties = {
      distinct_id: userUUID,
      $user_id: userUUID,
      $browser: navigator.userAgent,
      $browser_version: navigator.appVersion,
      $current_url: window.location.href,
      $device: navigator.platform,
      $device_id: navigator.userAgent,
      $initial_referrer: document.referrer ? document.referrer : undefined,
      $initial_referring_domain: document.referrer
        ? new URL(document.referrer).hostname
        : undefined,
      $os: navigator.platform,
      $screen_height: window.screen.height,
      $screen_width: window.screen.width,
      ...utmParams,
    };
    const properties = {
      ...eventProperties,
      ...additionalProperties,
    };
  //Finally we are calling the mixpanel api route
    fetch("/api/mixpanel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventName,
        properties: properties,
      }),
    });
  };
  
  export default sendToMixpanel;