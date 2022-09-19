import { PanelBody } from '@wordpress/components';
import { dispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { uniq } from 'lodash';
import { storeName } from '../../../../../editor/store';
import { PlainBodyTitle } from '../../../../../editor/components/panel';
import { userRoles } from './role';
import { FormTokenField } from '../../../components/form-token-field';

export function RolePanel(): JSX.Element {
  const { selectedStep } = useSelect(
    (select) => ({
      selectedStep: select(storeName).getSelectedStep(),
    }),
    [],
  );

  const anyValue = {
    id: '',
    name: __('Any user role', 'mailpoet'),
  };

  const rawSelected = selectedStep.args?.roles
    ? (selectedStep.args.roles as string[])
    : [];
  const selected = userRoles.filter((role): boolean =>
    rawSelected.includes(role.id as string),
  );
  if (!selected.length) {
    selected.push(anyValue);
  }
  return (
    <PanelBody opened>
      <PlainBodyTitle title={__('Trigger settings', 'mailpoet')} />
      <FormTokenField
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // The following error seems to be a mismatch. It claims the 'label' prop does not exist, but it does.
        label={__('When WordPress user role is:', 'mailpoet')}
        selected={selected}
        suggestions={uniq(userRoles)}
        anyValue={anyValue}
        anyValueIsDefault
        onChange={(items) => {
          dispatch(storeName).updateStepArgs(
            selectedStep.id,
            'roles',
            items.map((item) => item.id),
          );
        }}
      />
    </PanelBody>
  );
}
