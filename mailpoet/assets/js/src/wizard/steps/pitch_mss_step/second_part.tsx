import { useState } from '@wordpress/element';
import { useCallback } from 'react';
import ReactStringReplace from 'react-string-replace';
import { Heading } from 'common/typography/heading/heading';
import { MailPoet } from 'mailpoet';
import { Button, Input } from 'common';
import { OwnEmailServiceNote } from './own_email_service_note';

type MSSStepSecondPartPropType = {
  setStepPart: (newPart: string) => void;
  finishWizard: (redirect_url?: string) => void;
};

function MSSStepSecondPart({
  setStepPart,
  finishWizard,
}: MSSStepSecondPartPropType): JSX.Element {
  const [verifyButtonDisabled, setVerifyButtonDisabled] = useState(true);

  const maybeEnableVerifyButton = useCallback((event) => {
    if (event.target.value) {
      setVerifyButtonDisabled(false);
    } else {
      setVerifyButtonDisabled(true);
    }
  }, []);

  return (
    <>
      <Heading level={1}>
        {MailPoet.I18n.t('welcomeWizardMSSSecondPartTitle')}
      </Heading>

      <div className="mailpoet-gap" />
      <p>{MailPoet.I18n.t('welcomeWizardMSSSecondPartEnterKey')}</p>
      <p>
        {ReactStringReplace(
          MailPoet.I18n.t('welcomeWizardMSSSecondPartNoAccount'),
          /\[link](.*?)\[\/link]/g,
          (match, index) => (
            <a
              key={index}
              target="_blank"
              rel="noreferrer"
              href="https://account.mailpoet.com/?ref=plugin-wizard&utm_source=plugin&utm_medium=onboarding&utm_campaign=purchase"
            >
              {match}
            </a>
          ),
        )}
      </p>
      <div className="mailpoet-gap" />

      <label htmlFor="mailpoet-premium-key">
        <span className="mailpoet-wizard-label">
          {MailPoet.I18n.t('welcomeWizardMSSSecondPartInputLabel')}
        </span>
        <Input
          id="mailpoet-premium-key"
          name="mailpoet-premium-key"
          type="text"
          placeholder={MailPoet.I18n.t(
            'welcomeWizardMSSSecondPartInputPlaceholder',
          )}
          onChange={maybeEnableVerifyButton}
          isFullWidth
        />
      </label>

      <div className="mailpoet-gap" />
      <div className="mailpoet-gap" />

      <Button
        type="button"
        isFullWidth
        isDisabled={verifyButtonDisabled}
        onClick={() => setStepPart('third')}
      >
        {MailPoet.I18n.t('welcomeWizardMSSSecondPartButton')}
      </Button>

      <div className="mailpoet-gap" />
      <div className="mailpoet-gap" />

      <OwnEmailServiceNote finishWizard={finishWizard} />
    </>
  );
}

export { MSSStepSecondPart };
