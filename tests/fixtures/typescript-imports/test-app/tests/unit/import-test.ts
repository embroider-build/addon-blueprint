import { module, test } from 'qunit';

import * as myModule from 'my-addon';

module('imports', function (hooks) {
  test('did they work', async function (assert) {
    assert.ok(myModule.MyService);
  });
});
