<?php // phpcs:ignore SlevomatCodingStandard.TypeHints.DeclareStrictTypes.DeclareStrictTypesMissing

namespace MailPoet\Cron\Workers\SendingQueue;

use MailPoet\Entities\ScheduledTaskEntity;
use MailPoet\Entities\SendingQueueEntity;
use MailPoet\Mailer\MailerError;
use MailPoet\Mailer\MailerLog;
use MailPoet\Newsletter\Sending\ScheduledTaskSubscribersRepository;
use MailPoet\Newsletter\Sending\SendingQueuesRepository;

class SendingErrorHandler {
  /** @var ScheduledTaskSubscribersRepository */
  private $scheduledTaskSubscribersRepository;

  /** @var SendingThrottlingHandler */
  private $throttlingHandler;

  /** @var SendingQueuesRepository */
  private $sendingQueuesRepository;

  public function __construct(
    ScheduledTaskSubscribersRepository $scheduledTaskSubscribersRepository,
    SendingThrottlingHandler $throttlingHandler,
    SendingQueuesRepository $sendingQueuesRepository
  ) {
    $this->scheduledTaskSubscribersRepository = $scheduledTaskSubscribersRepository;
    $this->throttlingHandler = $throttlingHandler;
    $this->sendingQueuesRepository = $sendingQueuesRepository;
  }

  public function processError(
    MailerError $error,
    ScheduledTaskEntity $task,
    array $preparedSubscribersIds,
    array $preparedSubscribers
  ) {
    if ($error->getLevel() === MailerError::LEVEL_HARD) {
      return $this->processHardError($error);
    }
    $this->processSoftError($error, $task, $preparedSubscribersIds, $preparedSubscribers);
  }

  private function processHardError(MailerError $error) {
    if ($error->getRetryInterval() !== null) {
      MailerLog::processNonBlockingError($error->getOperation(), $error->getMessageWithFailedSubscribers(), $error->getRetryInterval());
    } else {
      $throttledBatchSize = null;
      if ($error->getOperation() === MailerError::OPERATION_CONNECT) {
        $throttledBatchSize = $this->throttlingHandler->throttleBatchSize();
      }
      MailerLog::processError($error->getOperation(), $error->getMessageWithFailedSubscribers(), null, false, $throttledBatchSize);
    }
  }

  private function processSoftError(MailerError $error, ScheduledTaskEntity $task, $preparedSubscribersIds, $preparedSubscribers) {
    foreach ($error->getSubscriberErrors() as $subscriberError) {
      $subscriberIdIndex = array_search($subscriberError->getEmail(), $preparedSubscribers);
      $message = $subscriberError->getMessage() ?: $error->getMessage();
      $this->scheduledTaskSubscribersRepository->saveError($task, $preparedSubscribersIds[$subscriberIdIndex], $message ?? '');
    }

    $queue = $task->getSendingQueue();

    if ($queue instanceof SendingQueueEntity) {
      $this->sendingQueuesRepository->updateCounts($queue);
    }
  }
}
