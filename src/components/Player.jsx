"use client";

import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import InfoTable from "./InfoTable";
import { Input } from "@/components/ui/input";

const Player = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);

  const [player1Time, setPlayer1Time] = useState(0);
  const [player2Time, setPlayer2Time] = useState(0);

  const [message, setMessage] = useState("");

  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/watch?v=UebSfjmQNvs"
  );
  const [videoId, setVideoId] = useState("UebSfjmQNvs");

  const [sync, setSync] = useState(false);

  const [syncInterval, setSyncInterval] = useState(null);
  const [timeToSync, setTimeToSync] = useState(0.5);
  const [diffToSync, setDiffToSync] = useState(0.003);

  const [size, setSize] = useState({
    width: 960,
    height: 540,
  });

  const getVideoId = (url) => {
    try {
      setMessage(null);
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get("v");
    } catch (error) {
      setMessage("Invalid URL");
      return null;
    }
  };

  useEffect(() => {
    const id = getVideoId(videoUrl);
    if (id) {
      setVideoId(id);
    } else {
      setMessage("Invalid URL");
    }
  }, [videoUrl]);

  const opts = {
    width: size.width,
    height: size.height,
    playerVars: {
      autoplay: 1,
      controls: 1,
      disablekb: 1,
      modestbranding: 1,
      mute: 0,
      rel: 0,
    },
  };

  const optsMute = {
    width: size.width,
    height: size.height,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      mute: 1,
      rel: 0,
    },
  };

  const onPlayerReady1 = (event) => {
    setPlayer1(event.target);
    setReady1(true);
    player1Ref.current = event.target;
    event.target.setPlaybackQuality("hd1080");
  };

  const onPlayerReady2 = (event) => {
    setPlayer2(event.target);
    setReady2(true);
    player2Ref.current = event.target;
    event.target.setPlaybackQuality("small");
  };

  const handleStateChange1 = (event) => {
    if (ready1 && ready2) {
      const playerState = event.data;
      syncPlayers(player1, player2, playerState);
    }
  };

  const syncPlayers = (mainPlayer, otherPlayer, playerState) => {
    const currentTime = mainPlayer.getCurrentTime();

    switch (playerState) {
      case 1: // Playing
        otherPlayer.seekTo(currentTime);
        otherPlayer.playVideo();
        break;
      case 2: // Paused
        otherPlayer.seekTo(currentTime);
        otherPlayer.pauseVideo();
        break;
      case 3: // Buffering
        otherPlayer.seekTo(currentTime);
        break;
      case 0: // Ended
        otherPlayer.stopVideo();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (ready1 && ready2) {
        const currentTime1 = player1Ref.current.getCurrentTime();
        const currentTime2 = player2Ref.current.getCurrentTime();
        const diff = Math.abs(currentTime1 - currentTime2);
        if (
          diff > parseFloat(diffToSync) ||
          diff < parseFloat(diffToSync * -1)
        ) {
          player2Ref.current.seekTo(Math.abs(currentTime1 + diff));
          setSync(true);
          setTimeout(() => {
            setSync(false);
          }, 300);
        }
      }
    }, timeToSync * 1000);
    setSyncInterval(interval);

    return () => {
      clearInterval(interval);
      clearInterval(syncInterval);
      setSyncInterval(null);
    };
  }, [ready1, ready2, timeToSync, diffToSync]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ready1 && ready2) {
        const currentTime1 = player1Ref.current.getCurrentTime();
        const currentTime2 = player2Ref.current.getCurrentTime();

        setPlayer1Time(currentTime1);
        setPlayer2Time(currentTime2);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [ready1, ready2]);

  useEffect(() => {
    clearInterval(syncInterval);
  }, [timeToSync, diffToSync]);

  return (
    <div className="relative aspect-video">
      <YouTube
        videoId={videoId} // Reemplaza VIDEO_ID con el ID del video
        opts={opts}
        onReady={onPlayerReady1}
        onStateChange={handleStateChange1}
        className="relative z-10"
      />
      <YouTube
        videoId={videoId} // Reemplaza VIDEO_ID con el ID del video
        opts={optsMute}
        onReady={onPlayerReady2}
        className="absolute top-0 left-0 blur-3xl scale-110"
      />

      <div className="relative z-10 flex flex-col mt-5">
        <InfoTable
          time1={player1Time}
          time2={player2Time}
          diff={player1Time - player2Time}
          message={message}
          sync={sync}
        />
        <div className="flex gap-2">
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <Input
            type="number"
            value={timeToSync}
            onChange={(e) => setTimeToSync(e.target.value)}
            className="w-20"
          />
          <Input
            type="number"
            value={diffToSync}
            onChange={(e) => setDiffToSync(e.target.value)}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
