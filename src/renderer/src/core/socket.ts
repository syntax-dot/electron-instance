import { SetWindowPositionData } from '@wm/shared/packet/data/data.set-window-position'
import { io } from 'socket.io-client'
import { Packet } from '@wm/shared/packet/packet'
import type { Socket } from 'socket.io-client'

export class WManagerSocket {
  private socket: Socket

  constructor(url: string, position: number) {
    this.socket = io(url, { autoConnect: false, query: { position } })
    this.socket.on('packet', this.handle.bind(this))
  }

  async connect() {
    return this.socket.connect()
  }

  handleSetWindowPosition(data: SetWindowPositionData) {
    window.electron.ipcRenderer.invoke('set-bounds', { x: data.x, y: data.y })
  }

  handle(packet: Packet<unknown>) {
    if (packet.name === 'set-window-position') {
      this.handleSetWindowPosition(packet.data as SetWindowPositionData)
    }
  }
}
