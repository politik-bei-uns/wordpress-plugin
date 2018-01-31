<?php

add_action('admin_menu', function () {
    add_submenu_page(
        'options-general.php',
        'Politik bei uns: Einstellungen',
        'Politik bei uns',
        'manage_options',
        'politik-bei-uns',
        'politik_bei_uns_options_html'
    );
});

function politik_bei_uns_options_html() {
    if (!current_user_can('manage_options'))
        return;
    settings_errors('politik_bei_uns_messages');
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('politik_bei_uns');
            do_settings_sections('politik_bei_uns');
            submit_button('speichern');
            ?>
        </form>
    </div>
    <?php
}

add_action('admin_init', function () {
    register_setting('politik_bei_uns', 'pbu_lightbox', function ($value) {
        if (intval($value))
            return '1';
        return '0';
    });
    register_setting('politik_bei_uns', 'pbu_font_awesome', function ($value) {
        if (intval($value))
            return '1';
        return '0';
    });

    add_settings_section(
        'politik_bei_uns_section_main',
        'Einstellungen',
        'politik_bei_uns_section_cb',
        'politik_bei_uns'
    );

    add_settings_field(
        'politik_bei_uns_field_lightbox',
        'Soll eine Lightbox geladen werden?',
        'politik_bei_uns_field_lightbox_cb',
        'politik_bei_uns',
        'politik_bei_uns_section_main',
        [
            'label_for' => 'pbu_lightbox',
            'class' => 'pbu_lightbox'
        ]
    );

    add_settings_field(
        'politik_bei_uns_field_font_awesome',
        'Soll Font Awesome geladen werden?',
        'politik_bei_uns_field_font_awesome_cb',
        'politik_bei_uns',
        'politik_bei_uns_section_main',
        [
            'label_for' => 'pbu_font_awesome',
            'class' => 'pbu_font_awesome'
        ]
    );
});

function politik_bei_uns_section_cb() {
}

function politik_bei_uns_field_lightbox_cb($args) {
    $status = boolval(get_option('pbu_lightbox', false));
?>
    <input type="checkbox"
        id="<?php echo esc_attr($args['label_for']); ?>"
        name="<?php echo esc_attr($args['label_for']); ?>"
        value="1"
        <?php if($status) { echo('checked'); } ?>
    >
<?php
}

function politik_bei_uns_field_font_awesome_cb($args) {
$status = boolval(get_option('pbu_font_awesome', false));
?>
    <input type="checkbox"
        id="<?php echo esc_attr($args['label_for']); ?>"
        name="<?php echo esc_attr($args['label_for']); ?>"
        value="1"
        <?php if($status) { echo('checked'); } ?>
    >
<?php
}

