import { Button, ToolbarItem } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';
import { store } from '../../store';

// See:
//   https://github.com/WordPress/gutenberg/blob/5caeae34b3fb303761e3b9432311b26f4e5ea3a6/packages/edit-post/src/components/header/header-toolbar/index.js
//   https://github.com/WordPress/gutenberg/blob/0ee78b1bbe9c6f3e6df99f3b967132fa12bef77d/packages/edit-site/src/components/header/index.js

export function InserterToggle(): JSX.Element {
  const { isInserterOpened, showIconLabels } = useSelect(
    (select) => ({
      isInserterOpened: select(store).isInserterSidebarOpened(),
      showIconLabels: select(store).isFeatureActive('showIconLabels'),
    }),
    [],
  );

  const { toggleInserterSidebar } = useDispatch(store);

  return (
    <ToolbarItem
      as={Button}
      className="edit-site-header-toolbar__inserter-toggle"
      variant="primary"
      isPressed={isInserterOpened}
      onMouseDown={(event) => event.preventDefault()}
      onClick={toggleInserterSidebar}
      icon={plus}
      label={__('Toggle step inserter', 'mailpoet')}
      showTooltip={!showIconLabels}
    >
      {showIconLabels &&
        (!isInserterOpened ? __('Add', 'mailpoet') : __('Close', 'mailpoet'))}
    </ToolbarItem>
  );
}
