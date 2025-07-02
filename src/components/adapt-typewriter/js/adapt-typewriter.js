import components from 'core/js/components';
import TypewriterView from './TypewriterView';
import TypewriterModel from './TypewriterModel';

export default components.register('typewriter', {
  model: TypewriterModel,
  view: TypewriterView
});
