import mockedData from '~/mock/manager.json'

export interface MonitorContent {
  queue : number
  event_type: 'start' | 'stop' | 'MOCK_INTERVAL',
  monitor_id: number,
  half?: 'left' | 'right',
  screen_type?: 'mini' | 'maxi' | 'full',
  media_type?: 'video' | 'image',
  media?: string
  time?: number
}

export async function getContent(queue: number, monitorID: number): Promise<MonitorContent[]> {
  console.log('monitorID', monitorID);


  return mockedData.filter(mock => mock.queue === queue && mock.monitor_id === monitorID) as MonitorContent[]
}
