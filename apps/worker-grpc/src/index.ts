import 'dotenv/config';
import {createServer, CallContext} from 'nice-grpc';
import {
  DeepPartial, 
  PingRequest, 
  PingResponse, 
  FeedServiceDefinition, 
  FeedServiceImplementation 
} from '@ararog/microblog-rpc';

const feedServiceImpl: FeedServiceImplementation = {
  async ping(
    request: PingRequest,
    context: CallContext
  ): Promise<DeepPartial<PingResponse>> {
    return {
      message: 'Pong'
    };
  },
};

const startServer = async () => {
  console.log('Starting server');
  const server = createServer();

  server.add(FeedServiceDefinition, feedServiceImpl);

  console.log('Server listening on', process.env.GRPC_HOST || '0.0.0.0:8080');
  await server.listen(process.env.GRPC_HOST || '0.0.0.0:8080');
}

startServer();