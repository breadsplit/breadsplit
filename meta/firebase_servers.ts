export interface FirebaseServer {
  name: string
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export type FirebaseServerName =
  | 'production'
  | 'development'
  | 'test'

export const FirebaseServers: Record<FirebaseServerName, FirebaseServer> = {
  production: {
    name: 'BreadSplit',
    apiKey: 'AIzaSyA959crhQz0tmrjpg7-2uVuTGOXjoy6WsU',
    authDomain: 'breadsplit-prod.firebaseapp.com',
    databaseURL: 'https://breadsplit-prod.firebaseio.com',
    projectId: 'breadsplit-prod',
    storageBucket: 'breadsplit-prod.appspot.com',
    messagingSenderId: '833804200396',
    appId: '1:833804200396:web:06c31ecfe6f1ce6c',
  },
  development: {
    name: 'BreadSplit Dev',
    apiKey: 'AIzaSyC6ury1bNqWRPB8gvUDEtzRmXykg-WalGc',
    authDomain: 'breadsplit-dev.firebaseapp.com',
    databaseURL: 'https://breadsplit-dev.firebaseio.com',
    projectId: 'breadsplit-dev',
    storageBucket: 'breadsplit-dev.appspot.com',
    messagingSenderId: '729380567565',
    appId: '1:729380567565:web:fbb2e12ef33baa19',
  },
  test: {
    name: 'BreadSplit Test',
    apiKey: 'AIzaSyCWnymN1sSTxnsdX65cMQ-NNM0I8KdHGOQ',
    authDomain: 'breadsplit-test.firebaseapp.com',
    databaseURL: 'https://breadsplit-test.firebaseio.com',
    projectId: 'breadsplit-test',
    storageBucket: 'breadsplit-test.appspot.com',
    messagingSenderId: '758227201981',
    appId: '1:758227201981:web:d05b2fce9b9846c6',
  },
}

export const CurrentServerName = (process.env.FIREBASE_SERVER || 'development') as FirebaseServerName

export default FirebaseServers[CurrentServerName]
