<?php declare(strict_types = 1);

namespace MailPoet\Test\DataFactories;

use MailPoet\DI\ContainerWrapper;
use MailPoet\Entities\DynamicSegmentFilterData;
use MailPoet\Entities\SegmentEntity;
use MailPoet\Segments\DynamicSegments\Filters\SubscriberScore;
use MailPoet\Segments\DynamicSegments\Filters\UserRole;
use MailPoet\Segments\DynamicSegments\SegmentSaveController;

class DynamicSegment extends Segment {

  private $filterData = [];

  /** @var SegmentSaveController */
  protected $saveController;

  public function __construct() {
    parent::__construct();
    $this->saveController = ContainerWrapper::getInstance()->get(SegmentSaveController::class);
  }

  public function withUserRoleFilter($role) {
    $this->filterData['segmentType'] = 'userRole';
    $this->filterData['wordpressRole'] = $role;
    $this->filterData['action'] = UserRole::TYPE;
    return $this;
  }

  public function withEngagementScoreFilter(int $score, string $operator) {
    $this->filterData['segmentType'] = 'userRole';
    $this->filterData['value'] = $score;
    $this->filterData['operator'] = $operator;
    $this->filterData['action'] = SubscriberScore::TYPE;
    return $this;
  }

  public function withWooCommerceProductFilter($productId) {
    $this->filterData['segmentType'] = 'woocommerce';
    $this->filterData['action'] = 'purchasedProduct';
    $this->filterData['operator'] = DynamicSegmentFilterData::OPERATOR_ANY;
    $this->filterData['product_ids'] = [$productId];
    return $this;
  }

  public function withWooCommerceCategoryFilter($categoryId) {
    $this->filterData['segmentType'] = 'woocommerce';
    $this->filterData['action'] = 'purchasedCategory';
    $this->filterData['operator'] = DynamicSegmentFilterData::OPERATOR_ANY;
    $this->filterData['category_ids'] = [$categoryId];
    return $this;
  }

  public function withWooCommerceNumberOfOrdersFilter() {
    $this->filterData['segmentType'] = 'woocommerce';
    $this->filterData['action'] = 'numberOfOrders';
    $this->filterData['number_of_orders_type'] = '=';
    $this->filterData['number_of_orders_count'] = '1';
    $this->filterData['days'] = '1';
    return $this;
  }

  public function withWooCommerceTotalSpentFilter(float $amount = 9, int $days = 1) {
    $this->filterData['segmentType'] = 'woocommerce';
    $this->filterData['action'] = 'totalSpent';
    $this->filterData['total_spent_type'] = '>';
    $this->filterData['total_spent_amount'] = $amount;
    $this->filterData['days'] = $days;
    return $this;
  }

  public function withWooCommerceSingleOrderValueFilter(float $amount = 10, int $days = 1) {
    $this->filterData['segmentType'] = 'woocommerce';
    $this->filterData['action'] = 'singleOrderValue';
    $this->filterData['single_order_value_type'] = '>';
    $this->filterData['single_order_value_amount'] = $amount;
    $this->filterData['days'] = $days;
    return $this;
  }

  public function withWooCommerceCustomerCountryFilter(array $countryCode = ['FR']) {
    $this->filterData['segmentType'] = 'woocommerce';
    $this->filterData['action'] = 'customerInCountry';
    $this->filterData['country_code'] = $countryCode;
    return $this;
  }

  public function create(): SegmentEntity {
    if (empty($this->filterData['segmentType'])) {
      $this->withUserRoleFilter('editor');
    }
    $data = $this->data;
    $data['filters'][] = $this->filterData;
    $segment = $this->saveController->save($data);
    if (($this->data['deleted_at'] ?? null) instanceof \DateTimeInterface) {
      $segment->setDeletedAt($this->data['deleted_at']);
      $this->entityManager->flush();
    }
    return $segment;
  }
}
