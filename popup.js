// Getting selected text
// https://stackoverflow.com/questions/20607108/cant-return-selected-text-on-chrome-extension

/* The function that finds and returns the selected text */
//var funcToInject = function() {
//    var selection = window.getSelection();
//    return (selection.rangeCount > 0) ? selection.toString() : '';
//};


function log (text) {
  chrome.extension.getBackgroundPage().console.log(text)
}

log("Executing popup script!");

function renderLastQuestion (lastquestion) {
	  document.getElementById('lastquestion').textContent = lastquestion;
}

function renderCurrentQuestion (question) {
  document.getElementById('currentquestion').textContent = question;
}


// Render last question
chrome.storage.local.get("lastquestion",function(value){renderLastQuestion(value.lastquestion)});

// Render current question
chrome.storage.local.get("currentquestion",function(value){renderCurrentQuestion(value.currentquestion)});


function deletelast() {
  chrome.storage.local.get("lastquestion",function(result){
    lastquestion = result.lastquestion
    chrome.storage.local.remove(lastquestion,function(){log("Last question was removed")});
    chrome.storage.local.set({"lastquestion":"DELETED QUESTION"},function(){});
    document.getElementById('lastquestion').textContent = "DELETED QUESTION";
  });
}

function savecurrent() {
  chrome.storage.local.set({"currentquestion":document.getElementById('currentquestion').value},function(){
    log("Modification to currentquestion is saved to local storage");
  });
}

function deletecurrent() {
  chrome.storage.local.get("currentquestion",function(result){
    currentquestion = result.currentquestion
    chrome.storage.local.set({"currentquestion":""},function(){});
  });
}


/* This line converts the above function to string
 * (and makes sure it will be called instantly) */


function exportToFile() {
  log("exporting all questions");
  chrome.storage.local.get(null, function(items) {
    delete items["currentquestion"];
    delete items["lastquestion"];
    var allitems = JSON.stringify(items,null, 2)
    var blob = new Blob([allitems], { type: 'text/plain;charset=utf-8;' });
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.innerHTML="test"
          link.setAttribute("href", url);
          link.setAttribute("download", "questions.txt");
          // link.style.visibility = 'hidden';
          document.body.appendChild(link);
          log("exporting all questions3");
          link.click();
          document.body.removeChild(link);
      }
  });
}

function clearall() {
  if (confirm('Are you sure you want clear all questions in database?')) {
    chrome.storage.local.clear(function(items) {
          log("Cleared all questions");
    });
  } else {
    log("Cancel clearing all questions")
  }

}

document.getElementById('deletelast').addEventListener('click', deletelast);

document.getElementById('savecurrent').addEventListener('click', savecurrent);

document.getElementById('exportToFile').addEventListener('click', exportToFile);

document.getElementById('clearall').addEventListener('click', clearall);