local json = cjson;

local hash_name = KEYS[1]; -- poll_123_voters -->stores which voters give which vote
local poll_name = KEYS[2]; --poll_123_votes --> stores no of votes for each option
local user_id = KEYS[3];
local poll_id = KEYS[4];
local curr_option = tonumber(ARGV[1]);
local user_gender = ARGV[2];


if redis.call("EXISTS", poll_name) == 0 then
    return "0_400"
end

-- valid poll_option logic
local total_option = redis.call("HLEN", poll_name);
local prev_option_json = redis.call("HGET", hash_name, user_id);
local prev_option = nil;
if (prev_option_json) then
    prev_option = tonumber(json.decode(prev_option_json).o);
end
if (curr_option < 0 or curr_option >= total_option) then
    return "0_400"
end
if prev_option and prev_option == curr_option then
    return "1_200"
end

-- user gender logic
local poll_gender = redis.call("HGET", "poll_metadata", poll_id);
if (poll_gender ~= "A" and user_gender ~= poll_gender) then
    return "0_403"
end

local poll_vote_obj = {
    o = curr_option, -- number
    g = user_gender  -- string
}

if prev_option then
    redis.call("HINCRBY", poll_name, prev_option, -1);
    redis.call("HDEL", hash_name, user_id);
end
redis.call("HINCRBY", poll_name, curr_option, 1);
redis.call("HSET", hash_name, user_id, json.encode(poll_vote_obj));


local poll_voters_sync_hash = poll_id .. "_sync_voters";

redis.call("SADD", "polls_to_sync", poll_id);

redis.call("HSET", poll_voters_sync_hash, user_id, json.encode(poll_vote_obj));

return "0_200"
