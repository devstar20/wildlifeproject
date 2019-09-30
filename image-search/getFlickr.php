<?php
class Flickr { 
 
 private $apiKey; 
 
 public function __construct($apikey = null) {
 $this->apiKey = $apikey;
 } 
 public function search($query = null, $user_id = null, $per_page = 200, $format = 'php_serial') { 
 $args = array(
 'method' => 'flickr.photos.search',
 'api_key' => $this->apiKey,
 'text' => urlencode($query),
 'user_id' => $user_id,

 'tags' => 'animal',
 'per_page' => $per_page,
 'format' => $format
 );
 $url = 'http://flickr.com/services/rest/?'; 
 $search = $url.http_build_query($args);
 $result = $this->file_get_contents_curl($search); 
 if ($format == 'php_serial') $result = unserialize($result); 
 return $result; 
 } 
 private function file_get_contents_curl($url) {
 $ch = curl_init();
 curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
 curl_setopt($ch, CURLOPT_HEADER, 0);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
 curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
 curl_setopt($ch, CURLOPT_URL, $url);
 curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
 $data = curl_exec($ch);
 $retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
 curl_close($ch);
 if ($retcode == 200) {
 return $data;
 } else {
 return null;
 }
 } 
}
 
if (!empty($_GET['search'])) {
 $Flickr = new Flickr('4df132c6e934430f5e6ced187e5a22c8'); 
 $data = $Flickr->search(stripslashes($_GET['search'])); 
 $html = '';
 if (!empty($data['photos']['total'])) {
 //$html = '<p>Total '.$data['photos']['total'].' photo(s) for this keyword.</p>'; 
 $search = strtolower(stripslashes($_GET['search']));
 foreach($data['photos']['photo'] as $photo) { 
 	$title = strtolower($photo['title']);
 	if(strpos($title, $search) == false)continue;
 	if(strpos($title, '(') !== false)continue;
 	$html .=  '<img src="' . 'http://farm' . $photo["farm"] . '.static.flickr.com/' . $photo["server"] . '/' . $photo["id"] . '_' . $photo["secret"] . '_s.jpg" style="width:120px; height:120px;" alt="" />'; 
 	
 	//$html .= '<h2>'.$photo['title'].'</h2>';
 }
 } else {
 $html = '<p>There are no photos for this keyword.</p>';
 }
 echo $html;
}