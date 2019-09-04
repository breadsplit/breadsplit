import DefaultServer, { FirebaseServers } from './firebase_servers'

let FirebaseConfigEnv: Record<string, string> = {}
try {
  FirebaseConfigEnv = JSON.parse(process.env.FIREBASE_CONFIG || '{}')
}
catch {
  FirebaseConfigEnv = {}
}

const server = Object.values(FirebaseServers).find(i => i.projectId === FirebaseConfigEnv.projectId) || DefaultServer

export const SERVER_HOST = server.appUrl
