function extractBtnClicked() {
  //take screenshot
  chrome.tabs.captureVisibleTab(null, {}, function (image) {
    chrome.storage.local.set({"screenshot": image});
    
    //open new tab
    chrome.tabs.create({ url: 'page/extract.html' });
  });
}

//add/remove animated class on mouse event
function particlesAnimation(e){
  let divClassList = e.target.parentNode.querySelector(".particles").classList;
  
  if (divClassList.contains('animated')) {
    divClassList.remove("animated");
  } else {
    divClassList.add("animated");
  }
}

window.onload = () => {
  var extractButton = document.getElementById("extractBtn");
  extractButton.addEventListener("mouseenter", particlesAnimation);
  extractButton.addEventListener("mouseleave", particlesAnimation);
  extractButton.addEventListener("click", extractBtnClicked)
}