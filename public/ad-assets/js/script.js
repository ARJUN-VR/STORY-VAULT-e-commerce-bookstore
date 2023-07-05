$(document).ready(function() {
    let images = $('#slideshow img');
    let currentIndex = 0;
    let interval = setInterval(changeImage, 3000);
  
    function changeImage() {
      $(images[currentIndex]).removeClass('active');
      currentIndex = (currentIndex + 1) % images.length;
      $(images[currentIndex]).addClass('active');
    }
  });
  