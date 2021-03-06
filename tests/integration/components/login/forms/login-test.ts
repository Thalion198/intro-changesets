/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import Validation from 'ember-boilerplate/validator/forms/login';
import type { TypedBufferedChangeset } from 'ember-form-changeset-validations';
import click from '@ember/test-helpers/dom/click';
import { loginPage } from 'ember-boilerplate/tests/pages/login';

module('Integration | Component | FormsLogin', function (hooks) {
  setupRenderingTest(hooks);

  test('Create (empty changeset)', async function (assert) {
    this.set(
      'changeset',
      Changeset(
        {
          email: '',
          password: '',
        } as Record<keyof typeof Validation, unknown>,
        lookupValidator(Validation),
        Validation
      )
    );

    this.set('saveFunction', (changeset: TypedBufferedChangeset) => {
      assert.step('saveFunction');
      assert.strictEqual(changeset.get('email'), 'edited@gmail.com');
      assert.strictEqual(changeset.get('password'), 'edited');
    });

    await render(
      hbs`<Forms::Login @changeset={{this.changeset}} @saveFunction={{this.saveFunction}} />`
    );

    assert.dom('[data-test-input="email"] input').hasValue('');
    assert.dom('[data-test-input="password"] input').hasValue('');

    await loginPage.email('edited@gmail.com').password('edited');

    await click("button[type='submit']");
    assert.verifySteps(['saveFunction']);
  });

  test('Edit (populated changeset)', async function (assert) {
    this.set(
      'changeset',
      Changeset(
        {
          email: 'hello',
          password: 'hello',
        } as Record<keyof typeof Validation, unknown>,
        lookupValidator(Validation),
        Validation
      )
    );

    this.set('saveFunction', (changeset: TypedBufferedChangeset) => {
      assert.strictEqual(changeset.get('email'), 'edited@gmail.com');
      assert.strictEqual(changeset.get('password'), 'helloEdited');
      assert.step('saveFunction');
    });

    await render(
      hbs`<Forms::Login @saveFunction={{this.saveFunction}} @changeset={{this.changeset}}/>`
    );

    assert.dom('[data-test-input="email"] input').hasValue('hello');
    assert.dom('[data-test-input="password"] input').hasValue('hello');

    await loginPage.email('edited@gmail.com').password('helloEdited');

    await click("button[type='submit']");
    assert.verifySteps(['saveFunction']);
  });
});
