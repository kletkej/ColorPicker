# ColorPicker
#### Description:
ColorPicker is a Chrome extension that let's you pick a color from a website (e.g. from pictures). It basically takes a screenshot of the active tab and opens it in a new tab. Now you have the ability to select an area, which will get analysed and which colors get displayed at the bottom of the page, together with the rgb and hex code of each color.
<br>
popup.html and popup.js get invoked when you click the extensions icon. Chromes API provides a function to take a screenshot of the active tab ('chrome.tabs.captureVisibleTab'), which is saved to permanent storage. After that we open a new tab.
<br>
extract.html, extract.js and extract.css are used for the new tab. We get the screenshot from storage (with 'chrome.storage.local.get') and afterwards delete it. Now we display the screenshot on the page, where the the user can select an area. The selected area is a div which has a transparent blue color and moves with together with your mouse cursor. The style was inspired by the Windows 10 selection box in the 'File Explorer'. After selecting an area the function 'getProminentColors' is invoked, which extracts the pixels colors, eliminates similar ones sorts them by occurence and then displays them as boxes on the page.
<br>
For styling bootstrap is used, together with a minamal amount of custom css.

#### Known Bugs
There are some areas that may be improved in the future:
- When selection a new area you have to scroll to the top of the page, otherwise the selected area is different from where your mouse was.
- Because in images, every pixel has a slightly different shade, colors that are almost the same have to be eliminated. Calculating the color difference based on RGB values is not perfect, it would be convert them to HSL and then compare them.
- If you select a big area the extension is pretty slow to analyse it's colors. Chrome thinks it crashed.

#### How to install and use the chrome extension
- Download project
- Open Chrome
- Go to chrom://extensions
- Activate 'Developer Mode' in the top right corner
- Click on 'Load unpacked'
- Select the project folder you just downloaded
- You are ready to go!
- Open any website.
- Click the extensions icon (which should be displayed in the top right corner of your window).
- A tab should open with the content of the former tab.
- Select an area on the image (pro tip: select small areas only)
- The colors get shown at the bottom of the page.
