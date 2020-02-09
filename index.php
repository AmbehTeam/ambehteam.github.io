<!DOCTYPE html>
<html  dir="ltr" lang="en">
  <head>
    
    <meta charset="utf-8" />
    <title>Home - Ambeh Team</title>
    <link rel="icon" type="image/ico" href="/images/logos/ambehicon.png">
    <link href="/normalize.css" type="text/css" rel="stylesheet" />
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link href="https://fonts.googleapis.com/css?family=Cinzel+Decorative" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Cinzel" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Josefin+Sans:300i" rel="stylesheet">
    <link href="/style.css" type="text/css"rel="stylesheet" />

  </head>
  <style>
    .intro {
      text-align: center;
      width: 80%;
      margin-left: 10%;
      margin-bottom: 5%;
      font-weight: bold;
      font-size: 24px;
      font-family: 'Josefin Sans', sans-serif; 
      background-color: #f1f1f1;
      padding: 3%;
    }
    

  </style>
  
  <body>
  <?php include('assets/header.php'); ?>

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

    <?php include('assets/footer.php'); ?>

  </body>
</html>