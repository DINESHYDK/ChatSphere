import { ROOT_DIR } from "@/config/paths";

export const ABSOLUTE_PATHS = {
  LUA: {
    ADD_POLL: `${ROOT_DIR}/redis-scripts/add-poll.lua`,
    ADD_POLL_VOTES: `${ROOT_DIR}/redis-scripts/add-poll-votes.lua`,
  },
};
