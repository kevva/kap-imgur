import test from 'ava';
import kapPluginTest from 'kap-plugin-test';

const response = {
	body: '{"data":{"link":"http://imgur.com/a/Z9B4u"}}'
};

test('request and copy to clipboard', async t => {
	const plugin = kapPluginTest('unicorn.gif');

	plugin.context.request.resolves(response);

	await plugin.run();

	const request = plugin.context.request.lastCall.args[1];
	delete request.body;

	t.is(plugin.context.request.lastCall.args[0], 'https://api.imgur.com/3/image');
	t.deepEqual(request, {
		method: 'post',
		headers: {
			authorization: 'Client-ID 34b90e75ab1c04b'
		}
	});
	t.true(plugin.context.copyToClipboard.calledWith('https://imgur.com/a/Z9B4u'));
});

test('custom `clientId`', async t => {
	const plugin = kapPluginTest('unicorn.gif', {
		config: {
			clientId: 'foo'
		}
	});

	plugin.context.request.resolves(response);

	await plugin.run();

	const {headers} = plugin.context.request.lastCall.args[1];

	t.deepEqual(headers, {
		authorization: 'Client-ID foo'
	});
});

