// @flow

//TODO: need to support grouping of files into single request

import { logger, FILE_STATES } from "@rupy/shared";
import type { BatchItem } from "../types";
import type { FileState } from "@rupy/shared";

export type SendOptions = {
	method: string,
	paramName: string,
	params: Object,
	// encoding: string,
	headers?: Object,
	forceJsonResponse: ?boolean
};

export type UploadData = {
	state: FileState,
	response: any,
};

export type SendResult = { request: Promise<UploadData>, abort: () => void };

type Headers = { [string]: string };

const SUCCESS_CODES = [200, 201, 202, 203, 204];

const setHeaders = (req, options: SendOptions) => {

	//TODO: Content-Range
	//TODO: 'Content-Disposition' = 'attachment; filename="' +  encodeURI(file.name)+ '"'
//'application/octet-stream'

	//cld cors allowed headers =  Cache-Control, Content-Disposition, Content-MD5, Content-Range, Content-Type, DPR, Viewport-Width, X-CSRF-Token, X-Prototype-Version, X-Requested-With, X-Unique-Upload-Id
	const headers = {
		// "Content-Type": options.encoding,
		...(options.headers || {}),
	};

	Object.keys(headers).forEach((name) =>
		req.setRequestHeader(name, headers[name]));
};

const getFormData = (item: BatchItem, options: SendOptions) => {
	const fd = new FormData(),
		fileName = item.file ? item.file.name : undefined;

	fd.set(options.paramName, item.file || item.url, fileName);

	Object.entries(options.params)
		.forEach(([key, val]: [string, any]) => fd.set(key, val));

	return fd;
};

const makeRequest = (item: BatchItem, url: string, options: SendOptions): { pXhr: Promise<XMLHttpRequest>, xhr: XMLHttpRequest } => {
	const req = new XMLHttpRequest();

	const pXhr = new Promise((resolve, reject) => {

		const formData = getFormData(item, options);

		req.onerror = () => reject(req);
		req.ontimeout = () => reject(req);
		req.onload = () => resolve(req);

		req.open(options.method, url);

		setHeaders(req, options);

		//TODO: onprogress
		// req.onprogress = function(e) {
		// 	if (e.lengthComputable) {
		// 		var percentComplete = (e.loaded / e.total) * 100;
		// 		console.log(percentComplete + '% uploaded');
		// 	}
		// };

		//TODO: Support withCredentials param


		req.send(formData);
	});

	return {
		pXhr,
		xhr: req,
	};
};

const getResponseHeaders = (xhr: XMLHttpRequest): ?Headers => {
	let resHeaders;

	try {
		resHeaders = xhr.getAllResponseHeaders().trim()
			.split(/[\r\n]+/)
			.reduce((res, line: string) => {
				const [key, val] = line.split(': ');
				res[key] = val;
				return res;
			}, {});
	} catch (ex) {
		logger.debugLog("uploady.uploader.sender: failed to read response headers", xhr);
	}

	return resHeaders;
};

const parseResponseJson = (response: string, headers: ?Headers, options: SendOptions): string | Object => {
	let parsed = response;

	const ct = headers && headers["content-type"];

	if (options.forceJsonResponse || ct && ~ct.indexOf("json")) {
		try {
			parsed = JSON.parse(response);
		} catch (e) { //silent fail
		}
	}

	return parsed;
};

const processResponse = async (pXhr: Promise<XMLHttpRequest>, options: SendOptions): Promise<UploadData> => {
	let state, response;

	try {
		const xhr = await pXhr;

		logger.debugLog("uploady.uploader.sender: received upload response ", xhr);

		state = ~SUCCESS_CODES.indexOf(xhr.status) ?
			FILE_STATES.FINISHED : FILE_STATES.ERROR;

		const resHeaders = getResponseHeaders(xhr);

		response = {
			data: parseResponseJson(xhr.response, resHeaders, options),
			headers: resHeaders,
		};
	} catch (ex) {
		logger.debugLog("uploady.uploader.sender: upload failed: ", ex);
		state = FILE_STATES.ERROR;
		response = ex;
	}

	return {
		state,
		response,
	};
};

export default (item: BatchItem, url: string, options: SendOptions): SendResult => {
	logger.debugLog("uploady.uploader.sender: sending file: ", { item, url, options, });

	const request = makeRequest(item, url, options);

	return {
		request: processResponse(request.pXhr, options),
		abort: () => request.xhr.abort(),
	};
};