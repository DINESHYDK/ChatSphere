local poll_name = KEYS[1]; --poll_123_votes --> stores no of votes for each option
local poll_id = KEYS[2];
local total_option = tonumber(ARGV[1]);
local poll_gender = ARGV[2];


for i = 0, total_option - 1, 1 do
  redis.call("HSET", poll_name, i, 0); -- i got converted to string automatically
end

redis.call("HSET", "poll_metadata", poll_id, poll_gender);

return "1_200"
