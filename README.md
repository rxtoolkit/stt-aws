# @buccaneerai/stt-aws
> 👂 An RxJS operator for real-time speech-to-text (STT/S2T) streaming using the AWS Transcribe.

## Installation
This is a private package. It requires setting up access in your npm config.

```bash
yarn add @buccaneerai/stt-aws
```

⚠️ To run the AWS Transcribe pipeline, you'll need a valid ACCESS_KEY_ID and SECRET_ACCESS_KEY with permissions to run AWS Transcribe. You'll need to set these in the environment or else it will probably not work.  Unfortunately, this module does not auto-detect AWS credentials stored in `~/.aws`.

⚠️ node.js only. This has not been tested on Browsers but it might be possible to make it work.  If you get it working, please make a PR!

## API

### `toAWSTranscribe`
Stream audio speech data to AWS Transcribe via WebSocket and get transcripts back:
```js
import {map} from 'rxjs/operators';
import {toAWSTranscribe} from '@buccaneerai/stt-deepspeech';

// The pipeline can take a stream of audio chunks encoded as 
// LINEAR16 (PCM encoded as 16-bit integers) in the form of a Buffer
const buffer$ = pcmChunkEncodedAs16BitIntegers$.pipe(
  map(chunk => Buffer.from(chunk, 'base64')),
  toAWSTranscribe()
);
buffer$.subscribe(console.log); // log transcript output
```

> ⚠️ Pay attention to the endcoding of the audio data.  The operator only accepts PCM data encoded as 16-bit integers. For example, LINEAR16 encoding usually works.

## Guides
- [Introduction to audio data](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_concepts)