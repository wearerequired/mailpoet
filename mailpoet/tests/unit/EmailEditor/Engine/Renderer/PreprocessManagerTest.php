<?php declare(strict_types = 1);

namespace unit\EmailEditor\Engine\Renderer;

use MailPoet\EmailEditor\Engine\Renderer\PreprocessManager;
use MailPoet\EmailEditor\Engine\Renderer\Preprocessors\CleanupPreprocessor;
use MailPoet\EmailEditor\Engine\Renderer\Preprocessors\TopLevelPreprocessor;

class PreprocessManagerTest extends \MailPoetUnitTest {
  public function testItCallsPreprocessorsProperly(): void {
    $layoutStyles = [
      'width' => 600,
      'background' => '#ffffff',
      'padding' => [
        'bottom' => 0,
        'left' => 0,
        'right' => 0,
        'top' => 0,
      ],
    ];
    $topLevel = $this->createMock(TopLevelPreprocessor::class);
    $topLevel->expects($this->once())->method('preprocess')->willReturn([]);

    $cleanup = $this->createMock(CleanupPreprocessor::class);
    $cleanup->expects($this->once())->method('preprocess')->willReturn([]);

    $secondPreprocessor = $this->createMock(TopLevelPreprocessor::class);
    $secondPreprocessor->expects($this->once())->method('preprocess')->willReturn([]);

    $preprocessManager = new PreprocessManager($cleanup, $topLevel);
    $preprocessManager->registerPreprocessor($secondPreprocessor);
    expect($preprocessManager->preprocess([], $layoutStyles))->equals([]);
  }
}
