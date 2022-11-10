<?php declare(strict_types = 1);

namespace MailPoet\Automation\Engine\Storage;

use MailPoet\Automation\Engine\Data\Automation;
use MailPoet\Automation\Engine\Data\AutomationRun;
use MailPoet\Automation\Engine\Data\AutomationStatistics;

class AutomationStatisticsStorage {

  /** @var string  */
  private $table;

  /** @var \wpdb  */
  private $wpdb;

  public function __construct() {
    global $wpdb;
    $this->table = $wpdb->prefix . 'mailpoet_automation_runs';
    $this->wpdb = $wpdb;
  }

  /**
   * @param Automation ...$automations
   * @return AutomationStatistics[]
   * @throws \MailPoet\Automation\Engine\Exceptions\InvalidStateException
   */
  public function getAutomationStatisticsForAutomations(Automation ...$automations): array {
    if (empty($automations)) {
      return [];
    }
    $automationIds = array_map(
      function(Automation $automation): int {
        return $automation->getId();
      },
      $automations
    );
    $runMatrix = $this->queryRunsFor(...$automationIds);
    $statistics = [];
    foreach ($automations as $automation) {
      $statistics[$automation->getId()] = $this->buildAutomationStatisticFromMatrix($runMatrix, $automation->getId(), null);
    }
    return $statistics;
  }

  public function getAutomationStats(int $automationId, int $versionId = null): AutomationStatistics {
    return $this->buildAutomationStatisticFromMatrix(
      $this->queryRunsFor($automationId),
      $automationId,
      $versionId
    );
  }

  private function buildAutomationStatisticFromMatrix(array $matrix, int $automationId, int $versionId = null): AutomationStatistics {

    $automationMatrix = $matrix[$automationId] ?? [];
    $versionMatrix = $automationMatrix[$versionId] ?? [];
    if ($versionId === null) {
      foreach ($automationMatrix as $version) {
        foreach ($version as $status => $runs) {
          if (!isset($versionMatrix[$status])) {
            $versionMatrix[$status] = 0;
          }
          $versionMatrix[$status] += $runs;
        }
      }
    }
    $totals = (int)array_sum($versionMatrix);
    return new AutomationStatistics(
      $automationId,
      $totals,
      $versionMatrix[AutomationRun::STATUS_RUNNING] ?? 0,
      $versionId
    );
  }

  /**
   * Returns an array with all runs for all versions of the given automations
   * [
   *    <automation_id> => [
   *      <version_id> => [
   *        <status> => int,
   *      ],
   *   ],
   * ]
   * @param int ...$automationIds
   * @return array<int,array<int,array<string,int>>>
   */
  private function queryRunsFor(int ...$automationIds): array {
    $table = esc_sql($this->table);

    $sql = 'SELECT status,automation_id as workfowId,version_id as versionId,count(id) as runs FROM ' . $table . ' where automation_id IN (' . implode(',', $automationIds) . ') group by status,automation_id,version_id; ';

    $matrix = [];
    // All parameters are either escaped or type safe.
    // phpcs:ignore WordPressDotOrg.sniffs.DirectDB.UnescapedDBParameter
    $results = $this->wpdb->get_results($sql);
    if (!is_array($results) || !count($results)) {
      return $matrix;
    }
    foreach ($results as $result) {
      $matrix[(int)$result->workfowId][(int)$result->versionId][(string)$result->status] = (int)$result->runs;
    }
    return $matrix;
  }
}
