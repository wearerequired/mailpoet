import { Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { AutomationFlowSection, storeName } from '../../../store';
import { locale } from '../../../config';
import { Step } from '../../../../../../editor/components/automation/types';
import { openTab } from '../../../navigation/open_tab';

const compactFormatter = Intl.NumberFormat(locale.toString(), {
  notation: 'compact',
});
const percentFormatter = Intl.NumberFormat(locale.toString(), {
  style: 'percent',
});

function FailedStep({ step }: { step: Step }): JSX.Element | null {
  const { section } = useSelect(
    (s) =>
      ({
        section: s(storeName).getSection('automation_flow'),
      } as {
        section: AutomationFlowSection;
      }),
    [],
  );

  const { data } = section;

  const failed = data.step_data?.failed;
  const value = failed !== undefined ? failed[step.id] ?? 0 : 0;
  if (!value) {
    return null;
  }
  const percent =
    data.step_data.total > 0
      ? Math.round((value / data.step_data.total) * 100)
      : 0;
  const formattedValue = compactFormatter.format(value);
  const formattedPercent = percentFormatter.format(percent / 100);
  return (
    <div className="mailpoet-automation-analytics-step-failed">
      <p>
        {formattedPercent} ({formattedValue})
        <span>
          {
            // translators: "failed" as in "100 automation runs failed at this step".
            __('failed', 'mailpoet')
          }
        </span>
      </p>
    </div>
  );
}

export function StepFooter({ step }: { step: Step }): JSX.Element | null {
  const { section } = useSelect(
    (s) =>
      ({
        section: s(storeName).getSection('automation_flow'),
      } as {
        section: AutomationFlowSection;
      }),
    [],
  );

  const { data } = section;
  if (!data || step.type === 'trigger') {
    return null;
  }
  const waiting = data.step_data?.waiting;
  const value = waiting !== undefined ? waiting[step.id] ?? 0 : 0;
  const percent =
    data.step_data.total > 0
      ? Math.round((value / data.step_data.total) * 100)
      : 0;

  const formattedValue = compactFormatter.format(value);
  const formattedPercent = percentFormatter.format(percent / 100);
  return (
    <>
      <FailedStep step={step} />
      <Tooltip text={__('View subscribers', 'mailpoet')}>
        <div className="mailpoet-automation-analytics-step-footer">
          <p>
            <a
              href={addQueryArgs(window.location.href, {
                tab: 'automation-subscribers',
              })}
              onClick={(e) => {
                e.preventDefault();
                openTab('subscribers', {
                  filters: { status: [], step: [step.id] },
                });
              }}
            >
              {formattedPercent} ({formattedValue}){' '}
              <span>
                {
                  // translators: "waiting" as in "100 people are waiting for this step".
                  __('waiting', 'mailpoet')
                }
              </span>
            </a>
          </p>
        </div>
      </Tooltip>
    </>
  );
}