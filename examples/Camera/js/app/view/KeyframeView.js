if (typeof define !== 'function') { 
	var define = require('amdefine')(module)
}
define(function(require) {
	var template = require('text!/template/keyframe.html')
	require('backbone')
	require('backbone.epoxy')
	KeyframeView = Backbone.Epoxy.View.extend({
		template: _.template(template),
		bindings: {
			"input.name2ds": "value:name,events:['keyup']"
		},
		
        initialize: function(keyframe){
			console.log('inside keyframe' , keyframe)
			this.keyframe = keyframe;
        },
        render: function(){
			this.parse()
			console.log('model is ' , this.model)
			console.log('inside keyframe view' , this.template(this.model))
            return this.template(this.model);
        },
		parse : function(){
			this.model = {
							startAt : this.keyframe['startAt'],
							endAt : this.keyframe['endAt'],
							startTop : this.keyframe['properties']['top']['from'],
							endTop : this.keyframe['properties']['top']['to'],
							startLeft : this.keyframe['properties']['left'] ? this.keyframe['properties']['left']['from'] : 0,
							endLeft : this.keyframe['properties']['left']? this.keyframe['properties']['left']['to'] : 0
						}
		}
    });

	return KeyframeView
})