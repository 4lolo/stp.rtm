/*global Widget */

function GraphWidget(widget, configName) {

    this.widget = widget;
    this.configName = configName;
    this.chart = null;
    this.oldValue = 0;

    this.dataToBind = {
        'value': '',
        'arrowClass': '',
        'percentageDiff': 0,
        'oldValue': '',
        'status': ''
    };
}

GraphWidget.prototype = new Widget();
GraphWidget.prototype.constructor = GraphWidget;

$.extend(GraphWidget.prototype, {
    /**
     * Invoked after each response from long polling server
     *
     * @param response Response from long polling server
     */
    handleResponse: function (response) {
        this.prepareData(response);
    },

    /**
     * Updates widget's state
     */
    prepareData: function (response) {
        var currentValue = response.data.length ? response.data[response.data.length - 1].y : undefined;
        var percentageValue = this.params.max ? currentValue / this.params.max : 0;
        var errorThreshold = this.params.errorThreshold || 2147483647;
        var warnThreshold = this.params.warnThreshold || 2147483647;

        /**
         * Calculating diff from last collected value
         */
        $.extend(this.dataToBind, this.setDifference(this.oldValue, currentValue));

        this.dataToBind.value = currentValue;
        this.dataToBind.status = (!currentValue && currentValue !== 0) || percentageValue >= errorThreshold ? 'ERROR' : (percentageValue >= warnThreshold ? 'WARN' : '');

        if (this.chart !== null) {
            this.chart.highcharts().destroy();
        }

        this.renderTemplate(this.dataToBind);
        this.animateNumber(this.$widget.find('.mainValue'),this.oldValue, (!currentValue && currentValue !== 0) ? '∞' : currentValue);
        this.oldValue = currentValue;

        this.chart = $('.graph', this.widget).highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: ''
            },
            xAxis: {
                title: '',
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                max: this.params.max,
                title: ''
            },
            tooltip: {
                pointFormat: 'Value of <b>{point.y}</b> noted.'
            },
            plotOptions: {
                area: {
                    pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [
                {
                    title: {
                        text: ''
                    },
                    data: response.data.map(function(p) { return { x: p.x, y: p.y || 0 }; })
                }
            ]
        });
        this.checkThresholds(currentValue);
    }
});
