import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';

import * as myModule from 'my-addon';

module('imports', function () {
  test('did they work', async function (assert) {
    assert.ok(myModule.MyService);
    assert.ok(myModule.JSComponent);
    assert.ok(myModule.TSComponent);
    assert.ok(myModule.TemplateOnly);
  });

  module('rendering', function (hooks) {
    setupRenderingTest(hooks);

    test('JSComponent can render', async function (assert) {
      this.setProperties({ JSComponent: myModule.JSComponent });

      await render(hbs`<this.JSComponent />`);

      assert.dom().hasText('nested: JS');
    });

    test('TSComponent can render', async function (assert) {
      this.setProperties({ TSComponent: myModule.TSComponent });

      await render(hbs`<this.TSComponent />`);

      assert.dom().hasText('nested: TS');
    });

    test('TemplateOnly can render', async function (assert) {
      this.setProperties({ TemplateOnly: myModule.TemplateOnly });

      await render(hbs`<this.TemplateOnly />`);

      assert.dom().hasText('this is a template-only component');
    });
  });
});
