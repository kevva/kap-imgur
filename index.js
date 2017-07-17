'use strict';
const fs = require('fs');
const url = require('url');
const FormData = require('form-data');

const action = async context => {
	const endpoint = 'https://api.imgur.com/3/image';
	const filePath = await context.filePath();
	const form = new FormData();

	context.setProgress('Uploading…');
	form.append('image', fs.createReadStream(filePath));

	const response = await context.request(endpoint, {
		method: 'post',
		body: form,
		headers: {authorization: `Client-ID ${context.config.get('clientId')}`}
	});

	const link = url.parse(JSON.parse(response.body).data.link);

	link.protocol = 'https';

	context.copyToClipboard(url.format(link));
	context.notify('URL to the GIF has been copied to the clipboard');
};

const imgur = {
	title: 'Share to Imgur',
	formats: ['gif'],
	action,
	config: {
		clientId: {
			title: 'Client ID',
			type: 'string',
			default: '34b90e75ab1c04b',
			required: true
		}
	}
};

exports.shareServices = [imgur];
