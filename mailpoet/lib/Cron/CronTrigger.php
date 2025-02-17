<?php // phpcs:ignore SlevomatCodingStandard.TypeHints.DeclareStrictTypes.DeclareStrictTypesMissing

namespace MailPoet\Cron;

use MailPoet\Cron\Triggers\WordPress;
use MailPoet\Settings\SettingsController;

class CronTrigger {
  const METHOD_LINUX_CRON = 'Linux Cron';
  const METHOD_WORDPRESS = 'WordPress';
  const METHOD_ACTION_SCHEDULER = 'Action Scheduler';

  const METHODS = [
    'wordpress' => self::METHOD_WORDPRESS,
    'linux_cron' => self::METHOD_LINUX_CRON,
    'action_scheduler' => self::METHOD_ACTION_SCHEDULER,
    'none' => 'Disabled',
  ];

  const DEFAULT_METHOD = self::METHOD_ACTION_SCHEDULER;
  const SETTING_NAME = 'cron_trigger';

  /** @var WordPress */
  private $wordpressTrigger;

  /** @var SettingsController */
  private $settings;

  /** @var DaemonActionSchedulerRunner */
  private $cronActionScheduler;

  public function __construct(
    WordPress $wordpressTrigger,
    SettingsController $settings,
    DaemonActionSchedulerRunner $cronActionScheduler
  ) {
    $this->wordpressTrigger = $wordpressTrigger;
    $this->settings = $settings;
    $this->cronActionScheduler = $cronActionScheduler;
  }

  public function init(string $environment = '') {
    $currentMethod = $this->settings->get(self::SETTING_NAME . '.method');
    try {
      $this->cronActionScheduler->init($currentMethod === self::METHOD_ACTION_SCHEDULER);
      // setup WordPress cron method trigger only outside of cli environment
      if ($currentMethod === self::METHOD_WORDPRESS && $environment !== 'cli') {
        return $this->wordpressTrigger->run();
      }
      return false;
    } catch (\Exception $e) {
      // cron exceptions should not prevent the rest of the site from loading
    }
  }
}
