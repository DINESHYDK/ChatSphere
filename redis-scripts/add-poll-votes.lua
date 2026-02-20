local hash_name = KEYS[1]; -- poll_123_voters
local poll_name = KEYS[2]; --poll_123_votes
local user_id = KEYS[3];
local poll_id = KEYS[4];
local curr_option = tonumber(ARGV[1]);
local user_gender = ARGV[2];


if not KEYS[1] or not KEYS[2] or not KEYS[3] or not KEYS[4] or not ARGV[1] or not ARGV[2] then
    return '{"status":"400", "message":"MISSING_INPUT"}'
end

if redis.call("EXISTS", poll_name) == 0 then
    return '{"status":"400", "message":"INVALID_REQUEST"}'
end

-- valid poll_option logic
local total_option = redis.call("HLEN", poll_name);
local prev_option = redis.call("HGET", hash_name, user_id);
if ((prev_option and (prev_option < 0 or prev_option >= total_option)) or (curr_option < 0 or curr_option >= total_option)) then
    return '{"status":"400", "message":"INVALID_REQUEST"}'
end
if prev_option and prev_option == curr_option then
    return '{"status":"200", "message":"SUCCESS"}'
end

-- user gender logic
local poll_gender = redis.call("HGET", "poll_metadata", poll_id);
if (poll_gender ~= "A" and user_gender ~= poll_gender) then
    return '{"status":"403", "message":"FORBIDDEN_TO_VOTE"}'
end


if prev_option then
    redis.call("HINCRBY", poll_name, prev_option, -1);
    redis.call("HDEL", hash_name, user_id);
end
redis.call("HINCRBY", poll_name, curr_option, 1);
redis.call("HSET", hash_name, user_id, curr_option);


local poll_votes_sync_hash = poll_id .. "_sync_votes";
local poll_voters_sync_hash = poll_id .. "_sync_voters";

redis.call("HINCRBY", poll_votes_sync_hash, curr_option, 1);
redis.call("SADD", poll_voters_sync_hash, user_id);
redis.call("SADD", "polls_to_sync", poll_id);


local redis_sync_set_size = redis.call("SCARD", "polls_to_sync");
if redis_sync_set_size > 10 then
  local sync_arr = {};

end
return '{"status":"200", "startSync": "0", "message":"SUCCESS"}';
