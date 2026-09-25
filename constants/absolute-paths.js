import { ROOT_DIR } from "@/config/paths";

export const ABSOLUTE_PATHS = {
  LUA: {
    SAVE_POLL: `${ROOT_DIR}/redis-scripts/save-poll.lua`,
    SAVE_POLL_VOTES: `${ROOT_DIR}/redis-scripts/save-poll-votes.lua`,
  },
};
