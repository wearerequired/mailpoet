<?php declare(strict_types = 1);

namespace MailPoet\EmailEditor\Engine\Renderer\ContentRenderer;

use MailPoet\EmailEditor\Engine\EmailEditor;
use MailPoet\EmailEditor\Integrations\MailPoet\Blocks\BlockTypesController;

require_once __DIR__ . '/DummyBlockRenderer.php';

class ContentRendererTest extends \MailPoetTest {
  private ContentRenderer $renderer;

  private \WP_Post $emailPost;

  public function _before(): void {
    parent::_before();
    $this->diContainer->get(EmailEditor::class)->initialize();
    $this->diContainer->get(BlockTypesController::class)->initialize();
    $this->renderer = $this->diContainer->get(ContentRenderer::class);
    $this->emailPost = new \WP_Post((object)[
      'ID' => 1,
      'post_content' => '<!-- wp:paragraph --><p>Hello!</p><!-- /wp:paragraph -->',
    ]);
  }

  public function testItRendersContent(): void {
    $template = new \WP_Block_Template();
    $template->id = 'template-id';
    $template->content = '<!-- wp:mailpoet/email-content /-->';
    $content = $this->renderer->render(
      $this->emailPost,
      $template
    );
    verify($content)->stringContainsString('Hello!');
  }

  public function testItInlinesContentStyles(): void {
    $template = new \WP_Block_Template();
    $template->id = 'template-id';
    $template->content = '<!-- wp:mailpoet/email-content /-->';
    $rendered = $this->renderer->render($this->emailPost, $template);
    $paragraphStyles = $this->getStylesValueForTag($rendered, 'p');
    verify($paragraphStyles)->stringContainsString('margin:0');
    verify($paragraphStyles)->stringContainsString('display:block');
  }

  private function getStylesValueForTag($html, $tag): ?string {
    $html = new \WP_HTML_Tag_Processor($html);
    if ($html->next_tag($tag)) {
      return $html->get_attribute('style');
    }
    return null;
  }
}
