/**
 * @see https://github.com/MTStevensW/bootstrap-duration-picker/
 * Forked from https://github.com/klorie/bootstrap-duration-picker
 */
(function ($) {

var langs = {
    en: {
        day: 'd',
        hour: 'hour',
        minute: 'min',
        second: 'sec',
        days: 'd',
        hours: 'hours',
        minutes: 'min',
        seconds: 'sec',
        milliseconds: 'ms'
    },
    es: {
        day: 'd&iacute;a',
        hour: 'hora',
        minute: 'minuto',
        second: 'segundo',
        days: 'd&iacute;s',
        hours: 'horas',
        minutes: 'minutos',
        seconds: 'segundos',
        milliseconds: 'ms'
    }
};

$.fn.durationPicker = function (options) {

        var defaults = {
            lang: 'en',
            max: 59,
            checkRanges: false,
            totalMax: 31556952000, // 1 year
            totalMin: 60000, // 1 minute
            showSeconds: true,
            showMilliseconds: true,
            showDays: false
        };

        var mainInputs     = {};
        var totalDurations = {};

        var settings = $.extend( {}, defaults, options );

        this.each(function (i, mainInput) {
            // Get current id
            var bdp_id = $(this).attr('id');

        	// Store an instance of moment duration
            totalDurations[bdp_id] = 0;

            mainInputs[bdp_id] = $(mainInput);

            function buildDisplayBlock(id, hidden) {
                return '<div class="bdp-block '+ (hidden ? 'hidden' : '') + '">' +
                            '<span id="bdp-'+ id +'"></span><br>' +
                            '<span class="bdp-label" id="' + id + '_label"></span>' +
                        '</div>';
            }

            var $mainInputReplacer = $('<div class="bdp-input"></div>');
            $mainInputReplacer.append(buildDisplayBlock('days', !settings.showDays));
            $mainInputReplacer.append(buildDisplayBlock('hours'));
            $mainInputReplacer.append(buildDisplayBlock('minutes'));
            $mainInputReplacer.append(buildDisplayBlock('seconds', !settings.showSeconds));
            $mainInputReplacer.append(buildDisplayBlock('milliseconds', !settings.showMilliseconds));

            mainInputs[bdp_id].after($mainInputReplacer).hide().data('bdp', '1');

            var inputs = [];

            var disabled = false;
            if (mainInputs[bdp_id].hasClass('disabled') || mainInputs[bdp_id].attr('disabled') == 'disabled') {
                disabled = true;
                $mainInputReplacer.addClass('disabled');
            }

            function updateMainInput() {
                mainInputs[bdp_id].val(totalDurations[bdp_id].asMilliseconds());
                mainInputs[bdp_id].change();
            }

            function updateMainInputReplacer() {
                $mainInputReplacer.find('#bdp-days').text(totalDurations[bdp_id].days());
                $mainInputReplacer.find('#bdp-hours').text(totalDurations[bdp_id].hours());
                $mainInputReplacer.find('#bdp-minutes').text(totalDurations[bdp_id].minutes());
                $mainInputReplacer.find('#bdp-seconds').text(totalDurations[bdp_id].seconds());
                $mainInputReplacer.find('#bdp-milliseconds').text(totalDurations[bdp_id].milliseconds());

                $mainInputReplacer.find('#days_label').text(langs[settings.lang][totalDurations[bdp_id].days() == 1 ? 'day' : 'days']);
                $mainInputReplacer.find('#hours_label').text(langs[settings.lang][totalDurations[bdp_id].hours() == 1 ? 'hour' : 'hours']);
                $mainInputReplacer.find('#minutes_label').text(langs[settings.lang][totalDurations[bdp_id].minutes() == 1 ? 'minute' : 'minutes']);
                $mainInputReplacer.find('#seconds_label').text(langs[settings.lang][totalDurations[bdp_id].seconds() == 1 ? 'second' : 'seconds']);
                $mainInputReplacer.find('#milliseconds_label').text(langs[settings.lang][totalDurations[bdp_id].milliseconds() == 1 ? 'millisecond' : 'milliseconds']);
            }

            function updatePicker() {
                if (disabled) {
                	return;
                }
                // Array of jQuery object inputs
                inputs.days.val(totalDurations[bdp_id].days());
                inputs.hours.val(totalDurations[bdp_id].hours());
                inputs.minutes.val(totalDurations[bdp_id].minutes());
                inputs.seconds.val(totalDurations[bdp_id].seconds());
                inputs.milliseconds.val(totalDurations[bdp_id].milliseconds());
            }

            function init() {
                if (!mainInputs[bdp_id].val()) {
                	mainInputs[bdp_id].val(0);
                }

                // Initialize moment with locale
                moment.locale(settings.lang);

                totalDurations[bdp_id] = moment.duration(parseInt(mainInputs[bdp_id].val(), 10));
                checkRanges();
                updatePicker();
            }

            function picker_changed() {
            	totalDurations[bdp_id] = moment.duration({
            		milliseconds : parseInt(inputs.milliseconds.val()),
            		seconds : parseInt(inputs.seconds.val()),
            		minutes : parseInt(inputs.minutes.val()),
            		hours : parseInt(inputs.hours.val()),
            		days :  parseInt(inputs.days.val())
            	});
            	checkRanges();
            	updateMainInput();
            }

            function buildNumericInput(label, hidden, max) {
                var $input = $('<input class="form-control input-sm" type="number" min="0" value="0">')
                    .change(picker_changed);
                if (max) {
                    $input.attr('max', max);
                }
                inputs[label] = $input;
                var $ctrl = $('<div> ' + langs[settings.lang][label] + '</div>');
                if (hidden) {
                    $ctrl.addClass('hidden');
                }
                return $ctrl.prepend($input);
            }

            function checkRanges() {
            	if (settings.checkRanges) {
            		// Assign max value if out of range
            		totalDurations[bdp_id] = (totalDuration[bdp_id].asMilliseconds() > settings.totalMax) ? moment.duration(settings.totalMax) : totalDurations[bdp_id];
            		// Assign minimum value if out of range
            		totalDurations[bdp_id] = (totalDurations[bdp_id].asMilliseconds() < settings.totalMin) ? moment.duration(settings.totalMin) : totalDurations[bdp_id];
            	}
            	// Always update input replacer
            	updateMainInputReplacer();
            }

            if (!disabled) {
                var $picker = $('<div class="bdp-popover"></div>');
                buildNumericInput('days', !settings.showDays).appendTo($picker);
                buildNumericInput('hours', false, 23).appendTo($picker);
                buildNumericInput('minutes', false, 59).appendTo($picker);
                buildNumericInput('seconds', !settings.showSeconds, 59).appendTo($picker);
                buildNumericInput('milliseconds', !settings.showMilliseconds, 999).appendTo($picker);

                $mainInputReplacer.popover({
                    placement: 'bottom',
                    trigger: 'click',
                    html: true,
                    content: $picker
                });
            }
            init();
            mainInputs[bdp_id].change(init);
        });
    };
}(jQuery));
