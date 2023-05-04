import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

export interface SetWindowPositionData {
  x: number
  y: number
}

export interface Packet<T> {
  name: string
  data: T
}

export function makePacket<T>(name: string, data: T): Packet<T> {
  return { data, name }
}


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
