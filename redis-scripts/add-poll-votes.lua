local hash_name, poll_name, user_id, poll_id = KEYS[1], KEYS[2], KEYS[3],
    KEYS[4]                                                                       --hash_name = poll_${}_votes, poll_name = poll_${}_voters
local curr_option, user_gender = tonumber(ARGV[1]), ARGV[2]


-- valid poll_option logic
local total_option = redis.call("HLEN", poll_name);
local prev_option = redis.call("HGET", hash_name, user_id);
if prev_option and prev_option == curr_option then
    return '{"status":"200", "message":"SUCCESS"}'
end
if prev_option then
    redis.call("HINCRBY", poll_name, prev_option, -1);
    redis.call("HDEL", hash_name, user_id);
end
redis.call("HINCRBY", poll_name, curr_option, 1);
redis.call("HSET", hash_name, user_id, curr_option);

return '{"status":"200", "message":"SUCCESS"}';
