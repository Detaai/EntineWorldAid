// Album data
var albums = [
  {
    name: "Bluma Album",
    cover: "../Bluma-image1.jpg",
    tracks: [
      { title: "Bluma's Plea", src: "Bluma's Plea.mp3" }
    ]
  },
  {
    name: "Gwen Album",
    cover: "../gwen-1.jpg",
    tracks: [
      { title: "Gwen's Lullaby", src: "Gwen's lullaby.mp3" }
    ]
  },
  {
    name: "Randeth Album",
    cover: "../nameplate.jpg",
    tracks: [
      { title: "Echo of the Pines", src: "Echo of the Pines.mp3" }
    ]
  }
];

var current = 0;

function renderAlbumViewer() {
  var album = albums[current];
  var viewer = document.getElementById('album-viewer');
  var html = '';
  html += '<div class="flex flex-col items-center mb-6">';
  html += '<img src="' + album.cover + '" alt="' + album.name + '" class="rounded-xl shadow-lg w-48 h-48 object-cover mb-4">';
  html += '<h2 class="text-xl font-semibold mb-2">' + album.name + '</h2>';
  html += '</div>';
  html += '<div class="w-full">';
  for (var i = 0; i < album.tracks.length; i++) {
    var track = album.tracks[i];
    html += '<div class="flex items-center mb-4">';
    html += '<span class="mr-3">' + track.title + '</span>';
    html += '<audio controls class="album-audio" src="' + encodeURI(track.src) + '"></audio>';
    html += '</div>';
  }
  html += '</div>';
  viewer.innerHTML = html;
  // Single-play logic
  var audios = viewer.querySelectorAll('.album-audio');
  audios.forEach(function(audio) {
    audio.addEventListener('play', function() {
      audios.forEach(function(a) {
        if (a !== audio) { a.pause(); a.currentTime = 0; }
      });
    });
  });
}

function renderCarousel() {
  var track = document.getElementById('carousel-track');
  track.innerHTML = '';
  var N = albums.length;
  var radius = 120;
  var centerX = track.offsetWidth / 2;
  var centerY = 90;
  // Left arrow
  var leftBtn = document.createElement('button');
  leftBtn.className = 'absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 rounded-full p-2 hover:bg-gray-600 z-10';
  leftBtn.innerHTML = '<span class="text-2xl">&#8592;</span>';
  leftBtn.onclick = function() {
    current = (current - 1 + albums.length) % albums.length;
    renderAlbumViewer();
    renderCarousel();
  };
  track.appendChild(leftBtn);
  // Right arrow
  var rightBtn = document.createElement('button');
  rightBtn.className = 'absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 rounded-full p-2 hover:bg-gray-600 z-10';
  rightBtn.innerHTML = '<span class="text-2xl">&#8594;</span>';
  rightBtn.onclick = function() {
    current = (current + 1) % albums.length;
    renderAlbumViewer();
    renderCarousel();
  };
  track.appendChild(rightBtn);
  // Carousel covers
  for (var i = 0; i < albums.length; i++) {
    var album = albums[i];
    var idx = (i - current + N) % N;
    var theta = Math.PI * (0.5 + idx / (N-1));
    var x, y, scale, z;
    if (idx === 0) {
      x = centerX - 64; y = centerY; scale = 1.1; z = 2;
    } else {
      x = centerX + Math.cos(theta) * radius - 48;
      y = centerY - Math.sin(theta) * radius;
      scale = 0.7; z = 1;
    }
    var div = document.createElement('div');
    div.className = 'carousel-album' + (idx === 0 ? ' active' : ' inactive');
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.style.zIndex = z;
    div.style.transform = 'scale(' + scale + ')';
    div.innerHTML = '<img src="' + album.cover + '" alt="' + album.name + '" class="rounded-xl shadow-lg w-24 h-24 object-cover border-4 border-gray-800 cursor-pointer">';
    if (idx !== 0) {
      div.addEventListener('click', (function(i) {
        return function() {
          current = i;
          renderAlbumViewer();
          renderCarousel();
        };
      })(i));
    }
    track.appendChild(div);
  }
}

window.addEventListener('DOMContentLoaded', function() {
  renderAlbumViewer();
  renderCarousel();
});
