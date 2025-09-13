
// components/InitializeStoreLog.tsx
import { onMount, onCleanup } from 'solid-js';
import { initStoreLogger, destroyStoreLogger } from '../../stores/storeLogger';

const InitializeStoreLog = () => {
  onMount(() => {

    console.log('🔄 Initializing NanoStores logger...');
    initStoreLogger();

  });

  onCleanup(() => {
    console.log('🧹 Cleaning up NanoStores logger...');
    destroyStoreLogger();
  });
  return null;
};

export default InitializeStoreLog;