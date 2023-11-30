import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup, Dropdown, MenuItem } from '@wordpress/components';
import { chevronDown, Icon } from '@wordpress/icons';
import { MailPoet } from 'mailpoet';
import { Heading } from 'common/typography/heading/heading';
import { Grid } from 'common/grid';
import { FilterSegmentTag, SegmentTags } from 'common';
import { NewsletterType } from './newsletter-type';

type Props = {
  newsletter: NewsletterType;
};

function NewsletterStatsInfo({ newsletter }: Props) {
  const newsletterDate =
    newsletter.queue.scheduled_at || newsletter.queue.created_at;
  return (
    <Grid.ThreeColumns className="mailpoet-stats-info">
      <div>
        <Heading level={1}>{newsletter.subject}</Heading>
        <div>
          <b>
            {MailPoet.Date.short(newsletterDate)}
            {' • '}
            {MailPoet.Date.time(newsletterDate)}
          </b>
        </div>
        {Array.isArray(newsletter.segments) && newsletter.segments.length && (
          <div>
            <span className="mailpoet-stats-info-key">
              {__('To', 'mailpoet')}
            </span>
            {': '}
            <SegmentTags dimension="large" segments={newsletter.segments} />
            <FilterSegmentTag newsletter={newsletter} dimension="large" />
          </div>
        )}
      </div>
      <div className="mailpoet-stats-info-sender-preview">
        <div>
          <div className="mailpoet-stats-info-key-value">
            <span className="mailpoet-stats-info-key">
              {__('From', 'mailpoet')}
              {': '}
            </span>
            {newsletter.sender_address ? newsletter.sender_address : '-'}
          </div>
          <div className="mailpoet-stats-info-key-value">
            <span className="mailpoet-stats-info-key">
              {__('Reply-to', 'mailpoet')}
              {': '}
            </span>
            {newsletter.reply_to_address ? newsletter.reply_to_address : '-'}
          </div>
          <div className="mailpoet-stats-info-key-value">
            <span className="mailpoet-stats-info-key">
              {__('GA campaign', 'mailpoet')}
              {': '}
            </span>
            {newsletter.ga_campaign ? newsletter.ga_campaign : '-'}
          </div>
        </div>
      </div>
      <div className="mailpoet-stats-info-sender-preview">
        <ButtonGroup>
          <Button
            href={newsletter.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            {__('Preview', 'mailpoet')}
          </Button>
          <Dropdown
            focusOnMount={false}
            popoverProps={{ placement: 'bottom-end' }}
            renderToggle={({ isOpen, onToggle }) => (
              <ButtonGroup>
                <Button href={newsletter.preview_url} variant="primary">
                  {__('Edit', 'mailpoet')}
                </Button>
                <Button onClick={onToggle} aria-expanded={isOpen}>
                  <Icon icon={chevronDown} size={24} />
                </Button>
              </ButtonGroup>
            )}
            renderContent={() => (
              <>
                {newsletter.type === 'notification' && (
                  <MenuItem variant="tertiary" onClick={() => {}}>
                    {__('Deactivate (Only for Post notifications)', 'mailpoet')}
                  </MenuItem>
                )}
                <MenuItem variant="tertiary" onClick={() => {}}>
                  {__('Duplicate')}
                </MenuItem>
                <MenuItem isDestructive onClick={() => {}}>
                  {__('Move to Trash')}
                </MenuItem>
              </>
            )}
          />
        </ButtonGroup>
      </div>
    </Grid.ThreeColumns>
  );
}

NewsletterStatsInfo.displayName = 'NewsletterStatsInfo';
export { NewsletterStatsInfo };
