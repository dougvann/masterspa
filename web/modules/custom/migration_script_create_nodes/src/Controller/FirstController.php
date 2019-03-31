<?php
/**
 * @file
 * Contains \Drupal\migration_script_create_nodes\Controller\FirstController.
 */
 
namespace Drupal\migration_script_create_nodes\Controller;
 
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Drupal\node\Entity\Node;
use Drupal\menu_link_content\Entity\MenuLinkContent;

/**
 * Controller routines for page example routes.
 */
class FirstController extends ControllerBase {


  // this is the funtion that delivers page content for /test
  public function content() {
  $executionStartTime = microtime(true);

  // I like to init my variables even though PHP doesn't require it.
  $count=1;
  // Open the CSV file which I keep at the webroot
  $CSVfp = fopen("./modules/custom/migration_script_create_nodes/blogs.txt", "r");
  if($CSVfp !== FALSE) {

    // Here's the new way to fire watchdog entries.
     \Drupal::logger('Import')->notice("CSVfp begins");

    // The value of the "$count != ###" determines how many rows of the CSV get parsed.
    while(! feof($CSVfp)) {
      // If $level is set, then this is not the 1st time this block is executing
      // and the value of $level is the previous row's value.
      //if (isset($level)) $prevLevel=$level;

      // now that the whole $level situation is resolved, load some data from the CSV
      $data = fgetcsv($CSVfp, 1000, ",");
      // Determine what level the page for this row is.
      // The CSV has a column for each menu-level.
      // By determining which column the Menu Title apears in, we know what level in the menu it is.

      $pageData = file_get_contents($data[0]); // $data[10] is the URL of the sce page. LOAD IT
      //$pageData = file_get_contents('http://sce-dev1.infy.sce.com/sprint2/your-business'); // $data[10] is the URL of the sce page. LOAD IT
//      OR use this line below to just pull in a single known page rather than a page from the CSV
    //$pageData = file_get_contents('http://localhost:81/sce.cs.dms.drupal/node/17');

      $html = str_get_html($pageData);
      foreach($html->find('img') as $img) {
        $src = $img->src;
        $img->src = "/sites/default/files/" . $src;
      }

      //print "Page Data = " . $data[0];
      $count++;
      // I had to go CRAZY with the Ternary operators b/c so many pages are missing some fields of data
//    We need to make sure that $html is not a boolean FALSE and if it is load in some dummy values
//    So that we can at least save the menu item for this page.
      if ($html) {
        //$body = $html->find('article',0)->innertext;
        $title = $html->find('h1',0)->innertext;
        //$ogurl = $html->find('head meta[name=og:url]',0)->content;
        $ogtitle = (isset($html->find('title',0)->plaintext)) ? $html->find('title',0)->plaintext : '';
        $desc = (isset($html->find('head meta[name=description]',0)->content)) ? $html->find('head meta[name=description]',0)->content : '';
        $keywords = (isset($html->find('head meta[name=keywords]',0)->content)) ? $html->find('head meta[name=keywords]',0)->content : '';
      $hero = $html->find('div[id=hero]',0)->style;
      $body = '<div class="container innercontent">';
      $body .= ' <div class="row white">';
      $body .= $html->find('div[class=row]',1)->innertext;
      $body .= '</div>';
      $body .= ' <div class="row white">';
      $body .= ' <div class="col-md-9 inner9">';
      $inner = $html->find('div[class=inner9]',0)->innertext;
      
      $body .= $inner;
      $body .= '</div>';
      $body .= '</div>';
      $body .= '</div>';
      //$h1Responsive = (isset($html->find('h1.responsivePageTitle',0)->innertext)) ? $html->find('h1.responsivePageTitle',0)->innertext : 'Check Page Manually';
        //\Drupal::logger('Import')->notice("Line $count, $h1Responsive");
      } else {
        $title="Failed Page Load";
        //$ogurl="failed-load/$count";
        //$ogtitle="Failed Page Load";
        $desc="Failed Page Load";
        $keywords="Faile Page load";
        $h1Responsive="Failed Page Load";
      }
      // Take the $ogurl value and remove the "https://www.sce.com/wps/portal" from it so that only a proper Drupal Path Alias remains.
      $url = substr($data[0], 32);
      if ($url[0] != "/") $url = "/" . $url; // rarely, I find a url missing a slash
      \Drupal::logger('Import')->notice("URL = $url");


      /* print some of the values to the screen. Feel free to comment-out some or all of these.
      print "Page #$count<br/>";
      print "TITLE        :  " . $title . "<br />";
      //print "H1           :  " . $h1Responsive . "<br />";
      //print "OG:TITLE     :  " . $ogtitle . "<br />";
      //print "OG:URL       :  " . $ogurl . "<br />";
      print "URL-ALIAS       :  " . $url . "<br />";
      print "DESCRIPTION  :  " . $desc . "<br />";
      print "KEYWORDS     :  " . $keywords . "<br />";
      print "Body Content     :  " . $body . "<br />"; */

// Create and save the node
      $nodeData = [
            'type' => 'page',
            'status' => 1,
            'title' => 'Energy Efficient',
            'path' => $url,
            'body' => $body,
            'field_hero_background' => $hero,
            'field_meta_tags' => serialize([ 
              'title' => $ogtitle,
              'description' => $desc,
              'keywords' => $keywords,
			  'og_url' => $data[0],
            ]),
        ];
      \Drupal::logger('Import')->notice("Line $count read");
      $entity = Node::create($nodeData);
      $entity->save();
	  //exit('qwerty');
	  //print_r($entity); exit;

//create and save the menu item for the path of the node we just saved
// While level 4 pages ARE added to the menu, they should be disabled.
// I need to add a line below to disable level4 items
// No level 5 pages need added to the menu.
      
      \Drupal::logger('Import')->notice("Line $count, $h1Responsive written");
      //print "<hr />";
    } 

  }
  fclose($CSVfp);
  $executionEndTime = microtime(true);
  $seconds = $executionEndTime - $executionStartTime;
  $seconds = round($seconds, 1, PHP_ROUND_HALF_UP);
  return [
      '#markup' => '<p>' . $this->t("$count pages executed in $seconds seconds.") . '</p>',
    ];
  }
}
