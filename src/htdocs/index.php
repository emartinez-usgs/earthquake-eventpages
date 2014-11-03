<?php
if (!isset($TEMPLATE)) {
	include_once 'functions.inc.php';

	// Defines the $CONFIG hash of configuration variables
	include_once '../conf/config.inc.php';

	$eventid = param('eventid');

	if ($eventid == null) {
		header('HTTP/1.0 400 Bad Request');
		trigger_error('Missing required parameter "eventid".');
		exit(-1);
	}

	if (isset($CONFIG['OFFSITE_HOST']) && $CONFIG['OFFSITE_HOST'] != '') {
		$OFFSITE_HOST = 'http://' . $CONFIG['OFFSITE_HOST'];
	} else {
		$OFFSITE_HOST = 'http://' . $_SERVER['HTTP_HOST'];
	}

	$STUB = $OFFSITE_HOST . $CONFIG['DETAILS_STUB'];
	$EVENT_FEED = file_get_contents(sprintf($STUB, $eventid));

	$replaceWith = 'url":"';
	$searchFor = $replaceWith . $OFFSITE_HOST;

	$EVENT = json_decode(str_replace(
			$searchFor, $replaceWith, $EVENT_FEED), true);

	$PROPERTIES = $EVENT['properties'];
	$GEOMETRY = $EVENT['geometry'];

	$TITLE = $PROPERTIES['title'];
	$NAVIGATION = navItem('#', 'Event Summary');

	$EVENT_CONFIG = array(
		'MOUNT_PATH' => $CONFIG['MOUNT_PATH'],
		'KML_STUB' => isset($CONFIG['KML_STUB']) ? $CONFIG['KML_STUB'] : null,
		'DYFI_RESPONSE_URL' => $CONFIG['DYFI_RESPONSE_URL']
	);

	$HEAD = '
		<link rel="stylesheet" href="css/index.css"/>
	';

	$FOOT =
		/* Embed event details in an explicitly named define. */
		'<script>' .
			'define(\'EventDetails\', ' . json_encode($EVENT) . ');' .
			'define(\'EventConfig\', ' . json_encode($EVENT_CONFIG) . ');' .
		'</script>' .
		/* Now start the action in a separate JS file for cachability. */
		'<script src="js/index.js"></script>' .
		'<script src="http://localhost:35729/livereload.js?snipver=1"></script>';

	include_once 'template.inc.php';
}

include_once '../lib/inc/html.inc.php';
?>
