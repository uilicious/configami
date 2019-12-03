/**
 * TemplateRoot is mainly used as a state object,
 * and to initialize the various `TemplateContext` and `ConfigamiContext` objects
 */
class TemplateRoot {

	/**
	 * Initialize the module root 
	 * @param {String} inTemplateDir 
	 */
	constructor( inTemplateDir ) {
		this._templateDir = inTemplateDir;
	}


}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = TemplateRoot;