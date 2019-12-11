/**
 * Template function processor
 * 
 * @param {ConfigamiContext} cg 
 * @param {Object} input 
 * @param {Object} output 
 */
module.exports = function(cg, input, output) {

	//
	// Setup namespace with labels
	//
	output["01-namespace.yaml"] = cg.applyTemplate( "k8/basic/namespace", { 
		"name"   : input.namespace,
		"labels" : input["namespace-labels"] || null
	})["namespace.yaml"];

	//
	// Get the simple input, with deployment zone specific config overwrites stripped off
	//
	let simpleInput = cg.joinNestedObject({}, input);
	simpleInput["name"] = null;
	simpleInput["primary-config"]  = null;
	simpleInput["fallback-config"] = null;
	simpleInput["proxy-config"]    = null;

	//
	// Util functions
	//

	/**
	 * Given the type - prepare the deployment config
	 * @param {String} type 
	 * @return {Object} to use as input
	 */
	function getDeploymentConfig(type) {
		// Get baseline config
		// Used in `k8/basic/deployment-with-service`
		let ret = cg.joinNestedObject({}, simpleInput)
		ret.name = input.name+"-"+type;

		// Overwrite with fallback first - for servicelb
		if( type == "service-lb" ) {
			ret = cg.joinNestedObject(ret, JSON.parse(JSON.stringify(input["fallback-config"])));
		}

		// Overwrite with the respective "type-config" object
		ret = cg.joinNestedObject(ret, JSON.parse(JSON.stringify(input[type+"-config"])));

		// environment mapping for service-lb
		if( type == "service-lb" ) {
			ret["env"] = ret["env"] || {};
			let env = ret["env"];

			// Prepare the upsteam string
			let upstreamStr = `server ${input.name}-primary:${input.port} fail_timeout=1s;\nserver ${input.name}-fallback:${input.port} backup;`
			
			// Set the upstream, and timeout if needed
			env["PROXY_CONNECT_TIMEOUT"] = env["PROXY_CONNECT_TIMEOUT"] || "1s";
			env["FORWARD_UPSTREAM"] = env["FORWARD_UPSTREAM"] || upstreamStr;
		}

		// Return final config
		return JSON.parse(JSON.stringify(ret));
	}

	/**
	 * Given the type - prepare the deployment config
	 * @param {String} type 
	 * @return {String} to output as yaml
	 */
	function getServiceYaml(type) {
		let subTemplateOutput = cg.applyTemplate("k8/basic/deployment-with-service", getDeploymentConfig(type), {});
		return subTemplateOutput["deployment.yaml"] + "\n" + subTemplateOutput["service.yaml"];
	}

	//
	// Setup the various services
	//
	output["02-fallback.yaml"] = getServiceYaml("fallback");
	output["03-primary.yaml"] = getServiceYaml("primary");
	output["04-service-lb.yaml"] = getServiceYaml("service-lb");

	// 
	// Cleanout public-lb if its blank
	//
	if( output["05-public-lb.yaml"] != null && output["05-public-lb.yaml"].trim() == "" ) {
		output["05-public-lb.yaml"] = null;
	}
}