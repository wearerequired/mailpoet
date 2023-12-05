<?php declare(strict_types = 1);

namespace MailPoet\Test\Acceptance;

use MailPoet\Features\FeaturesController;
use MailPoet\Test\DataFactories\Features;
use MailPoet\Test\DataFactories\Settings;

class CreateAndSendEmailUsingGutenbergCest {
  public function createAndSendStandardNewsletter(\AcceptanceTester $i) {
    $settings = new Settings();
    $settings->withCronTriggerMethod('Action Scheduler');
    $settings->withSender('John Doe', 'john@doe.com');
    (new Features())->withFeatureEnabled(FeaturesController::GUTENBERG_EMAIL_EDITOR);
    $segmentName = $i->createListWithSubscriber();

    $i->wantTo('Create standard newsletter using Gutenberg editor');
    $i->login();
    $i->amOnMailpoetPage('Emails');
    $i->click('[data-automation-id="create_standard_email_dropdown"]');
    $i->waitForText('Create using new editor (Beta)');
    $i->click('Create using new editor (Beta)');
    $i->waitForText('Create modern, beautiful emails that embody your brand with advanced customization and editing capabilities.');
    $i->click('//button[text()="Continue"]');

    $i->wantTo('Compose an email');
    $i->waitForElement('.is-root-container');
    $i->wait(1);
    $i->click('.is-root-container');
    $i->type('Hello world!');

    $i->wantTo('Verify correct WP menu item is highlighted');
    $i->waitForText('Emails', 10, '#toplevel_page_mailpoet-homepage .current');

    $i->wantTo('Change subject and preheader');
    $i->click('[data-automation-id="email_settings_tab"]');
    $i->fillField('[data-automation-id="email_subject"]', 'My New Subject');
    $i->fillField('[data-automation-id="email_preview_text"]', 'My New Preview Text');

    $i->wantTo('Send an email and verify it was delivered');
    $i->click('Save Draft');
    $i->waitForText('Saved');
    $i->click('Send');
    $i->waitForElement('[name="subject"]');
    $subject = $i->grabValueFrom('[name="subject"]');
    verify($subject)->equals('My New Subject');
    $i->waitForText('My New Preview Text');
    $i->fillField('sender_name', 'John Doe');
    $i->fillField('sender_address', 'john.doe@example.com');
    $i->selectOptionInSelect2($segmentName);

    $i->click('Send');
    $i->waitForEmailSendingOrSent();

    $i->triggerMailPoetActionScheduler();

    $i->wantTo('Confirm the newsletter was received');
    $i->checkEmailWasReceived('My New Subject');
  }

  public function displayNewsletterPreview(\AcceptanceTester $i) {
    $settings = new Settings();
    $settings->withCronTriggerMethod('Action Scheduler');
    $settings->withSender('John Doe', 'john@doe.com');
    (new Features())->withFeatureEnabled(FeaturesController::GUTENBERG_EMAIL_EDITOR);

    $i->wantTo('Open standard newsletter using Gutenberg editor');
    $i->login();
    $i->amOnMailpoetPage('Emails');
    $i->click('[data-automation-id="create_standard_email_dropdown"]');
    $i->waitForText('Create using new editor (Beta)');
    $i->click('Create using new editor (Beta)');
    $i->waitForText('Create modern, beautiful emails that embody your brand with advanced customization and editing capabilities.');
    $i->click('//button[text()="Continue"]');

    $i->wantTo('Edit an email');
    $i->waitForElement('.is-root-container');
    $i->wait(1);
    $i->click('.is-root-container');
    $i->type('Hello world!');

    $i->wantTo('Save draft and display preview');
    $i->click('Save Draft');
    $i->waitForText('Saved');
    $i->click('.mailpoet-preview-dropdown button[aria-label="Preview"]');
    $i->waitForElementClickable('//button[text()="Preview in new tab"]');
    $i->click('//button[text()="Preview in new tab"]');
    $i->switchToNextTab();
    $i->canSeeInCurrentUrl('endpoint=view_in_browser');
    $i->canSee('Hello world!');
    $i->closeTab();

    $i->wantTo('Send preview email and verify it was delivered');
    $i->click('//span[text()="Send a test email"]'); // MenuItem component renders a button containing span
    $i->waitForElementClickable('//button[text()="Send test email"]');
    $i->click('//button[text()="Send test email"]');
    $i->waitForText('Test email sent successfully!');
    $i->click('//button[text()="Close"]');
    $i->waitForElementNotVisible('//button[text()="Send test email"]');
  }
}
