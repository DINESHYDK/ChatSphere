if true then
  local str = '{"name":"Vishesh","age":18,"state":"haryana"}';
 return redis.error_reply(str);
end


local poll_name = KEYS[1]; --poll_123_votes
local poll_id = KEYS[2];
local total_option = tonumber(ARGV[1]);
local poll_gender = ARGV[2];

if not poll_name or not total_option then
  return redis.error_reply("MISSING KEY OR ARGUMENT");
end

if total_option > 6 then
  return redis.error_reply("TOO_MUCH_OPTIONS");
end
for i = 0, total_option - 1, 1 do
  redis.call("HSET", poll_name, i, 0); 
end

redis.call("HSET", "poll_metadata", poll_id, poll_gender);
