import components from 'core/js/components';
import MemoryView from './MemoryView';
import MemoryModel from './MemoryModel';

export default components.register('memory', {
  model: MemoryModel,
  view: MemoryView
});
