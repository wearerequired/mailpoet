<?php declare(strict_types = 1);

namespace MailPoet\Test\Acceptance;

use MailPoet\Features\FeaturesController;
use MailPoet\Test\DataFactories\Features;
use MailPoet\Test\DataFactories\Settings;

class HomepageBasicsCest {
  public function _before() {
    (new Features())->withFeatureEnabled(FeaturesController::FEATURE_HOMEPAGE);
  }

  public function homepageRenders(\AcceptanceTester $i) {
    $i->wantTo('Check homepage renders and is present in menu');
    $i->login();
    $i->amOnMailpoetPage('Homepage');
    $i->waitForElement('.mailpoet-top-bar');
    $i->see('Home', '#adminmenu');
  }

  public function homepageRendersMailerError(\AcceptanceTester $i) {
    $i->wantTo('Check homepage can render Mailer error');
    (new Settings())->withSendingError('Sending is broken!');
    $i->login();
    $i->amOnMailpoetPage('Homepage');
    $i->waitForElement('.mailpoet_notice');
    $i->waitForText('Sending is broken!');
    $i->waitForElementClickable('.mailpoet_notice .button');
    $i->click('Resume sending');
    $i->waitForText('Sending has been resumed');
    $i->dontSee('Sending is broken!');
  }
}