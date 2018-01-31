pbu_modules = {};

jQuery(document).ready(function ($) {
    pbu_modules.pbu_main = new PbuMain();
    pbu_modules.pbu_main.init();
});

var PbuMain = function () {
    $ = jQuery.noConflict(true);
    oparl_base_url = 'https://oparl.politik-bei-uns.de';
    media_base_url = 'https://cdn.politik-bei-uns.de';
    portal_base_url = 'https://politik-bei-uns.de';

    this.init = function () {
        $('.politik-bei-uns-box').each(function() {
            var url = oparl_base_url + '/' + $(this).data('type') + '/' + $(this).data('id');
            $.get(url, function(data) {
                pbu_modules.pbu_main.show(data);
            });
        });
    };

    this.show = function (data) {
        var body = data.body.split('/');
        body = body[body.length - 1];
        var obj_id = data.id.split('/');
        obj_id = obj_id[obj_id.length - 1];
        var current_box = $('.politik-bei-uns-box[data-id="' + obj_id + '"]');

        html = '<div class="header-box">';
        html += '<h3>';
        if (data.type === 'https://schema.oparl.org/1.0/Paper') {
            html += 'Vorlage: ';
        }
        else if (data.type === 'https://schema.oparl.org/1.0/File') {
            html += 'Datei: ';
        }
        else if (data.type === 'https://schema.oparl.org/1.0/Meeting') {
            html += 'Sitzung: ';
        }
        if (data.name)
            html += data.name + '</h3>';
        else
            html += 'Unbenanntes Dokument</h3>';
        html += '<p>';
        html += 'Erstellt: ' + this.format_datetime(data.created);
        if (data.created !== data.modified)
            html += ' | Aktualisiert: ' + this.format_datetime(data.modified);
        if (data.type === 'https://schema.oparl.org/1.0/Paper') {
            if (data.paperType) {
                html += ' | Typ: ' + data.paperType;
            }
        }
        else if (data.type === 'https://schema.oparl.org/1.0/File') {
            if (data.size) {
                if (data.size > 1000000) {
                    html += ' | Typ: ' + String((Math.round(data.size / 100000))/10).replace('.', ',') + ' MB';
                }
                else if (data.size > 1000) {
                    html += ' | Größe: ' + String((Math.round(data.size / 100))/10).replace('.', ',') + ' kB';
                }
                else {
                    html += ' | Größe: ' + String(data.size) + ' B';
                }
            }
        }
        else if (data.type === 'https://schema.oparl.org/1.0/Meeting') {
            if (data.start)
                html += ' | Beginn: ' + this.format_datetime(data.start);
            if (data.end)
                html += ' | Ende: ' + this.format_datetime(data.end);
            if (data.agendaItem)
                html += ' | ' + data.agendaItem.length + ' Tagesordnungspunkte';
            if (data.location) {
                html += ' | Ort: ';
                if (data.location.room)
                    html += data.location.room + ', ';
                if (data.location.streetAddress)
                    html += data.location.streetAddress + ', ';
                if (data.location.postalCode)
                    html += data.location.postalCode + ' ';
                if (data.location.locality)
                    html += data.location.locality;
            }
        }
        html += '</p>';
        html += '</div><div class="content-box">';
        if (data.type === 'https://schema.oparl.org/1.0/Paper') {
            html += this.generate_file_fragment(data.mainFile, body);
        }
        else if (data.type === 'https://schema.oparl.org/1.0/File') {
            html += this.generate_file_fragment(data, body);
        }
        else if (data.type === 'https://schema.oparl.org/1.0/Meeting') {
            html += this.generate_file_fragment(data.invitation, body);
        }
        html += '</div><div class="footer-box">';
        html += '<h4><a href="' + portal_base_url + '/' + current_box.data('type') + '/' + obj_id + '" target="_blank">';
        html += '<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i> ';
        html += 'Weitere Details auf "Politik bei uns" anschauen</a>';
        html += '</div>';
        current_box.html(html);
        $('.politik-bei-uns-box[data-id="' + obj_id + '"] .politik-bei-uns-image').colorbox({rel: obj_id});
    };

    this.generate_file_fragment = function (file, body) {
        html = '';
        if (file) {
            if (file['politik-bei-uns:thumbnailStatus']) {
                var file_id = file.id.split('/');
                file_id = file_id[file_id.length - 1];
                html += '';
                html += '<div class="politik-bei-uns-imagebox"><div class="politik-bei-uns-imagebox-scroll">';
                for (var i = 1; i <= file['politik-bei-uns:pages']; i++) {
                    html += '<a href="' + media_base_url + '/file-thumbnails/' + body + '/' + file_id + '/1200/' + i + '.jpg" class="politik-bei-uns-image">';
                    html += '<img src="' + media_base_url + '/file-thumbnails/' + body + '/' + file_id + '/300/' + i + '.jpg">';
                    html += '</a>';
                }
                html += '</div></div>';
            }
        }
        return html;
    };

    this.format_datetime = function(datetime, format) {
        if (!format)
            format = 'full';
        year = datetime.substr(0, 4);
        month = datetime.substr(5, 2);
        day = datetime.substr(8, 2);
        if (format === 'full') {
            hour = datetime.substr(11, 2);
            minute = datetime.substr(14, 2);
            return (day + '.' + month + '.' + year + ', ' + hour + ':' + minute + ' Uhr');
        }
        else if (format === 'date') {
            return (day + '.' + month + '.' + year);
        }
    }
};