# @rxtk/stt-aws
> 👂 An RxJS operator for real-time speech-to-text (STT/S2T) streaming using the AWS Transcribe.

```bash
npm i @rxtk/stt-aws
```

```bash
yarn add @rxtk/stt-aws
```

⚠️ To run the AWS Transcribe pipeline, you'll need a valid ACCESS_KEY_ID and SECRET_ACCESS_KEY with permissions to run AWS Transcribe. You'll need to set these in the environment or else it will probably not work.  Unfortunately, this module does not auto-detect AWS credentials stored in `~/.aws`.

⚠️ node.js only. This has not been tested on Browsers but it might be possible to make it work.  If you get it working, please make a PR!

## API

### `toAWSTranscribe`
Stream audio speech data to AWS Transcribe via WebSocket and get transcripts back:
```js
import {map} from 'rxjs/operators';
import {toAWSTranscribe} from '@rxtk/stt-aws';

// The pipeline can take a stream of audio chunks encoded as 
// LINEAR16 (PCM encoded as 16-bit integers) in the form of a Buffer
const stt$ = pcmChunkEncodedAs16BitIntegers$.pipe(
  map(chunk => Buffer.from(chunk, 'base64')),
  toAWSTranscribe()
);
stt$.subscribe(console.log); // log transcript output
stt$.error$.subscribe(console.error) // handle WebSocket errors
```

> ⚠️ Pay attention to the endcoding of the audio data.  The operator only accepts PCM data encoded as 16-bit integers. For example, LINEAR16 encoding usually works.

## Guides
- [Introduction to audio data](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_concepts)
