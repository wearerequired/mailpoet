import { __ } from '@wordpress/i18n';
import { DropdownMenu } from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';
import { useDuplicateButton } from '../menu';
import { Workflow } from '../../workflow';

type Props = {
  workflow: Workflow;
};

export function More({ workflow }: Props): JSX.Element {
  // Menu items are using custom hooks because the "DropdownMenu" component uses the "controls"
  // attribute rather than child components, but we need to render modal confirmation dialogs.
  const duplicate = useDuplicateButton(workflow);

  const menuItems = [duplicate].filter((item) => item);

  return (
    <>
      <DropdownMenu
        label={__('More', 'mailpoet')}
        icon={moreVertical}
        controls={menuItems.map(({ control }) => control)}
      />
    </>
  );
}
