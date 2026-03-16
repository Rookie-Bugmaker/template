import store from 'store';
import expirePlugin from 'store/plugins/expire';
import eventsPlugin from 'store/plugins/events';

// plugin usage:
store.addPlugin(expirePlugin);
store.addPlugin(eventsPlugin);

export { store as localStorage };

export default store;
