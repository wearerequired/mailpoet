<?php declare(strict_types = 1);

namespace MailPoet\EmailEditor\Engine\Renderer\Preprocessors;

class CleanupPreprocessor implements Preprocessor {
  public function preprocess(array $parsedBlocks, array $layoutStyles): array {
    foreach ($parsedBlocks as $key => $block) {
      // https://core.trac.wordpress.org/ticket/45312
      // \WP_Block_Parser::parse_blocks() sometimes add a block with name null that can cause unexpected spaces in rendered content
      // This behavior was reported as an issue, but it was closed as won't fix
      if ($block['blockName'] === null) {
        unset($parsedBlocks[$key]);
      }
    }
    return array_values($parsedBlocks);
  }
}
