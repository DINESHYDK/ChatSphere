local hash_name = KEYS[1];
local total_option = tonumber(ARGV[1]);


if not hash_name or not total_option then
  error("MISSING_INPUT");
end

for i = 1, total_option, 1 do
    redis.call("HSET", hash_name, string.char(65 + i - 1), 0); --like A: 3, B: 4
end
