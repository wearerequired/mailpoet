import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import MailPoet from 'mailpoet';
import Hooks from 'wp-js-hooks';

import Listing from 'listing/listing.jsx';
import ListingTabs from 'newsletters/listings/tabs.jsx';

import {
  QueueMixin,
  StatisticsMixin,
  MailerMixin,
} from 'newsletters/listings/mixins.jsx';

const mailpoetTrackingEnabled = (!!(window.mailpoet_tracking_enabled));

const columns = [
  {
    name: 'subject',
    label: MailPoet.I18n.t('subject'),
  },
  {
    name: 'status',
    label: MailPoet.I18n.t('status'),
  },
  {
    name: 'segments',
    label: MailPoet.I18n.t('lists'),
  },
  {
    name: 'statistics',
    label: MailPoet.I18n.t('statistics'),
    display: mailpoetTrackingEnabled,
  },
  {
    name: 'sent_at',
    label: MailPoet.I18n.t('sentOn'),
  },
];

let newsletterActions = [
  {
    name: 'view',
    link: function link(newsletter) {
      return (
        <a href={newsletter.preview_url} target="_blank">
          {MailPoet.I18n.t('preview')}
        </a>
      );
    },
  },
];

Hooks.addFilter('mailpoet_newsletters_listings_notification_history_actions', StatisticsMixin.addStatsCTAAction);
newsletterActions = Hooks.applyFilters('mailpoet_newsletters_listings_notification_history_actions', newsletterActions);

const NewsletterListNotificationHistory = React.createClass({
  mixins: [QueueMixin, StatisticsMixin, MailerMixin],
  renderItem: function renderItem(newsletter, actions, meta) {
    const rowClasses = classNames(
      'manage-column',
      'column-primary',
      'has-row-actions'
    );

    const segments = newsletter.segments.map(segment => segment.name).join(', ');

    return (
      <div>
        <td className={rowClasses}>
          <strong>
            <a
              href={newsletter.preview_url}
              target="_blank"
            >{ newsletter.queue.newsletter_rendered_subject || newsletter.subject }</a>
          </strong>
          { actions }
        </td>
        <td className="column" data-colname={MailPoet.I18n.t('status')}>
          { this.renderQueueStatus(newsletter, meta.mta_log) }
        </td>
        <td className="column" data-colname={MailPoet.I18n.t('lists')}>
          { segments }
        </td>
        { (mailpoetTrackingEnabled === true) ? (
          <td className="column" data-colname={MailPoet.I18n.t('statistics')}>
            { this.renderStatistics(newsletter, undefined, meta.current_time) }
          </td>
        ) : null }
        <td className="column-date" data-colname={MailPoet.I18n.t('sentOn')}>
          { (newsletter.sent_at) ? MailPoet.Date.format(newsletter.sent_at) : MailPoet.I18n.t('notSentYet') }
        </td>
      </div>
    );
  },
  render: function render() {
    return (
      <div>
        <h1 className="title">
          {MailPoet.I18n.t('pageTitle')} <Link className="page-title-action" to="/new" data-automation-id="new_email">{MailPoet.I18n.t('new')}</Link>
        </h1>

        <ListingTabs tab="notification" />

        <Link
          className="page-title-action"
          to="/notification"
        >{MailPoet.I18n.t('backToPostNotifications')}</Link>

        <Listing
          limit={window.mailpoet_listing_per_page}
          location={this.props.location}
          params={this.props.params}
          endpoint="newsletters"
          type="notification_history"
          base_url="notification/history/:parent_id"
          onRenderItem={this.renderItem}
          columns={columns}
          item_actions={newsletterActions}
          auto_refresh
          sort_by="sent_at"
          sort_order="desc"
          afterGetItems={this.checkMailerStatus}
        />
      </div>
    );
  },
});

module.exports = NewsletterListNotificationHistory;
