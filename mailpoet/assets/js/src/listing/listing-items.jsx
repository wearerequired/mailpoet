import { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';

import { Grid } from 'common/grid';
import { ListingBulkActions } from 'listing/bulk-actions.jsx';
import { ListingItem } from 'listing/listing-item.jsx';

// eslint-disable-next-line react/prefer-stateless-function, max-len
class ListingItems extends Component {
  render() {
    if (this.props.items.length === 0) {
      let message;
      if (this.props.loading === true) {
        message =
          (this.props.messages.onLoadingItems &&
            this.props.messages.onLoadingItems(this.props.group)) ||
          __('Loading ...', 'mailpoet');
      } else {
        message =
          (this.props.messages.onNoItemsFound &&
            this.props.messages.onNoItemsFound(
              this.props.group,
              this.props.search,
            )) ||
          __('No items found.', 'mailpoet');
      }

      return (
        <tbody>
          <tr className="mailpoet-listing-no-items">
            <td
              colSpan={
                this.props.columns.length + (this.props.is_selectable ? 1 : 0)
              }
              className="colspanchange"
            >
              {message}
            </td>
          </tr>
        </tbody>
      );
    }

    const isSelectAllHidden =
      this.props.selection === false || this.props.count <= this.props.limit;
    const areBulkActionsHidden = !(
      this.props.selected_ids.length > 0 || this.props.selection
    );

    const actionAndSelectAllRowClasses = classnames(
      'mailpoet-listing-actions-and-select-all-row',
      {
        mailpoet_hidden: areBulkActionsHidden && isSelectAllHidden,
      },
    );
    const selectAllClasses = classnames('mailpoet-listing-select-all', {
      mailpoet_hidden: isSelectAllHidden,
    });

    return (
      <tbody>
        <tr className={actionAndSelectAllRowClasses}>
          <td
            colSpan={
              this.props.columns.length + (this.props.is_selectable ? 1 : 0)
            }
          >
            <Grid.SpaceBetween verticalAlign="center">
              <div className="mailpoet-listing-bulk-actions-container">
                {!areBulkActionsHidden && (
                  <ListingBulkActions
                    count={this.props.count}
                    bulk_actions={this.props.bulk_actions}
                    selection={this.props.selection}
                    selected_ids={this.props.selected_ids}
                    onBulkAction={this.props.onBulkAction}
                  />
                )}
              </div>
              <div className={selectAllClasses}>
                {this.props.selection !== 'all'
                  ? __('All items on this page are selected.', 'mailpoet')
                  : __('All %d items are selected.', 'mailpoet').replace(
                      '%d',
                      this.props.count.toLocaleString(),
                    )}
                &nbsp;
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    this.props.onSelectAll(event);
                  }}
                >
                  {this.props.selection !== 'all'
                    ? __('Select all items on all pages', 'mailpoet')
                    : __('Clear selection', 'mailpoet')}
                </a>
                .
              </div>
            </Grid.SpaceBetween>
          </td>
        </tr>

        {this.props.items.map((item) => {
          const renderItem = item;
          renderItem.id = parseInt(item.id, 10);
          renderItem.selected =
            this.props.selected_ids.indexOf(renderItem.id) !== -1;
          let key = `item-${renderItem.id}-${item.id}`;
          if (typeof this.props.getListingItemKey === 'function') {
            key = this.props.getListingItemKey(item);
          }

          return (
            <ListingItem
              columns={this.props.columns}
              isItemInactive={this.props.isItemInactive}
              onSelectItem={this.props.onSelectItem}
              onRenderItem={this.props.onRenderItem}
              onDeleteItem={this.props.onDeleteItem}
              onRestoreItem={this.props.onRestoreItem}
              onTrashItem={this.props.onTrashItem}
              onRefreshItems={this.props.onRefreshItems}
              selection={this.props.selection}
              is_selectable={this.props.is_selectable}
              item_actions={this.props.item_actions}
              group={this.props.group}
              location={this.props.location}
              key={key}
              item={renderItem}
              isItemDeletable={this.props.isItemDeletable}
              isItemToggleable={this.props.isItemToggleable}
            />
          );
        })}
      </tbody>
    );
  }
}

ListingItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired,
  messages: PropTypes.shape({
    onLoadingItems: PropTypes.func,
    onNoItemsFound: PropTypes.func,
  }).isRequired,
  group: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line react/forbid-prop-types
  is_selectable: PropTypes.bool.isRequired,
  selection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  count: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selected_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  getListingItemKey: PropTypes.func,
  onSelectItem: PropTypes.func.isRequired,
  onRenderItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onRestoreItem: PropTypes.func.isRequired,
  onTrashItem: PropTypes.func.isRequired,
  onRefreshItems: PropTypes.func.isRequired,
  isItemInactive: PropTypes.func.isRequired,
  item_actions: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line react/forbid-prop-types
  bulk_actions: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line react/forbid-prop-types
  onBulkAction: PropTypes.func.isRequired,
  search: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  isItemDeletable: PropTypes.func,
  isItemToggleable: PropTypes.func,
};

ListingItems.defaultProps = {
  getListingItemKey: undefined,
  search: undefined,
  location: undefined,
  isItemDeletable: () => true,
  isItemToggleable: () => false,
};

export { ListingItems };
