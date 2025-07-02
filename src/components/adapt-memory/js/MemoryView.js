import ComponentView from 'core/js/views/componentView';

class MemoryView extends ComponentView {
  preRender() {
    this.setActiveItem = (...args) => this.model.setActiveItem(...args);
    this.setVisitedItems = (...args) => this.model.setVisitedItems(...args);
    this.resetActiveItems = () => this.model.resetActiveItems();
  }

  postRender() {
    this.setReadyStatus();
  }
}

MemoryView.template = 'memory.jsx';

export default MemoryView;
