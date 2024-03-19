import {
  // We can remove the ts-expect-error comments once the types are available.
  // @ts-expect-error TS7016: Could not find a declaration file for module '@wordpress/block-editor'.
  __experimentalSpacingSizesControl as SpacingSizesControl,
  useSetting,
} from '@wordpress/block-editor';
import {
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  __experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { isEqual } from 'lodash';
import { EmailStyles, storeName } from '../../store';

export function DimensionsPanel() {
  const availableUnits = useSetting('spacing.units') as string[];
  const units = useCustomUnits({
    availableUnits,
  });

  const [mailpoetEmailData] = useEntityProp(
    'postType',
    'mailpoet_email',
    'mailpoet_data',
  );

  const { styles } = useSelect((select) => ({
    styles: select(storeName).getStyles(),
  }));
  const defaultPadding = styles.spacing.padding ?? undefined;
  const defaultBlockGap = styles.spacing.blockGap ?? undefined;

  const { updateEmailMailPoetTheme } = useDispatch(storeName);

  // Padding
  const paddingValues =
    mailpoetEmailData.theme?.styles?.spacing?.padding ?? defaultPadding;
  const resetPadding = () => {
    void updateEmailMailPoetTheme({
      ...mailpoetEmailData.theme,
      styles: {
        ...mailpoetEmailData.theme?.styles,
        spacing: {
          ...mailpoetEmailData.theme?.styles?.spacing,
          padding: defaultPadding ?? undefined,
        },
      },
    } as EmailStyles);
  };
  const setPaddingValues = (value) => {
    void updateEmailMailPoetTheme({
      ...mailpoetEmailData.theme,
      styles: {
        ...mailpoetEmailData.theme?.styles,
        spacing: {
          ...mailpoetEmailData.theme?.styles?.spacing,
          padding: value,
        },
      },
    } as EmailStyles);
  };

  // Block spacing
  const blockGapValue =
    mailpoetEmailData.theme?.styles?.spacing?.blockGap ?? defaultBlockGap;
  const resetBlockGap = () => {
    void updateEmailMailPoetTheme({
      ...mailpoetEmailData.theme,
      styles: {
        ...mailpoetEmailData.theme?.styles,
        spacing: {
          ...styles.spacing,
          blockGap: undefined,
        },
      },
    } as EmailStyles);
  };

  const setBlockGapValue = (value) => {
    void updateEmailMailPoetTheme({
      ...mailpoetEmailData.theme,
      styles: {
        ...mailpoetEmailData.theme?.styles,
        spacing: {
          ...mailpoetEmailData.theme?.styles?.spacing,
          blockGap: value.top || styles.spacing.blockGap,
        },
      },
    } as EmailStyles);
  };

  const resetAll = () => {
    void updateEmailMailPoetTheme({
      ...mailpoetEmailData.theme,
      styles: {
        ...mailpoetEmailData.theme?.styles,
        spacing: {
          ...styles.spacing,
          padding: defaultPadding ?? undefined,
          blockGap: defaultBlockGap ?? undefined,
        },
      },
    } as EmailStyles);
  };

  return (
    <ToolsPanel label={__('Dimensions', 'mailpoet')} resetAll={resetAll}>
      <ToolsPanelItem
        isShownByDefault
        hasValue={() => !isEqual(paddingValues, defaultPadding)}
        label={__('Padding')}
        onDeselect={() => resetPadding()}
        className="tools-panel-item-spacing"
      >
        <SpacingSizesControl
          allowReset
          values={paddingValues}
          onChange={setPaddingValues}
          label={__('Padding')}
          sides={['horizontal', 'vertical', 'top', 'left', 'right', 'bottom']}
          units={units}
        />
      </ToolsPanelItem>
      <ToolsPanelItem
        isShownByDefault
        label={__('Block spacing')}
        hasValue={() => blockGapValue !== defaultBlockGap}
        onDeselect={() => resetBlockGap()}
        className="tools-panel-item-spacing"
      >
        <SpacingSizesControl
          label={__('Block spacing')}
          min={0}
          onChange={setBlockGapValue}
          showSideInLabel={false}
          sides={['top']} // Use 'top' as the shorthand property in non-axial configurations.
          values={{ top: blockGapValue }}
          allowReset
        />
      </ToolsPanelItem>
    </ToolsPanel>
  );
}