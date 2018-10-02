import { M3Controller } from "./m3.controller";
import { IMIRequest, IMIResult, IM3Parameter } from "./m3.interface";
import { FileUtil } from "3kles-corebe";

export class M3Utils {

	public static addM3ControllerToRouter(router: any, controller: M3Controller): void {
		if (controller.getParameters()) {
			Object.keys(controller.getParameters()).forEach((key) => {
				router.route('/' + key).post(controller.execute(key));
			});
		}
	}

	public static buildErrorResponse(miresponse: IMIRequest): any {
		console.log('Body Response Raw:', miresponse);
		if (miresponse.nrOfFailedTransactions > 0) {
			const listError = [];
			Object.keys(miresponse.results).forEach((i) => {
				const tempresult: IMIResult = miresponse.results[i] as IMIResult;
				const error = {
					type: tempresult.errorType,
					context: tempresult.errorField,
					code: tempresult.errorCode,
					message: tempresult.errorMessage
				};
				listError.push(error);
			});
			console.log('Error API=', listError);
			return { error: listError };
		}
		return null;
	}

	public static buildM3APIResult(miresponse: IMIRequest): any {
		console.log('Nb resp:', miresponse.nrOfSuccessfullTransactions);
		if (miresponse.nrOfSuccessfullTransactions === 1) {
			return miresponse.results[0].records;
		} else if (miresponse.nrOfSuccessfullTransactions > 1) {
			return miresponse.results;
		}
		return null;
	}

	// Function to generate M3 Rest API URL
	public static buildM3APIURL(params: IM3Parameter, data: any): string {
		let url = '/m3api-rest/v2/execute/';
		url += params.api + '/' + params.transaction + ';maxrecs=0;metadata=false' + M3Utils.buildM3APIQuery(params.inParameter, data);
		console.log('URL API M3: ', url);
		return url;
	}

	// Function to generate parameter string from JSON object
	public static buildM3APIQuery(obj: any, data: any): string {
		let query = '?' + Object.keys(obj).map((paramName) => {
			return paramName + '=' + obj[paramName];
		}).join('&');
		if (Object.keys(data).length !== 0) {
			query += '&' + Object.keys(data).map((key) => {
				return key + '=' + data[key];
			}).join('&');
		}
		return query;
	}

	public static loadM3ConfigFromFile(file: any): IM3Parameter[] {
		return M3Utils.loadM3Config(FileUtil.readFile(file));
	}

	public static loadM3Config(params: any): IM3Parameter[] {
		const listparams: IM3Parameter[] = [];
		Object.keys(params).forEach((key) => {
			listparams[key] = params[key] as IM3Parameter;
		});
		return listparams;
	}
}
