//take screenshot
chrome.tabs.captureVisibleTab(null, {}, function (image) {
  chrome.storage.local.set({ "screenshot": image });

  //open new tab
  chrome.tabs.create({ url: 'page/extract.html' });
});