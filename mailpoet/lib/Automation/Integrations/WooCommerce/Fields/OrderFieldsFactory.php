<?php declare(strict_types = 1);

namespace MailPoet\Automation\Integrations\WooCommerce\Fields;

use MailPoet\Automation\Engine\Data\Field;
use MailPoet\Automation\Integrations\WooCommerce\Payloads\OrderPayload;

class OrderFieldsFactory {
  /** @return Field[] */
  public function getFields(): array {
    return array_merge(
      [
        new Field(
          'woocommerce:order:billing-company',
          Field::TYPE_STRING,
          __('Billing company', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_billing_company();
          }
        ),
        new Field(
          'woocommerce:order:billing-phone',
          Field::TYPE_STRING,
          __('Billing phone', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_billing_phone();
          }
        ),
        new Field(
          'woocommerce:order:billing-city',
          Field::TYPE_STRING,
          __('Billing city', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_billing_city();
          }
        ),
        new Field(
          'woocommerce:order:billing-postcode',
          Field::TYPE_STRING,
          __('Billing postcode', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_billing_postcode();
          }
        ),
        new Field(
          'woocommerce:order:billing-state',
          Field::TYPE_STRING,
          __('Billing state/county', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_billing_state();
          }
        ),
        new Field(
          'woocommerce:order:billing-country',
          Field::TYPE_STRING,
          __('Billing country', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_billing_country();
          }
        ),
        new Field(
          'woocommerce:order:shipping-company',
          Field::TYPE_STRING,
          __('Shipping company', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_shipping_company();
          }
        ),
        new Field(
          'woocommerce:order:shipping-phone',
          Field::TYPE_STRING,
          __('Shipping phone', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_shipping_phone();
          }
        ),
        new Field(
          'woocommerce:order:shipping-city',
          Field::TYPE_STRING,
          __('Shipping city', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_shipping_city();
          }
        ),
        new Field(
          'woocommerce:order:shipping-postcode',
          Field::TYPE_STRING,
          __('Shipping postcode', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_shipping_postcode();
          }
        ),
        new Field(
          'woocommerce:order:shipping-state',
          Field::TYPE_STRING,
          __('Shipping state/county', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_shipping_state();
          }
        ),
        new Field(
          'woocommerce:order:shipping-country',
          Field::TYPE_STRING,
          __('Shipping country', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_shipping_country();
          }
        ),
        new Field(
          'woocommerce:order:created-date',
          Field::TYPE_DATETIME,
          __('Created date', 'mailpoet'),
          function (OrderPayload $payload) {
            return $payload->getOrder()->get_date_created();
          }
        ),
      ]
    );
  }
}
