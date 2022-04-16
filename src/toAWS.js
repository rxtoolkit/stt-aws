// copied from https://github.com/aws-samples/amazon-transcribe-websocket-static
// https://aws.amazon.com/blogs/aws/amazon-transcribe-streaming-now-supports-websockets/
// https://cloud.google.com/speech-to-text/docs/encoding
// https://docs.aws.amazon.com/transcribe/latest/dg/streaming.html
// https://docs.aws.amazon.com/transcribe/latest/dg/limits-guidelines.html
import {of, throwError} from 'rxjs';
import {map,takeUntil} from 'rxjs/operators';
import {conduit} from '@bottlenose/rxws';

import createAwsSignedUrl from './internals/createAwsSignedUrl';
import convertAudioToBinaryMessage from './internals/convertAudioToAWSBinaryMessage';
import decodeMessage from './internals/decodeAWSMessage';
import shortenChunks from './internals/shortenChunks';

const errors = {
  missingCredentials: () => new Error('toAWS operator requires AWS credentials'),
};

const toAWS = function toAWS({
  region = (process.env.AWS_REGION || 'us-east-1'),
  accessKeyId = process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
  stop$ = of(),
  isMedical = false, // use AWS Transcibe Medical vs AWS Transcribe (normal)
  specialty = 'PRIMARYCARE', // medical specialty (for AWS Transcibe Medical)
  type = 'CONVERSATION', // vs 'DICTATION' (for AWS Transcribe Medical)
  chunkSize = 512,
  useSpeakerLabels = true,
  _conduit = conduit,
  _serializer = audioBinary => convertAudioToBinaryMessage({audioBinary}),
  _deserializer = message => decodeMessage({message}),
  _getPresignedUrl = createAwsSignedUrl
} = {}) {
  // audio data should already be encoded as 16-bit PCM
  // with a sample rate of 16000 stored in a Buffer...
  return fileChunk$ => {
    if (!accessKeyId) return throwError(errors.missingCredentials());
    if (!secretAccessKey) return throwError(errors.missingCredentials());
    let url;
    try {
      url = _getPresignedUrl({
        region,
        accessKeyId,
        secretAccessKey,
        isMedical,
        type,
        specialty,
        useSpeakerLabels
      });
    } catch (err) {
      return throwError(err);
    }
    const message$ = fileChunk$.pipe(
      shortenChunks(chunkSize), // AWS will reject chunks that are too large
      // stream chunks to AWS websocket server and receive responses
      _conduit({url, serializer: _serializer, deserializer: _deserializer})
    );
    const error$ = get(message$, 'error$');
    let obs$ = message$.pipe(takeUntil(stop$));
    obs$.error$ = error$;
    return obs$;
  };
};

export default toAWS;
