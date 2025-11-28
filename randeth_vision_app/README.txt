Randeth Vision App
===================

Files:
- index.html : Web UI
- script.js  : Filter logic and camera/image handling

How to use:
1. Open index.html in a modern browser (Chrome, Firefox, Edge).
   If you are developing in VSCode, you can use the Live Server extension to serve the file.
2. Upload an image via the file picker OR click 'Start Camera' to enable the webcam feed.
3. Adjust sliders:
   - Green Retention: how much green increases perceived brightness
   - Green Flatten: compress green shades so they are indistinguishable
   - Force Merge Greens: force green-dominant pixels into a single brightness band
   - Brightness Boost: boosts bioluminescent-like greens
4. Click 'Download Result' to save a PNG of the current canvas.

Notes:
This simulates your worldbuilding: Randeths see mostly grayscale, with limited ability to detect green as brightness.
