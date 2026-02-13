local hash_name = KEYS[1]; -- poll_123_votes
local poll_name = KEYS[2]; -- poll_123
local user_id = KEYS[3];
local curr_option = ARGV[1];

if not hash_name or not poll_name or not user_id or not curr_option then
    redis.error_reply("MISSING KEYS OR ARGUMENT");
end

local prev_option = redis.call("HGET", hash_name, user_id);

if prev_option then
    redis.call("HINCRBY", poll_name, prev_option, -1);
    redis.call("HDEL", hash_name, user_id);
end

redis.call("HINCRBY", poll_name, curr_option, 1);
redis.call("HSET", hash_name, user_id, curr_option);
