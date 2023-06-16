<?php declare(strict_types = 1);

namespace MailPoet\Automation\Integrations\MailPoet\Analytics\Controller;

use MailPoet\Automation\Engine\Data\Automation;
use MailPoet\Automation\Engine\Data\Step;
use MailPoet\Automation\Integrations\MailPoet\Actions\SendEmailAction;
use MailPoet\Automation\Integrations\MailPoet\Analytics\Entities\Query;
use MailPoet\Entities\StatisticsClickEntity;
use MailPoet\Entities\StatisticsOpenEntity;
use MailPoet\Newsletter\NewslettersRepository;
use MailPoet\Newsletter\Statistics\NewsletterStatisticsRepository;
use MailPoet\Newsletter\Statistics\WooCommerceRevenue;
use MailPoet\WooCommerce\Helper;

class OverviewStatisticsController {
  /** @var NewslettersRepository */
  private $newslettersRepository;

  /** @var NewsletterStatisticsRepository */
  private $newsletterStatisticsRepository;

  /** @var Helper */
  private $wooCommerceHelper;

  public function __construct(
    NewslettersRepository $newslettersRepository,
    NewsletterStatisticsRepository $newsletterStatisticsRepository,
    Helper $wooCommerceHelper
  ) {
    $this->newslettersRepository = $newslettersRepository;
    $this->newsletterStatisticsRepository = $newsletterStatisticsRepository;
    $this->wooCommerceHelper = $wooCommerceHelper;
  }

  public function getStatisticsForAutomation(Automation $automation, Query $query): array {
    $emails = $this->getEmailsFromAutomation($automation);
    $formattedEmptyRevenue = $this->wooCommerceHelper->getRawPrice(
      0,
      [
        'currency' => $this->wooCommerceHelper->getWoocommerceCurrency(),
      ]
    );
    $data = [
      'sent' => ['current' => 0, 'previous' => 0],
      'opened' => ['current' => 0, 'previous' => 0],
      'clicked' => ['current' => 0, 'previous' => 0],
      'orders' => ['current' => 0, 'previous' => 0],
      'unsubscribed' => ['current' => 0, 'previous' => 0],
      'revenue' => ['current' => 0, 'previous' => 0],
      'revenue_formatted' => [
        'current' => $formattedEmptyRevenue,
        'previous' => $formattedEmptyRevenue,
      ],
      'emails' => [],
    ];
    if (!$emails) {
      return $data;
    }

    $requiredData = [
      'totals',
      StatisticsClickEntity::class,
      StatisticsOpenEntity::class,
      WooCommerceRevenue::class,
    ];

    $currentStatistics = $this->newsletterStatisticsRepository->getBatchStatistics(
      $emails,
      $query->getPrimaryAfter(),
      $query->getPrimaryBefore(),
      $requiredData
    );
    foreach ($currentStatistics as $newsletterId => $statistic) {
      $data['sent']['current'] += $statistic->getTotalSentCount();
      $data['opened']['current'] += $statistic->getOpenCount();
      $data['clicked']['current'] += $statistic->getClickCount();
      $data['unsubscribed']['current'] += $statistic->getUnsubscribeCount();
      $data['orders']['current'] += $statistic->getWooCommerceRevenue() ? $statistic->getWooCommerceRevenue()->getOrdersCount() : 0;
      $data['revenue']['current'] += $statistic->getWooCommerceRevenue() ? $statistic->getWooCommerceRevenue()->getValue() : 0;
      $newsletter = $this->newslettersRepository->findOneById($newsletterId);
      $data['emails'][$newsletterId]['id'] = $newsletterId;
      $data['emails'][$newsletterId]['name'] = $newsletter ? $newsletter->getSubject() : '';
      $data['emails'][$newsletterId]['sent']['current'] = $statistic->getTotalSentCount();
      $data['emails'][$newsletterId]['opened']['current'] = $statistic->getOpenCount();
      $data['emails'][$newsletterId]['clicked']['current'] = $statistic->getClickCount();
      $data['emails'][$newsletterId]['unsubscribed']['current'] = $statistic->getUnsubscribeCount();
      $data['emails'][$newsletterId]['orders']['current'] = $statistic->getWooCommerceRevenue() ? $statistic->getWooCommerceRevenue()->getOrdersCount() : 0;
      $data['emails'][$newsletterId]['revenue']['current'] = $statistic->getWooCommerceRevenue() ? $statistic->getWooCommerceRevenue()->getValue() : 0;
      $data['emails'][$newsletterId]['revenue_formatted']['current'] = $this->wooCommerceHelper->getRawPrice(
        $data['emails'][$newsletterId]['revenue']['current'],
        [
          'currency' => $this->wooCommerceHelper->getWoocommerceCurrency(),
        ]
      );
      $data['emails'][$newsletterId]['order'] = count($data['emails']);
    }

    $previousStatistics = $this->newsletterStatisticsRepository->getBatchStatistics(
      $emails,
      $query->getSecondaryAfter(),
      $query->getSecondaryBefore(),
      $requiredData
    );

    foreach ($previousStatistics as $newsletterId => $statistic) {
      $data['sent']['previous'] += $statistic->getTotalSentCount();
      $data['opened']['previous'] += $statistic->getOpenCount();
      $data['clicked']['previous'] += $statistic->getClickCount();
      $data['unsubscribed']['previous'] += $statistic->getUnsubscribeCount();
      $data['orders']['previous'] += $statistic->getWooCommerceRevenue() ? $statistic->getWooCommerceRevenue()->getOrdersCount() : 0;
      $data['revenue']['previous'] += $statistic->getWooCommerceRevenue() ? $statistic->getWooCommerceRevenue()->getValue() : 0;
      $data['emails'][$newsletterId]['sent']['previous'] = $statistic->getTotalSentCount();
      $data['emails'][$newsletterId]['opened']['previous'] = $statistic->getOpenCount();
      $data['emails'][$newsletterId]['clicked']['previous'] = $statistic->getClickCount();
      $data['emails'][$newsletterId]['unsubscribed']['previous'] = $statistic->getUnsubscribeCount();
      $data['emails'][$newsletterId]['orders']['previous'] = $statistic->getWooCommerceRevenue() ? $statistic->getWooCommerceRevenue()->getOrdersCount() : 0;
      $data['emails'][$newsletterId]['revenue']['previous'] = $statistic->getWooCommerceRevenue() ? $statistic->getWooCommerceRevenue()->getValue() : 0;
      $data['emails'][$newsletterId]['revenue_formatted']['current'] = $this->wooCommerceHelper->getRawPrice(
        $data['emails'][$newsletterId]['revenue']['current'],
        [
          'currency' => $this->wooCommerceHelper->getWoocommerceCurrency(),
        ]
      );
    }

    $data['revenue_formatted']['current'] = $this->wooCommerceHelper->getRawPrice(
      $data['revenue']['current'],
      [
        'currency' => $this->wooCommerceHelper->getWoocommerceCurrency(),
      ]
    );

    $data['revenue_formatted']['previous'] = $this->wooCommerceHelper->getRawPrice(
      $data['revenue']['previous'],
      [
        'currency' => $this->wooCommerceHelper->getWoocommerceCurrency(),
      ]
    );

    return $data;
  }

  private function getEmailsFromAutomation(Automation $automation): array {
    return array_filter(array_map(
      function (Step $step) {
        $emailId = $step->getArgs()['email_id'] ?? null;
        if (!$emailId) {
          return null;
        }
        return $this->newslettersRepository->findOneById((int)$emailId);
      },
      array_filter(
        array_values($automation->getSteps()),
        function ($step) {
          return in_array(
            $step->getKey(),
            [
              SendEmailAction::KEY,
            ],
            true
          );
        }
      )
    ));
  }
}
