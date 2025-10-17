import fastify from 'fastify'
import { Server as IOServer } from 'socket.io'
import { createServer } from 'http'

const FASTIFY_PORT = (() => {
  const rawPort = process.env.FASTIFY_PORT
  const parsed = rawPort ? Number.parseInt(rawPort, 10) : NaN
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 3010
})()

const fastifyServer = fastify({
  logger: true
})
fastifyServer.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})
fastifyServer.listen({ port: FASTIFY_PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err
  console.log(`Fastify server is running on ${address}`)
})


const SOCKET_IO_PORT = (() => {
  const rawPort = process.env.SOCKET_IO_PORT
  const parsed = rawPort ? Number.parseInt(rawPort, 10) : NaN
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 3011
})()

export default async function createWsServer() {
  const httpSever = createServer();
  const io = new IOServer(httpSever, {
    cors: { origin: true, methods: ['GET','POST'] },
    pingInterval: 20000,
    pingTimeout: 20000,
  });

  // 연결 이벤트 이름
  io.on('connection', (socket) => {
    console.log('[WS] connected', socket.id);
  });

  httpSever.listen(SOCKET_IO_PORT, '0.0.0.0', () => {
    console.log(`Socket.IO server is running on ${SOCKET_IO_PORT}`)
  });

  return { io, httpSever }
}
