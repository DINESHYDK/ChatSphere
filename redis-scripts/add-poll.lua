local poll_name = KEYS[1]; --poll_123
local total_option = tonumber(ARGV[1]);


if not poll_name or not total_option then
  return redis.error_reply("MISSING KEY OR ARGUMENT");
end

if total_option > 6 then
  return redis.error_reply("TOO_MUCH_OPTIONS");
end
for i = 1, total_option, 1 do
  redis.call("HSET", poll_name, string.char(65 + i - 1), 0);   --like A: 3, B: 4
end
  
