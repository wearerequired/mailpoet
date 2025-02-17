<?php declare(strict_types = 1);

namespace MailPoet\Test\Acceptance;

use Codeception\Util\Locator;
use MailPoet\Test\DataFactories\Newsletter;
use MailPoet\Test\DataFactories\Settings;
use MailPoet\Test\DataFactories\WooCommerceProduct;

/**
 * @group woo
 */
class SendProductPurchaseEmailCest {
  /** @var Settings */
  private $settingsFactory;

  public function _before(\AcceptanceTester $i) {
    $i->activateWooCommerce();
    $this->settingsFactory = new Settings();
    $this->settingsFactory->withWooCommerceListImportPageDisplayed(true);
    $this->settingsFactory->withWooCommerceCheckoutOptinEnabled();
    $this->settingsFactory->withConfirmationEmailDisabled();
    $this->settingsFactory->withCronTriggerMethod('Action Scheduler');
  }

  public function sendProductPurchaseEmail(\AcceptanceTester $i) {
    $i->wantTo('Buy a product and receive a "Product Purchase" email');

    $productName = 'Product Purchase Test Product';
    $productFactory = new WooCommerceProduct($i);
    $product1 = $productFactory->withName($productName)->create();
    $product2 = $productFactory->withName($productName)->create();

    $emailSubject = 'Product Purchase Test';
    $newsletterFactory = new Newsletter();
    $newsletterFactory
      ->withSubject($emailSubject)
      ->withAutomaticTypeWooCommerceProductPurchased([$product1])
      ->withActiveStatus()
      ->create();

    $userEmail = 'user2@email.test';
    $i->orderProduct($product1, $userEmail);

    $i->triggerMailPoetActionScheduler();

    $i->checkEmailWasReceived($emailSubject);
    $i->click(Locator::contains('span.subject', $emailSubject));
    $i->waitForText($userEmail, 20);

    $i->wantTo('Buy the same product once again and don\'t receive the newsletter');

    $i->emptyMailbox();

    $i->amOnSiteHomepage();

    // Add additional random product to cart to buy 2 products
    $i->addProductToCart($product2);

    // Order 2 products with 1 attached to WC Automatic email
    $i->orderProductWithoutRegistration($product1, $userEmail);
    $i->triggerMailPoetActionScheduler();
    $i->checkEmailWasNotReceived($emailSubject);
  }

  public function doNotSendProductPurchaseEmailIfUserHasNotOptedIn(\AcceptanceTester $i) {
    $i->wantTo('Buy a product, do not opt-in and don\'t receive a "Product Purchase" email');

    $productName = 'Product Purchase Test Product';
    $productFactory = new WooCommerceProduct($i);
    $product = $productFactory->withName($productName)->create();

    $emailSubject = 'Product Purchase Test 2';
    $newsletterFactory = new Newsletter();
    $newsletterFactory
      ->withSubject($emailSubject)
      ->withAutomaticTypeWooCommerceProductPurchased([$product])
      ->withActiveStatus()
      ->create();

    $userEmail = 'user4@email.test';
    $i->orderProduct($product, $userEmail, true, false);

    $i->amOnMailboxAppPage();
    $i->dontSee($emailSubject);
    $i->dontSee($userEmail);
  }
}
