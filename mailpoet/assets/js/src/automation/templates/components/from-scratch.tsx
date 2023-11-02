import { Dispatch, ReactNode, useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { Hooks } from 'wp-js-hooks';
import { PremiumModal } from '../../../common/premium-modal';
import { Notice } from '../../../notices/notice';
import { FromScratchHookType } from '../../types/filters';

type FromScratchPremiumModalProps = {
  showModal: boolean;
  onClose: () => void;
};

function FromScratchPremiumModal({
  showModal,
  onClose,
}: FromScratchPremiumModalProps): JSX.Element | null {
  if (!showModal) {
    return null;
  }
  return (
    <PremiumModal
      onRequestClose={onClose}
      tracking={{
        utm_medium: 'upsell_modal',
        utm_campaign: 'create_automation_from_scratch',
      }}
    >
      {__('You cannot create automation from scratch.', 'mailpoet')}
    </PremiumModal>
  );
}

function fromScratchHook(callback: () => void, errorHandler: Dispatch<string>) {
  const fromScratchCallback: FromScratchHookType = Hooks.applyFilters(
    'mailpoet.automation.templates.from_scratch_button',
    () => {
      callback();
    },
  );
  fromScratchCallback(errorHandler);
}

type FromScratchButtonProps = {
  variant?: Button.Props['variant'];
  children?: ReactNode;
};

export function FromScratchButton({
  variant = 'secondary',
  children = __('From scratch', 'mailpoet'),
}: FromScratchButtonProps): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const [error, errorHandler] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const onClickScratchButton = useCallback(() => {
    fromScratchHook(() => {
      setShowModal(true);
    }, errorHandler);
  }, []);

  const premiumClose = () => {
    setShowModal(false);
    setIsBusy(false);
  };
  return (
    <>
      {error && (
        <Notice type="error" closable timeout={false}>
          <p>{error}</p>
        </Notice>
      )}
      <Button
        variant={variant}
        isBusy={isBusy}
        disabled={isBusy}
        onClick={() => {
          setIsBusy(true);
          onClickScratchButton();
        }}
      >
        {children}
      </Button>
      <FromScratchPremiumModal showModal={showModal} onClose={premiumClose} />
    </>
  );
}
