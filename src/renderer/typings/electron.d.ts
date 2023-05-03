import Electron, { IpcRenderer } from 'electron';

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  ipcRenderer: IpcRenderer,
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
