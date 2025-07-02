import ComponentView from 'core/js/views/componentView';

class TypewriterView extends ComponentView {
  postRender() {
    this.setReadyStatus();
    this.setupInviewCompletion('.component__widget');
  }
}

TypewriterView.template = 'typewriter.jsx';

export default TypewriterView;
