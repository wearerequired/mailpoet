import React from 'react';
import MailPoet from 'mailpoet';

import {
  SegmentTypes,
  WordpressRoleFormItem,
  OnFilterChange,
  SubscriberActionTypes,
} from '../types';
import { WordpressRoleFields } from './subscriber_wordpress_role';
import { SubscribedDateFields, SubscribedDateOperator } from './subscriber_subscribed_date';

export function validateSubscriber(formItems: WordpressRoleFormItem): boolean {
  if ((!formItems.action) || (formItems.action === SubscriberActionTypes.WORDPRESS_ROLE)) {
    return !!formItems.wordpressRole;
  }
  if (!formItems.operator || !formItems.value) {
    return false;
  }
  if (
    formItems.operator === SubscribedDateOperator.BEFORE
    || formItems.operator === SubscribedDateOperator.AFTER
  ) {
    const re = new RegExp(/^\d+-\d+-\d+$/);
    return re.test(formItems.value);
  }
  if (
    formItems.operator === SubscribedDateOperator.IN_THE_LAST
    || formItems.operator === SubscribedDateOperator.NOT_IN_THE_LAST
  ) {
    const re = new RegExp(/^\d+$/);
    return re.test(formItems.value);
  }
  return false;
}

export const SubscriberSegmentOptions = [
  { value: SubscriberActionTypes.WORDPRESS_ROLE, label: MailPoet.I18n.t('segmentsSubscriber'), group: SegmentTypes.WordPressRole },
  { value: SubscriberActionTypes.SUBSCRIBED_DATE, label: MailPoet.I18n.t('subscribedDate'), group: SegmentTypes.WordPressRole },
];

const componentsMap = {
  [SubscriberActionTypes.WORDPRESS_ROLE]: WordpressRoleFields,
  [SubscriberActionTypes.SUBSCRIBED_DATE]: SubscribedDateFields,
};

interface Props {
  onChange: OnFilterChange;
  item: WordpressRoleFormItem;
}

export const SubscriberFields: React.FunctionComponent<Props> = ({ onChange, item }) => {
  let Component;
  if (!item.action) {
    Component = WordpressRoleFields;
  } else {
    Component = componentsMap[item.action];
  }

  if (!Component) return null;

  return (
    <Component
      item={item}
      onChange={onChange}
    />
  );
};
