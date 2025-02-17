import { FontSizePicker } from '@wordpress/components';
import { useSetting } from '@wordpress/block-editor';
import { FontSizePickerProps } from '@wordpress/components/src/font-size-picker/types';

type Props = Pick<FontSizePickerProps, 'value' | 'onChange'>;

export function FontSizeSettings({ value, onChange }: Props): JSX.Element {
  const fontSizes = useSetting('typography.fontSizes');
  return (
    <FontSizePicker
      value={value}
      onChange={onChange}
      fontSizes={fontSizes}
      __nextHasNoMarginBottom
    />
  );
}
