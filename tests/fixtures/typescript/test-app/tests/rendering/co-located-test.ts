import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Rendering | co-located', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a JS component', async function (assert) {
    await render(hbs`<CoLocated />`);

    assert.dom().hasText('Hello, from a co-located component');
  });

  test('it renders a TS component', async function (assert) {
    await render(hbs`<CoLocatedTs />`);

    assert.dom().containsText('Hello, from a co-located TS component (in TypeScript)');
  });
});
