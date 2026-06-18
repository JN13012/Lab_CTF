export function getCurrentRoomStats(runtime, roomId) {
  return {
    commands: 0,
    hints: 0,
    flagAttempts: 0,
    ...(runtime.roomStats?.[roomId] || {}),
  };
}
