<!doctype html>
<html>

<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5FCNDB4');</script>
<!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <title>Your local Master Spa Dealer</title>
    <meta name="description" content="" />
    <meta name="keywords" content="" />

    <?php include( "_includes/headstuff-2015.html"); ?>



</head>

<body >

    <?php include( "_includes/header.html"); ?>

    <?php include( "_includes/nav.html"); ?>


    <div id="hero" style="background-image: url(_images/_hero/hero-models-signature.jpg);"></div>



    <div class="container innercontent">


        <div class="row white">
            <div class="col-md-9 inner9">
                <h1>Thank You</h1>



                <div class="row">
                    <div class="col-md-12">
                        
                        <div id="locatorMessage" class="container" style="display:none;"></div>
                <div id="locatorResults" class="bump-up" style="display:none;">
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-8 text-center">
                        <p class="lead">Below is the information to find the closest Michael Phelps Swim Spa dealer near you!</p>
                    </div>
                    <div class="col-md-2"></div>
                </div>
                <div class="row text-center"><!--Start center row -->
                    <div class="col-md-6"><!--Start float left.-->
                        <br />
                        <img id="locatorDealerLogo" style="display:none;" vspace="10"><br />
                        <strong><span id="locatorDealerName"></span></strong><br />
                        <span id="locatorDealerAddress"></span><br />
                        Phone: <span id="locatorDealerPhone"></span><br />
                        <span id="locatorDealerFax"></span><br />
                        <a style="font-size:11pt; font-weight:normal;" id="locatorDealerEmail" href="#"></a><br />
                        <a style="font-size:11pt; font-weight:normal;" id="locatorDealerUrl" href="#" target="_blank"></a>
                    </div><!--End float left.-->
                    <div class="col-md-6" style="">
                        <img id="locatorDealerPhoto" class="img-responsive" style="display:none;" border="1"><br />
                    </div>
                    <div style="clear:both;"></div>
                    <p class="content" style=" margin-top:0px; font-family:Trebuchet MS, Arial, sans-serif; font-size:11pt; width:100%; max-width: 600px;">Your local Master Spas dealer is <span id='locatorDistance'></span> away.<br /></p>
                </div><!---End center row-->
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-2"></div>
                </div>


                <div id="map" style="width: 100%; max-width: 956px;  border:1px solid black; height:400px; margin:auto;"></div>
                <div style='height:10px;'></div>
            </div> <!-- End locatorResults -->
   
                        

                    </div>
                </div>

            </div>


            <?php include( "_includes/side-right-nobooklets-2015.html"); ?>






        </div>
    </div>
    <?php include( "_includes/footer.html"); ?>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/locator.v2.js"></script>
            <script>
                // locator config
                var v2locatorConfig = {
                    url:'https://masterspasdealer.com/service/locator/',
                    photoDefault:"https://masterspas.com/img/default-locator-image.jpg",
                    validate:'all',
                    enableMap:true,
                    maxDistanceToDisplay:10000
                };
            </script>
</body>

</html>