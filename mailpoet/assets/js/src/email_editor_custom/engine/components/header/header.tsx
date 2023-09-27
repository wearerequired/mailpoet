import { useRef } from '@wordpress/element';
import { PinnedItems } from '@wordpress/interface';
import { Button, ToolbarItem } from '@wordpress/components';
import { NavigableToolbar } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { plus, listView } from '@wordpress/icons';
import { MailPoetEmailData, storeName } from '../../store';

export function Header() {
  const inserterButton = useRef();
  const listviewButton = useRef();

  const { toggleInserterSidebar, toggleListviewSidebar, saveEditedEmail } =
    useDispatch(storeName);
  const { isInserterSidebarOpened, isListviewSidebarOpened, hasEdits } =
    useSelect(
      (select) => ({
        isInserterSidebarOpened: select(storeName).isInserterSidebarOpened(),
        isListviewSidebarOpened: select(storeName).isListviewSidebarOpened(),
        hasEdits: select(storeName).hasEdits(),
      }),
      [],
    );
  const [mailpoetEmailDa] = useEntityProp(
    'postType',
    'mailpoet_email',
    'mailpoet_data',
  );
  const mailpoetEmailData: MailPoetEmailData = mailpoetEmailDa;

  const preventDefault = (event) => {
    event.preventDefault();
  };

  const shortLabelInserter = !isInserterSidebarOpened ? __('Add') : __('Close');

  return (
    <div className="edit-post-header">
      <div className="edit-post-header__toolbar">
        <NavigableToolbar
          className="edit-post-header-toolbar"
          aria-label={__('Email document tools', 'mailpoet')}
        >
          <div className="edit-post-header-toolbar__left">
            <ToolbarItem
              ref={inserterButton}
              as={Button}
              className="edit-post-header-toolbar__inserter-toggle"
              variant="primary"
              isPressed={isInserterSidebarOpened}
              onMouseDown={preventDefault}
              onClick={toggleInserterSidebar}
              disabled={false}
              icon={plus}
              label={shortLabelInserter}
              showTooltip
              aria-expanded={isInserterSidebarOpened}
            />
            <ToolbarItem
              ref={listviewButton}
              as={Button}
              className="edit-post-header-toolbar__document-overview-toggle"
              variant="tertiary"
              isPressed={isListviewSidebarOpened}
              onMouseDown={preventDefault}
              onClick={toggleListviewSidebar}
              disabled={false}
              icon={listView}
              label={__('List view', 'mailpoet')}
              showTooltip
              aria-expanded={isInserterSidebarOpened}
            />
          </div>
        </NavigableToolbar>
        <div className="edit-post-header__center">Todo Email Name</div>
      </div>
      <div className="edit-post-header__settings">
        <Button variant="link" disabled={!hasEdits} onClick={saveEditedEmail}>
          {__('Save Draft', 'mailpoet')}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            window.location.href = `admin.php?page=mailpoet-newsletters#/send/${mailpoetEmailData.id}`;
          }}
        >
          {__('Send', 'mailpoet')}
        </Button>
        <PinnedItems.Slot scope={storeName} />
      </div>
    </div>
  );
}
