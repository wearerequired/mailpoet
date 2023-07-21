import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { useSelector } from 'settings/store/hooks';
import { PremiumStatus } from 'settings/store/types';
import { Button } from 'common/button/button';
import { PremiumModal } from 'common/premium_modal';
import { useState } from 'react';

type ActiveMessageProps = { canUseSuccessClass: boolean };

function ActiveMessage(props: ActiveMessageProps) {
  return (
    <div
      className={classnames('mailpoet_success_item', {
        mailpoet_success: props.canUseSuccessClass,
      })}
    >
      {__('MailPoet Premium is active', 'mailpoet')}
    </div>
  );
}

type PremiumMessageProps = {
  message: string;
  buttonText: string;
};

function PremiumMessage(props: PremiumMessageProps) {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  return (
    <>
      <div className="mailpoet_error mailpoet_install_premium_message">
        {props.message}
      </div>
      <Button onClick={() => setShowPremiumModal(true)}>
        {props.buttonText}
      </Button>
      {showPremiumModal && (
        <PremiumModal
          onRequestClose={() => {
            setShowPremiumModal(false);
          }}
        >
          {__(
            'Your current MailPoet plan includes advanced features, but they require the MailPoet Premium plugin to be installed and activated.',
            'mailpoet',
          )}
        </PremiumModal>
      )}
    </>
  );
}

type NotValidMessageProps = { message?: string };

function NotValidMessage({ message }: NotValidMessageProps) {
  return (
    <div className="mailpoet_error">
      {message || __('Your key is not valid for MailPoet Premium', 'mailpoet')}
    </div>
  );
}

NotValidMessage.defaultProps = {
  message: '',
};

type Props = {
  keyMessage?: string;
  canUseSuccessClass: boolean;
};

export function PremiumMessages(props: Props) {
  const { premiumStatus: status } = useSelector('getKeyActivationState')();

  switch (status) {
    case PremiumStatus.VALID_PREMIUM_PLUGIN_ACTIVE:
      return <ActiveMessage canUseSuccessClass={props.canUseSuccessClass} />;
    case PremiumStatus.VALID_PREMIUM_PLUGIN_NOT_INSTALLED:
      return (
        <PremiumMessage
          message={__('MailPoet Premium is not installed.', 'mailpoet')}
          buttonText={__('Download MailPoet Premium plugin', 'mailpoet')}
        />
      );
    case PremiumStatus.VALID_PREMIUM_PLUGIN_NOT_ACTIVE:
      return (
        <PremiumMessage
          message={__(
            'MailPoet Premium is installed but not activated.',
            'mailpoet',
          )}
          buttonText={__('Activate MailPoet Premium plugin', 'mailpoet')}
        />
      );
    case PremiumStatus.INVALID:
      return <NotValidMessage message={props.keyMessage} />;
    default:
      return null;
  }
}

PremiumMessages.defaultProps = {
  keyMessage: '',
};
