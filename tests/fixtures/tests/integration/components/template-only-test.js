import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | template-only', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<TemplateOnly />`);

    assert.dom(this.element).hasText('Hi there from a template only component');

    // Template block usage:
    await render(hbs`
      <TemplateOnly>
        template block text
      </TemplateOnly>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
