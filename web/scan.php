<?php


function scan($url, &$allLinks, &$count) {
  $count++;
  $theseLinks = array();
  $path=$url;
  $html = file_get_contents($path);
  $dom = new DOMDocument();
  @$dom->loadHTML($html);
  // grab all the on the page
  $xpath = new DOMXPath($dom);
  $hrefs = $xpath->evaluate("/html/body//a");
  for ($i = 0; $i < $hrefs->length; $i++ ) {
    $href = $hrefs->item($i);
    // strpos($url, 'http') !== 0
    $url = $href->getAttribute('href');
    // echo $url.'<br />';
    if (strpos($url, 'http') !== 0) $url = "https://michaelphelpsswimspa.com$url";
    if (strpos($url, 'michael')) {
      $theseLinks[$url]=false;
      $allLinks[$url]=false;
    }
  }
  print "Round $count, Added " . count($theseLinks) . ' unique links.<br />'; 
  return $theseLinks;
}

  $allLinks = array();
  $count = 0;

  $results = scan('https://michaelphelpsswimspa.com/index.php', $allLinks, $count);

  //while ($count < 10){
    foreach ($results as $url=>$status) {
      if (!$status) {
        scan($url, $allLinks, $count);
      }
    }
  //}
  print '<pre>';
  print_r($allLinks);
  print '</pre>';

?>
