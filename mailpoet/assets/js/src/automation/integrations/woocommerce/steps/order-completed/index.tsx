import { __, _x } from '@wordpress/i18n';
import { StepType } from '../../../../editor/store';
import { Icon } from './icon';

const keywords = [
  __('woocommerce', 'mailpoet'),
  __('order', 'mailpoet'),
  __('completed', 'mailpoet'),
];
export const step: StepType = {
  key: 'woocommerce:order-completed',
  group: 'triggers',
  title: () => __('Order completed', 'mailpoet'),
  description: () =>
    __('Start the automation when an order is completed.', 'mailpoet'),
  subtitle: () => _x('Trigger', 'noun', 'mailpoet'),
  keywords,
  foreground: '#2271b1',
  background: '#f0f6fc',
  icon: () => <Icon />,
  edit: () => null,
} as const;
