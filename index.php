<?php 
  include('assets/header.php');
?>

<div class="intro">
  
  <div class="w3-content w3-section" style="max-width:1024px;">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/snow.jpg" width="100%" height="500px" alt="University of Jordan in snow.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/engineering.jpg" width="100%" height="500px" alt="Faculty of Engineering.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/science.jpg" width="100%" height="500px" alt="Faculty of Science.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/kasit.jpg" width="100%" height="500px" alt="Faculty of IT 'King Abdullah II for Information Technology'.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/kasit2.jpg" width="100%" height="500px"alt="Faculty of IT 'KASIT'.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/night.jpg" width="100%" height="500px"alt="University of Jordan's main gates at night.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/arts.jpg" width="100%" height="500px" alt="Faculty of Arts.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/ju.jpg" width="100%" height="500px" alt="University of Jordan from the sky.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/jusign.jpg" width="100%" height="500px" alt="University of Jordan logo and sign.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/UJ.jpg" width="100%" height="500px" alt="University of Jordan main gates from above.">
  <img class="mySlides w3-animate-fading" src="/images/slideshow/clocktower.jpg" width="100%" height="500px" alt="The famous Clocktower of University of Jordan.">
  </div>
    <script>
      var myIndex = 0;
      carousel();

      function carousel() {
        var i;
        var x = document.getElementsByClassName("mySlides");
        for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";  
        }
        myIndex++;
        if (myIndex > x.length) {myIndex = 1}    
        x[myIndex-1].style.display = "block";  
        setTimeout(carousel, 9000); // Change image every 9 seconds
      }
    </script>
<br />
  <p>Ambeh Team is a website that provides students of the University of Jordan -in specific- and other universities -in general- with all their exam and studying needs such as Test Banks, PDFs, Videos and more. It is now so much easier for them to gather whatever they need from only one place.</p>

</div>


  			<!--Footer menu with facebook and email links-->

<?php 
  include('assets/footer.php');
?>