import ItemsComponentModel from 'core/js/models/itemsComponentModel';
import ItemModel from 'core/js/models/itemModel';

export default class MemoryModel extends ItemsComponentModel {
  setUpItems() {
    const items = this.get('_items') || [];
    items.forEach((item, index) => (item._index = index + 1));
    this.setChildren(new Backbone.Collection(_.shuffle(items), { model: ItemModel }));
  }

  restoreUserAnswers() {
    const savedItems = this.get('_userAnswer');
    if (!savedItems) return;
    const newItems = [];
    savedItems.forEach((index) => {
      if (index > 0) {
        const item = this.getItem(index);
        item.set('_isVisited', true);
        newItems.push(item);
      } else {
        newItems.push(this.getItem(Math.abs(-index)));
      }
    });

    this.setChildren(new Backbone.Collection(newItems, { model: ItemModel }));
  }

  storeUserAnswer() {
    const booleanArray = this.getChildren().map((child) => {
      if (child.get('_isVisited')) {
        return child.get('_index');
      } else {
        return -child.get('_index');
      }
    });
    this.set('_userAnswer', booleanArray);
  }

  setActiveItem(index) {
    const item = this.getItem(index);
    item.toggleActive();
  }

  setVisitedItems(indexes) {
    indexes.forEach((index) => {
      const item = this.getItem(parseInt(index));
      item.set('_isVisited', true);
    });
  }
}
