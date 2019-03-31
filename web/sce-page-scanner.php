<?php
$executionStartTime = microtime(true);
// Script to scrape the HTML of a page and create an array
// Then parse the array into separate pieces of data based on the HTML Comments
  include("simple_html_dom.php");
//$html =  file('https://www.sce.com/wps/portal/home/residential/rebates-savings/rebates/!ut/p/b1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOINLdwdPTyDDTzdXU0dDTydDCxDTH3MjEPNzYAKIoEKDHAARwNC-sP1o_ApCTQ0xlAQZG5k4OkV5urj72RoZGBhBFVg6W7g6uHlD1QQEmhs4GkcaOAX7OhobGBgBlWAx5EFuREGmZ7pigCyC5rD/dl4/d5/L2dBISEvZ0FBIS9nQSEh/?ecid=web_quicklink-home_rebates');
//$html =  file('https://www.sce.com/wps/portal/home/residential/rebates-savings/rebates/!ut/p/b1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOINLdwdPTyDDTzdXU0dDTydDCxDTH3MjEPNzYAKIoEKDHAARwNC-sP1o_ApCTQ0xlAQZG5k4OkV5urj72RoZGBhBFVg6W7g6uHlD1QQEmhs4GkcaOAX7OhobGBgBlWAx5EFuREGmZ7pigCyC5rD/dl4/d5/L2dBISEvZ0FBIS9nQSEh/?ecid=web_quicklink-home_rebates');
//  $html =  file('https://www.sce.com');
  $html = file('https://www.sce.com/wps/portal/home/partners/consulting-services/expansion');
  $html = file('https://www.sce.com/wps/portal/home/residential/');
  $count=count($html); //how many rows of data?
// Find out the line # of the HTML Array where our content begins.
  $row=1;
  while ($row != $count-1 && !strpos($html[$row], 'WCM Start: Main Content_Responsive | Main Content Responsive')) $row++;
  $contentBegin = $row;
  print 'Total of ' . $count . ' rows of HTML<br />';
  print 'contentBegin: ' . $contentBegin . ' <br />';
//  print $html[$contentBegin];
// Find out the line # of the HTML Aray where our content ends
  while ($row != $count-1 && !strpos($html[$row], 'WCM End: Main Content_Responsive | Main Content Responsive')) $row++;
  $contentEnd = $row;
// Print out some basic stats on this page.
  print 'contentEnd: ' . $contentEnd . ' <br /><br /><br />';
//  print $html[$contentEnd] . "\n\n";

// Now that we have the BEGINNING and ENDING Array Keys, 
// We can iterate through this subset of HTML looking for more HTML comments
// For NowLLL Just print a Tree Structure of the Page Elements
// I will write A LOT of Case-Switch code to detect each IWCM Module based on the HTML comments
  $state="";
  $nest='';
  print htmlspecialchars(trim($html[$contentBegin])) . "<br />\n";
  for ($i = $contentBegin+1; $i<$contentEnd; ++$i) {
    $prevState=$state;
    $value = htmlspecialchars($html[$i]);
    // test if the HTML comment is starting a new iwnc module
    if (strpos($value, '--') && strpos($value, 'Start')) {
      if ($nest===TRUE) print "---";
      if ($prevState=="start") {
        $nest=TRUE;
        print "---";
      }
      print "Starting $value<br />";
      $state="start";
    }
    //test if the HTML comment is ending an iwcm module
    else if (strpos($value, '--') && strpos($value, 'End')) {
      if ($nest===TRUE && $prevState != "end") {
        print "---";
      }
      $state="end";;
      print "Ending $value<br />";
      if ($prevState=="end") print "<br />\n";
      if ($prevState=="end") $nest=FALSE;
      if ($prevState=="start" && $nest!=TRUE) print "<br />\n";
    }
  }
  print htmlspecialchars($html[$contentEnd]) . "<br />\n";
$executionEndTime = microtime(true);
$seconds = $executionEndTime - $executionStartTime;
$seconds = round($seconds, 1, PHP_ROUND_HALF_UP);
print "page processed in $seconds seconds.";
?>
