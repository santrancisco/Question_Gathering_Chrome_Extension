console.log("background script is executing!");

chrome.commands.onCommand.addListener(function(command) {
  console.log('onCommand event received for message: ', command);
  if (command == "additem") {
     additem();
  }
});


function additem(){
  console.log("Add item pressed")
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    chrome.storage.local.get("currentquestion",function(result){
    var question = ""
    if (typeof result.currentquestion !== "undefined") {
      question = result.currentquestion;
    }
    if (question === "") {
      chrome.storage.local.set({"currentquestion":selection[0]},function(){
        console.log("Added question "+selection[0]);
      });
      return
    }
    var obj = {};
    answer = selection[0];
    obj[question] = answer;
    chrome.storage.local.set(obj,function(){
      console.log("Added answer "+answer);
      chrome.storage.local.set({"currentquestion":""},function(){});
      chrome.storage.local.set({"lastquestion":question},function(){});
    });


    });


  });
  chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
});
}

console.log("background script finished loading");