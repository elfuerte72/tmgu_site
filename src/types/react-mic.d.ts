declare module 'react-mic' {
  import { Component } from 'react';

  export interface ReactMicProps {
    record: boolean;
    className?: string;
    onStop: (data: { blob: Blob; blobURL: string }) => void;
    onError?: (error: Error) => void;
    mimeType?: string;
    strokeColor?: string;
    backgroundColor?: string;
  }

  export class ReactMic extends Component<ReactMicProps> {}
}
