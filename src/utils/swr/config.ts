import { SWRConfiguration } from 'swr'

export const swrGlobalConfig: SWRConfiguration = {
  // Cache settings
  dedupingInterval: 2000,       // 2s - tránh duplicate requests
  revalidateOnFocus: false,     // không revalidate khi tab focus
  revalidateOnReconnect: true,  // revalidate khi reconnect
  refreshInterval: 0,           // no periodic revalidation
  errorRetryCount: 2,           // retry 2 lần khi fail
  errorRetryInterval: 5000,     // retry sau 5s

  // Error handling
  onError: (error, key) => {
    console.error('SWR Error:', error, 'Key:', key)
    // Có thể thêm Sentry/logging ở đây
  },

  // Success handling
  onSuccess: (data, key) => {
    console.log('SWR Success:', key, data)
  }
}

// Config cho specific types
export const swrConfigs = {
  auth: {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 phút cho auth
    errorRetryCount: 1
  },
  realtime: {
    refreshInterval: 30000, // 30s cho realtime data
    revalidateOnFocus: true
  },
  static: {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0
  }
}