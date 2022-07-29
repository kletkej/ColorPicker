# ColorPicker
#### Video Demo: https://youtu.be/2qbLVcbBR00
#### Description: 
ColorPicker is a Chrome extension that let's you pick a color from a website (e.g. from pictures). It basically takes a screenshot of the active tab and opens it in a new tab. Now you have the ability to select an area, which will get analysed and which colors get displayed at the bottom of the page, together with the rgb and hex code of each color.

There are some areas that may be improved in the future:

- When selection a new area you have to scroll to the top of the page, otherwise the selected area is different from where your mouse was.
- Because in images, every pixel has a slightly different shade, colors that are almost the same had to be eliminated. Color difference with RGB values is not perfect, it would be better to get the HSL values from all colors and compare them.
- If you select a big area the extension is pretty slow to analyse it's colors. Chrome thinks it crashed.