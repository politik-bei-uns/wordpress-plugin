<?php
/*
Plugin Name: Politik bei uns
Plugin URI: https://politik-bei-uns.de/
Description: Stellt Dokumente vom kommunalen Transparenz-Portal Politik bei uns dar
Version: 0.1.1
Author: Ernesto Ruge
Author URI: https://binary-butterfly.de
*/

defined('ABSPATH') or die('nope.');

require('politik-bei-uns-admin.php');

add_action( 'wp_enqueue_scripts', function() {
    $script_depenencies = array('jquery');
    if (get_option('pbu_font_awesome', false)) {
        wp_enqueue_style('font-awesome',
            'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
            array(),
            '4.7.0'
        );
    }
    if (get_option('pbu_lightbox', false)) {
        wp_enqueue_script('politik-bei-uns-lightbox',
            plugins_url('/jquery.colorbox-min.js', __FILE__),
            array('jquery'),
            get_plugin_data(__FILE__)['Version'],
            true
        );
        $script_depenencies[] = 'politik-bei-uns-lightbox';
    }
    wp_enqueue_style('politik-bei-uns',
        plugins_url('/politik-bei-uns.css', __FILE__),
        array(),
        get_plugin_data(__FILE__)['Version']
    );
    wp_enqueue_script('politik-bei-uns',
        plugins_url('/politik-bei-uns.js', __FILE__),
        $script_depenencies,
        get_plugin_data(__FILE__)['Version'],
        true
    );
});

add_shortcode( 'politik-bei-uns', function($atts) {
    if (!array_key_exists('type', $atts))
        return '';
    if (!array_key_exists('id', $atts))
        return '';
    if (!in_array($atts['type'], array('paper', 'file', 'meeting')))
        return '';
    if (strlen($atts['id']) != 24)
        return '';
    return '<div class="politik-bei-uns-box" data-type="' . $atts['type'] . '" data-id="' . $atts['id'] . '"></div>';
});

add_action('wp_footer', function() {
?>
<script>
    pbu_config = {
        lightbox: <?php echo( (boolval(get_option('pbu_lightbox', false))) ? 'true' : 'false'); ?>,
        font_awesome: <?php echo((boolval(get_option('pbu_font_awesome', false))) ? 'true' : 'false'); ?>
    };
</script>
<?php
});
