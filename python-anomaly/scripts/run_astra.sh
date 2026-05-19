#!/usr/bin/env bash
# Live anomaly detection from the Orbbec Astra camera on the JetAuto.
#
# The Astra publishes via the Orbbec ROS driver (not v4l2), so
# `growcast-anomaly capture` cannot open it directly. This script wires it
# in with two pieces:
#
#   1. `rosrun image_view extract_images` dumps frames as JPGs into a temp dir.
#   2. `growcast-anomaly watch` polls that dir and scores the newest frame.
#
# One Ctrl-C cleans up both: the pump is killed and the temp dir removed.
#
# Override defaults via env vars:
#   ASTRA_TOPIC   default /astra/rgb/image_raw
#   INTERVAL      default 2.0   (seconds per frame / poll)
#   HEATMAP_DIR   default /tmp/gc
#
# Extra flags pass through to `growcast-anomaly watch`:
#   INTERVAL=5.0 ./scripts/run_astra.sh --threshold 0.28

set -euo pipefail

TOPIC="${ASTRA_TOPIC:-/astra/rgb/image_raw}"
INTERVAL="${INTERVAL:-2.0}"
HEATMAP_DIR="${HEATMAP_DIR:-/tmp/gc}"
FRAME_DIR="$(mktemp -d -t growcast-astra-XXXXXX)"
mkdir -p "$HEATMAP_DIR"

PUMP_PID=""

cleanup() {
  local rc=$?
  if [[ -n "$PUMP_PID" ]] && kill -0 "$PUMP_PID" 2>/dev/null; then
    kill "$PUMP_PID" 2>/dev/null || true
    wait "$PUMP_PID" 2>/dev/null || true
  fi
  rm -rf "$FRAME_DIR"
  exit "$rc"
}
trap cleanup EXIT INT TERM

if ! command -v rosrun >/dev/null 2>&1; then
  echo "error: rosrun not on PATH — source your ROS setup first, e.g." >&2
  echo "       source /opt/ros/melodic/setup.bash" >&2
  exit 1
fi

if ! command -v growcast-anomaly >/dev/null 2>&1; then
  echo "error: growcast-anomaly not on PATH — activate the venv first, e.g." >&2
  echo "       source .venv/bin/activate" >&2
  exit 1
fi

echo "growcast-astra: topic=$TOPIC interval=${INTERVAL}s"
echo "                frames   -> $FRAME_DIR"
echo "                heatmaps -> $HEATMAP_DIR"
echo

# extract_images writes frame*.jpg into the current working directory, so we
# launch it from inside the temp dir.
( cd "$FRAME_DIR" && rosrun image_view extract_images \
    image:="$TOPIC" _sec_per_frame:="$INTERVAL" >/dev/null 2>&1 ) &
PUMP_PID=$!

growcast-anomaly watch "$FRAME_DIR" \
  --interval "$INTERVAL" \
  --json \
  --heatmap-dir "$HEATMAP_DIR" \
  "$@"
