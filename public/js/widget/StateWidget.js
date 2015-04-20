/*global Widget */

function StateWidget(widget, configName) {

    this.widget = widget;
    this.configName = configName;
}

StateWidget.prototype = new Widget();
StateWidget.prototype.constructor = StateWidget;

(function() {
	$.extend(StateWidget.prototype, {
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
			this.renderTemplate(response);
		}
	});
	
}());