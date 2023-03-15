<?php declare(strict_types = 1);

namespace MailPoet\Automation\Integrations\WooCommerce\Payloads;

use MailPoet\Automation\Engine\Integration\Payload;

class CustomerPayload implements Payload {

  /** @var \WC_Customer */
  private $customer;

  public function __construct(
    \WC_Customer $customer
  ) {
    $this->customer = $customer;
  }

  public function getCustomer(): \WC_Customer {
    return $this->customer;
  }

  public function getId(): int {
    return $this->customer->get_id();
  }
}
