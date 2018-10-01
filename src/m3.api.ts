import * as btoa from 'btoa';
import { HttpApi, IHttpOptions } from '3kles-corebe';
import { IMIRequest } from './m3.interface';
import { M3Utils } from './m3.utils';

export class M3API extends HttpApi {

	constructor() {
		super('https');
	}

	// Function to create options request data
	public buildRequest(params: any, id?: any, data?: any): any {
		console.log("Parameters:", params);
		if (!data) data = {};
		// Check if id is present (get, update, delete)
		if (id) {
			// Check one least key
			if (Object.keys(params.inParameter).length >= 1) {
				// id must be the first key
				if (params.inParameter[Object.keys(params.inParameter)[0]] === '$id') {
					params.inParameter[Object.keys(params.inParameter)[0]] = id;
				}
			}
		}
		// Create options request
		const options: IHttpOptions = {
			hostname: params.host,
			port: params.port,
			path: encodeURI(M3Utils.buildM3APIURL(params, data)),
			rejectUnauthorized: false,
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				'Authorization': 'Basic ' + btoa(params.user + ':' + params.password)
			}
		};
		return options;
	}

	public processResponse(response: any): any {
		const miresponse: IMIRequest = JSON.parse(Buffer.concat(response).toString()) as IMIRequest;
		response = M3Utils.buildErrorResponse(miresponse);
		if (!response) {
			response = M3Utils.buildM3APIResult(miresponse);
		}
		return response;
	}

}
