'use client';

import { useRef, useState } from 'react';

export default function HumanEquationVoiceTestPage() {
  const [offerCreated, setOfferCreated] = useState(false);
  const [answerReceived, setAnswerReceived] = useState(false);
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false);
  const [connectionState, setConnectionState] = useState('new');
  const [iceState, setIceState] = useState('new');
  const [dataChannelState, setDataChannelState] = useState('not-created');
  const [remoteTrackReceived, setRemoteTrackReceived] = useState(false);
  const [serverErrorBody, setServerErrorBody] = useState('');
  const [clientError, setClientError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const pcRef = useRef(null);
  const dcRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const startVoiceTest = async () => {
    setIsStarting(true);
    setClientError('');
    setServerErrorBody('');
    setOfferCreated(false);
    setAnswerReceived(false);
    setRemoteDescriptionSet(false);
    setRemoteTrackReceived(false);

    try {
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const remoteAudio = document.createElement('audio');
      remoteAudio.autoplay = true;
      remoteAudioRef.current = remoteAudio;

      pc.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        setRemoteTrackReceived(true);
      };

      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState);
      };

      pc.oniceconnectionstatechange = () => {
        setIceState(pc.iceConnectionState);
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = mediaStream.getAudioTracks()[0];
      pc.addTrack(audioTrack, mediaStream);

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      setDataChannelState(dc.readyState);
      dc.onopen = () => setDataChannelState(dc.readyState);
      dc.onclose = () => setDataChannelState(dc.readyState);

      const offer = await pc.createOffer();
      setOfferCreated(true);

      await pc.setLocalDescription(offer);

      const response = await fetch('/api/human-equation-voice-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      const answerText = await response.text();

      if (!response.ok) {
        setServerErrorBody(answerText || `HTTP ${response.status}`);
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      setAnswerReceived(true);

      await pc.setRemoteDescription({
        type: 'answer',
        sdp: answerText,
      });

      setRemoteDescriptionSet(true);
    } catch (error) {
      setClientError(error.message || 'Unknown client error');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>OpenAI GA Realtime Voice Test</h1>
      <p>
        Clean isolated route to verify GA Realtime WebRTC connectivity independent of Human Equation.
      </p>

      <button type="button" onClick={startVoiceTest} disabled={isStarting}>
        {isStarting ? 'Starting…' : 'Start Voice Test'}
      </button>

      <ul style={{ marginTop: '1.25rem', lineHeight: 1.7 }}>
        <li>offer created: {offerCreated ? 'yes' : 'no'}</li>
        <li>answer received: {answerReceived ? 'yes' : 'no'}</li>
        <li>setRemoteDescription success: {remoteDescriptionSet ? 'yes' : 'no'}</li>
        <li>peer connection state: {connectionState}</li>
        <li>ICE state: {iceState}</li>
        <li>data channel state: {dataChannelState}</li>
        <li>remote audio track received: {remoteTrackReceived ? 'yes' : 'no'}</li>
      </ul>

      {serverErrorBody ? (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '0.75rem' }}>
          server error body: {serverErrorBody}
        </pre>
      ) : null}

      {clientError ? (
        <p style={{ color: '#b00020' }}>client error: {clientError}</p>
      ) : null}
    </main>
  );
}
