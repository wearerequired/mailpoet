import { __ } from '@wordpress/i18n';
import { StepType } from '../../../../editor/store';
import { Icon } from './icon';
import { PremiumModalForStepEdit } from '../../../../../common/premium-modal';

const keywords = [
  // translators: noun, used as a search keyword for "Woo Subscription trial started" trigger
  __('woocommerce', 'mailpoet'),
  // translators: noun, used as a search keyword for "Woo Subscription trial started" trigger
  __('subscription', 'mailpoet'),
  // translators: noun, used as a search keyword for "Woo Subscription trial started" trigger
  __('trial', 'mailpoet'),
  // translators: adjective, used as a search keyword for "Woo Subscription trial started" trigger
  __('started', 'mailpoet'),
];
export const step: StepType = {
  key: 'woocommerce-subscriptions:trial-started',
  group: 'triggers',
  title: () => __('Woo Subscription trial started', 'mailpoet'),
  description: () =>
    __('Start the automation when a subscription trial starts.', 'mailpoet'),

  subtitle: () => __('Trigger', 'mailpoet'),
  keywords,
  foreground: '#2271b1',
  background: '#f0f6fc',
  icon: () => <Icon />,
  edit: () => (
    <PremiumModalForStepEdit
      tracking={{
        utm_medium: 'upsell_modal',
        utm_campaign: 'create_automation_editor_woo_subscription_trial_ended',
      }}
    >
      {__(
        'Starting an automation when a subscription trial starts is a premium feature.',
        'mailpoet',
      )}
    </PremiumModalForStepEdit>
  ),
} as const;
