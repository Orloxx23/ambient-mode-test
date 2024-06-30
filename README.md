# YouTube Ambient Mode | *TEST*

![Imgur](https://i.imgur.com/CXkNvHF.png)

This project demonstrates how to recreate YouTube's Ambient Mode by synchronizing two YouTube players using React and the `react-youtube` library. The main player controls playback while a muted, lower-quality player follows closely in sync. The interface includes a time difference display, synchronization status, and inputs for video URL and synchronization settings.

## Features

- Two synchronized YouTube players
- One player is muted and lower quality
- Display of current time and time difference between players
- Synchronization status indicator
- Input fields for video URL, synchronization interval, and time difference threshold

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Orloxx23/ambient-mode-test.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ambient-mode-test
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## How It Works

### Component Structure

- **Player Component:** Contains the logic and structure for the two YouTube players.
- **InfoTable Component:** Displays the current times of both players, their difference, and a synchronization status message.
- **Input Component:** Allows users to input the video URL, synchronization interval, and time difference threshold.

### Detailed Explanation

#### State Variables

- `player1`, `player2`: Holds references to the YouTube player instances.
- `ready1`, `ready2`: Indicates if each player is ready.
- `player1Ref`, `player2Ref`: Refs to directly interact with the YouTube player instances.
- `player1Time`, `player2Time`: Stores the current time of each player.
- `message`: Stores error messages or status updates.
- `videoUrl`, `videoId`: Manages the URL and ID of the video to be played.
- `sync`: Indicates if synchronization is currently happening.
- `syncInterval`: Stores the interval ID for synchronization checks.
- `timeToSync`, `diffToSync`: Controls the synchronization interval and the time difference threshold.
- `size`: Holds the dimensions for the YouTube player.

#### Helper Functions

- `getVideoId(url)`: Extracts the video ID from a YouTube URL.

#### Effects

1. **URL Change Effect:** Extracts and sets the video ID whenever the `videoUrl` state changes.
2. **Synchronization Effect:** Checks every `timeToSync` seconds if the players are out of sync by more than `diffToSync` seconds, and if so, synchronizes them.
3. **Time Update Effect:** Updates the current time of both players every second.
4. **Sync Interval Cleanup Effect:** Clears the synchronization interval when the component unmounts or when `timeToSync` or `diffToSync` changes.

#### Synchronization Effect Explained

This effect ensures that the secondary player stays in sync with the primary player:

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    if (ready1 && ready2) {
      const currentTime1 = player1Ref.current.getCurrentTime();
      const currentTime2 = player2Ref.current.getCurrentTime();
      const diff = Math.abs(currentTime1 - currentTime2);
      if (diff > parseFloat(diffToSync) || diff < parseFloat(diffToSync * -1)) {
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
```

#### Explanation:

- **Interval Setup:** An interval is set to run every `timeToSync` seconds (converted to milliseconds).
- **Condition Check:** It first checks if both players are ready.
- **Get Current Times:** It retrieves the current playback times of both players.
- **Calculate Difference:** The difference between the two times is calculated.
- **Sync Condition:** If the difference exceeds the threshold defined by `diffToSync`, it adjusts the secondary player's time to match the primary player's time plus the difference. This ensures tight synchronization.
- **Sync Indicator:** A sync indicator is set to `true` for 300 milliseconds to show that synchronization is happening.
- **Cleanup:** The interval is cleared when the component unmounts or when `timeToSync` or `diffToSync` changes to prevent memory leaks.

#### YouTube Player Options

- `opts` and `optsMute`: Configuration options for the YouTube players, including disabling controls, muting, and setting initial quality.

#### Event Handlers

- `onPlayerReady1`, `onPlayerReady2`: Sets the player references and initial quality when the players are ready.
- `handleStateChange1`: Synchronizes the second player to match the state of the first player.
- `syncPlayers(mainPlayer, otherPlayer, playerState)`: Syncs the second player based on the first player's state.

### Rendering

- Two `YouTube` components are rendered with different configurations for the main and muted players.
- The `InfoTable` component displays the current times of both players, their difference, and a sync status message.
- Input fields for the video URL, synchronization interval, and time difference threshold.

### Example Usage

```jsx
// In your main component file
import Player from "./Player";

function App() {
  return (
    <div>
      <Player />
    </div>
  );
}

export default App;
```

### Input and Synchronization

- **URL Input:** Enter a valid YouTube URL to load a new video.
- **Synchronization Interval:** Adjust the frequency (in seconds) at which synchronization checks are performed.
- **Time Difference Threshold:** Set the maximum allowed time difference (in seconds) between the players before synchronizing.

## Information Table

##### The table displays:

- The current time of the primary player.
- The current time of the secondary player.
- The time difference between the two players.
- A synchronization status message indicating if the players are currently synchronizing.

## Conclusion

This project demonstrates how to synchronize two YouTube players in a React application using the react-youtube library. By following the steps and understanding the code structure, you can customize and extend this functionality for various use cases.
